from rest_framework import serializers

from apps.products.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "product_name",
            "product_price",
            "quantity",
            "gift_message",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reference",
            "status",
            "created_at",
            "delivery_first_name",
            "delivery_last_name",
            "delivery_street",
            "delivery_city",
            "delivery_postal_code",
            "delivery_date",
            "gift_message",
            "subtotal",
            "delivery_fee",
            "discount",
            "total",
            "items",
        ]
        read_only_fields = [
            "id",
            "reference",
            "status",
            "subtotal",
            "total",
            "created_at",
        ]


class CreateOrderItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)
    gift_message = serializers.CharField(required=False, allow_blank=True)


class CreateOrderSerializer(serializers.Serializer):
    items = CreateOrderItemSerializer(many=True)
    delivery_first_name = serializers.CharField(max_length=150)
    delivery_last_name = serializers.CharField(max_length=150)
    delivery_email = serializers.EmailField()
    delivery_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    delivery_street = serializers.CharField(max_length=255)
    delivery_city = serializers.CharField(max_length=100)
    delivery_postal_code = serializers.CharField(max_length=20)
    delivery_country = serializers.CharField(max_length=100, default="France")
    delivery_date = serializers.DateField()
    gift_message = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("La commande doit contenir au moins un article.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        request = self.context["request"]

        # Calculer le sous-total
        subtotal = 0
        product_cache = {}
        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data["product_id"], is_active=True)
                product_cache[str(item_data["product_id"])] = product
                subtotal += product.price * item_data["quantity"]
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Produit {item_data['product_id']} introuvable.")

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            subtotal=subtotal,
            **validated_data,
        )

        for item_data in items_data:
            product = product_cache[str(item_data["product_id"])]
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_price=product.price,
                quantity=item_data["quantity"],
                gift_message=item_data.get("gift_message", ""),
            )

        return order
