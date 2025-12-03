from fastapi import APIRouter, Depends, status

from app.api.dependencies.auth import get_current_user_id
from app.schemas.attachment import PresignRequest, PresignResponse
from app.services.attachment_service import AttachmentService

router = APIRouter(prefix="/api/attachments", tags=["attachments"])


@router.post("/presign", response_model=PresignResponse, status_code=status.HTTP_201_CREATED)
def presign_upload(payload: PresignRequest, _: int = Depends(get_current_user_id)):
    # auth required to request presign
    return AttachmentService().presign_upload(payload)
