from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...database.session import get_db
from ...schemas.goals import (
    GoalCreate,
    GoalResponse,
    GoalUpdate,
)
from ...services.goal_service import GoalService


router = APIRouter(
    prefix="/goals",
    tags=["Goals"],
)


@router.post(
    "",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_goal(
    data: GoalCreate,
    db: Session = Depends(get_db),
):
    return GoalService.create(db, data)


@router.get(
    "",
    response_model=list[GoalResponse],
)
def get_goals(
    db: Session = Depends(get_db),
):
    return GoalService.get_all(db)


@router.get(
    "/{goal_id}",
    response_model=GoalResponse,
)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
):
    goal = GoalService.get_by_id(
        db,
        goal_id,
    )

    if goal is None:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )

    return goal


@router.patch(
    "/{goal_id}",
    response_model=GoalResponse,
)
def update_goal(
    goal_id: int,
    data: GoalUpdate,
    db: Session = Depends(get_db),
):
    goal = GoalService.update(
        db,
        goal_id,
        data,
    )

    if goal is None:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )

    return goal


@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
):
    deleted = GoalService.delete(
        db,
        goal_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )