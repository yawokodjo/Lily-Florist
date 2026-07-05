"""
Gestion des commandes.
POST /api/v1/orders/           → créer une commande
GET  /api/v1/orders/           → mes commandes
GET  /api/v1/orders/<id>/      → détail commande
"""
from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.products.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return (
                Order.objects.filter(user=self.request.user)
                .prefetch_related("items__product")
                .order_by("-created_at")
            )
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        return OrderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Décrémenter le stock
        for item_data in request.data.get("items", []):
            try:
                product = Product.objects.select_for_update().get(id=item_data["product_id"])
                if product.stock_quantity < item_data["quantity"]:
                    raise ValueError(f"Stock insuffisant pour {product.name}")
                product.stock_quantity -= item_data["quantity"]
                product.save(update_fields=["stock_quantity"])
            except Product.DoesNotExist:
                pass

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """Annuler une commande (si status == pending)."""
        order = self.get_object()
        if order.status != Order.Status.PENDING:
            return Response(
                {"detail": "Seules les commandes en attente peuvent être annulées."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])
        return Response(OrderSerializer(order).data)
