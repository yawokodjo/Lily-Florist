"""
Fixtures pytest partagées — factories légères sans factory_boy.
"""

from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.products.models import Category, Product

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(db):
    user = User.objects.create_user(
        email="test@lily.com", password="StrongPass123!", first_name="Test"
    )
    client = APIClient()
    response = client.post(
        "/api/v1/auth/login/", {"email": "test@lily.com", "password": "StrongPass123!"}
    )
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return client, user


@pytest.fixture
def category_factory(db):
    _counter = {"n": 0}

    def _factory(**kwargs):
        _counter["n"] += 1
        defaults = {
            "name": f"Category {_counter['n']}",
            "slug": f"category-{_counter['n']}",
        }
        defaults.update(kwargs)
        return Category.objects.create(**defaults)

    return _factory


@pytest.fixture
def product_factory(db, category_factory):
    _counter = {"n": 0}

    def _factory(**kwargs):
        _counter["n"] += 1
        cat = kwargs.pop("category", None) or category_factory()
        defaults = {
            "name": f"Product {_counter['n']}",
            "slug": f"product-{_counter['n']}",
            "description": "A beautiful flower",
            "price": Decimal("29.99"),
            "category": cat,
            "stock_quantity": 10,
            "is_active": True,
            "is_featured": False,
        }
        defaults.update(kwargs)
        return Product.objects.create(**defaults)

    return _factory
