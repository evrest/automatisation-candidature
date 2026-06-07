# Job Automator — Backend (FastAPI)

## Démarrage

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API : http://localhost:8000
Docs auto : http://localhost:8000/docs

## Structure

```
app/
├── main.py              # FastAPI factory + CORS + create_all
├── config.py            # Settings (pydantic-settings)
├── database.py          # Engine + SessionLocal + get_db
├── models/              # SQLAlchemy 2.0 — 1 fichier par entité
├── schemas/             # Pydantic v2 — alias camelCase pour matcher le front
├── services/            # Logique métier — profile_service (full) + job_service (CRUD)
└── routers/             # Endpoints HTTP
    ├── profile.py       # GET / PUT — full
    └── jobs.py          # CRUD + stubs (scrape, generate, submit, email)
```

## État

- **Profil** : full (GET / PUT avec sous-listes remplacées en bloc).
- **Jobs** : CRUD persistant + actions stubbées (return JSON descriptif).
