from decimal import Decimal
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from cart.views import _get_or_create_cart
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    cart = _get_or_create_cart(request)
    cart_items = cart.items.select_related("product").all()

    if not cart_items.exists():
        return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate stock
    for item in cart_items:
        if item.quantity > item.product.stock_quantity:
            return Response(
                {"error": f"Insufficient stock for {item.product.name}. Available: {item.product.stock_quantity}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Determine email
    if request.user.is_authenticated:
        email = request.user.email
    else:
        email = data.get("guest_email")
        if not email:
            return Response({"error": "Email is required for guest checkout."}, status=status.HTTP_400_BAD_REQUEST)

    subtotal = cart.total_price
    tax = (subtotal * Decimal("0.08")).quantize(Decimal("0.01"))  # 8% tax stub
    shipping_cost = Decimal("0.00") if subtotal >= Decimal("50.00") else Decimal("5.99")
    total = subtotal + tax + shipping_cost

    with transaction.atomic():
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            guest_email=email if not request.user.is_authenticated else "",
            payment_method=data["payment_method"],
            shipping_first_name=data["shipping_first_name"],
            shipping_last_name=data["shipping_last_name"],
            shipping_address_1=data["shipping_address_1"],
            shipping_address_2=data.get("shipping_address_2", ""),
            shipping_city=data["shipping_city"],
            shipping_state=data["shipping_state"],
            shipping_zip=data["shipping_zip"],
            shipping_country=data.get("shipping_country", "US"),
            phone=data.get("phone", ""),
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            notes=data.get("notes", ""),
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_sku=item.product.sku,
                price=item.product.price,
                quantity=item.quantity,
            )
            # Decrement stock
            item.product.stock_quantity -= item.quantity
            item.product.save()

        # Clear the cart
        cart.items.all().delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_list(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def order_detail(request, order_number):
    try:
        order = Order.objects.prefetch_related("items").get(order_number=order_number)
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

    # Only allow owner or guest with matching session
    if order.user and request.user.is_authenticated and order.user != request.user:
        return Response({"error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    return Response(OrderSerializer(order).data)
