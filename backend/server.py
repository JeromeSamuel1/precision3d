from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse, CheckoutStatusResponse
)

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Fixed product catalog (prices defined server-side for security)
PRODUCTS = {
    "fidget-cone": {
        "id": "fidget-cone",
        "name": "Fidget Cone",
        "description": "A satisfying desk toy with smooth rotational mechanics. Precision-printed with tight tolerances for a premium fidget experience.",
        "price": 5.00,
        "image": "https://images.unsplash.com/photo-1743438948521-3e7e1a59a3f5",
        "category": "desk-toys",
        "colors": ["Midnight Blue", "Slate Grey", "Cyan"],
        "material": "PLA+"
    },
    "infinity-cube": {
        "id": "infinity-cube",
        "name": "Infinity Cube",
        "description": "An endlessly folding puzzle cube that keeps your hands busy and your mind focused. Magnetic hinges for satisfying clicks.",
        "price": 4.00,
        "image": "https://images.unsplash.com/photo-1776235239377-ecba32a76dd4",
        "category": "puzzles",
        "colors": ["Obsidian Black", "Slate Grey", "Electric Blue"],
        "material": "PETG"
    },
    "party-hat": {
        "id": "party-hat",
        "name": "Party Hat",
        "description": "A unique 3D-printed geometric party hat that stands out at any celebration. Lightweight and durable.",
        "price": 3.50,
        "image": "https://images.unsplash.com/photo-1759124650162-6bc71d025621",
        "category": "accessories",
        "colors": ["Holographic Silver", "Gold", "Neon Cyan"],
        "material": "PLA"
    }
}


# Models
class CartItem(BaseModel):
    product_id: str
    quantity: int = 1


class CheckoutRequest(BaseModel):
    items: List[CartItem]
    origin_url: str


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "Precision3D API"}


@api_router.get("/products")
async def get_products():
    return list(PRODUCTS.values())


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    if product_id not in PRODUCTS:
        raise HTTPException(status_code=404, detail="Product not found")
    return PRODUCTS[product_id]


@api_router.post("/checkout")
async def create_checkout(request: Request, checkout_req: CheckoutRequest):
    # Calculate total from server-side prices
    total = 0.0
    line_items_desc = []
    for item in checkout_req.items:
        product_id = item.product_id
        quantity = item.quantity
        if product_id not in PRODUCTS:
            raise HTTPException(status_code=400, detail=f"Invalid product: {product_id}")
        product = PRODUCTS[product_id]
        total += product["price"] * quantity
        line_items_desc.append(f"{product['name']} x{quantity}")

    if total <= 0:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Build URLs from frontend origin
    origin = checkout_req.origin_url.rstrip("/")
    success_url = f"{origin}/order/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/order"

    # Initialize Stripe
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "items": str([{"product_id": i.product_id, "quantity": i.quantity} for i in checkout_req.items]),
        "description": ", ".join(line_items_desc)
    }

    checkout_request = CheckoutSessionRequest(
        amount=total,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )

    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)

    # Store transaction in DB
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "amount": total,
        "currency": "usd",
        "items": [{"product_id": i.product_id, "quantity": i.quantity} for i in checkout_req.items],
        "description": ", ".join(line_items_desc),
        "payment_status": "pending",
        "status": "initiated",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction)

    return {"url": session.url, "session_id": session.session_id}


@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(request: Request, session_id: str):
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    # Update transaction in DB
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "payment_status": status.payment_status,
            "status": status.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )

    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        if webhook_response.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": "paid",
                    "status": "complete",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error"}


@api_router.post("/contact")
async def submit_contact(contact: ContactRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contacts.insert_one(doc)
    return {"success": True, "message": "Message received. We'll get back to you soon."}


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
