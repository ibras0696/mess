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
