from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product_name", "product_price", "quantity", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["reference", "user", "status", "total", "delivery_date", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["reference", "delivery_email", "delivery_first_name"]
    readonly_fields = ["reference", "subtotal", "total", "created_at"]
    inlines = [OrderItemInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Edition
            return self.readonly_fields + ["user"]
        return self.readonly_fields
