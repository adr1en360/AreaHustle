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




// this is the PASSPORT API call


export async function apiGetPassport() {
  console.log("[apiGetPassport] Requesting passport details");
  const response = await fetchApi("/passport/me", { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to fetch passport");
  }
  return responseData;
}

export async function apiStartVoiceSession() {
  console.log("[apiStartVoiceSession] Starting voice session");
  const response = await fetchApi("/passport/voice-session", { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to start voice session");
  }
  return responseData;
}

export async function apiProxyOffer(sessionId: string, sdpData: any) {
  console.log("[apiProxyOffer] Proxying offer for session:", sessionId);
  const response = await fetchApi(`/passport/voice-session/${sessionId}/offer`, {
    method: "POST",
    body: JSON.stringify(sdpData),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to proxy offer");
  }
  return responseData;
}

export async function apiDemoCompleteJobSweep(jobAmount: number = 5000.0) {
  console.log("[apiDemoCompleteJobSweep] Triggering demo sweep for amount:", jobAmount);
  // Based on the endpoint /demo/complete-job-sweep?job_amount=...
  const response = await fetchApi(`/passport/demo/complete-job-sweep?job_amount=${jobAmount}`, { method: "POST" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Demo sweep failed");
  }
  return responseData;
}

export async function apiGetProofCard() {
  console.log("[apiGetProofCard] Requesting proof card");
  const response = await fetchApi("/passport/proof-card", { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to fetch proof card");
  }
  return responseData;
}

export async function apiListTransactions() {
  console.log("[apiListTransactions] Requesting transaction list");
  const response = await fetchApi("/passport/transactions", { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to list transactions");
  }
  return responseData;
}

// Loans
export const apiCreateLoan = (principal: number, sweepPercentage: number) => {
  return fetchApi("/loans/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ principal, sweep_percentage: sweepPercentage }),
  });
};
export const apiGetActiveLoan = () => fetchApi("/loans/active");


// this is the USERS API


export async function apiGetHustlerProfile() {
  console.log("[apiGetHustlerProfile] Requesting hustler profile");
  const response = await fetchApi("/users/hustler-profile", { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to fetch hustler profile");
  }
  return responseData;
}

export async function apiUpdateHustlerProfile(data: { service_areas: string[]; categories: string[] }) {
  console.log("[apiUpdateHustlerProfile] Updating hustler profile:", data);
  const response = await fetchApi("/users/hustler-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to update hustler profile");
  }
  return responseData;
}

export async function apiCreateHustlerProfile(data: { service_areas: string[]; categories: string[] }) {
  console.log("[apiCreateHustlerProfile] Creating hustler profile:", data);
  const response = await fetchApi("/users/hustler-profile", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to create hustler profile");
  }
  return responseData;
}

export async function apiListNearbyHustlers(neighbourhood: string) {
  console.log("[apiListNearbyHustlers] Requesting nearby hustlers for:", neighbourhood);
  const response = await fetchApi(`/users/nearby-hustlers?neighbourhood=${encodeURIComponent(neighbourhood)}`, { method: "GET" });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.detail || "Failed to list nearby hustlers");
  }
  return responseData;
}
