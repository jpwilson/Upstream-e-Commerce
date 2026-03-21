from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_sku", "price", "quantity", "line_total"]
        read_only_fields = ["product_name", "product_sku", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "email", "status", "payment_method", "payment_status",
            "shipping_first_name", "shipping_last_name",
            "shipping_address_1", "shipping_address_2",
            "shipping_city", "shipping_state", "shipping_zip", "shipping_country",
            "phone", "subtotal", "shipping_cost", "tax", "total",
            "notes", "items", "created_at", "updated_at",
        ]
        read_only_fields = ["order_number", "status", "payment_status", "subtotal", "total"]


class CreateOrderSerializer(serializers.Serializer):
    guest_email = serializers.EmailField(required=False)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    shipping_first_name = serializers.CharField(max_length=100)
    shipping_last_name = serializers.CharField(max_length=100)
    shipping_address_1 = serializers.CharField(max_length=300)
    shipping_address_2 = serializers.CharField(max_length=300, required=False, default="")
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_zip = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default="US")
    phone = serializers.CharField(max_length=20, required=False, default="")
    notes = serializers.CharField(required=False, default="")
