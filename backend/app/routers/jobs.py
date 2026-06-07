from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.job import JobCreate, JobRead, JobUpdate
from app.services import job_service

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


# --------------------------------------------------------
# CRUD persistant
# --------------------------------------------------------


@router.get("", response_model=list[JobRead])
def list_jobs(db: Session = Depends(get_db)) -> list[JobRead]:
    return [JobRead.model_validate(j) for j in job_service.list_jobs(db)]


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)) -> JobRead:
    return JobRead.model_validate(job_service.create_job(db, payload))


@router.get("/{job_id}", response_model=JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)) -> JobRead:
    job = _get_or_404(db, job_id)
    return JobRead.model_validate(job)


@router.patch("/{job_id}", response_model=JobRead)
def update_job(job_id: int, payload: JobUpdate, db: Session = Depends(get_db)) -> JobRead:
    job = _get_or_404(db, job_id)
    return JobRead.model_validate(job_service.update_job(db, job, payload))


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)) -> None:
    job = _get_or_404(db, job_id)
    job_service.delete_job(db, job)


# --------------------------------------------------------
# Actions stubbées — branchera la logique réelle plus tard.
# Pour l'instant : retour JSON minimal { ok, action, jobId }.
# --------------------------------------------------------


@router.post("/scrape")
def scrape_jobs() -> dict:
    return {"ok": True, "action": "scrape", "found": 0}


@router.post("/{job_id}/generate-cv")
def generate_cv(job_id: int, db: Session = Depends(get_db)) -> dict:
    _get_or_404(db, job_id)
    return {"ok": True, "action": "generate_cv", "jobId": job_id}


@router.post("/{job_id}/generate-cover-letter")
def generate_cover_letter(job_id: int, db: Session = Depends(get_db)) -> dict:
    _get_or_404(db, job_id)
    return {"ok": True, "action": "generate_cover_letter", "jobId": job_id}


@router.post("/{job_id}/verify")
def verify_job(job_id: int, db: Session = Depends(get_db)) -> dict:
    _get_or_404(db, job_id)
    return {"ok": True, "action": "verify", "jobId": job_id}


@router.post("/{job_id}/submit")
def submit_job(job_id: int, db: Session = Depends(get_db)) -> dict:
    _get_or_404(db, job_id)
    return {"ok": True, "action": "submit", "jobId": job_id}


@router.post("/{job_id}/send-email")
def send_email(job_id: int, db: Session = Depends(get_db)) -> dict:
    _get_or_404(db, job_id)
    return {"ok": True, "action": "send_email", "jobId": job_id}


# --------------------------------------------------------


def _get_or_404(db: Session, job_id: int):
    job = job_service.get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job
