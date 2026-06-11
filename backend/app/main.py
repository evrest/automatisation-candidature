from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.migrations import run_migrations
from app.models import Base
from app.routers import jobs, profile, scrape


def create_app() -> FastAPI:
    app = FastAPI(title="Job Automator API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # MVP : create_all + micro-migrations. Passer à Alembic quand le schéma se stabilisera.
    Base.metadata.create_all(bind=engine)
    run_migrations(engine)

    app.include_router(profile.router)
    app.include_router(jobs.router)
    app.include_router(scrape.router)

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
