from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...database.session import get_db
from ...schemas.projects import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from ...services.goal_service import GoalService
from ...services.project_service import ProjectService


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
):
    if data.goal_id is not None:
        goal = GoalService.get_by_id(
            db,
            data.goal_id,
        )

        if goal is None:
            raise HTTPException(
                status_code=404,
                detail="Goal not found",
            )

    return ProjectService.create(
        db,
        data,
    )


@router.get(
    "",
    response_model=list[ProjectResponse],
)
def get_projects(
    db: Session = Depends(get_db),
):
    return ProjectService.get_all(db)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = ProjectService.get_by_id(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = ProjectService.get_by_id(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    if "goal_id" in data.model_fields_set:
        if data.goal_id is not None:
            goal = GoalService.get_by_id(
                db,
                data.goal_id,
            )

            if goal is None:
                raise HTTPException(
                    status_code=404,
                    detail="Goal not found",
                )

    return ProjectService.update(
        db,
        project_id,
        data,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    deleted = ProjectService.delete(
        db,
        project_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )