import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { Home } from "../pages/Home/Home";
import { Goals } from "../pages/Goals/Goals";
import { Projects } from "../pages/Projects/Projects";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="placeholder-page">
      <p className="eyebrow">NEXUS MODULE</p>
      <h1>{title}</h1>
      <p>This module is part of the NEXUS architecture.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/goals", element: <Goals /> },
      { path: "/projects", element: <Projects /> },
      { path: "/tasks", element: <Placeholder title="Tasks" /> },
      { path: "/roadmaps", element: <Placeholder title="Roadmaps" /> },
      { path: "/learning", element: <Placeholder title="Learning" /> },
      { path: "/knowledge", element: <Placeholder title="Knowledge" /> },
      { path: "/mind", element: <Placeholder title="Mind" /> },
      { path: "/calendar", element: <Placeholder title="Calendar" /> },
      { path: "/automation", element: <Placeholder title="Automation" /> },
      { path: "/analytics", element: <Placeholder title="Analytics" /> },
      { path: "/settings", element: <Placeholder title="Settings" /> },
    ],
  },
]);
