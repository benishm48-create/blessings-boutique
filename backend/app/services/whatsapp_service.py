"""WhatsApp click-to-chat links plus optional Twilio automatic sending."""
from urllib.parse import quote

from ..config import settings


def _digits_only(number: str) -> str:
    return "".join(ch for ch in str(number) if ch.isdigit())


def build_whatsapp_link(message: str, to_number: str | None = None) -> str:
    number = _digits_only(to_number or settings.SHOP_WHATSAPP_NUMBER)
    return f"https://wa.me/{number}?text={quote(message)}"


def send_whatsapp_message(message: str, to_number: str | None = None) -> bool:
    if not (
        settings.TWILIO_ACCOUNT_SID
        and settings.TWILIO_AUTH_TOKEN
        and settings.TWILIO_WHATSAPP_FROM
    ):
        return False

    number = _digits_only(to_number or settings.SHOP_WHATSAPP_NUMBER)
    if not number:
        return False

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        payload = {
            "from_": settings.TWILIO_WHATSAPP_FROM,
            "to": f"whatsapp:+{number}",
        }

        if settings.TWILIO_CONTENT_SID:
            payload["content_sid"] = settings.TWILIO_CONTENT_SID
        else:
            payload["body"] = message

        client.messages.create(**payload)
        return True
    except Exception as exc:
        # The order/contact request remains successful; click-to-chat still works.
        print(f"[whatsapp_service] Twilio send failed: {exc}")
        return False


def build_order_message(order) -> str:
    lines = "\n".join(
        f"- {item.product_name} x{item.qty} = ₹{float(item.price) * item.qty:,.2f}"
        for item in order.items
    )
    return (
        f"🛍️ New order #{order.id}\n"
        f"Customer: {order.customer_name} ({order.phone})\n"
        f"{lines}\n"
        f"Total: ₹{float(order.total_amount):,.2f}"
    )


def notify_new_order(order) -> str:
    message = build_order_message(order)
    send_whatsapp_message(message)
    return build_whatsapp_link(message)


def build_contact_message(contact) -> str:
    return f"📩 New message from {contact.name} ({contact.email}):\n{contact.message}"


def notify_contact_message(contact) -> str:
    message = build_contact_message(contact)
    send_whatsapp_message(message)
    return build_whatsapp_link(message)
