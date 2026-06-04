import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type UserRole = "customer" | "hustler";

export interface PostedJob {
  id: number;
  title: string;
  area: string;
  dist: string;
  budget: number;
  rating: number;
  customer: string;
  cat: string;
  urgent?: boolean;
  posted: string;
  isNew?: boolean;
}

export interface PendingSweep {
  id: number;
  gross: number;
  sweep: number;
  net: number;
  title: string;
  customer: string;
  trustBefore: number;
  trustAfter: number;
}

interface AuthState {
  isLoggedIn: boolean;
  userRole: UserRole;
  user: { name: string; avatar: string; walletBalance: number; trustScore: number };
  language: "English" | "French" | "Arabic";
  areas: string[];
  extraJobs: PostedJob[];
  pendingSweep: PendingSweep | null;
  voiceOpen: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setLanguage: (l: AuthState["language"]) => void;
  setAreas: (a: string[]) => void;
  addJob: (j: PostedJob) => void;
  triggerPayout: (args: { gross: number; title: string; customer: string }) => void;
  consumePendingSweep: () => void;
  setVoiceOpen: (b: boolean) => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setRole] = useState<UserRole>("customer");
  const [language, setLanguage] = useState<AuthState["language"]>("English");
  const [areas, setAreas] = useState<string[]>(["Lekki Phase 1"]);
  const [walletBalance, setWallet] = useState(0);
  const [trustScore, setTrust] = useState(820);
  const [extraJobs, setExtraJobs] = useState<PostedJob[]>([]);
  const [pendingSweep, setPending] = useState<PendingSweep | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const addJob = useCallback((j: PostedJob) => {
    setExtraJobs((prev) => [j, ...prev]);
  }, []);

  const triggerPayout = useCallback(
    ({ gross, title, customer }: { gross: number; title: string; customer: string }) => {
      const sweep = Math.round(gross * 0.2);
      const net = gross - sweep;
      const trustBefore = trustScore;
      const trustAfter = Math.min(1000, trustScore + 5);
      setPending({
        id: Date.now(),
        gross,
        sweep,
        net,
        title,
        customer,
        trustBefore,
        trustAfter,
      });
      // The dashboard will animate ticking; commit balances after a short delay there.
      setTimeout(() => {
        setWallet((w) => w + net);
        setTrust(trustAfter);
      }, 600);
    },
    [trustScore]
  );

  const consumePendingSweep = useCallback(() => setPending(null), []);

  return (
    <Ctx.Provider
      value={{
        isLoggedIn,
        userRole,
        language,
        areas,
        extraJobs,
        pendingSweep,
        voiceOpen,
        user: {
          name: "Adaeze O.",
          avatar: "AO",
          walletBalance,
          trustScore,
        },
        login: (role) => {
          setRole(role);
          setLoggedIn(true);
        },
        logout: () => {
          setLoggedIn(false);
          setWallet(0);
          setTrust(820);
          setExtraJobs([]);
          setPending(null);
        },
        setLanguage,
        setAreas,
        addJob,
        triggerPayout,
        consumePendingSweep,
        setVoiceOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
}
