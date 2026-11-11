import { useEffect } from "react";
import { Activity, Brain, Clock3, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  checkBackendHealth,
  getGoals,
  getProjects,
  getTasks,
} from "../../services/api";

import { useAppStore } from "../../stores/appStore";

export function Home() {
  const backendOnline = useAppStore(
    (state) => state.backendOnline,
  );

  const setBackendStatus = useAppStore(
    (state) => state.setBackendStatus,
  );

  const goalsQuery = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  useEffect(() => {
    checkBackendHealth()
      .then((result) => {
        setBackendStatus(true, result.version);
      })
      .catch(() => {
        setBackendStatus(false);
      });
  }, [setBackendStatus]);

  const goals = goalsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];

  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed",
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status !== "completed",
  ).length;

  const activeTasks = tasks.filter(
    (task) => task.status !== "completed",
  ).length;

  const loading =
    goalsQuery.isLoading ||
    projectsQuery.isLoading ||
    tasksQuery.isLoading;

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <p className="eyebrow">COMMAND CENTER</p>

          <h1>NEXUS Dashboard</h1>

          <p className="page-description">
            Your local command center for goals, projects,
            knowledge and execution.
          </p>
        </div>

        <div className="system-status">
          <span
            className={`status-dot ${backendOnline ? "" : "offline"
              }`}
          />

          {backendOnline
            ? "SYSTEM ONLINE"
            : "BACKEND OFFLINE"}
        </div>
      </header>

      <section className="stats-grid">
        <StatCard
          variant="goals"
          icon={<Target />}
          label="Active Goals"
          value={loading ? "—" : String(activeGoals)}
        />

        <StatCard
          variant="projects"
          icon={<Activity />}
          label="Active Projects"
          value={loading ? "—" : String(activeProjects)}
        />

        <StatCard
          variant="tasks"
          icon={<Clock3 />}
          label="Active Tasks"
          value={loading ? "—" : String(activeTasks)}
        />

        <StatCard
          variant="knowledge"
          icon={<Brain />}
          label="Knowledge"
          value="0"
        />
      </section>

      <section className="workspace-panel">
        <div>
          <p className="eyebrow">WORKSPACE</p>

          <h2>Your command center is ready.</h2>

          <p>
            NEXUS connects your goals, projects and tasks
            into one local execution environment.
          </p>
        </div>

        <div className="workspace-placeholder">
          <div className="node node-main">
            NEXUS
          </div>

          <div className="node node-one">
            GOALS
          </div>

          <div className="node node-two">
            PROJECTS
          </div>

          <div className="node node-three">
            KNOWLEDGE
          </div>
        </div>
      </section>
    </div>
  );
}
function StatCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant:
  | "goals"
  | "projects"
  | "tasks"
  | "knowledge";
}) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <div className="stat-value">
          {value}
        </div>

        <div className="stat-label">
          {label}
        </div>
      </div>
    </div>
  );
}