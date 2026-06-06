const API_URL = "http://localhost:8000/api/v1";

export function getToken() {
  return localStorage.getItem("area_token");
}

export function setToken(token: string) {
  localStorage.setItem("area_token", token);
}

export function removeToken() {
  localStorage.removeItem("area_token");
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

// Tuma this is the TASKS API calls so just continue based on the schema 

export async function apiCreateTask(data: { category: string; description: string; budget: number; neighbourhood: string }) {
  console.log("[apiCreateTask] Requesting task creation:", data);
  const response = await fetchApi("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Task creation failed");
  }
  return responseData;
}

export async function apiListTasks(filters?: { neighbourhood?: string; category?: string; status?: string }) {
  console.log("[apiListTasks] Requesting task list with filters:", filters);
  const params = new URLSearchParams();
  if (filters?.neighbourhood) params.append("neighbourhood", filters.neighbourhood);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.status) params.append("status", filters.status);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const response = await fetchApi(`/tasks/${queryStr}`, { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to list tasks");
  }
  return responseData;
}

export async function apiMyTasks() {
  console.log("[apiMyTasks] Requesting user tasks");
  const response = await fetchApi("/tasks/my-tasks", { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to fetch user tasks");
  }
  return responseData;
}

export async function apiMatchTask(taskId: string) {
  console.log("[apiMatchTask] Matching task ID:", taskId);
  const response = await fetchApi(`/tasks/${taskId}/match`, { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Task matching failed");
  }
  return responseData;
}

export async function apiActivateTask(taskId: string) {
  console.log("[apiActivateTask] Activating task ID:", taskId);
  const response = await fetchApi(`/tasks/${taskId}/activate`, { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Task activation failed");
  }
  return responseData;
}

export async function apiCompleteTask(taskId: string) {
  console.log("[apiCompleteTask] Completing task ID:", taskId);
  const response = await fetchApi(`/tasks/${taskId}/complete`, { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Task completion failed");
  }
  return responseData;
}

export async function apiVoiceToIntent(audioUrl: string) {
  console.log("[apiVoiceToIntent] Extracting intent from audioUrl:", audioUrl);
  // The backend route uses audio_url as query param
  const response = await fetchApi(`/tasks/voice-to-intent?audio_url=${encodeURIComponent(audioUrl)}`, { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Voice-to-intent failed");
  }
  return responseData;
}

// Auth
export const apiLogin = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const apiRegister = async (data: { email: string; password: string; role: string; name: string }) => {
  return fetchApi("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const apiGetMe = () => fetchApi("/auth/me");



// Passport & Finance
export const apiGetPassport = () => fetchApi("/passport/me");
export const apiGetTransactions = () => fetchApi("/passport/transactions");
export const apiDemoSweep = (jobAmount: number) => {
  return fetchApi("/passport/demo/complete-job-sweep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_amount: jobAmount }),
  });
};

// Loans
export const apiCreateLoan = (principal: number, sweepPercentage: number) => {
  return fetchApi("/loans/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ principal, sweep_percentage: sweepPercentage }),
  });
};
export const apiGetActiveLoan = () => fetchApi("/loans/active");

// Users / Hustlers
export const apiCreateHustlerProfile = (data: { service_areas: string[]; categories: string[] }) => {
  return fetchApi("/users/hustler-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
export const apiGetNearbyHustlers = (neighbourhood: string) => fetchApi(`/users/nearby-hustlers?neighbourhood=${neighbourhood}`);
