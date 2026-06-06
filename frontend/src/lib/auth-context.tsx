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
  refreshUser?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!token);
  const [language, setLanguage] = useState("English");
  const [areas, setAreas] = useState<string[]>([]);

  const syncDemoState = (u: any) => {
    return u;
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const u = await api.getMe();
        setUser(u);
      } catch (e) {}
    }
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
    refreshUser();
  };

  const addDemoTransaction = (txn: any) => {
    refreshUser();
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
