from datetime import datetime

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=200,
    )

    description: str = ""

    project_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = None

    progress: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    project_id: int | None = None


class TaskResponse(BaseModel):
    id: int

    title: str
    description: str

    status: str
    progress: int

    project_id: int | None

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }