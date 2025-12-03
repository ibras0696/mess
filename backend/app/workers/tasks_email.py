import smtplib
from email.message import EmailMessage
from typing import Iterable

from app.core.config import settings


def send_email(subject: str, body: str, to_emails: Iterable[str]) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.mail_from
    msg["To"] = ", ".join(to_emails)
    msg.set_content(body)

    with smtplib.SMTP(host=settings.mailhog_host, port=settings.mailhog_port) as smtp:
        smtp.send_message(msg)
