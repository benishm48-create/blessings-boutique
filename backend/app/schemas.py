import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class CleanModel(BaseModel):
    """Base request model: trims accidental leading/trailing whitespace."""

    model_config = ConfigDict(str_strip_whitespace=True)


# ---------- Products ----------

class ProductOut(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    price: float
    rating: Optional[float] = None
    image: Optional[str] = None
    hover_image: Optional[str] = None
    description: Optional[str] = None
    stock: int

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(CleanModel):
    name: str = Field(min_length=1, max_length=200)
    category: Optional[str] = Field(default=None, max_length=100)
    price: float = Field(gt=0, le=10_000_000)
    rating: Optional[float] = Field(default=4.5, ge=0, le=5)
    image: Optional[str] = Field(default=None, max_length=500)
    hover_image: Optional[str] = Field(default=None, max_length=500)
    description: Optional[str] = Field(default=None, max_length=10_000)
    stock: int = Field(default=100, ge=0, le=1_000_000)


class ProductUpdate(CleanModel):
    """
    Used by the admin product-edit API.

    Every field is optional so the admin can update only the fields
    that need to change.
    """

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    category: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    price: Optional[float] = Field(
        default=None,
        gt=0,
        le=10_000_000,
    )

    rating: Optional[float] = Field(
        default=None,
        ge=0,
        le=5,
    )

    image: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    hover_image: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    description: Optional[str] = Field(
        default=None,
        max_length=10_000,
    )

    stock: Optional[int] = Field(
        default=None,
        ge=0,
        le=1_000_000,
    )


# ---------- Checkout / Orders ----------

class CartItemIn(CleanModel):
    # Only id + qty are trusted for checkout calculations.
    # name/price remain for backwards compatibility with the React frontend.

    id: int = Field(gt=0)

    name: Optional[str] = Field(
        default=None,
        max_length=200,
    )

    price: Optional[float] = Field(
        default=None,
        ge=0,
    )

    qty: int = Field(
        gt=0,
        le=100,
    )


class CheckoutIn(CleanModel):
    customer_name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    phone: str = Field(
        min_length=7,
        max_length=25,
    )

    address: str = Field(
        min_length=5,
        max_length=300,
    )

    city: str = Field(
        min_length=2,
        max_length=100,
    )

    state: str = Field(
        min_length=2,
        max_length=100,
    )

    pincode: str = Field(
        min_length=4,
        max_length=10,
    )

    payment_method: Literal["cod"] = "cod"

    items: list[CartItemIn] = Field(
        min_length=1,
        max_length=50,
    )

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not re.fullmatch(r"[0-9+()\-\s]+", value):
            raise ValueError("Enter a valid phone number")

        digit_count = sum(ch.isdigit() for ch in value)

        if not 7 <= digit_count <= 15:
            raise ValueError("Enter a valid phone number")

        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9\-\s]+", value):
            raise ValueError("Enter a valid pincode")

        return value


class OrderItemOut(BaseModel):
    product_name: str
    price: float
    qty: int

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    customer_name: str
    email: str
    phone: str
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]
    whatsapp_link: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ---------- Contact ----------

class ContactIn(CleanModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    message: str = Field(
        min_length=2,
        max_length=5000,
    )


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime
    whatsapp_link: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ---------- Newsletter ----------

class NewsletterIn(CleanModel):
    email: EmailStr