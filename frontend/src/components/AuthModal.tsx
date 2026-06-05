import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { X, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export function AuthModal({
  open,
  onClose,
  role,
  redirectTo,
}: {
  open: boolean;
  onClose: () => void;
  role: "customer" | "hustler";
  redirectTo: string;
}) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      await login(role, email, password);
      setIsLoading(false);
      onClose();
      nav({ to: redirectTo });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up backdrop-blur-sm bg-background/80">
      <div className="relative w-full max-w-md rounded-3xl bg-card shadow-elevated p-8 border">
        <button onClick={onClose} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold">{role === "customer" ? "Hire a Hustler" : "Join the Hustle"}</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter your email and password to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 animate-fade-up">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hustler@areahustle.test"
                className="w-full rounded-2xl border bg-muted/30 px-10 py-3.5 text-sm outline-none focus:border-primary transition"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border bg-muted/30 px-10 py-3.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Login / Register"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
