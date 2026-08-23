from types import SimpleNamespace

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services import email_service, whatsapp_service

router = APIRouter(prefix="/api", tags=["Contact & Newsletter"])


@router.post("/contact", response_model=schemas.ContactOut, status_code=201)
def submit_contact(
    payload: schemas.ContactIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    contact = models.ContactMessage(
        name=payload.name,
        email=str(payload.email).lower(),
        message=payload.message,
    )
    db.add(contact)
    try:
        db.commit()
        db.refresh(contact)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="We couldn't send your message right now. Please try again in a moment.",
        )

    # Background tasks get a plain snapshot instead of a live ORM object, so
    # they do not depend on the request's database session staying open.
    snapshot = SimpleNamespace(
        id=contact.id,
        name=contact.name,
        email=contact.email,
        message=contact.message,
    )
    whatsapp_message = whatsapp_service.build_contact_message(snapshot)
    whatsapp_link = whatsapp_service.build_whatsapp_link(whatsapp_message)

    background_tasks.add_task(email_service.send_contact_notification, snapshot)
    background_tasks.add_task(whatsapp_service.send_whatsapp_message, whatsapp_message)

    result = schemas.ContactOut.model_validate(contact)
    result.whatsapp_link = whatsapp_link
    return result


@router.post("/newsletter", status_code=201)
def subscribe_newsletter(payload: schemas.NewsletterIn, db: Session = Depends(get_db)):
    sub = models.NewsletterSubscriber(email=str(payload.email).lower())
    db.add(sub)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This email is already subscribed")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="We couldn't subscribe you right now. Please try again in a moment.",
        )
    return {"message": "Subscribed successfully"}
