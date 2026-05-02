"""Backend tests for Precision3D (Products, Checkout, Contact)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dimensional-print-4.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Root ---
def test_api_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "Precision3D" in r.json().get("message", "")


# --- Products ---
class TestProducts:
    def test_get_products_returns_three(self, client):
        r = client.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_product_prices(self, client):
        r = client.get(f"{API}/products")
        data = r.json()
        price_map = {p["id"]: p["price"] for p in data}
        assert price_map.get("fidget-cone") == 5.00
        assert price_map.get("infinity-cube") == 4.00
        assert price_map.get("party-hat") == 3.50

    def test_product_schema(self, client):
        r = client.get(f"{API}/products")
        for p in r.json():
            for key in ("id", "name", "description", "price", "image", "category", "colors", "material"):
                assert key in p, f"Missing {key}"
            assert isinstance(p["colors"], list)

    def test_get_single_product(self, client):
        r = client.get(f"{API}/products/fidget-cone")
        assert r.status_code == 200
        assert r.json()["price"] == 5.00

    def test_get_single_product_not_found(self, client):
        r = client.get(f"{API}/products/nonexistent")
        assert r.status_code == 404


# --- Contact ---
class TestContact:
    def test_contact_submit_success(self, client):
        payload = {
            "name": "TEST_User",
            "email": "test_user@example.com",
            "message": "TEST_ automated contact message",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data.get("success") is True
        assert "message" in data

    def test_contact_missing_fields(self, client):
        r = client.post(f"{API}/contact", json={"name": "x"})
        assert r.status_code == 422


# --- Checkout ---
class TestCheckout:
    def test_checkout_valid(self, client):
        payload = {
            "items": [
                {"product_id": "fidget-cone", "quantity": 2},
                {"product_id": "party-hat", "quantity": 1},
            ],
            "origin_url": BASE_URL,
        }
        r = client.post(f"{API}/checkout", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("http")
        assert "session_id" in data and data["session_id"]

    def test_checkout_empty_cart(self, client):
        payload = {"items": [], "origin_url": BASE_URL}
        r = client.post(f"{API}/checkout", json=payload)
        assert r.status_code == 400

    def test_checkout_invalid_product(self, client):
        payload = {
            "items": [{"product_id": "bogus-xyz", "quantity": 1}],
            "origin_url": BASE_URL,
        }
        r = client.post(f"{API}/checkout", json=payload)
        assert r.status_code == 400
