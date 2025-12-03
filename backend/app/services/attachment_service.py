import uuid

import boto3
from botocore.client import Config

from app.core.config import settings
from app.repositories.attachment_repo import AttachmentRepository
from app.core.database import SessionLocal
from app.schemas.attachment import PresignRequest, PresignResponse


class AttachmentService:
    def __init__(self) -> None:
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.minio_endpoint,
            aws_access_key_id=settings.minio_access_key,
            aws_secret_access_key=settings.minio_secret_key,
            config=Config(signature_version="s3v4"),
        )

    def presign_upload(self, payload: PresignRequest) -> PresignResponse:
        object_key = f"uploads/{uuid.uuid4()}/{payload.filename}"
        params = {
            "Bucket": settings.minio_bucket,
            "Key": object_key,
            "ContentType": payload.content_type,
        }
        url = self.client.generate_presigned_url(
            ClientMethod="put_object",
            Params=params,
            ExpiresIn=settings.presign_expire_seconds,
        )
        return PresignResponse(url=url, object_key=object_key, expires_in=settings.presign_expire_seconds)

    def link_to_message(self, payload) -> None:
        with SessionLocal() as session:
            repo = AttachmentRepository(session)
            repo.create(
                message_id=payload.message_id,
                object_key=payload.object_key,
                file_name=payload.file_name,
                content_type=payload.content_type,
                size_bytes=payload.size_bytes,
                url=payload.url,
            )
            session.commit()
