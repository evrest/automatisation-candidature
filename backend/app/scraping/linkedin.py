"""Scraper LinkedIn via l'API "jobs-guest" (publique, sans login).

Deux temps : la recherche renvoie des cartes HTML, puis chaque offre
est enrichie via l'endpoint de détail pour récupérer la description.
"""

from __future__ import annotations

import re
from urllib.parse import urlencode

import httpx
from parsel import Selector

from app.scraping.base import BaseScraper, ScrapedOffer, ScraperError

_SEARCH_URL = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
_DETAIL_URL = "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"

_JOB_ID_RE = re.compile(r"-(\d+)(?:\?|$)")


class LinkedInScraper(BaseScraper):
    id = "linkedin"
    label = "LinkedIn"

    async def search(
        self,
        client: httpx.AsyncClient,
        query: str,
        location: str,
        limit: int,
    ) -> list[ScrapedOffer]:
        params = urlencode({"keywords": query, "location": location, "start": 0})
        resp = await self._get(client, f"{_SEARCH_URL}?{params}")

        offers = self._parse_cards(resp.text)[:limit]
        if not offers:
            return []

        # Enrichissement : description (+ salaire éventuel) offre par offre.
        for offer in offers:
            await self._polite_pause()
            try:
                await self._fetch_detail(client, offer)
            except ScraperError:
                continue  # la carte reste exploitable sans description
        return offers

    def _parse_cards(self, html: str) -> list[ScrapedOffer]:
        sel = Selector(text=html)
        offers: list[ScrapedOffer] = []
        for card in sel.css("li"):
            url = (card.css("a.base-card__full-link::attr(href)").get() or "").split("?")[0]
            title = _clean(card.css(".base-search-card__title::text").get())
            company = _clean(
                card.css(".base-search-card__subtitle a::text").get()
                or card.css(".base-search-card__subtitle::text").get()
            )
            if not url or not title:
                continue
            external_id = self._extract_id(card, url)
            if not external_id:
                continue
            offers.append(
                ScrapedOffer(
                    source=self.id,
                    external_id=external_id,
                    title=title,
                    company=company or "(entreprise inconnue)",
                    url=url,
                    location=_clean(card.css(".job-search-card__location::text").get()),
                )
            )
        return offers

    @staticmethod
    def _extract_id(card: Selector, url: str) -> str | None:
        urn = card.css("[data-entity-urn]::attr(data-entity-urn)").get() or ""
        if ":" in urn:
            return urn.rsplit(":", 1)[-1]
        match = _JOB_ID_RE.search(url)
        return match.group(1) if match else None

    async def _fetch_detail(self, client: httpx.AsyncClient, offer: ScrapedOffer) -> None:
        resp = await self._get(client, _DETAIL_URL.format(job_id=offer.external_id))
        sel = Selector(text=resp.text)
        paragraphs = sel.css(".show-more-less-html__markup ::text").getall()
        description = "\n".join(p.strip() for p in paragraphs if p.strip())
        offer.description = description or None
        offer.salary = _clean(sel.css(".compensation__salary::text").get()) or offer.salary


def _clean(value: str | None) -> str | None:
    return value.strip() if value and value.strip() else None
