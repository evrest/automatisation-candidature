"""Socle commun des scrapers.

Choix technique : httpx (fetch async, compatible FastAPI) + parsel
(la lib de sélecteurs de Scrapy — mêmes CSS/XPath, sans le reactor
Twisted que Scrapy imposerait dans un process uvicorn).
"""

from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass

import httpx

# Headers "navigateur" : les job boards rejettent les UA par défaut.
BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Délai de politesse entre deux requêtes de détail vers un même site.
POLITE_DELAY_S = 0.6


class ScraperError(Exception):
    """Erreur lisible, remontée telle quelle au front (site bloqué, HTML changé…)."""


@dataclass
class ScrapedOffer:
    """Offre normalisée, indépendante du site d'origine."""

    source: str
    external_id: str
    title: str
    company: str
    url: str
    location: str | None = None
    salary: str | None = None
    description: str | None = None


class BaseScraper(ABC):
    """Un scraper par site. S'enregistre dans SCRAPERS (cf. __init__.py)."""

    id: str
    label: str

    @abstractmethod
    async def search(
        self,
        client: httpx.AsyncClient,
        query: str,
        location: str,
        limit: int,
    ) -> list[ScrapedOffer]: ...

    async def _get(self, client: httpx.AsyncClient, url: str, **kwargs) -> httpx.Response:
        """GET avec gestion d'erreurs uniforme."""
        try:
            resp = await client.get(url, headers=BROWSER_HEADERS, follow_redirects=True, **kwargs)
        except httpx.HTTPError as exc:
            raise ScraperError(f"{self.label} injoignable : {exc}") from exc
        if resp.status_code == 403:
            raise ScraperError(f"{self.label} a bloqué la requête (protection anti-bot).")
        if resp.status_code >= 400:
            raise ScraperError(f"{self.label} a répondu {resp.status_code}.")
        return resp

    @staticmethod
    async def _polite_pause() -> None:
        await asyncio.sleep(POLITE_DELAY_S)
