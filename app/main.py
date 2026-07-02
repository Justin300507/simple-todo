from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.config import settings

# Import all models to ensure they are registered with SQLAlchemy Base.metadata
from app.models.users import *  # noqa: F401
from app.models.tasks import *  # noqa: F401

# Import routers
from app.routes.stats_routes import stats_router
from app.routes.user_routes import user_router
from app.routes.auth_routes import auth_router
from app.routes.seed_routes import seed_router
from app.routes.task_routes import task_router

app = FastAPI(
    title="ForgeAI Project API",
    description="Backend API for the ForgeAI Project application.",
    version="1.0.0",
)

# CORS (required for frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint (required for deployment health checks)
@app.get("/health")
def health():
    return {"status": "ok"}

# Database setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(stats_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(seed_router)
app.include_router(task_router)
