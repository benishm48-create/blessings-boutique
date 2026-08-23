"""Resend email notifications for orders and contact messages."""

import html
import resend

from ..config import settings


def _send(to_email: str, subject: str, html_body: str) -> bool:
    if not settings.RESEND_API_KEY:
        print(
            f"[email_service] RESEND_API_KEY not configured, "
            f"skipping email to {to_email}"
        )
        return False

    resend.api_key = settings.RESEND_API_KEY

    params: resend.Emails.SendParams = {
        "from": settings.RESEND_FROM_EMAIL or "onboarding@resend.dev",
        "to": [to_email],
        "subject": subject,
        "html": html_body,
    }

    try:
        response = resend.Emails.send(params)
        print(
            f"[email_service] Email sent successfully "
            f"to {to_email}: {response}"
        )
        return True

    except Exception as exc:
        print(
            f"[email_service] Failed to send email "
            f"to {to_email}: {exc}"
        )
        return False


def _money(value) -> str:
    return f"{float(value):,.2f}"


def send_order_confirmation(order) -> None:
    items_html = "".join(
        "<tr>"
        f"<td>{html.escape(str(item.product_name))}</td>"
        f"<td>{item.qty}</td>"
        f"<td>₹{_money(item.price)}</td>"
        "</tr>"
        for item in order.items
    )

    customer_name = html.escape(str(order.customer_name))

    customer_html = f"""
    <h2>Thank you for your order, {customer_name}!</h2>

    <p>
        Order #{order.id} has been received and is being processed.
    </p>

    <table border="1" cellpadding="6" cellspacing="0">
        <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
        </tr>

        {items_html}
    </table>

    <p>
        <b>Total: ₹{_money(order.total_amount)}</b>
    </p>

    <p>
        We will contact you shortly to confirm delivery details.
    </p>
    """

    _send(
        order.email,
        f"Order Confirmation #{order.id} — Maison Élan",
        customer_html,
    )

    if settings.SHOP_OWNER_EMAIL:
        owner_html = f"""
        <h2>New order received — #{order.id}</h2>

        <p>
            {customer_name} |
            {html.escape(str(order.phone))} |
            {html.escape(str(order.email))}
        </p>

        <p>
            {html.escape(str(order.address))},
            {html.escape(str(order.city))},
            {html.escape(str(order.state))} -
            {html.escape(str(order.pincode))}
        </p>

        <table border="1" cellpadding="6" cellspacing="0">
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>

            {items_html}
        </table>

        <p>
            <b>Total: ₹{_money(order.total_amount)}</b>
        </p>
        """

        _send(
            settings.SHOP_OWNER_EMAIL,
            f"New Order #{order.id}",
            owner_html,
        )


def send_contact_notification(contact) -> None:
    contact_name = html.escape(str(contact.name))
    contact_email = html.escape(str(contact.email))

    contact_message = html.escape(
        str(contact.message)
    ).replace("\n", "<br>")

    if settings.SHOP_OWNER_EMAIL:
        owner_html = f"""
        <h2>New contact form message</h2>

        <p>
            <b>From:</b>
            {contact_name}
            ({contact_email})
        </p>

        <p>
            {contact_message}
        </p>
        """

        _send(
            settings.SHOP_OWNER_EMAIL,
            "New Contact Message — Maison Élan",
            owner_html,
        )

    ack_html = f"""
    <p>Hi {contact_name},</p>

    <p>
        Thanks for reaching out to Maison Élan —
        we received your message and will get back to you within 24 hours.
    </p>
    """

    _send(
        contact.email,
        "We received your message — Maison Élan",
        ack_html,
    )