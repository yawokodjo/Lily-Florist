import uuid
from django.db import models
from django.core.validators import MinValueValidator
from apps.core.models import TimestampedModel


class Category(TimestampedModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_url = models.URLField(blank=True)   # fallback Unsplash pour le MVP
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Produit"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_active", "is_featured"]),
            models.Index(fields=["category", "is_active"]),
        ]

    def __str__(self):
        return self.name

    @property
    def in_stock(self):
        return self.stock_quantity > 0

    @property
    def photo_url(self):
        if self.image:
            return self.image.url
        return self.image_url or ""
