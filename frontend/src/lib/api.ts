const API_URL = "http://localhost:8080/api/v1";

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
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "API request failed");
  }

  return response.json();
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

// Tasks
export const apiCreateTask = (data: { category: string; description: string; budget: number; neighbourhood: string }) => {
  return fetchApi("/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const apiGetTasks = (status?: string, neighbourhood?: string) => {
  let url = "/tasks/?";
  if (status) url += `status=${status}&`;
  if (neighbourhood) url += `neighbourhood=${neighbourhood}`;
  return fetchApi(url);
};

export const apiMatchTask = (taskId: string) => fetchApi(`/tasks/${taskId}/match`, { method: "POST" });
export const apiActivateTask = (taskId: string) => fetchApi(`/tasks/${taskId}/activate`, { method: "POST" });
export const apiCompleteTask = (taskId: string) => fetchApi(`/tasks/${taskId}/complete`, { method: "POST" });

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
