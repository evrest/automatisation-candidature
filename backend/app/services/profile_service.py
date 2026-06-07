from __future__ import annotations

from typing import Iterable

from sqlalchemy.orm import Session

from app.models import (
    Certification,
    Education,
    Experience,
    Language,
    Profile,
    Project,
    Skill,
)
from app.schemas.profile import ProfileUpdate


# Mapping nom-de-champ-du-payload → classe SQLAlchemy correspondante.
# Ajoute une entrée ici et la sous-liste est gérée automatiquement par _replace_collection.
_COLLECTIONS: dict[str, type] = {
    "experiences": Experience,
    "projects": Project,
    "educations": Education,
    "skills": Skill,
    "languages": Language,
    "certifications": Certification,
}

_IDENTITY_FIELDS: tuple[str, ...] = (
    "first_name", "last_name", "email", "phone", "birth_date",
    "address", "city", "country", "driving_license",
    "linkedin_url", "github_url", "portfolio_url", "website_url",
    "title", "summary", "interests",
)


def get_or_create_profile(db: Session) -> Profile:
    """MVP mono-utilisateur : un seul profil, créé à la volée si absent."""
    profile = db.query(Profile).first()
    if profile is None:
        profile = Profile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def update_profile(db: Session, payload: ProfileUpdate) -> Profile:
    profile = get_or_create_profile(db)

    for field in _IDENTITY_FIELDS:
        setattr(profile, field, getattr(payload, field))

    for field, model_cls in _COLLECTIONS.items():
        items = getattr(payload, field)
        _replace_collection(getattr(profile, field), items, model_cls, profile.id)

    db.commit()
    db.refresh(profile)
    return profile


def _replace_collection(
    current: list,
    new_items: Iterable,
    model_cls: type,
    profile_id: int,
) -> None:
    """Vide la collection puis y insère les items du payload.
    Bénéficie du cascade delete-orphan déclaré sur le Profile."""
    current.clear()
    for item in new_items:
        current.append(model_cls(profile_id=profile_id, **item.model_dump()))
