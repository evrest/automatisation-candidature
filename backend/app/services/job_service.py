from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import JobApplication
from app.schemas.job import JobCreate, JobUpdate


def list_jobs(db: Session) -> list[JobApplication]:
    stmt = select(JobApplication).order_by(JobApplication.found_at.desc())
    return list(db.scalars(stmt))


def get_job(db: Session, job_id: int) -> JobApplication | None:
    return db.get(JobApplication, job_id)


def create_job(db: Session, payload: JobCreate) -> JobApplication:
    job = JobApplication(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def update_job(db: Session, job: JobApplication, payload: JobUpdate) -> JobApplication:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


def delete_job(db: Session, job: JobApplication) -> None:
    db.delete(job)
    db.commit()
