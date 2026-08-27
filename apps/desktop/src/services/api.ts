const API_BASE_URL = "http://127.0.0.1:8000";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  status: "active" | "in_progress" | "completed";
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface GoalCreate {
  title: string;
  description: string;
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  progress?: number;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function getBackendRoot() {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function getGoals(): Promise<Goal[]> {
  const response = await fetch(`${API_BASE_URL}/goals`);

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function createGoal(
  data: GoalCreate,
): Promise<Goal> {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function updateGoal(
  goalId: number,
  data: GoalUpdate,
): Promise<Goal> {
  const response = await fetch(
    `${API_BASE_URL}/goals/${goalId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteGoal(
  goalId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/goals/${goalId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }
}