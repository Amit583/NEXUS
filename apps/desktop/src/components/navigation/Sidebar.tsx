import { NavLink } from "react-router-dom";
import {
  Home,
  Target,
  FolderKanban,
  CheckSquare,
  Route,
  GraduationCap,
  Network,
  Brain,
  CalendarDays,
  Zap,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  { label: "Home", path: "/", icon: Home },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Roadmaps", path: "/roadmaps", icon: Route },
  { label: "Learning", path: "/learning", icon: GraduationCap },
  { label: "Knowledge", path: "/knowledge", icon: Network },
  { label: "Mind", path: "/mind", icon: Brain },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Automation", path: "/automation", icon: Zap },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>

        <div>
          <div className="brand-name">NEXUS</div>
          <div className="brand-subtitle">PERSONAL OS</div>
        </div>
      </div>

      <nav className="navigation">
        <div className="nav-section-title">WORKSPACE</div>

        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="nav-section-title">SYSTEM</div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="system-indicator">
          <span className="status-dot" />
          <span>LOCAL SYSTEM</span>
        </div>
      </div>
    </aside>
  );
}
