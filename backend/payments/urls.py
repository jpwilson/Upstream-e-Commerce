from django.urls import path
from . import views

urlpatterns = [
    path("process/", views.process_payment, name="process-payment"),
    path("create-intent/", views.create_payment_intent, name="create-payment-intent"),
]
