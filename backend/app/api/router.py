from fastapi import APIRouter

from .routes import goals


api_router = APIRouter()

api_router.include_router(goals.router)