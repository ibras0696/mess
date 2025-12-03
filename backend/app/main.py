from fastapi import FastAPI

from app.api.routers import health
from app.core.config import settings
from app.core.logger import configure_logging


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title=settings.app_name)

    app.include_router(health.router, prefix="/api")

    @app.get("/", tags=["meta"], summary="Root ping")
    async def root() -> dict[str, str]:
        return {"app": settings.app_name, "env": settings.env}

    return app


app = create_app()
