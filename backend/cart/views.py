from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer


def _get_or_create_cart(request):
    """Get or create a cart for the current user/session."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        # Merge any existing session cart
        session_key = request.session.session_key
        if session_key:
            try:
                session_cart = Cart.objects.get(session_key=session_key, user__isnull=True)
                cart.merge_session_cart(session_cart)
            except Cart.DoesNotExist:
                pass
        return cart
    else:
        if not request.session.session_key:
            request.session.create()
        cart, _ = Cart.objects.get_or_create(
            session_key=request.session.session_key, user__isnull=True
        )
        return cart


@api_view(["GET"])
@permission_classes([AllowAny])
def get_cart(request):
    cart = _get_or_create_cart(request)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def add_to_cart(request):
    serializer = AddToCartSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    product = get_object_or_404(Product, id=serializer.validated_data["product_id"], is_active=True)
    quantity = serializer.validated_data["quantity"]

    if product.stock_quantity < quantity:
        return Response(
            {"error": f"Only {product.stock_quantity} items available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart = _get_or_create_cart(request)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    if cart_item.quantity > product.stock_quantity:
        return Response(
            {"error": f"Cannot add more than {product.stock_quantity} items."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.save()
    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["PATCH"])
@permission_classes([AllowAny])
def update_cart_item(request, item_id):
    serializer = UpdateCartItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    cart = _get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    new_quantity = serializer.validated_data["quantity"]

    if new_quantity == 0:
        cart_item.delete()
    else:
        if new_quantity > cart_item.product.stock_quantity:
            return Response(
                {"error": f"Only {cart_item.product.stock_quantity} items available."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart_item.quantity = new_quantity
        cart_item.save()

    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def remove_from_cart(request, item_id):
    cart = _get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    return Response(CartSerializer(cart, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def clear_cart(request):
    cart = _get_or_create_cart(request)
    cart.items.all().delete()
    return Response(CartSerializer(cart, context={"request": request}).data)
