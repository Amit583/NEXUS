import { ConfirmDialog } from "../../components/dialogs/ConfirmDialog";
import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createProject,
    deleteProject,
    getGoals,
    getProjects,
    updateProject,
    type Goal,
    type Project,
} from "../../services/api";

function getProjectStatusLabel(
    status: Project["status"],
) {
    switch (status) {
        case "active":
            return "ACTIVE";

        case "in_progress":
            return "IN PROGRESS";

        case "completed":
            return "COMPLETED";
    }
}

export function Projects() {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalId, setGoalId] = useState("");
    const [projectToDelete, setProjectToDelete] =
        useState<Project | null>(null);

    const projectsQuery = useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });

    const goalsQuery = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

    const goals: Goal[] = goalsQuery.data ?? [];

    const getGoalTitle = (goalId: number | null) => {
        if (goalId === null) {
            return null;
        }

        const goal = goals.find(
            (goal) => goal.id === goalId,
        );

        return goal?.title ?? "Unknown Goal";
    };

    const projects = projectsQuery.data ?? [];

    const totalProjects = projects.length;

    const activeProjects = projects.filter(
        (project) => project.status === "active",
    ).length;

    const inProgressProjects = projects.filter(
        (project) =>
            project.status === "in_progress",
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === "completed",
    ).length;

    const overallProgress =
        totalProjects === 0
            ? 0
            : Math.round(
                projects.reduce(
                    (total, project) =>
                        total + project.progress,
                    0,
                ) / totalProjects,
            );

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            setTitle("");
            setDescription("");
            setGoalId("");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            progress,
            goal_id,
        }: {
            id: number;
            progress?: number;
            goal_id?: number | null;
        }) =>
            updateProject(id, {
                ...(progress !== undefined && {
                    progress,
                }),
                ...(goal_id !== undefined && {
                    goal_id,
                }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProject,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },
    });

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        createMutation.mutate({
            title: title.trim(),
            description: description.trim(),
            goal_id: goalId ? Number(goalId) : null,
        });
    }

    return (
        <div className="projects-page">
            <div className="projects-header">
                <div>
                    <p className="eyebrow">NEXUS MODULE</p>

                    <h1>Projects</h1>

                    <p>
                        Organize major work and track your
                        progress.
                    </p>
                </div>
            </div>

            <div className="projects-summary">
                <div className="project-summary-card">
                    <span className="project-summary-label">
                        TOTAL PROJECTS
                    </span>

                    <strong className="project-summary-value">
                        {totalProjects}
                    </strong>
                </div>

                <div className="project-summary-card">
                    <span className="project-summary-label">
                        ACTIVE
                    </span>

                    <strong className="project-summary-value">
                        {activeProjects}
                    </strong>
                </div>

                <div className="project-summary-card">
                    <span className="project-summary-label">
                        IN PROGRESS
                    </span>

                    <strong className="project-summary-value">
                        {inProgressProjects}
                    </strong>
                </div>

                <div className="project-summary-card">
                    <span className="project-summary-label">
                        COMPLETED
                    </span>

                    <strong className="project-summary-value">
                        {completedProjects}
                    </strong>
                </div>

                <div className="project-summary-card">
                    <span className="project-summary-label">
                        OVERALL PROGRESS
                    </span>

                    <strong className="project-summary-value">
                        {overallProgress}%
                    </strong>
                </div>
            </div>

            <form
                className="project-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Project title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <select
                    value={goalId}
                    onChange={(event) =>
                        setGoalId(event.target.value)
                    }
                >
                    <option value="">
                        No goal selected
                    </option>

                    {goals.map((goal) => (
                        <option
                            key={goal.id}
                            value={goal.id}
                        >
                            {goal.title}
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending
                        ? "Creating..."
                        : "Create Project"}
                </button>
            </form>

            {projectsQuery.isLoading && (
                <p>Loading projects...</p>
            )}

            {projectsQuery.isError && (
                <p>
                    Unable to load projects. Make sure the
                    NEXUS backend is running.
                </p>
            )}

            {projectsQuery.data &&
                projectsQuery.data.length === 0 && (
                    <div className="empty-state">
                        <h2>No projects yet</h2>

                        <p>
                            Create your first project above.
                        </p>
                    </div>
                )}

            <div className="projects-list">
                {projectsQuery.data?.map((project) => (
                    <article
                        className="project-card"
                        key={project.id}
                    >
                        <div className="project-card-header">
                            <div>
                                <h2>{project.title}</h2>

                                {getGoalTitle(project.goal_id) && (
                                    <p className="project-goal">
                                        Goal: {getGoalTitle(project.goal_id)}
                                    </p>
                                )}

                                {project.description && (
                                    <p>
                                        {project.description}
                                    </p>
                                )}
                            </div>

                            <select
                                value={project.goal_id ?? ""}
                                onChange={(event) =>
                                    updateMutation.mutate({
                                        id: project.id,
                                        goal_id:
                                            event.target.value === ""
                                                ? null
                                                : Number(event.target.value),
                                    })
                                }
                            >
                                <option value="">
                                    No goal
                                </option>

                                {goals.map((goal) => (
                                    <option
                                        key={goal.id}
                                        value={goal.id}
                                    >
                                        {goal.title}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() =>
                                    setProjectToDelete(project)
                                }
                            >
                                Delete
                            </button>
                        </div>

                        <div className="project-progress">
                            <label>
                                Progress: {project.progress}%
                            </label>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={project.progress}
                                onChange={(event) =>
                                    updateMutation.mutate({
                                        id: project.id,
                                        progress: Number(
                                            event.target.value,
                                        ),
                                    })
                                }
                            />
                        </div>

                        <span
                            className={
                                `project-status ` +
                                `project-status-${project.status}`
                            }
                        >
                            {getProjectStatusLabel(
                                project.status,
                            )}
                        </span>
                    </article>
                ))}
            </div>
            <ConfirmDialog
                open={projectToDelete !== null}
                title="Delete project?"
                message={
                    projectToDelete
                        ? `Are you sure you want to delete "${projectToDelete.title}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete Project"
                cancelText="Cancel"
                onCancel={() =>
                    setProjectToDelete(null)
                }
                onConfirm={() => {
                    if (projectToDelete) {
                        deleteMutation.mutate(
                            projectToDelete.id,
                        );

                        setProjectToDelete(null);
                    }
                }}
            />
        </div>
    );
}