import { useEffect } from "react";
import { Activity, Brain, Clock3, Target } from "lucide-react";
import { checkBackendHealth } from "../../services/api";
import { useAppStore } from "../../stores/appStore";

export function Home() {
  const backendOnline = useAppStore((state) => state.backendOnline);
  const setBackendStatus = useAppStore(
    (state) => state.setBackendStatus
  );

  useEffect(() => {
    checkBackendHealth()
      .then((result) => {
        setBackendStatus(true, result.version);
      })
      .catch(() => {
        setBackendStatus(false);
      });
  }, [setBackendStatus]);

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <p className="eyebrow">COMMAND CENTER</p>
          <h1>NEXUS Dashboard</h1>
          <p className="page-description">
            Your local command center for goals, projects, knowledge and
            execution.
          </p>
        </div>

        <div className="system-status">
          <span className={`status-dot ${backendOnline ? "" : "offline"}`} />
          {backendOnline ? "SYSTEM ONLINE" : "BACKEND OFFLINE"}
        </div>
      </header>

      <section className="stats-grid">
        <StatCard
          icon={<Target />}
          label="Active Goals"
          value="0"
        />

        <StatCard
          icon={<Activity />}
          label="Projects"
          value="0"
        />

        <StatCard
          icon={<Clock3 />}
          label="Tasks"
          value="0"
        />

        <StatCard
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
            NEXUS will eventually transform goals into visual execution
            systems, but the underlying workspace must be built first.
          </p>
        </div>

        <div className="workspace-placeholder">
          <div className="node node-main">NEXUS</div>

          <div className="node node-one">GOALS</div>
          <div className="node node-two">PROJECTS</div>
          <div className="node node-three">KNOWLEDGE</div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
