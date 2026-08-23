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

## 1. Folder structure

This zip contains **both** the frontend and backend, already wired together:

```
fullstack-boutique/
├── frontend/                 # your React/Vite site (node_modules not included — run npm install)
│   ├── src/
│   │   ├── api.js            # already added — talks to the backend
│   │   ├── components/
│   │   │   ├── CartDrawer.jsx   # already updated — real checkout form
│   │   │   ├── Contact.jsx      # already updated — posts to /api/contact
│   │   │   └── ...            (all your other original components, untouched)
│   │   └── App.jsx           # already updated — clears cart after order
│   ├── .env.example          # copy to .env → sets VITE_API_URL
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── main.py              # FastAPI app, CORS, routes wired up
    │   ├── config.py            # reads settings from .env
    │   ├── database.py          # SQLAlchemy engine/session
    │   ├── models.py            # Postgres tables (Product, Order, OrderItem, ContactMessage, NewsletterSubscriber)
    │   ├── schemas.py           # request/response validation (Pydantic)
    │   ├── routers/
    │   │   ├── products.py      # GET/POST /api/products
    │   │   ├── checkout.py      # POST /api/checkout, GET /api/checkout/orders/{id}
    │   │   └── contact.py       # POST /api/contact, POST /api/newsletter
    │   └── services/
    │       ├── email_service.py     # SMTP email sending
    │       └── whatsapp_service.py  # wa.me link + optional Twilio auto-send
    ├── seed_data.py              # loads your 8 existing products into Postgres
    ├── requirements.txt
    └── .env.example              # copy to .env and fill in
```

The frontend files listed as "already updated" have been pre-integrated for you — no copy-pasting needed, just install and run both sides (step 6 below).

---

## 2. Install PostgreSQL & create the database

**On Windows/macOS:** install from https://www.postgresql.org/download/
**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Then create the database and a user for your app:
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE blessings;
CREATE USER boutique_user WITH PASSWORD 'boutique_pass';
GRANT ALL PRIVILEGES ON DATABASE boutique_db TO boutique_user;
\q
```
(Change the password to something real before going live.)

---

## 3. Set up the Python backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Now open `.env` and fill in:
- `DATABASE_URL` — matches the DB/user/password you created in step 2
- `SMTP_USERNAME` / `SMTP_PASSWORD` / `SHOP_OWNER_EMAIL` — see "Email setup" below
- `SHOP_WHATSAPP_NUMBER` — your WhatsApp number, country code + number, no `+` or spaces (e.g. `919876543210`)
- `ADMIN_API_KEY` — a long random secret used only for admin API calls

---

## 4. Create tables and load your existing products

```bash
python seed_data.py
```
This creates all tables (if they don't exist yet) and inserts the 8 products that are currently hardcoded in your frontend's `content.js`, so the site has real data from day one.

---

## 5. Run the backend

```bash
uvicorn app.main:app --reload --port 8000
```
Visit **http://localhost:8000/docs** — FastAPI auto-generates an interactive API tester (Swagger UI) where you can try every endpoint without writing frontend code.

Endpoints:
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/products/` | list all products (optional `?category=sarees`) |
| GET | `/api/products/{id}` | single product |
| POST | `/api/products/` | add a new product (requires `X-Admin-Key`) |
| POST | `/api/checkout/` | place an order (cart items + shipping info) |
| GET | `/api/checkout/orders/{id}` | admin-only order lookup (requires `X-Admin-Key`) |
| POST | `/api/contact` | submit the contact form |
| POST | `/api/newsletter` | subscribe an email |

---

## 6. Run the frontend (already wired to the backend)

The `frontend/` folder already has `api.js`, the updated `CartDrawer.jsx`/`Contact.jsx`, and the `App.jsx` callback in place — you don't need to copy anything.

1. Create the frontend's env file:
   ```bash
   cd frontend
   cp .env.example .env
   ```
   (It already points to `http://localhost:8000` — change it later if you deploy the backend elsewhere.)

2. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

3. Run both servers side by side:
   ```bash
   # terminal 1
   cd backend && uvicorn app.main:app --reload --port 8000
   # terminal 2
   cd frontend && npm run dev
   ```

Your "Add to Cart" → "Proceed to Checkout" → "Place Order" flow now writes real rows into PostgreSQL, and the contact form saves messages and notifies you by email + WhatsApp link.

*(Optional: switch `NewArrivals.jsx` to fetch products from `api.getProducts()` instead of importing `content.js`, once you're ready to manage products through the database instead of hardcoded data.)*

---

## 7. Email setup (Gmail example)

1. Turn on 2-Step Verification: https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Put the 16-character app password into `SMTP_PASSWORD` in `.env` (not your real Gmail password)
4. Set `SMTP_USERNAME` and `SMTP_FROM_EMAIL` to that Gmail address, and `SHOP_OWNER_EMAIL` to wherever you want new-order/contact alerts sent

Any SMTP provider works the same way (Zoho Mail, Outlook, your hosting provider's SMTP, etc.) — just change `SMTP_HOST`/`SMTP_PORT`.

---

## 8. WhatsApp setup

**Works immediately, no signup:** every order and contact submission returns a `whatsapp_link` — a `wa.me` "click to chat" link pre-filled with the order/message details. The frontend already shows this as a button in the checkout success screen and contact form.

**Fully automatic (server sends the WhatsApp message itself), optional:**
1. Create a Twilio account: https://www.twilio.com/whatsapp
2. Enable the WhatsApp Sandbox (for testing) or apply for a real WhatsApp Business sender (for production)
3. Fill `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` and, when using a template, `TWILIO_CONTENT_SID` in `.env`
4. Nothing else changes — `whatsapp_service.py` automatically uses Twilio if those are filled in, and falls back to just the link if they're blank

---

## 9. Deploying to production (overview)

- **Database:** managed Postgres (Railway, Render, Supabase, AWS RDS, DigitalOcean) — copy its connection string into `DATABASE_URL`
- **Backend:** deploy the `backend/` folder to Render, Railway, Fly.io, or a VPS. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Frontend:** `npm run build` in `Bouti/`, deploy the `dist/` folder to Vercel/Netlify, and set `VITE_API_URL` to your deployed backend's URL
- Update `FRONTEND_ORIGINS` in the backend `.env` to your real deployed frontend URL (CORS)

### Production hardening already included
- Checkout ignores frontend product names/prices and calculates totals only from PostgreSQL.
- Product rows are locked during checkout to reduce overselling under concurrent orders.
- Identical checkout retries within a short safety window return the existing order instead of creating a duplicate.
- Checkout/contact/newsletter database failures return customer-safe messages instead of raw SQL errors.
- `POST /api/products/` and `GET /api/checkout/orders/{id}` require the `X-Admin-Key` header.
- Email/WhatsApp notification failures do not roll back an order that was already saved.
- `/api/health` also verifies PostgreSQL connectivity.

For a full admin dashboard, replace the API-key guard with proper login/JWT roles before exposing admin features to staff.

### Switching schema changes to Alembic (optional, for later)
Right now tables are created automatically on startup (`Base.metadata.create_all`). That's fine while you're building. Once the site is live and you need to change the schema without losing data, switch to Alembic migrations (`pip install alembic`, `alembic init migrations`) instead of relying on auto-create.

---

## What each piece of "full stack" means here

- **Frontend** (already have this): React + Vite + Tailwind — what customers see and click
- **Backend** (this folder): Python + FastAPI — receives requests from the frontend, contains your business logic (checkout, contact, stock)
- **Database**: PostgreSQL — permanently stores products, orders, and messages
- **Integrations**: SMTP for email, WhatsApp `wa.me`/Twilio for WhatsApp — triggered automatically by the backend after checkout/contact

If anything in these steps errors out, paste the exact error message and I'll help you fix it.
