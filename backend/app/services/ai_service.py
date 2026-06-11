"""Génération IA : résumé d'offre, CV, lettre de motivation.

Tout passe par Anthropic. Sans ANTHROPIC_API_KEY :
- summarize_offer dégrade en extrait brut de la description ;
- generate_cv / generate_cover_letter lèvent AiNotConfigured (→ 503 côté API).
"""

from __future__ import annotations

import json
import re

from anthropic import AsyncAnthropic

from app.config import settings
from app.models import JobApplication, Profile

_FALLBACK_SUMMARY_LEN = 280


class AiNotConfigured(Exception):
    """Aucune clé API : la fonctionnalité IA demandée n'est pas disponible."""


def is_configured() -> bool:
    return bool(settings.anthropic_api_key)


def _client() -> AsyncAnthropic:
    if not is_configured():
        raise AiNotConfigured(
            "Clé API Anthropic absente — définis ANTHROPIC_API_KEY pour activer la génération."
        )
    return AsyncAnthropic(api_key=settings.anthropic_api_key)


# --------------------------------------------------------
# Résumé d'offre (modèle rapide)
# --------------------------------------------------------


async def summarize_offer(title: str, company: str, description: str | None) -> dict:
    """Retourne {"summary": str, "salary": str | None} pour la carte miniature."""
    if not description:
        return {"summary": "", "salary": None}
    if not is_configured():
        return {"summary": _truncate(description), "salary": None}

    prompt = (
        "Voici une offre d'emploi.\n"
        f"Poste : {title} — Entreprise : {company}\n"
        f"Description :\n{description[:6000]}\n\n"
        "Réponds UNIQUEMENT avec un JSON de la forme "
        '{"summary": "...", "salary": "..." ou null}.\n'
        "- summary : 2 à 3 phrases en français résumant missions et profil recherché.\n"
        "- salary : la fourchette de salaire si elle est mentionnée dans le texte, sinon null."
    )
    response = await _client().messages.create(
        model=settings.ai_model_fast,
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_summary_json(response.content[0].text, fallback=_truncate(description))


def _parse_summary_json(raw: str, fallback: str) -> dict:
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
            return {
                "summary": str(data.get("summary") or fallback),
                "salary": data.get("salary") or None,
            }
        except json.JSONDecodeError:
            pass
    return {"summary": fallback, "salary": None}


def _truncate(text: str) -> str:
    text = " ".join(text.split())
    if len(text) <= _FALLBACK_SUMMARY_LEN:
        return text
    return text[:_FALLBACK_SUMMARY_LEN].rsplit(" ", 1)[0] + "…"


# --------------------------------------------------------
# CV & lettre de motivation (modèle qualitatif)
# --------------------------------------------------------


async def generate_cv(profile: Profile, job: JobApplication) -> str:
    prompt = (
        "Tu es un expert en recrutement. À partir du profil candidat et de l'offre "
        "ci-dessous, rédige un CV en français, format markdown, une page, orienté "
        "résultats, en mettant en avant les éléments du profil les plus pertinents "
        "pour CETTE offre. N'invente aucune expérience.\n\n"
        f"=== PROFIL ===\n{_profile_to_text(profile)}\n\n"
        f"=== OFFRE ===\n{_job_to_text(job)}\n\n"
        "Réponds uniquement avec le CV en markdown, sans préambule."
    )
    return await _generate(prompt)


async def generate_cover_letter(profile: Profile, job: JobApplication) -> str:
    prompt = (
        "Tu es un expert en candidatures. Rédige une lettre de motivation en français "
        "(250 à 350 mots), ton professionnel mais naturel, spécifique à l'offre, qui "
        "relie concrètement les expériences du profil aux besoins du poste. "
        "N'invente aucun fait.\n\n"
        f"=== PROFIL ===\n{_profile_to_text(profile)}\n\n"
        f"=== OFFRE ===\n{_job_to_text(job)}\n\n"
        "Réponds uniquement avec la lettre, sans préambule."
    )
    return await _generate(prompt)


async def _generate(prompt: str) -> str:
    response = await _client().messages.create(
        model=settings.ai_model_smart,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()


# --------------------------------------------------------
# Sérialisation compacte pour les prompts
# --------------------------------------------------------


def _profile_to_text(p: Profile) -> str:
    lines = [
        f"{p.first_name} {p.last_name} — {p.title}",
        f"Contact : {p.email} / {p.phone} — {p.city or ''} {p.country or ''}",
        f"Liens : {' '.join(filter(None, [p.linkedin_url, p.github_url, p.portfolio_url]))}",
        f"Pitch : {p.summary}",
        "",
        "Expériences :",
        *(
            f"- {e.position} chez {e.company} ({e.start_date} → {e.end_date or 'aujourd’hui'}) : "
            f"{e.description} [{', '.join(e.technologies)}]"
            for e in p.experiences
        ),
        "",
        "Projets :",
        *(f"- {pr.name} : {pr.description} [{', '.join(pr.technologies)}]" for pr in p.projects),
        "",
        "Formation :",
        *(f"- {ed.degree}, {ed.institution} ({ed.start_date} → {ed.end_date or ''})" for ed in p.educations),
        "",
        "Compétences : " + ", ".join(s.name for s in p.skills),
        "Langues : " + ", ".join(f"{l.name} ({l.level})" for l in p.languages),
        "Certifications : " + ", ".join(c.name for c in p.certifications),
    ]
    return "\n".join(lines)


def _job_to_text(j: JobApplication) -> str:
    parts = [
        f"Poste : {j.title} — {j.company}",
        f"Lieu : {j.location or 'non précisé'} — Contrat : {j.contract_type or 'non précisé'}",
        f"Salaire : {j.salary or 'non précisé'}",
        f"Description :\n{(j.description or j.summary or '')[:6000]}",
    ]
    return "\n".join(parts)
