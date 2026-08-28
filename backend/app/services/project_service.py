from sqlalchemy.orm import Session

from ..engines.progress_engine import (
    calculate_progress_status,
)
from ..repositories.goals import GoalRepository
from ..repositories.projects import ProjectRepository
from ..schemas.projects import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectService:

    @staticmethod
    def create(
        db: Session,
        data: ProjectCreate,
    ):
        if data.goal_id is not None:
            goal = GoalRepository.get_by_id(
                db,
                data.goal_id,
            )

            if goal is None:
                return None

        return ProjectRepository.create(
            db,
            title=data.title.strip(),
            description=data.description,
            goal_id=data.goal_id,
        )

    @staticmethod
    def get_all(db: Session):
        return ProjectRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        project_id: int,
    ):
        return ProjectRepository.get_by_id(
            db,
            project_id,
        )

    @staticmethod
    def update(
        db: Session,
        project_id: int,
        data: ProjectUpdate,
    ):
        project = ProjectRepository.get_by_id(
            db,
            project_id,
        )

        if project is None:
            return None

        values = data.model_dump(
            exclude_unset=True
        )

        if "title" in values:
            project.title = values["title"].strip()

        if "description" in values:
            project.description = values[
                "description"
            ]

        if "goal_id" in values:
            goal_id = values["goal_id"]

            if goal_id is not None:
                goal = GoalRepository.get_by_id(
                    db,
                    goal_id,
                )

                if goal is None:
                    return None

            project.goal_id = goal_id

        if "progress" in values:
            progress = values["progress"]

            project.progress = progress
            project.status = (
                calculate_progress_status(progress)
            )

        db.commit()
        db.refresh(project)

        return project

    @staticmethod
    def delete(
        db: Session,
        project_id: int,
    ):
        project = ProjectRepository.get_by_id(
            db,
            project_id,
        )

        if project is None:
            return False

        ProjectRepository.delete(
            db,
            project,
        )

        return True