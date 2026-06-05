import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "customer" | "hustler" | null;
export type JobState = "pending" | "accepted" | "awaiting_confirmation" | "done";

export interface Job {
  id: string;
  category: string;
  budget: number;
  location: string;
  description: string;
  state: JobState;
  editsRemaining: number;
  assignedHustler?: string;
  distance?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: Role;
  login: (email: string, role?: Role) => void;
  register: (role: Role, data: any) => void;
  logout: () => void;
  walletBalance: number;
  trustScore: number;
  jobs: Job[];
  postJob: (job: Omit<Job, "id" | "state" | "editsRemaining">) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  acceptJob: (id: string) => void;
  markJobDone: (id: string) => void;
  confirmJobDone: (id: string) => void;
  toast: { show: boolean; title: string; message: string; type?: "success" | "sweep" } | null;
  hideToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<Role>(null);
  const [walletBalance, setWalletBalance] = useState(12500);
  const [trustScore, setTrustScore] = useState(820);
  const [toast, setToast] = useState<AuthContextType["toast"]>(null);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      category: "Generator Servicing",
      budget: 8000,
      location: "Lekki Phase 1",
      description: "My Mikano generator is making a loud noise and shutting down after 10 mins. Needs urgent check.",
      state: "pending",
      editsRemaining: 3,
      distance: "2.5 km",
    },
    {
      id: "2",
      category: "Plumbing",
      budget: 15000,
      location: "Yaba",
      description: "The kitchen sink pipe is leaking heavily into the cabinet underneath.",
      state: "accepted",
      editsRemaining: 0,
      assignedHustler: "Tunde A.",
      distance: "5.1 km",
    },
  ]);

  const showToast = (title: string, message: string, type: "success" | "sweep" = "success") => {
    setToast({ show: true, title, message, type });
    setTimeout(() => setToast(null), 7000);
  };

  const login = (email: string, role?: Role) => {
    setIsLoggedIn(true);
    setUserRole(role || "customer");
  };

  const register = (role: Role, data: any) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const postJob = (job: Omit<Job, "id" | "state" | "editsRemaining">) => {
    const newJob: Job = { ...job, id: Math.random().toString(36).substring(2, 9), state: "pending", editsRemaining: 3, distance: "0.0 km" };
    setJobs([newJob, ...jobs]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(
      jobs.map((j) =>
        j.id === id ? { ...j, ...updates, editsRemaining: updates.description && j.editsRemaining > 0 ? j.editsRemaining - 1 : j.editsRemaining } : j,
      ),
    );
  };

  const acceptJob = (id: string) => setJobs(jobs.map((j) => (j.id === id ? { ...j, state: "accepted", assignedHustler: "You" } : j)));
  const markJobDone = (id: string) => setJobs(jobs.map((j) => (j.id === id ? { ...j, state: "awaiting_confirmation" } : j)));

  const confirmJobDone = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    setJobs(jobs.map((j) => (j.id === id ? { ...j, state: "done" } : j)));

    // Trigger Escrow Sweep & Financial Passport Logic globally
    const payout = job.budget;
    const loanSweep = payout * 0.2; // 20% mock automated sweep
    const net = payout - loanSweep;

    setTimeout(() => {
      showToast(
        "Escrow Unlocked!",
        `Job: +₦${payout.toLocaleString()}  |  Loan Sweep: -₦${loanSweep.toLocaleString()}  |  Wallet: +₦${net.toLocaleString()}`,
        "sweep",
      );
      setWalletBalance((prev) => prev + net);
      setTrustScore((prev) => prev + 15);
    }, 800);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        login,
        register,
        logout,
        walletBalance,
        trustScore,
        jobs,
        postJob,
        updateJob,
        acceptJob,
        markJobDone,
        confirmJobDone,
        toast,
        hideToast: () => setToast(null),
      }}
    >
      {children}
      {toast && toast.show && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-white shadow-elevated rounded-2xl p-5 border-l-[6px] border-[#10B981] animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-sm">
          <h4 className="font-display font-bold text-[#0D3B2E] text-lg">{toast.title}</h4>
          <p className="text-sm font-semibold text-muted-foreground mt-1 whitespace-pre-wrap">{toast.message}</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
