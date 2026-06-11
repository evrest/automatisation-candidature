"""Scraper Indeed France (best-effort).

Indeed est derrière Cloudflare : la requête peut être bloquée (403).
Dans ce cas une ScraperError lisible remonte jusqu'au front — les
autres sites cochés continuent leur scrape normalement.
"""

from __future__ import annotations

from urllib.parse import parse_qs, urlencode, urlparse

import httpx
from parsel import Selector

from app.scraping.base import BaseScraper, ScrapedOffer, ScraperError

_BASE = "https://fr.indeed.com"


class IndeedScraper(BaseScraper):
    id = "indeed"
    label = "Indeed"

    async def search(
        self,
        client: httpx.AsyncClient,
        query: str,
        location: str,
        limit: int,
    ) -> list[ScrapedOffer]:
        params = urlencode({"q": query, "l": location})
        resp = await self._get(client, f"{_BASE}/jobs?{params}")

        offers = self._parse_cards(resp.text)[:limit]
        for offer in offers:
            await self._polite_pause()
            try:
                await self._fetch_detail(client, offer)
            except ScraperError:
                continue
        return offers

    def _parse_cards(self, html: str) -> list[ScrapedOffer]:
        sel = Selector(text=html)
        cards = sel.css("div.job_seen_beacon")
        if not cards and "challenge" in html.lower():
            raise ScraperError("Indeed a renvoyé une page de vérification anti-bot.")
        offers: list[ScrapedOffer] = []
        for card in cards:
            jk = self._extract_jk(card)
            title = _clean(" ".join(card.css("h2.jobTitle ::text").getall()))
            company = _clean(card.css('[data-testid="company-name"]::text').get())
            if not jk or not title:
                continue
            offers.append(
                ScrapedOffer(
                    source=self.id,
                    external_id=jk,
                    title=title,
                    company=company or "(entreprise inconnue)",
                    url=f"{_BASE}/viewjob?jk={jk}",
                    location=_clean(card.css('[data-testid="text-location"]::text').get()),
                    salary=_clean(
                        card.css(".salary-snippet-container ::text").get()
                        or card.css('[data-testid="attribute_snippet_testid"]::text').get()
                    ),
                )
            )
        return offers

    @staticmethod
    def _extract_jk(card: Selector) -> str | None:
        jk = card.css("[data-jk]::attr(data-jk)").get()
        if jk:
            return jk
        href = card.css("h2.jobTitle a::attr(href)").get() or ""
        return parse_qs(urlparse(href).query).get("jk", [None])[0]

    async def _fetch_detail(self, client: httpx.AsyncClient, offer: ScrapedOffer) -> None:
        resp = await self._get(client, offer.url)
        sel = Selector(text=resp.text)
        paragraphs = sel.css("#jobDescriptionText ::text").getall()
        description = "\n".join(p.strip() for p in paragraphs if p.strip())
        offer.description = description or None


def _clean(value: str | None) -> str | None:
    return value.strip() if value and value.strip() else None
