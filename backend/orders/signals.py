from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Order


@receiver(post_save, sender=Order)
def send_order_confirmation(sender, instance, created, **kwargs):
    if created:
        email = instance.email
        if not email:
            return

        subject = f"Order Confirmation - {instance.order_number}"
        message = (
            f"Thank you for your order!\n\n"
            f"Order Number: {instance.order_number}\n"
            f"Total: ${instance.total}\n\n"
            f"Items:\n"
        )
        for item in instance.items.all():
            message += f"  - {item.product_name} x{item.quantity}: ${item.line_total}\n"

        message += (
            f"\nShipping to:\n"
            f"  {instance.shipping_first_name} {instance.shipping_last_name}\n"
            f"  {instance.shipping_address_1}\n"
            f"  {instance.shipping_city}, {instance.shipping_state} {instance.shipping_zip}\n\n"
            f"We'll send you another email when your order ships.\n"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )


@receiver(post_save, sender=Order)
def send_status_update(sender, instance, created, **kwargs):
    if not created and instance.email:
        subject = f"Order {instance.order_number} - Status Update"
        message = (
            f"Your order status has been updated.\n\n"
            f"Order Number: {instance.order_number}\n"
            f"New Status: {instance.get_status_display()}\n"
        )
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=True,
        )
