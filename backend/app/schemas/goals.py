from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class GoalCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=200,
    )
    description: str = Field(
        default="",
        max_length=2000,
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError(
                "Title cannot be empty."
            )

        return value

    @field_validator("description")
    @classmethod
    def validate_description(
        cls,
        value: str,
    ) -> str:
        return value.strip()


class GoalUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
    )
    progress: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    @field_validator("title")
    @classmethod
    def validate_title(
        cls,
        value: str | None,
    ) -> str | None:
        if value is not None:
            value = value.strip()

            if not value:
                raise ValueError(
                    "Title cannot be empty."
                )

        return value

    @field_validator("description")
    @classmethod
    def validate_description(
        cls,
        value: str | None,
    ) -> str | None:
        if value is not None:
            return value.strip()

        return value


class GoalResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    progress: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }