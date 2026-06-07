from __future__ import annotations

from datetime import datetime

from app.schemas.common import CamelModel


class JobBase(CamelModel):
    title: str
    company: str
    source: str = "manual"
    url: str | None = None
    location: str | None = None
    contract_type: str | None = None
    salary: str | None = None
    description: str | None = None
    requirements: list[str] = []
    keywords: list[str] = []
    contact_email: str | None = None
    notes: str | None = None


class JobCreate(JobBase):
    pass


class JobUpdate(CamelModel):
    """Patch partiel : tout est optionnel."""

    title: str | None = None
    company: str | None = None
    source: str | None = None
    url: str | None = None
    location: str | None = None
    contract_type: str | None = None
    salary: str | None = None
    description: str | None = None
    requirements: list[str] | None = None
    keywords: list[str] | None = None
    status: str | None = None
    cv_path: str | None = None
    cover_letter_path: str | None = None
    contact_email: str | None = None
    notes: str | None = None


class JobRead(JobBase):
    id: int
    status: str
    cv_path: str | None = None
    cover_letter_path: str | None = None
    found_at: datetime
    applied_at: datetime | None = None
