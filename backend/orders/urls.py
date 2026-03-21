from django.urls import path
from . import views

urlpatterns = [
    path("", views.order_list, name="order-list"),
    path("create/", views.create_order, name="order-create"),
    path("<uuid:order_number>/", views.order_detail, name="order-detail"),
]
