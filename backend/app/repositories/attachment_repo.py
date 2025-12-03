from app.models.attachment import Attachment
from sqlalchemy.orm import Session


class AttachmentRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        message_id: int | None,
        object_key: str,
        file_name: str,
        content_type: str,
        size_bytes: int | None = None,
        url: str | None = None,
    ) -> Attachment:
        att = Attachment(
            message_id=message_id or 0,
            object_key=object_key,
            file_name=file_name,
            content_type=content_type,
            size_bytes=size_bytes,
            url=url,
        )
        self.session.add(att)
        return att
