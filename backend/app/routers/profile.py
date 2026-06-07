from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.profile import ProfileRead, ProfileUpdate
from app.services import profile_service

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ProfileRead)
def get_profile(db: Session = Depends(get_db)) -> ProfileRead:
    profile = profile_service.get_or_create_profile(db)
    return ProfileRead.model_validate(profile)


@router.put("", response_model=ProfileRead)
def put_profile(payload: ProfileUpdate, db: Session = Depends(get_db)) -> ProfileRead:
    profile = profile_service.update_profile(db, payload)
    return ProfileRead.model_validate(profile)
