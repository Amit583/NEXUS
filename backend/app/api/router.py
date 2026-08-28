from fastapi import APIRouter

from .routes import goals, projects


api_router = APIRouter()

api_router.include_router(goals.router)
api_router.include_router(projects.router)