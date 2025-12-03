from celery import Celery

from app.core.config import settings


celery_app = Celery(
    "web_messenger_worker",
    broker=settings.redis_url,
    backend=settings.redis_url,
)


@celery_app.task(name="health.ping")
def ping() -> str:
    """Simple health task to verify Celery wiring."""
    return "pong"


@celery_app.task(name="email.offline_notification")
def offline_notification(to_emails: list[str], subject: str, body: str) -> None:
    """Send offline notification emails."""
    from app.workers.tasks_email import send_email

    send_email(subject=subject, body=body, to_emails=to_emails)
