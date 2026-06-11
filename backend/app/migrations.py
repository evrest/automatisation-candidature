"""Micro-migrations SQLite.

Base.metadata.create_all crée les tables manquantes mais ne touche jamais
aux tables existantes. Pour la DB prod (volume Fly), on ajoute ici les
colonnes apparues après le premier déploiement. Passer à Alembic si le
schéma devient mouvant.
"""

from __future__ import annotations

from sqlalchemy import Engine

# table → {colonne: type SQL}. Ajouter une entrée suffit.
_NEW_COLUMNS: dict[str, dict[str, str]] = {
    "job_applications": {
        "external_id": "VARCHAR",
        "summary": "VARCHAR",
        "cv_content": "VARCHAR",
        "letter_content": "VARCHAR",
    },
}


def run_migrations(engine: Engine) -> None:
    with engine.begin() as conn:
        for table, columns in _NEW_COLUMNS.items():
            rows = conn.exec_driver_sql(f"PRAGMA table_info({table})").fetchall()
            existing = {row[1] for row in rows}
            if not existing:  # table absente : create_all la créera complète
                continue
            for name, sql_type in columns.items():
                if name not in existing:
                    conn.exec_driver_sql(f"ALTER TABLE {table} ADD COLUMN {name} {sql_type}")
