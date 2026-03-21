from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product_name", "product_sku", "price", "quantity", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "user", "guest_email", "status", "payment_status", "total", "created_at"]
    list_filter = ["status", "payment_status", "payment_method", "created_at"]
    search_fields = ["order_number", "guest_email", "user__email", "shipping_last_name"]
    readonly_fields = ["order_number", "created_at", "updated_at"]
    inlines = [OrderItemInline]
