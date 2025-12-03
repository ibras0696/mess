from app.models.attachment import Attachment
from sqlalchemy.orm import Session


class AttachmentRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        message_id: int,
        object_key: str,
        file_name: str,
        content_type: str,
        size_bytes: int | None = None,
        url: str | None = None,
    ) -> Attachment:
        att = Attachment(
            message_id=message_id,
            object_key=object_key,
            file_name=file_name,
            content_type=content_type,
            size_bytes=size_bytes,
            url=url,
        )
        self.session.add(att)
        return att

    def bulk_create(self, message_id: int, items: list[dict]) -> list[Attachment]:
        records = [
            Attachment(
                message_id=message_id,
                object_key=i["object_key"],
                file_name=i["file_name"],
                content_type=i["content_type"],
                size_bytes=i.get("size_bytes"),
                url=i.get("url"),
            )
            for i in items
        ]
        self.session.add_all(records)
        return records
