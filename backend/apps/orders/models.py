import uuid
from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

from apps.core.models import TimestampedModel
from apps.products.models import Product
from apps.users.models import User


class Order(TimestampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        CONFIRMED = "confirmed", "Confirmée"
        PROCESSING = "processing", "En préparation"
        SHIPPED = "shipped", "Expédiée"
        DELIVERED = "delivered", "Livrée"
        CANCELLED = "cancelled", "Annulée"
        REFUNDED = "refunded", "Remboursée"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=20, unique=True, blank=True)

    user = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="orders", null=True, blank=True
    )
    # Livraison
    delivery_first_name = models.CharField(max_length=150)
    delivery_last_name = models.CharField(max_length=150)
    delivery_email = models.EmailField()
    delivery_phone = models.CharField(max_length=20, blank=True)
    delivery_street = models.CharField(max_length=255)
    delivery_city = models.CharField(max_length=100)
    delivery_postal_code = models.CharField(max_length=20)
    delivery_country = models.CharField(max_length=100, default="France")
    delivery_date = models.DateField()
    gift_message = models.TextField(blank=True)

    # Finance
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("5.99"))
    discount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("0"))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    stripe_payment_intent = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Commande"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "created_at"])]

    def save(self, *args, **kwargs):
        if not self.reference:
            import random
            import string

            self.reference = "ORD-" + "".join(
                random.choices(string.ascii_uppercase + string.digits, k=8)
            )
        self.total = self.subtotal + self.delivery_fee - self.discount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} ({self.get_status_display()})"


class OrderItem(TimestampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=255)  # snapshot au moment de l'achat
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    gift_message = models.TextField(blank=True)

    class Meta:
        verbose_name = "Article de commande"

    @property
    def line_total(self):
        return self.product_price * self.quantity
