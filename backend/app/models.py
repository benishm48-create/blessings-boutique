from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price > 0", name="ck_products_price_positive"),
        CheckConstraint("stock >= 0", name="ck_products_stock_nonnegative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), index=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    rating = Column(Float, default=4.5)
    image = Column(String(500), nullable=True)
    hover_image = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    stock = Column(Integer, default=100, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("total_amount >= 0", name="ck_orders_total_nonnegative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    address = Column(String(300), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    payment_method = Column(String(30), default="cod", nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(30), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = (
        CheckConstraint("price >= 0", name="ck_order_items_price_nonnegative"),
        CheckConstraint("qty > 0", name="ck_order_items_qty_positive"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)
    product_name = Column(String(200), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    qty = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
