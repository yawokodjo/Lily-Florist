"""
Tests unitaires — modèle Product.
Lancer : pytest backend/tests/unit/test_products.py -v
"""

from decimal import Decimal

import pytest


@pytest.mark.django_db
class TestProductModel:
    def test_in_stock_property_true(self, product_factory):
        product = product_factory(stock_quantity=10)
        assert product.in_stock is True

    def test_in_stock_property_false_when_zero(self, product_factory):
        product = product_factory(stock_quantity=0)
        assert product.in_stock is False

    def test_photo_url_returns_image_url_as_fallback(self, product_factory):
        url = "https://images.unsplash.com/test.jpg"
        product = product_factory(image=None, image_url=url)
        assert product.photo_url == url

    def test_price_cannot_be_negative(self, product_factory):
        with pytest.raises(Exception):
            product = product_factory(price=Decimal("-5.00"))
            product.full_clean()

    def test_str_returns_name(self, product_factory):
        product = product_factory(name="Red Roses")
        assert str(product) == "Red Roses"


@pytest.mark.django_db
class TestProductAPI:
    def test_list_products_returns_only_active(self, api_client, product_factory):
        product_factory(is_active=True)
        product_factory(is_active=False)
        response = api_client.get("/api/v1/products/")
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_featured_endpoint(self, api_client, product_factory):
        product_factory(is_featured=True)
        product_factory(is_featured=False)
        response = api_client.get("/api/v1/products/featured/")
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_search_by_name(self, api_client, product_factory):
        product_factory(name="Red Roses Bouquet")
        product_factory(name="Pink Tulips")
        response = api_client.get("/api/v1/products/?search=roses")
        assert response.status_code == 200
        assert response.data["count"] == 1
