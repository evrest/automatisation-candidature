from __future__ import annotations

from app.schemas.common import CamelModel


# --------------------------------------------------------
# Sous-entités — Input (sans id, pour PUT en bloc)
#                Read  (avec id, pour GET)
# --------------------------------------------------------


class ExperienceBase(CamelModel):
    company: str
    position: str
    location: str | None = None
    contract_type: str | None = None
    start_date: str
    end_date: str | None = None
    description: str = ""
    achievements: list[str] = []
    technologies: list[str] = []
    tags: list[str] = []
    order: int = 0


class ExperienceRead(ExperienceBase):
    id: int


class ProjectBase(CamelModel):
    name: str
    role: str | None = None
    context: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    url: str | None = None
    github_url: str | None = None
    description: str = ""
    achievements: list[str] = []
    technologies: list[str] = []
    tags: list[str] = []
    order: int = 0


class ProjectRead(ProjectBase):
    id: int


class EducationBase(CamelModel):
    institution: str
    degree: str
    field: str | None = None
    location: str | None = None
    start_date: str
    end_date: str | None = None
    grade: str | None = None
    description: str | None = None
    order: int = 0


class EducationRead(EducationBase):
    id: int


class SkillBase(CamelModel):
    category: str
    name: str
    level: str | None = None
    years_of_experience: int | None = None
    order: int = 0


class SkillRead(SkillBase):
    id: int


class LanguageBase(CamelModel):
    name: str
    level: str
    order: int = 0


class LanguageRead(LanguageBase):
    id: int


class CertificationBase(CamelModel):
    name: str
    issuer: str
    date: str
    url: str | None = None
    order: int = 0


class CertificationRead(CertificationBase):
    id: int


# --------------------------------------------------------
# Profil — identité + tous les sous-blocs
# --------------------------------------------------------


class _ProfileIdentity(CamelModel):
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    phone: str = ""
    birth_date: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    driving_license: bool = False

    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    website_url: str | None = None

    title: str = ""
    summary: str = ""
    interests: list[str] = []


class ProfileUpdate(_ProfileIdentity):
    """Payload PUT — remplace tout le profil et ses sous-listes."""

    experiences: list[ExperienceBase] = []
    projects: list[ProjectBase] = []
    educations: list[EducationBase] = []
    skills: list[SkillBase] = []
    languages: list[LanguageBase] = []
    certifications: list[CertificationBase] = []


class ProfileRead(_ProfileIdentity):
    id: int
    experiences: list[ExperienceRead] = []
    projects: list[ProjectRead] = []
    educations: list[EducationRead] = []
    skills: list[SkillRead] = []
    languages: list[LanguageRead] = []
    certifications: list[CertificationRead] = []
