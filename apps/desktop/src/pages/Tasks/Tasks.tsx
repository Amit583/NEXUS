import { ConfirmDialog } from "../../components/dialogs/ConfirmDialog";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ListTodo,
  Check,
  CircleGauge,
  Activity,
  Play,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getProjects,
  getTasks,
  updateTask,
  type Task,
} from "../../services/api";

export function Tasks() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null);

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      setTitle("");
      setDescription("");
      setProjectId("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      progress,
    }: {
      id: number;
      progress: number;
    }) =>
      updateTask(id, {
        progress,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    createMutation.mutate({
      title: trimmedTitle,
      description: description.trim(),
      project_id: projectId ? Number(projectId) : null,
    });
  }

  function handleProgressChange(
    task: Task,
    progress: number,
  ) {
    updateMutation.mutate({
      id: task.id,
      progress,
    });
  }

  if (tasksQuery.isLoading || projectsQuery.isLoading) {
    return (
      <div className="tasks-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">NEXUS MODULE</p>
            <h1>Tasks</h1>
          </div>
        </div>

        <div className="loading-state">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (tasksQuery.isError || projectsQuery.isError) {
    return (
      <div className="tasks-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">NEXUS MODULE</p>
            <h1>Tasks</h1>
          </div>
        </div>

        <div className="error-state">
          Unable to load Tasks.
          Make sure the NEXUS backend is running.
        </div>
      </div>
    );
  }

  const tasks = tasksQuery.data ?? [];
  const projects = projectsQuery.data ?? [];

  const totalTasks = tasks.length;

  const activeTasks = tasks.filter(
    (task) => task.status === "active",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round(
        tasks.reduce(
          (total, task) =>
            total + task.progress,
          0,
        ) / totalTasks,
      );

  return (
    <div className="tasks-page">
      <div className="tasks-summary">
        <div className="task-summary-card summary-tasks">
          <div className="summary-card-content">
            <span className="task-summary-label">
              TOTAL TASKS
            </span>

            <strong className="task-summary-value">
              {tasks.length}
            </strong>
          </div>

          <div className="summary-icon">
            <ListTodo />
          </div>
        </div>

        <div className="task-summary-card summary-active">
          <div className="summary-card-content">
            <span className="task-summary-label">
              ACTIVE
            </span>

            <strong className="task-summary-value">
              {activeTasks}
            </strong>
          </div>

          <div className="summary-icon">
            <Play />
          </div>
        </div>

        <div className="task-summary-card summary-progress">
          <div className="summary-card-content">
            <span className="task-summary-label">
              IN PROGRESS
            </span>

            <strong className="task-summary-value">
              {inProgressTasks}
            </strong>
          </div>

          <div className="summary-icon">
            <Activity />
          </div>
        </div>

        <div className="task-summary-card summary-completed">
          <div className="summary-card-content">
            <span className="task-summary-label">
              COMPLETED
            </span>

            <strong className="task-summary-value">
              {completedTasks}
            </strong>
          </div>

          <div className="summary-icon">
            <Check />
          </div>
        </div>

        <div className="task-summary-card summary-overall">
          <div className="summary-card-content">
            <span className="task-summary-label">
              OVERALL PROGRESS
            </span>

            <strong className="task-summary-value">
              {overallProgress}%
            </strong>
          </div>

          <div className="summary-icon">
            <CircleGauge />
          </div>
        </div>
      </div>

      <form
        className="task-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />

        <select
          value={projectId}
          onChange={(event) =>
            setProjectId(event.target.value)
          }
        >
          <option value="">
            No project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending
            ? "Creating..."
            : "Create Task"}
        </button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h2>No tasks yet</h2>
            <p>
              Create your first task above.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const project = projects.find(
              (item) =>
                item.id === task.project_id,
            );

            return (
              <article
                className="task-card"
                key={task.id}
              >
                <div className="task-card-header">
                  <div>
                    <h2>{task.title}</h2>

                    {task.description && (
                      <p>
                        {task.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setTaskToDelete(task)
                    }
                    disabled={
                      deleteMutation.isPending
                    }
                  >
                    Delete
                  </button>
                </div>

                <div className="task-project">
                  <span>LINKED PROJECT</span>

                  <strong>
                    {project
                      ? project.title
                      : "No project"}
                  </strong>
                </div>

                <div className="task-progress">
                  <div className="task-progress-header">
                    <span>PROGRESS</span>

                    <strong>{task.progress}%</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(event) =>
                      handleProgressChange(
                        task,
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </div>
              </article>
            );
          })
        )}

        <ConfirmDialog
          open={taskToDelete !== null}
          title="Delete task?"
          message={
            taskToDelete
              ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
              : ""
          }
          confirmText="Delete Task"
          cancelText="Cancel"
          onCancel={() => setTaskToDelete(null)}
          onConfirm={() => {
            if (taskToDelete) {
              deleteMutation.mutate(taskToDelete.id);
              setTaskToDelete(null);
            }
          }}
        />
      </div>
    </div>
  );
}