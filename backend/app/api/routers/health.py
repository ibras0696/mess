from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/healthz", summary="Service liveness probe")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
