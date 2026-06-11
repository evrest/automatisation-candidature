from __future__ import annotations

from pydantic import Field

from app.schemas.common import CamelModel
from app.schemas.job import JobRead


class ScrapeSite(CamelModel):
    """Un site scrapable, exposé au front pour construire la modal."""

    id: str
    label: str


class ScrapeRequest(CamelModel):
    sites: list[str] = Field(min_length=1)
    limit: int = Field(default=10, ge=1, le=25)  # par site
    query: str | None = None  # défaut : titre du profil
    location: str | None = None  # défaut : ville du profil


class ScrapeSiteError(CamelModel):
    site: str
    message: str


class ScrapeResult(CamelModel):
    created: list[JobRead]
    skipped_duplicates: int
    errors: list[ScrapeSiteError]
