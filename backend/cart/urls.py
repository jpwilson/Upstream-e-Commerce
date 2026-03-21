from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_cart, name="cart-detail"),
    path("add/", views.add_to_cart, name="cart-add"),
    path("items/<int:item_id>/", views.update_cart_item, name="cart-update-item"),
    path("items/<int:item_id>/remove/", views.remove_from_cart, name="cart-remove-item"),
    path("clear/", views.clear_cart, name="cart-clear"),
]
