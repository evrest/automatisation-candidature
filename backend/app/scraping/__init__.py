"""Registre des scrapers. Ajouter un site = créer un module + une entrée ici."""

from app.scraping.base import BaseScraper, ScrapedOffer, ScraperError
from app.scraping.indeed import IndeedScraper
from app.scraping.linkedin import LinkedInScraper

SCRAPERS: dict[str, BaseScraper] = {
    scraper.id: scraper for scraper in (LinkedInScraper(), IndeedScraper())
}

__all__ = ["SCRAPERS", "BaseScraper", "ScrapedOffer", "ScraperError"]
