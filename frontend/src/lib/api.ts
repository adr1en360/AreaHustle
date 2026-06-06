const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000/api/v1"
  : "https://areahustle.onrender.com/api/v1";

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof URLSearchParams) {
    delete headers["Content-Type"];
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch (error: any) {
    // Catches net::ERR_CONNECTION_CLOSED, CORS drops, and network offline issues
    throw new Error(
      "Unable to connect to the backend. It might be waking up from sleep (Render free tier) or is currently offline. Please wait 30 seconds and try again.",
    );
  }

  if (!res.ok) {
    let errData;
    try {
      errData = await res.json();
    } catch (e) {}

    // FastAPI Validation Errors are arrays, standard HTTPExceptions are strings.
    let errorMessage = res.statusText;
    if (typeof errData?.detail === "string") {
      errorMessage = errData.detail;
    } else if (Array.isArray(errData?.detail)) {
      errorMessage = errData.detail.map((err: any) => `${err.loc?.slice(-1)}: ${err.msg}`).join(" | ");
    }

    throw new Error(errorMessage || "An API Error Occurred");
  }
  return res.json();
}

export const api = {
  // Auth
  login: (data: any) => {
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);
    return fetchApi("/auth/login", { method: "POST", body: params });
  },
  register: (data: any) => fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => fetchApi("/auth/me"),

  // Users / Hustler Profile
  getHustlerProfile: () => fetchApi("/users/hustler-profile"),
  createHustlerProfile: (data: any) => fetchApi("/users/hustler-profile", { method: "POST", body: JSON.stringify(data) }),

  // Tasks
  createTask: (data: any) => fetchApi("/tasks/", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => fetchApi(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getTasks: (params: Record<string, any> = {}) => {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    }
    const query = new URLSearchParams(cleanParams).toString();
    return fetchApi(`/tasks/${query ? `?${query}` : ""}`);
  },
  getMyTasks: () => fetchApi("/tasks/my-tasks"),
  matchTask: (id: string) => fetchApi(`/tasks/${id}/match`, { method: "POST" }),
  activateTask: (id: string) => fetchApi(`/tasks/${id}/activate`, { method: "POST" }),
  completeTask: (id: string) => fetchApi(`/tasks/${id}/complete`, { method: "POST" }),
  voiceToIntent: (audioUrl: string) => fetchApi(`/tasks/voice-to-intent?audio_url=${encodeURIComponent(audioUrl)}`, { method: "POST" }),
  voiceToIntentUpload: (formData: FormData) => fetchApi("/tasks/voice-to-intent/upload", { method: "POST", body: formData }),

  // Passport & Transactions
  getPassport: () => fetchApi("/passport/me"),
  getProofCard: () => fetchApi("/passport/proof-card"),
  getTransactions: () => fetchApi("/transactions/"),
};
