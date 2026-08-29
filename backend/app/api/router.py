from fastapi import APIRouter

from .routes import goals, projects, tasks


api_router = APIRouter()

api_router.include_router(goals.router)
api_router.include_router(projects.router)
api_router.include_router(tasks.router)