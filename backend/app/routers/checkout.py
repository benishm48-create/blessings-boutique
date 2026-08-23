import hashlib
import json
from collections import defaultdict
from datetime import datetime, timedelta
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from .. import models, schemas
from ..database import get_db
from ..security import require_admin_key
from ..services import email_service, whatsapp_service


router = APIRouter(prefix="/api/checkout", tags=["Checkout"])

# A very short retry window prevents accidental double orders caused by
# double-clicks, browser retries, or a temporary network reconnect. It does not
# block a customer from intentionally placing another order later.
_DUPLICATE_WINDOW_SECONDS = 30


def _item_quantities(payload: schemas.CheckoutIn) -> dict[int, int]:
    quantities: dict[int, int] = defaultdict(int)
    for item in payload.items:
        quantities[item.id] += item.qty
    return dict(quantities)


def _fingerprint_lock_key(payload: schemas.CheckoutIn, quantities: dict[int, int]) -> int:
    """Return a stable signed 64-bit key for PostgreSQL advisory locking."""
    canonical = json.dumps(
        {
            "customer_name": payload.customer_name.casefold(),
            "email": str(payload.email).casefold(),
            "phone": payload.phone,
            "address": payload.address.casefold(),
            "city": payload.city.casefold(),
            "state": payload.state.casefold(),
            "pincode": payload.pincode.casefold(),
            "payment_method": payload.payment_method,
            "items": sorted(quantities.items()),
        },
        sort_keys=True,
        separators=(",", ":"),
    )
    digest = hashlib.sha256(canonical.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], byteorder="big", signed=True)


def _order_matches_items(order: models.Order, quantities: dict[int, int]) -> bool:
    existing: dict[int, int] = defaultdict(int)
    for item in order.items:
        if item.product_id is None:
            return False
        existing[item.product_id] += item.qty
    return dict(existing) == quantities


def _recent_duplicate(
    db: Session,
    payload: schemas.CheckoutIn,
    quantities: dict[int, int],
) -> models.Order | None:
    cutoff = datetime.utcnow() - timedelta(seconds=_DUPLICATE_WINDOW_SECONDS)
    candidates = (
        db.query(models.Order)
        .options(selectinload(models.Order.items))
        .filter(
            models.Order.created_at >= cutoff,
            models.Order.customer_name == payload.customer_name,
            models.Order.email == str(payload.email).lower(),
            models.Order.phone == payload.phone,
            models.Order.address == payload.address,
            models.Order.city == payload.city,
            models.Order.state == payload.state,
            models.Order.pincode == payload.pincode,
            models.Order.payment_method == payload.payment_method,
        )
        .order_by(models.Order.id.desc())
        .limit(5)
        .all()
    )
    for order in candidates:
        if _order_matches_items(order, quantities):
            return order
    return None


def _order_response(order: models.Order) -> schemas.OrderOut:
    message = whatsapp_service.build_order_message(order)
    result = schemas.OrderOut.model_validate(order)
    result.whatsapp_link = whatsapp_service.build_whatsapp_link(message)
    return result


@router.post("/", response_model=schemas.OrderOut, status_code=201)
def checkout(
    payload: schemas.CheckoutIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Create a production-safe COD order from database prices and stock."""
    quantities = _item_quantities(payload)
    lock_key = _fingerprint_lock_key(payload, quantities)

    try:
        # Serializes identical checkout requests. This prevents two concurrent
        # retries from both creating an order before either one can see the other.
        db.execute(text("SELECT pg_advisory_xact_lock(:lock_key)"), {"lock_key": lock_key})

        duplicate = _recent_duplicate(db, payload, quantities)
        if duplicate:
            result = _order_response(duplicate)
            db.rollback()  # release advisory lock; no new data was written
            return result

        product_ids = sorted(quantities)

        # Lock product rows until commit so two customers cannot oversell the
        # same final units at the same time.
        products = (
            db.query(models.Product)
            .filter(models.Product.id.in_(product_ids))
            .order_by(models.Product.id)
            .with_for_update()
            .all()
        )
        products_by_id = {product.id: product for product in products}

        missing_ids = [product_id for product_id in product_ids if product_id not in products_by_id]
        if missing_ids:
            raise HTTPException(
                status_code=404,
                detail="One or more products in your bag are no longer available. Please refresh and try again.",
            )

        total = Decimal("0.00")
        order_items: list[models.OrderItem] = []

        for product_id in product_ids:
            product = products_by_id[product_id]
            qty = quantities[product_id]
            available_stock = product.stock or 0

            if available_stock < qty:
                raise HTTPException(
                    status_code=409,
                    detail=f"Only {available_stock} item(s) left for '{product.name}'. Please update your bag.",
                )

            # Never trust frontend price/name. Both come from PostgreSQL.
            unit_price = Decimal(str(product.price)).quantize(Decimal("0.01"))
            product.stock = available_stock - qty
            total += unit_price * qty

            order_items.append(
                models.OrderItem(
                    product_id=product.id,
                    product_name=product.name,
                    price=unit_price,
                    qty=qty,
                )
            )

        order = models.Order(
            customer_name=payload.customer_name,
            email=str(payload.email).lower(),
            phone=payload.phone,
            address=payload.address,
            city=payload.city,
            state=payload.state,
            pincode=payload.pincode,
            payment_method=payload.payment_method,
            total_amount=total.quantize(Decimal("0.01")),
            items=order_items,
        )

        db.add(order)
        db.commit()
        db.refresh(order)

    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError:
        db.rollback()
        # Never expose database/SQL details to customers.
        raise HTTPException(
            status_code=503,
            detail="We couldn't place your order right now. No order was charged. Please try again in a moment.",
        )

    # Email failures are handled inside email_service and must never undo an
    # order that has already been safely committed to PostgreSQL.
    email_service.send_order_confirmation(order)

    whatsapp_message = whatsapp_service.build_order_message(order)
    background_tasks.add_task(whatsapp_service.send_whatsapp_message, whatsapp_message)

    return _order_response(order)


@router.get(
    "/orders/{order_id}",
    response_model=schemas.OrderOut,
    dependencies=[Depends(require_admin_key)],
)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Admin-only order lookup; protects customer PII from public access."""
    order = (
        db.query(models.Order)
        .options(selectinload(models.Order.items))
        .filter(models.Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return _order_response(order)
