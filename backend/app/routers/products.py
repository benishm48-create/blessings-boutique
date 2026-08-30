from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import require_admin

router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


@router.get("/", response_model=list[schemas.ProductOut])
def list_products(
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Product)

    if category:
        query = query.filter(models.Product.category == category)

    return query.order_by(models.Product.id).all()


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(models.Product)
        .filter(models.Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product


@router.post(
    "/",
    response_model=schemas.ProductOut,
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
):
    product = models.Product(**payload.model_dump())

    db.add(product)

    try:
        db.commit()
        db.refresh(product)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not save product",
        )

    return product


@router.patch(
    "/{product_id}",
    response_model=schemas.ProductOut,
    dependencies=[Depends(require_admin)],
)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
):
    product = (
        db.query(models.Product)
        .filter(models.Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No product fields provided",
        )

    for field_name, value in updates.items():
        setattr(product, field_name, value)

    try:
        db.commit()
        db.refresh(product)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not update product",
        )

    return product


@router.delete(
    "/{product_id}",
    dependencies=[Depends(require_admin)],
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(models.Product)
        .filter(models.Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    try:
        db.delete(product)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not delete product",
        )

    return {
        "message": "Product deleted successfully"
    }
