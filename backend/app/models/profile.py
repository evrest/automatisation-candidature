from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import JSON, Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.certification import Certification
    from app.models.education import Education
    from app.models.experience import Experience
    from app.models.language import Language
    from app.models.project import Project
    from app.models.skill import Skill


class Profile(Base, TimestampMixin):
    """Profil unique (MVP mono-utilisateur). Source de vérité pour CV / LM."""

    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Identité
    first_name: Mapped[str] = mapped_column(String, default="")
    last_name: Mapped[str] = mapped_column(String, default="")
    email: Mapped[str] = mapped_column(String, default="")
    phone: Mapped[str] = mapped_column(String, default="")
    birth_date: Mapped[str | None] = mapped_column(String, nullable=True)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    city: Mapped[str | None] = mapped_column(String, nullable=True)
    country: Mapped[str | None] = mapped_column(String, nullable=True)
    driving_license: Mapped[bool] = mapped_column(Boolean, default=False)

    # Liens
    linkedin_url: Mapped[str | None] = mapped_column(String, nullable=True)
    github_url: Mapped[str | None] = mapped_column(String, nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(String, nullable=True)
    website_url: Mapped[str | None] = mapped_column(String, nullable=True)

    # Pitch
    title: Mapped[str] = mapped_column(String, default="")
    summary: Mapped[str] = mapped_column(String, default="")

    # Centres d'intérêt (liste libre)
    interests: Mapped[list[str]] = mapped_column(JSON, default=list)

    experiences: Mapped[list[Experience]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Experience.order",
    )
    projects: Mapped[list[Project]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Project.order",
    )
    educations: Mapped[list[Education]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Education.order",
    )
    skills: Mapped[list[Skill]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Skill.order",
    )
    languages: Mapped[list[Language]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Language.order",
    )
    certifications: Mapped[list[Certification]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="Certification.order",
    )
