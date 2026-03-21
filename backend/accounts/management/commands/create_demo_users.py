from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import CustomerProfile

DEMO_USERS = [
    {
        "username": "demo_shopper",
        "password": "demo1234",
        "email": "shopper@demo.com",
        "first_name": "Jane",
        "last_name": "Shopper",
        "profile": {
            "phone": "555-0101",
            "address_1": "123 Main St",
            "city": "Portland",
            "state": "OR",
            "zip_code": "97201",
            "country": "US",
        },
    },
    {
        "username": "demo_admin",
        "password": "demo1234",
        "email": "admin@demo.com",
        "first_name": "Alex",
        "last_name": "Admin",
        "is_staff": True,
        "profile": {
            "phone": "555-0102",
            "address_1": "456 Oak Ave",
            "city": "Seattle",
            "state": "WA",
            "zip_code": "98101",
            "country": "US",
        },
    },
    {
        "username": "demo_vip",
        "password": "demo1234",
        "email": "vip@demo.com",
        "first_name": "Morgan",
        "last_name": "VIP",
        "profile": {
            "phone": "555-0103",
            "address_1": "789 Elm Blvd",
            "city": "San Francisco",
            "state": "CA",
            "zip_code": "94102",
            "country": "US",
        },
    },
]


class Command(BaseCommand):
    help = "Create demo user accounts for testing"

    def handle(self, *args, **options):
        for data in DEMO_USERS:
            profile_data = data.pop("profile")
            is_staff = data.pop("is_staff", False)
            password = data.pop("password")

            user, created = User.objects.get_or_create(
                username=data["username"],
                defaults={**data, "is_staff": is_staff},
            )
            if created:
                user.set_password(password)
                user.save()
                CustomerProfile.objects.get_or_create(user=user, defaults=profile_data)
                self.stdout.write(self.style.SUCCESS(f"Created: {user.username}"))
            else:
                self.stdout.write(f"Already exists: {user.username}")

            # Put back for potential re-runs
            data["password"] = password
            data["profile"] = profile_data
            if is_staff:
                data["is_staff"] = is_staff
