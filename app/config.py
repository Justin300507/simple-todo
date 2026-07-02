import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/mydatabase")
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-development-only")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Config()

# Preflight patch: ensure commonly-referenced settings attributes always exist
if not hasattr(settings, "DATABASE_URL"):
    try:
        settings.DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    except Exception:
        object.__setattr__(settings, "DATABASE_URL", os.getenv("DATABASE_URL", "sqlite:///./app.db"))
if not hasattr(settings, "SECRET_KEY"):
    try:
        settings.SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    except Exception:
        object.__setattr__(settings, "SECRET_KEY", os.getenv("SECRET_KEY", "dev-secret-key-change-in-production"))
if not hasattr(settings, "ALGORITHM"):
    try:
        settings.ALGORITHM = os.getenv("ALGORITHM", "HS256")
    except Exception:
        object.__setattr__(settings, "ALGORITHM", os.getenv("ALGORITHM", "HS256"))
if not hasattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES"):
    try:
        settings.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    except Exception:
        object.__setattr__(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080")))
