import { ConfirmDialog } from "../../components/dialogs/ConfirmDialog";
import { useState } from "react";
import type { FormEvent } from "react";
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
    return <p>Loading tasks...</p>;
  }

  if (tasksQuery.isError || projectsQuery.isError) {
    return (
      <p>
        Unable to load Tasks.
        Make sure the NEXUS backend is running.
      </p>
    );
  }

  const tasks = tasksQuery.data ?? [];
  const projects = projectsQuery.data ?? [];

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">NEXUS MODULE</p>
          <h1>Tasks</h1>
          <p>
            Break projects into actionable work.
          </p>
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

                <p className="task-project">
                  Project:{" "}
                  {project
                    ? project.title
                    : "No project"}
                </p>

                <div className="task-progress">
                  <label>
                    Progress: {task.progress}%
                  </label>

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