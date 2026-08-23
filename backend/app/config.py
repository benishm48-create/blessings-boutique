"""
Central configuration. Everything is read from environment variables so that
no secret (DB password, email password, Twilio token) ever lives in the code.

Copy `.env.example` to `.env` and fill in your real values before running.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _csv_env(name: str, default: str) -> list[str]:
    return [value.strip() for value in os.getenv(name, default).split(",") if value.strip()]


class Settings:
    # ---- Database ----
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://boutique_user:boutique_pass@localhost:5432/blessings",
    )

    # ---- CORS ----
    FRONTEND_ORIGINS: list[str] = _csv_env("FRONTEND_ORIGINS", "http://localhost:5173")

    # ---- Admin-only API protection ----
    # Use a long random value in production. Send it only in the X-Admin-Key header.
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "")

    # ---- Email (SMTP) ----
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "")
    SHOP_OWNER_EMAIL: str = os.getenv("SHOP_OWNER_EMAIL", "")

    # ---- WhatsApp ----
    SHOP_WHATSAPP_NUMBER: str = os.getenv("SHOP_WHATSAPP_NUMBER", "919876543210")

    # Twilio automatic WhatsApp (optional). TWILIO_CONTENT_SID is used for
    # approved/template messaging; if blank, the service falls back to body text.
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_WHATSAPP_FROM: str = os.getenv("TWILIO_WHATSAPP_FROM", "")
    TWILIO_CONTENT_SID: str = os.getenv("TWILIO_CONTENT_SID", "")


settings = Settings()
