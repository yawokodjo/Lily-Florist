from django.urls import path
from ..views.users import MeView, AddressListCreateView

urlpatterns = [
    path("me/", MeView.as_view(), name="user-me"),
    path("addresses/", AddressListCreateView.as_view(), name="user-addresses"),
]
