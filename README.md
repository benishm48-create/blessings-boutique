# Blessings Boutique — Backend (Python + FastAPI + PostgreSQL)

This is the backend for your React/Vite boutique frontend. It gives you:

- **Products API** — reads/writes products from PostgreSQL (matches your existing `content.js` items)
- **Cart → Checkout** — customer fills shipping details, order + items saved to PostgreSQL
- **Email notifications** — order confirmation to customer + shop owner, via SMTP
- **WhatsApp notifications** — a click-to-chat `wa.me` link is always generated; optional fully-automatic sending via Twilio
- **Contact form** — saved to DB, emails + WhatsApp both notified
- **Newsletter signup** — saved to DB

Stack: **FastAPI** (Python), **SQLAlchemy** (ORM), **PostgreSQL** (database), **Uvicorn** (server).

---
