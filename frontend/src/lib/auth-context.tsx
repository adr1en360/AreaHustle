import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";
import { toast } from "sonner";

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!token);
  const [language, setLanguage] = useState("English");
  const [areas, setAreas] = useState<string[]>([]);

  const syncDemoState = (u: any) => {
    if (!u) return u;
    const isCustomer = u.role === "customer";

    if (isCustomer && !localStorage.getItem("demo_customer_balance")) {
      localStorage.setItem("demo_customer_balance", "1000000");
    }
    if (!isCustomer && !localStorage.getItem("demo_hustler_balance")) {
      localStorage.setItem("demo_hustler_balance", "0");
    }

    const balance = parseInt(localStorage.getItem(isCustomer ? "demo_customer_balance" : "demo_hustler_balance") || "0");
    const trustScore = parseInt(localStorage.getItem("demo_hustler_trust") || "820");
    return { ...u, wallet_balance: balance, trust_score: trustScore };
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      api
        .getMe()
        .then((u) => {
          setUser(syncDemoState(u));
          setIsLoading(false);
        })
        .catch(() => {
          logout();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const handleStorage = () => {
      setUser((prev: any) => syncDemoState(prev));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async (data: any) => {
    const res = await api.login(data);
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
    const u = await api.getMe();
    setUser(syncDemoState(u));
    return syncDemoState(u);
  };

  const register = async (data: any) => {
    await api.register(data);
    return await login({ username: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateDemoBalance = (role: string, amount: number) => {
    const key = role === "customer" ? "demo_customer_balance" : "demo_hustler_balance";
    const current = parseInt(localStorage.getItem(key) || (role === "customer" ? "1000000" : "0"));
    const newBalance = current + Number(amount);
    localStorage.setItem(key, newBalance.toString());

    setUser((prev: any) => {
      if (prev && prev.role === role) {
        return { ...prev, wallet_balance: newBalance };
      }
      return prev;
    });
  };

  const addDemoTransaction = (txn: any) => {
    const txns = JSON.parse(localStorage.getItem("demo_transactions") || "[]");
    txns.unshift(txn);
    localStorage.setItem("demo_transactions", JSON.stringify(txns));

    const trust = parseInt(localStorage.getItem("demo_hustler_trust") || "820");
    const newTrust = Math.min(1000, trust + 15);
    localStorage.setItem("demo_hustler_trust", newTrust.toString());

    setUser((prev: any) => {
      if (prev && prev.role === "hustler") {
        return { ...prev, trust_score: newTrust };
      }
      return prev;
    });
  };

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
