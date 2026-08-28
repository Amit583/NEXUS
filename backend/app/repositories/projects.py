from sqlalchemy.orm import Session

from ..models.project import Project


class ProjectRepository:

    @staticmethod
    def create(
        db: Session,
        *,
        title: str,
        description: str,
        goal_id: int | None = None,
    ):
        project = Project(
            title=title,
            description=description,
            goal_id=goal_id,
        )

        db.add(project)
        db.commit()
        db.refresh(project)

        return project

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Project)
            .order_by(Project.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        project_id: int,
    ):
        return (
            db.query(Project)
            .filter(Project.id == project_id)
            .first()
        )

    @staticmethod
    def delete(
        db: Session,
        project: Project,
    ):
        db.delete(project)
        db.commit()