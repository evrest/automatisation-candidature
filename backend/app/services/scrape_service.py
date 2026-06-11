"""Orchestration du scraping : sites → offres → dédup → résumé IA → DB.

Dédoublonnage à deux niveaux :
- contre la DB : (source, external_id) et url déjà connus ;
- intra-batch : la même offre remontée deux fois dans un même run.
"""

from __future__ import annotations

import asyncio

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import JobApplication
from app.schemas.job import JobRead
from app.schemas.scrape import ScrapeRequest, ScrapeResult, ScrapeSite, ScrapeSiteError
from app.scraping import SCRAPERS, ScrapedOffer, ScraperError
from app.services import ai_service, profile_service

_HTTP_TIMEOUT = httpx.Timeout(20.0)
_SUMMARY_CONCURRENCY = 4


def list_sites() -> list[ScrapeSite]:
    return [ScrapeSite(id=s.id, label=s.label) for s in SCRAPERS.values()]


async def run_scrape(db: Session, req: ScrapeRequest) -> ScrapeResult:
    profile = profile_service.get_or_create_profile(db)
    query = (req.query or "").strip() or profile.title or "développeur"
    location = (req.location or "").strip() or profile.city or "France"

    offers, errors = await _scrape_sites(req.sites, query, location, req.limit)
    fresh, skipped = _dedupe(db, offers)
    summaries = await _summarize_all(fresh)

    jobs = [
        JobApplication(
            source=o.source,
            external_id=o.external_id,
            title=o.title,
            company=o.company,
            url=o.url,
            location=o.location,
            salary=o.salary or s["salary"],
            description=o.description,
            summary=s["summary"] or None,
            status="found",
        )
        for o, s in zip(fresh, summaries)
    ]
    db.add_all(jobs)
    db.commit()
    for job in jobs:
        db.refresh(job)

    return ScrapeResult(
        created=[JobRead.model_validate(j) for j in jobs],
        skipped_duplicates=skipped,
        errors=errors,
    )


async def _scrape_sites(
    site_ids: list[str], query: str, location: str, limit: int
) -> tuple[list[ScrapedOffer], list[ScrapeSiteError]]:
    offers: list[ScrapedOffer] = []
    errors: list[ScrapeSiteError] = []
    async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
        for site_id in site_ids:
            scraper = SCRAPERS.get(site_id)
            if scraper is None:
                errors.append(ScrapeSiteError(site=site_id, message="Site inconnu."))
                continue
            try:
                offers += await scraper.search(client, query, location, limit)
            except ScraperError as exc:
                errors.append(ScrapeSiteError(site=site_id, message=str(exc)))
            except Exception as exc:  # HTML changé, parsing inattendu…
                errors.append(ScrapeSiteError(site=site_id, message=f"Erreur inattendue : {exc}"))
    return offers, errors


def _dedupe(db: Session, offers: list[ScrapedOffer]) -> tuple[list[ScrapedOffer], int]:
    rows = db.execute(
        select(JobApplication.source, JobApplication.external_id, JobApplication.url)
    ).all()
    known_ids = {(r.source, r.external_id) for r in rows if r.external_id}
    known_urls = {r.url for r in rows if r.url}

    fresh: list[ScrapedOffer] = []
    skipped = 0
    for offer in offers:
        key = (offer.source, offer.external_id)
        if key in known_ids or offer.url in known_urls:
            skipped += 1
            continue
        known_ids.add(key)
        known_urls.add(offer.url)
        fresh.append(offer)
    return fresh, skipped


async def _summarize_all(offers: list[ScrapedOffer]) -> list[dict]:
    semaphore = asyncio.Semaphore(_SUMMARY_CONCURRENCY)

    async def one(o: ScrapedOffer) -> dict:
        async with semaphore:
            try:
                return await ai_service.summarize_offer(o.title, o.company, o.description)
            except Exception:  # l'import ne doit pas échouer pour un résumé raté
                return {"summary": "", "salary": None}

    return list(await asyncio.gather(*(one(o) for o in offers)))
