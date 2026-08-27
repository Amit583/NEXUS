from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.goal import Goal


class GoalRepository:

    @staticmethod
    def create(
        db: Session,
        title: str,
        description: str = "",
    ) -> Goal:

        goal = Goal(
            title=title,
            description=description,
        )

        db.add(goal)
        db.commit()
        db.refresh(goal)

        return goal

    @staticmethod
    def get_all(db: Session) -> list[Goal]:

        statement = select(Goal).order_by(
            Goal.created_at.desc()
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def get_by_id(
        db: Session,
        goal_id: int,
    ) -> Goal | None:

        return db.get(Goal, goal_id)

    @staticmethod
    def delete(
        db: Session,
        goal: Goal,
    ) -> None:

        db.delete(goal)
        db.commit()