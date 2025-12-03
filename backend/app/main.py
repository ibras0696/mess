from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routers
from app.core.config import settings
from app.core.database import engine
from app.core.logger import configure_logging
from app.models.base import Base


def create_app() -> FastAPI:
    configure_logging()
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(routers.api_router)

    @app.get("/", tags=["meta"], summary="Root ping")
    async def root() -> dict[str, str]:
        return {"app": settings.app_name, "env": settings.env}

    return app


app = create_app()
