from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import CustomerProfile
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    UpdateProfileSerializer, CustomerProfileSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    user = User.objects.create_user(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
    )
    CustomerProfile.objects.create(user=user)
    login(request, user)

    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(
        request,
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if user is None:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    # Ensure profile exists
    CustomerProfile.objects.get_or_create(user=request.user)
    return Response(UserSerializer(request.user).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = UpdateProfileSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    user = request.user
    profile, _ = CustomerProfile.objects.get_or_create(user=user)

    # Update user fields
    user_fields = ["email", "first_name", "last_name"]
    for field in user_fields:
        if field in data:
            setattr(user, field, data[field])
    user.save()

    # Update profile fields
    profile_fields = ["phone", "address_1", "address_2", "city", "state", "zip_code", "country"]
    for field in profile_fields:
        if field in data:
            setattr(profile, field, data[field])
    profile.save()

    return Response(UserSerializer(user).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response(UserSerializer(request.user).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def demo_accounts(request):
    """Return list of demo accounts for the QA login dropdown."""
    from accounts.management.commands.create_demo_users import DEMO_USERS

    accounts = []
    for u in DEMO_USERS:
        accounts.append({
            "username": u["username"],
            "password": u["password"],
            "display_name": f"{u['first_name']} {u['last_name']}",
            "role": "Admin" if u.get("is_staff") else "Shopper",
        })
    return Response(accounts)
