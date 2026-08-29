from sqlalchemy.orm import Session

from ..models.task import Task


class TaskRepository:
    @staticmethod
    def create(
        db: Session,
        task: Task,
    ) -> Task:
        db.add(task)
        db.commit()
        db.refresh(task)

        return task

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Task]:
        return (
            db.query(Task)
            .order_by(Task.id.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        task_id: int,
    ) -> Task | None:
        return (
            db.query(Task)
            .filter(Task.id == task_id)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        task: Task,
    ) -> Task:
        db.commit()
        db.refresh(task)

        return task

    @staticmethod
    def delete(
        db: Session,
        task: Task,
    ) -> None:
        db.delete(task)
        db.commit()