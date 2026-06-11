from __future__ import annotations

from datetime import datetime

from sqlalchemy import JSON, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, _utcnow


class JobApplication(Base, TimestampMixin):
    """Une opportunité repérée (scrape ou manuelle) + le suivi de candidature."""

    __tablename__ = "job_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    title: Mapped[str] = mapped_column(String)
    company: Mapped[str] = mapped_column(String)
    source: Mapped[str] = mapped_column(String, default="manual")  # linkedin | indeed | manual | ...
    external_id: Mapped[str | None] = mapped_column(String, nullable=True, index=True)  # id chez la source, dédup
    url: Mapped[str | None] = mapped_column(String, nullable=True)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    contract_type: Mapped[str | None] = mapped_column(String, nullable=True)
    salary: Mapped[str | None] = mapped_column(String, nullable=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    summary: Mapped[str | None] = mapped_column(String, nullable=True)  # résumé IA court
    requirements: Mapped[list[str]] = mapped_column(JSON, default=list)
    keywords: Mapped[list[str]] = mapped_column(JSON, default=list)

    # Workflow : found → cv_generated → reviewed → submitted → responded / rejected
    status: Mapped[str] = mapped_column(String, default="found")

    cv_path: Mapped[str | None] = mapped_column(String, nullable=True)
    cover_letter_path: Mapped[str | None] = mapped_column(String, nullable=True)
    cv_content: Mapped[str | None] = mapped_column(String, nullable=True)  # CV généré (markdown)
    letter_content: Mapped[str | None] = mapped_column(String, nullable=True)  # lettre générée
    contact_email: Mapped[str | None] = mapped_column(String, nullable=True)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)

    found_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    applied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
