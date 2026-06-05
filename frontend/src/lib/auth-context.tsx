import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiLogin, apiRegister, setToken, removeToken, getToken, apiGetMe, apiCreateTask, apiGetTasks } from "./api";
import { toast } from "sonner";

export type Role = "customer" | "hustler" | null;
export type JobState = "pending" | "accepted" | "completed" | "closed";

export interface Job {
  id: string;
  title: string;
  budget: number;
  state: JobState;
  area: string;
  customer: string;
  hustler?: string;
  cat: string;
  isNew?: boolean;
}

export interface User {
  name: string;
  trustScore: number;
  walletBalance: number;
}

export interface PendingSweep {
  title: string;
  gross: number;
  sweep: number;
  net: number;
  customer: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: Role;
  user: User;
  customerWallet: number;
  activeJobs: Job[];
  pendingSweep: PendingSweep | null;
  language: string;
  areas: string[];
  extraJobs: Job[];
  login: (role: Role, email?: string, password?: string) => Promise<void>;
  logout: () => void;
  setLanguage: (l: string) => void;
  setAreas: (a: string[]) => void;
  consumePendingSweep: () => void;
  topUp: (amount: number) => void;
  withdraw: (amount: number) => void;
  postJob: (job: Omit<Job, "id" | "state">) => void;
  acceptJob: (id: string) => void;
  markJobDone: (id: string) => void;
  confirmJob: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role>(null);
  const [user, setUser] = useState<User>({ name: "Tunde A.", trustScore: 820, walletBalance: 12000 });
  const [customerWallet, setCustomerWallet] = useState(50000);
  const [language, setLanguage] = useState("English");
  const [areas, setAreas] = useState<string[]>([]);
  const [pendingSweep, setPendingSweep] = useState<PendingSweep | null>(null);

  const [activeJobs, setActiveJobs] = useState<Job[]>([
    {
      id: "j1",
      title: "Generator Servicing",
      budget: 8000,
      state: "completed",
      area: "Lekki Phase 1",
      customer: "Sarah O.",
      cat: "Repairs",
      hustler: "Tunde A.",
    },
    {
      id: "j2",
      title: "Deep Clean - 3BR Apt",
      budget: 22000,
      state: "accepted",
      area: "Ikoyi",
      customer: "Mr. Lawal",
      cat: "Cleaning",
      hustler: "Tunde A.",
    },
    { id: "j3", title: "Errand - Pickup at Shoprite", budget: 3500, state: "pending", area: "Yaba", customer: "Chuka N.", cat: "Errands" },
  ]);

  // Persist session if token exists
  useEffect(() => {
    if (getToken()) {
      apiGetMe()
        .then((data) => {
          setIsLoggedIn(true);
          setUserRole(data.role as Role);
          setUser((prev) => ({ ...prev, name: data.name }));
        })
        .catch(() => {
          removeToken();
        });
    }
  }, []);

  const login = async (role: Role, email = "demo@areahustle.test", password = "password") => {
    try {
      // Try to login via API
      const res = await apiLogin(email, password);
      setToken(res.access_token);
      const me = await apiGetMe();
      setUser((prev) => ({ ...prev, name: me.name }));
    } catch (error) {
      console.warn("API Login Failed, using mock local state.");
      toast.info("Backend unreachable. Using local mock state.");
    } finally {
      setIsLoggedIn(true);
      setUserRole(role);
      setUser((prev) => ({ ...prev, name: role === "customer" ? "Sarah O." : "Tunde A." }));
    }
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const topUp = (amount: number) => setCustomerWallet((prev) => prev + amount);
  const withdraw = (amount: number) => setUser((prev) => ({ ...prev, walletBalance: Math.max(0, prev.walletBalance - amount) }));

  const postJob = async (job: Omit<Job, "id" | "state">) => {
    try {
      await apiCreateTask({ category: job.cat, description: job.title, budget: job.budget, neighbourhood: job.area });
    } catch (e) {
      // ignore for fallback
    }
    const newJob: Job = { ...job, id: Math.random().toString(36).substring(2, 9), state: "pending", isNew: true };
    setActiveJobs((prev) => [newJob, ...prev]);
    setCustomerWallet((prev) => prev - job.budget);
  };

  const acceptJob = (id: string) => setActiveJobs((prev) => prev.map((j) => (j.id === id ? { ...j, state: "accepted", hustler: user.name } : j)));
  const markJobDone = (id: string) => setActiveJobs((prev) => prev.map((j) => (j.id === id ? { ...j, state: "completed" } : j)));
  const confirmJob = (id: string) => {
    const job = activeJobs.find((j) => j.id === id);
    if (!job) return;
    setActiveJobs((prev) => prev.map((j) => (j.id === id ? { ...j, state: "closed" } : j)));
    const sweepAmt = job.budget * 0.2; // 20% auto loan sweep
    const net = job.budget - sweepAmt;
    setPendingSweep({ title: job.title, gross: job.budget, sweep: sweepAmt, net, customer: job.customer });
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + net, trustScore: Math.min(1000, prev.trustScore + 15) }));
  };
  const consumePendingSweep = () => setPendingSweep(null);
  const extraJobs = activeJobs.filter((j) => j.state === "pending");

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        user,
        customerWallet,
        activeJobs,
        pendingSweep,
        language,
        areas,
        extraJobs,
        login,
        logout,
        setLanguage,
        setAreas,
        consumePendingSweep,
        topUp,
        withdraw,
        postJob,
        acceptJob,
        markJobDone,
        confirmJob,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
