import uuid
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from orders.models import Order


@api_view(["POST"])
@permission_classes([AllowAny])
def process_payment(request):
    """
    Payment processing stub.
    In production, this would integrate with Stripe/PayPal APIs.
    """
    order_number = request.data.get("order_number")
    payment_method = request.data.get("payment_method", "credit_card")

    if not order_number:
        return Response({"error": "Order number is required."}, status=status.HTTP_400_BAD_REQUEST)

    order = get_object_or_404(Order, order_number=order_number)

    if order.payment_status == "paid":
        return Response({"error": "Order is already paid."}, status=status.HTTP_400_BAD_REQUEST)

    # --- Stripe stub ---
    if payment_method == "credit_card":
        token = request.data.get("token")
        # In production: stripe.Charge.create(amount=..., currency='usd', source=token)
        # Simulating a successful payment
        transaction_id = f"ch_{uuid.uuid4().hex[:24]}"
        order.payment_status = "paid"
        order.transaction_id = transaction_id
        order.status = Order.Status.PROCESSING
        order.save()

        return Response({
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Payment processed successfully (stub).",
            "order_number": str(order.order_number),
        })

    # --- PayPal stub ---
    elif payment_method == "paypal":
        paypal_order_id = request.data.get("paypal_order_id")
        # In production: verify with PayPal API
        transaction_id = f"PP-{uuid.uuid4().hex[:20]}"
        order.payment_status = "paid"
        order.transaction_id = transaction_id
        order.status = Order.Status.PROCESSING
        order.save()

        return Response({
            "status": "success",
            "transaction_id": transaction_id,
            "message": "PayPal payment processed successfully (stub).",
            "order_number": str(order.order_number),
        })

    return Response({"error": "Invalid payment method."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment_intent(request):
    """
    Stripe PaymentIntent stub for frontend integration.
    In production, this creates a real Stripe PaymentIntent.
    """
    amount = request.data.get("amount")
    if not amount:
        return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Stub response mimicking Stripe PaymentIntent
    return Response({
        "client_secret": f"pi_{uuid.uuid4().hex[:24]}_secret_{uuid.uuid4().hex[:12]}",
        "payment_intent_id": f"pi_{uuid.uuid4().hex[:24]}",
        "amount": amount,
        "currency": "usd",
    })
