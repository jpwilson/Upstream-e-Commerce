from django.db import models
from django.conf import settings
from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        null=True, blank=True, related_name="cart",
    )
    session_key = models.CharField(max_length=40, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(user__isnull=False) | models.Q(session_key__isnull=False),
                name="cart_must_have_user_or_session",
            )
        ]

    @property
    def total_price(self):
        return sum(item.line_total for item in self.items.select_related("product").all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def merge_session_cart(self, session_cart):
        """Merge a session-based cart into this user cart."""
        for item in session_cart.items.all():
            existing = self.items.filter(product=item.product).first()
            if existing:
                existing.quantity += item.quantity
                existing.save()
            else:
                item.cart = self
                item.save()
        session_cart.delete()

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        return f"Cart (session: {self.session_key})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["cart", "product"]

    @property
    def line_total(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
