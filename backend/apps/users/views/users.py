from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework import serializers as drf_serializers

from ..models import Address
from ..serializers import UserSerializer

User = get_user_model()


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/users/me/"""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AddressSerializer(drf_serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "label",
            "street",
            "city",
            "postal_code",
            "country",
            "is_default",
        ]


class AddressListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/users/addresses/"""

    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Address.objects.none()
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
