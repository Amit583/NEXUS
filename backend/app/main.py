from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .database.connection import Base, engine
from .models.goal import Goal


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NEXUS API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "nexus-api",
        "version": "0.1.0",
    }


@app.get("/")
async def root():
    return {
        "name": "NEXUS",
        "message": "NEXUS backend is running.",
    }