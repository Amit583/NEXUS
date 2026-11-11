import { ConfirmDialog } from "../../components/dialogs/ConfirmDialog";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  LoaderCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  type Goal,
} from "../../services/api";

function getGoalStatusLabel(
  status: Goal["status"],
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

export function Goals() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalToDelete, setGoalToDelete] =
    useState<Goal | null>(null);

  const goalsQuery = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const goals = goalsQuery.data ?? [];

  const totalGoals = goals.length;

  const activeGoals = goals.filter(
    (goal) => goal.status === "active",
  ).length;

  const inProgressGoals = goals.filter(
    (goal) => goal.status === "in_progress",
  ).length;

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed",
  ).length;

  const overallProgress =
    totalGoals === 0
      ? 0
      : Math.round(
        goals.reduce(
          (total, goal) => total + goal.progress,
          0,
        ) / totalGoals,
      );

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });

      setTitle("");
      setDescription("");
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
      updateGoal(id, {
        progress,

      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
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
    });
  }

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <p className="eyebrow">NEXUS MODULE</p>
          <h1>Goals</h1>
          <p>
            Define your objectives and track your progress.
          </p>
        </div>
      </div>
      <div className="goals-summary">
        <div className="goal-summary-card summary-projects">
          <div className="summary-card-content">
            <span className="goal-summary-label">
              TOTAL GOALS
            </span>

            <strong className="goal-summary-value">
              {totalGoals}
            </strong>
          </div>

          <div className="summary-icon">
            <Target />
          </div>
        </div>

        <div className="goal-summary-card summary-active">
          <div className="summary-card-content">
            <span className="goal-summary-label">
              ACTIVE
            </span>

            <strong className="goal-summary-value">
              {activeGoals}
            </strong>
          </div>

          <div className="summary-icon">
            <Circle />
          </div>
        </div>

        <div className="goal-summary-card summary-progress">
          <div className="summary-card-content">
            <span className="goal-summary-label">
              IN PROGRESS
            </span>

            <strong className="goal-summary-value">
              {inProgressGoals}
            </strong>
          </div>

          <div className="summary-icon">
            <LoaderCircle />
          </div>
        </div>

        <div className="goal-summary-card summary-completed">
          <div className="summary-card-content">
            <span className="goal-summary-label">
              COMPLETED
            </span>

            <strong className="goal-summary-value">
              {completedGoals}
            </strong>
          </div>

          <div className="summary-icon">
            <CheckCircle2 />
          </div>
        </div>

        <div className="goal-summary-card summary-overall">
          <div className="summary-card-content">
            <span className="goal-summary-label">
              OVERALL PROGRESS
            </span>

            <strong className="goal-summary-value">
              {overallProgress}%
            </strong>
          </div>

          <div className="summary-icon">
            <TrendingUp />
          </div>
        </div>
      </div>

      <form
        className="goal-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

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
            : "Create Goal"}
        </button>
      </form>

      {goalsQuery.isLoading && (
        <div className="loading-state">
          Loading goals...
        </div>
      )}

      {goalsQuery.isError && (
        <div className="error-state">
          Unable to load goals.
          Make sure the NEXUS backend is running.
        </div>
      )}

      {goalsQuery.data &&
        goalsQuery.data.length === 0 && (
          <div className="empty-state">
            <h2>No goals yet</h2>
            <p>Create your first goal above.</p>
          </div>
        )}

      <div className="goals-list">
        {goalsQuery.data?.map((goal) => (
          <article
            className="goal-card"
            key={goal.id}
          >
            <div className="goal-card-header">
              <div>
                <h2>{goal.title}</h2>

                {goal.description && (
                  <p>{goal.description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setGoalToDelete(goal)
                }
              >
                Delete
              </button>
            </div>

            <div className="goal-progress">
              <div className="goal-progress-header">
                <span>PROGRESS</span>

                <strong>{goal.progress}%</strong>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(event) =>
                  updateMutation.mutate({
                    id: goal.id,
                    progress: Number(
                      event.target.value,
                    ),
                  })
                }
              />
            </div>

            <span className={`goal-status goal-status-${goal.status}`}>
              {getGoalStatusLabel(goal.status)}
            </span>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={goalToDelete !== null}
        title="Delete goal?"
        message={
          goalToDelete
            ? `Are you sure you want to delete "${goalToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Goal"
        cancelText="Cancel"
        onCancel={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteMutation.mutate(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
      />
    </div>
  );
}