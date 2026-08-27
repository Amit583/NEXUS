from sqlalchemy.orm import Session

from ..engines.progress_engine import (
    calculate_goal_status,
)
from ..repositories.goals import GoalRepository
from ..schemas.goals import (
    GoalCreate,
    GoalUpdate,
)


class GoalService:

    @staticmethod
    def create(
        db: Session,
        data: GoalCreate,
    ):
        return GoalRepository.create(
            db,
            title=data.title,
            description=data.description,
        )

    @staticmethod
    def get_all(db: Session):
        return GoalRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        goal_id: int,
    ):
        return GoalRepository.get_by_id(
            db,
            goal_id,
        )

    @staticmethod
    def update(
        db: Session,
        goal_id: int,
        data: GoalUpdate,
    ):
        goal = GoalRepository.get_by_id(
            db,
            goal_id,
        )

        if goal is None:
            return None

        values = data.model_dump(
            exclude_unset=True
        )

        if "title" in values:
            goal.title = values["title"]

        if "description" in values:
            goal.description = values[
                "description"
            ]

        if "progress" in values:
            progress = values["progress"]

            goal.progress = progress
            goal.status = (
                calculate_goal_status(progress)
            )

        db.commit()
        db.refresh(goal)

        return goal

    @staticmethod
    def delete(
        db: Session,
        goal_id: int,
    ):
        goal = GoalRepository.get_by_id(
            db,
            goal_id,
        )

        if goal is None:
            return False

        GoalRepository.delete(db, goal)

        return True