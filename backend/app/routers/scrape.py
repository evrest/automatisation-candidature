from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.scrape import ScrapeRequest, ScrapeResult, ScrapeSite
from app.services import scrape_service

router = APIRouter(prefix="/api/scrape", tags=["scrape"])


@router.get("/sites", response_model=list[ScrapeSite])
def sites() -> list[ScrapeSite]:
    return scrape_service.list_sites()


@router.post("", response_model=ScrapeResult)
async def scrape(payload: ScrapeRequest, db: Session = Depends(get_db)) -> ScrapeResult:
    return await scrape_service.run_scrape(db, payload)
