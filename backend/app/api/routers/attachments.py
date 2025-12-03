from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from app.api.dependencies.auth import get_current_user_id
from app.schemas.attachment import PresignRequest, PresignResponse
from app.services.attachment_service import AttachmentService

router = APIRouter(prefix="/api/attachments", tags=["attachments"])


@router.post("/presign", response_model=PresignResponse, status_code=status.HTTP_201_CREATED)
def presign_upload(payload: PresignRequest, _: int = Depends(get_current_user_id)):
    # auth required to request presign
    return AttachmentService().presign_upload(payload)


class AttachmentLinkRequest(BaseModel):
    message_id: int = Field(gt=0)
    object_key: str = Field(min_length=1)
    file_name: str
    content_type: str
    size_bytes: int | None = None
    url: str | None = None


@router.post("/link", status_code=status.HTTP_204_NO_CONTENT)
def link_attachment(payload: AttachmentLinkRequest, _: int = Depends(get_current_user_id)):
    AttachmentService().link_to_message(payload)
    return None
