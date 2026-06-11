from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./dev.db"
    cors_origins: str = "http://localhost:5173"

    # IA (résumés d'offres, génération CV / lettre). Vide = fallback sans IA.
    anthropic_api_key: str = ""
    ai_model_fast: str = "claude-haiku-4-5"  # résumés en masse
    ai_model_smart: str = "claude-sonnet-4-6"  # CV / lettre de motivation

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
