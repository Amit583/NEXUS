from sqlalchemy.orm import Session

from ..models.project import Project
from ..models.task import Task
from ..repositories.tasks import TaskRepository
from ..schemas.tasks import TaskCreate, TaskUpdate


class TaskService:
    @staticmethod
    def create_task(
        db: Session,
        task_data: TaskCreate,
    ) -> Task:
        if task_data.project_id is not None:
            project = (
                db.query(Project)
                .filter(Project.id == task_data.project_id)
                .first()
            )

            if project is None:
                raise ValueError("Project not found")

        task = Task(
            title=task_data.title,
            description=task_data.description,
            project_id=task_data.project_id,
        )

        return TaskRepository.create(
            db,
            task,
        )

    @staticmethod
    def get_tasks(
        db: Session,
    ) -> list[Task]:
        return TaskRepository.get_all(db)

    @staticmethod
    def get_task(
        db: Session,
        task_id: int,
    ) -> Task | None:
        return TaskRepository.get_by_id(
            db,
            task_id,
        )

    @staticmethod
    def update_task(
        db: Session,
        task_id: int,
        task_data: TaskUpdate,
    ) -> Task:
        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if task is None:
            raise ValueError("Task not found")

        update_data = task_data.model_dump(
            exclude_unset=True,
        )

        if "project_id" in update_data:
            project_id = update_data["project_id"]

            if project_id is not None:
                project = (
                    db.query(Project)
                    .filter(Project.id == project_id)
                    .first()
                )

                if project is None:
                    raise ValueError("Project not found")

        for field, value in update_data.items():
            setattr(task, field, value)

        return TaskRepository.update(
            db,
            task,
        )

    @staticmethod
    def delete_task(
        db: Session,
        task_id: int,
    ) -> None:
        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if task is None:
            raise ValueError("Task not found")

        TaskRepository.delete(
            db,
            task,
        )