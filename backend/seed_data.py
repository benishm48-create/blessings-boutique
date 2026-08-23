"""
Populates the `products` table with the same items already shown in the
frontend's src/data/content.js mock file, so the site works with real data
immediately.

Run it once after the tables are created:
    python seed_data.py
"""
from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)

PRODUCTS = [
    dict(id=1, name="Ivory Silk Wrap Dress", category="casual", price=4200, rating=4.8,
         image="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=900&auto=format&fit=crop"),
    dict(id=2, name="Champagne Draped Gown", category="party", price=8600, rating=5.0,
         image="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=900&auto=format&fit=crop"),
    dict(id=3, name="Hand-Embroidered Kurti", category="kurtis", price=2950, rating=4.6,
         image="https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=900&auto=format&fit=crop"),
    dict(id=4, name="Beige Tailored Blazer Set", category="casual", price=5400, rating=4.7,
         image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=900&auto=format&fit=crop"),
    dict(id=5, name="Gold-Threaded Banarasi Saree", category="sarees", price=12500, rating=5.0,
         image="https://images.unsplash.com/photo-1583391733981-3b062a3897cc?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1610189844934-3d10d6467d17?q=80&w=900&auto=format&fit=crop"),
    dict(id=6, name="Soft Linen Co-ord Set", category="casual", price=3300, rating=4.5,
         image="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"),
    dict(id=7, name="Rose Chiffon Party Saree", category="sarees", price=6700, rating=4.9,
         image="https://images.unsplash.com/photo-1610189000909-9403a4b90e5b?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=900&auto=format&fit=crop"),
    dict(id=8, name="Little Bloom Party Frock", category="kids", price=1800, rating=4.7,
         image="https://images.unsplash.com/photo-1519457851430-a9c2c7c04d2f?q=80&w=900&auto=format&fit=crop",
         hover_image="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=900&auto=format&fit=crop"),
]


def run():
    db = SessionLocal()
    try:
        for data in PRODUCTS:
            existing = db.query(models.Product).filter(models.Product.id == data["id"]).first()
            if existing:
                continue
            db.add(models.Product(**data))
        db.commit()
        print(f"Seeded {len(PRODUCTS)} products (skipped any that already existed).")
    finally:
        db.close()


if __name__ == "__main__":
    run()
