import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const DEMO_TOKEN = "areahustle-demo-token";
const DEMO_USER_KEY = "areahustle-demo-user";

type DemoUser = {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: "customer" | "hustler";
  wallet_balance: number;
  trust_score: number;
  language_preference: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  userRole: "customer" | "hustler" | null;
  user: any;
  token: string | null;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  areas: string[];
  setAreas: (areas: string[]) => void;
  updateDemoBalance: (role: string, amount: number) => void;
  addDemoTransaction: (txn: any) => void;
  refreshUser?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("demo_token"));
  const [user, setUser] = useState<DemoUser | null>(() => {
    const savedUser = localStorage.getItem(DEMO_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [areas, setAreas] = useState<string[]>([]);

  const persistUser = (nextUser: DemoUser) => {
    setUser(nextUser);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(nextUser));
  };

  const refreshUser = async () => undefined;

  useEffect(() => {
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    const handleStorage = () => {
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async (data: any) => {
    const email = String(data.username || "demo@areahustle.test").toLowerCase();
    const role = /hustler|worker|artisan|provider/.test(email) ? "hustler" : "customer";
    const demoUser: DemoUser = {
      id: `demo-${role}`,
      email,
      name: role === "hustler" ? "Demo Hustler" : "Demo Customer",
      phone_number: "+234 800 000 0000",
      role,
      wallet_balance: role === "hustler" ? 18500 : 25000,
      trust_score: role === "hustler" ? 840 : 0,
      language_preference: "english",
    };
    localStorage.setItem("demo_token", DEMO_TOKEN);
    persistUser(demoUser);
    setToken(DEMO_TOKEN);
    return demoUser;
  };

  const register = async (data: any) => {
    const role = data.role === "hustler" ? "hustler" : "customer";
    const demoUser: DemoUser = {
      id: `demo-${role}`,
      email: data.email,
      name: data.name || (role === "hustler" ? "Demo Hustler" : "Demo Customer"),
      phone_number: data.phone_number || "+234 800 000 0000",
      role,
      wallet_balance: role === "hustler" ? 18500 : 25000,
      trust_score: role === "hustler" ? 840 : 0,
      language_preference: data.language_preference || "english",
    };
    localStorage.setItem("demo_token", DEMO_TOKEN);
    persistUser(demoUser);
    setToken(DEMO_TOKEN);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem("demo_token");
    localStorage.removeItem(DEMO_USER_KEY);
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateDemoBalance = async (_role: string, amount: number) => {
    if (user) persistUser({ ...user, wallet_balance: Math.max(0, user.wallet_balance + amount) });
  };

  const addDemoTransaction = (_txn: any) => undefined;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        isLoading,
        userRole: user?.role || null,
        user,
        token,
        login,
        register,
        logout,
        language,
        setLanguage,
        areas,
        setAreas,
        updateDemoBalance,
        addDemoTransaction,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
