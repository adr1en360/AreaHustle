import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Loader2, Mail, Phone, UserRound, UsersRound, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export function AuthModal({ open, onClose, initialRole, initialMode }: any) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode || "login");
  const [role, setRole] = useState(initialRole || "customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (open) {
      setMode(initialMode || "login");
      setRole(initialRole || "customer");
      setShowPassword(false);
    }
  }, [open, initialMode, initialRole]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let loggedInUser;
      if (mode === "login") {
        loggedInUser = await login({ username: email, password });
        toast.success("Logged in successfully!");
      } else {
        loggedInUser = await register({ email, password, name, role, phone_number: phone, language_preference: "english" });
        toast.success("Registered successfully!");
      }
      onClose();
      const userRole = loggedInUser?.role || role;
      const targetRoute = mode === "register" && userRole === "hustler" ? "/onboarding" : userRole === "customer" ? "/customer-dashboard" : "/jobs";
      nav({ to: targetRoute });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/20 p-4 backdrop-blur-md animate-in fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative my-auto w-full max-w-xl overflow-hidden rounded-4xl border bg-card shadow-elevated animate-scale-in"
      >
        <div className="relative overflow-hidden bg-primary px-6 pb-7 pt-6 text-primary-foreground sm:px-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -right-4 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            aria-label="Close authentication dialog"
            className="absolute right-5 top-5 z-20 rounded-full p-2 text-primary-foreground/70 transition hover:bg-white/10 hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">AreaHustle</p>
              <p className="mt-1 text-sm font-medium text-primary-foreground/85">Your area. Your hustle. Your trust.</p>
            </div>
          </div>
          <h2 id="auth-modal-title" className="relative mt-8 font-display text-3xl font-bold tracking-tight">
            {mode === "login" ? "Welcome back" : "Build your local network"}
          </h2>
          <p className="relative mt-2 max-w-sm text-sm leading-6 text-primary-foreground/70">
            {mode === "login" ? "Sign in to keep your work and opportunities moving." : "Join thousands of people getting more done, locally."}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">I want to</label>
                  <span className="text-xs text-muted-foreground">Choose your starting point</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <RoleButton
                    active={role === "customer"}
                    icon={UserRound}
                    onClick={() => setRole("customer")}
                    title="Hire help"
                    description="Get trusted local tasks done."
                  />
                  <RoleButton
                    active={role === "hustler"}
                    icon={BriefcaseBusiness}
                    onClick={() => setRole("hustler")}
                    title="Find work"
                    description="Turn your skills into opportunity."
                  />
                </div>
              </div>
            )}

            <div className={mode === "register" ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
              {mode === "register" && (
                <Field label="Full name" id="auth-name" icon={UserRound}>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Full name"
                    className="w-full min-h-12 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </Field>
              )}
              {mode === "register" && (
                <Field label="Phone number" id="auth-phone" icon={Phone}>
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    autoComplete="tel"
                    placeholder="Phone number"
                    className="w-full min-h-12 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </Field>
              )}
              <Field label="Email address" id="auth-email" icon={Mail} className={mode === "register" ? "sm:col-span-2" : undefined}>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  className="w-full min-h-12 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </Field>
              <Field label="Password" id="auth-password" icon={LockKeyhole} className={mode === "register" ? "sm:col-span-2" : undefined}>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder="Password"
                    className="w-full min-h-12 rounded-2xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            </div>

            {mode === "login" && (
              <p className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs leading-5 text-muted-foreground">
                Demo access is enabled. Use any password, and enter <span className="font-semibold text-primary">hustler@demo.test</span> to preview
                the hustler workspace.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Continue to AreaHustle" : "Create my account"}
            </button>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              {mode === "register"
                ? "By creating an account, you agree to our terms and privacy policy."
                : "Your account is protected with secure sign-in."}
            </p>
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">{mode === "login" ? "New to AreaHustle?" : "Already a member?"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="w-full rounded-full border py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5"
            >
              {mode === "login" ? "Create an account" : "Log in instead"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RoleButton({
  active,
  icon: Icon,
  onClick,
  title,
  description,
}: {
  active: boolean;
  icon: typeof UserRound;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group rounded-2xl border p-3 text-left transition ${active ? "border-primary bg-primary/8 ring-2 ring-primary/15" : "bg-background hover:border-primary/40 hover:bg-muted/40"}`}
    >
      <span
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
    </button>
  );
}

function Field({
  label,
  id,
  icon: Icon,
  className,
  children,
}: {
  label: string;
  id: string;
  icon: typeof Mail;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`block ${className || ""}`}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </label>
      {children}
    </div>
  );
}
