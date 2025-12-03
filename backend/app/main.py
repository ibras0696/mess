from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routers
from app.ws import router as ws_router
from app.core.config import settings
from app.core.logger import configure_logging


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(routers.api_router)
    app.include_router(ws_router.router)

    @app.get("/", tags=["meta"], summary="Root ping")
    async def root() -> dict[str, str]:
        return {"app": settings.app_name, "env": settings.env}

    return app


app = create_app()
