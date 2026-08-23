from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from . import models
from .config import settings
from .database import engine
from .routers import checkout, contact, products

# Creates missing tables for the current project. Use migrations before future
# production schema changes so existing customer data is never recreated/lost.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Maison Élan Boutique API",
    description="Backend for the boutique storefront: products, checkout, contact & newsletter.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(contact.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Maison Élan Boutique API is running"}


@app.get("/api/health")
def health():
    """Health is only 'healthy' when PostgreSQL is reachable too."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return JSONResponse(status_code=503, content={"status": "unhealthy"})
    return {"status": "healthy"}
