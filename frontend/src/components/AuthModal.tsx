import { useState, useEffect } from "react";
import { useAuth, Role } from "@/lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { X, Briefcase, User } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialRole?: Role;
  initialMode?: "login" | "register";
}

export function AuthModal({ open, onClose, initialRole = "customer", initialMode = "register" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nin, setNin] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedRole(initialRole);
      setMode(initialMode);
      setStep(1);
    }
  }, [initialRole, initialMode, open]);

  if (!open) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(selectedRole, { email, password, name: fullName, age, phoneNumber, nin });
    onClose();
    navigate({ to: selectedRole === "customer" ? "/post-task" : "/jobs" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onClose();
    navigate({ to: selectedRole === "customer" ? "/customer-dashboard" : "/jobs" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-md rounded-[2rem] bg-[#F9F9F8] shadow-elevated overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-[#F9F9F8]">
          <h2 className="font-display text-2xl font-bold text-[#0D3B2E]">{mode === "login" ? "Welcome Back" : "Join AreaHustle"}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-black/5 transition">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex border-b border-border/50 bg-[#F9F9F8]">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 text-sm font-bold transition ${mode === "login" ? "text-[#0D3B2E] border-b-2 border-[#0D3B2E]" : "text-muted-foreground"}`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode("register");
              setStep(1);
            }}
            className={`flex-1 py-3 text-sm font-bold transition ${mode === "register" ? "text-[#0D3B2E] border-b-2 border-[#0D3B2E]" : "text-muted-foreground"}`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-[#F9F9F8]">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex gap-2 p-1 bg-black/5 rounded-xl mb-4 border">
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${selectedRole === "customer" ? "bg-white shadow-sm text-[#0D3B2E]" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("hustler")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${selectedRole === "hustler" ? "bg-white shadow-sm text-[#0D3B2E]" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Hustler
                </button>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#0D3B2E] py-3.5 text-sm font-bold text-white shadow-soft hover:bg-[#0D3B2E]/90 transition mt-2"
              >
                Log In
              </button>
            </form>
          ) : step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground mb-4">How do you want to use AreaHustle?</p>
              <button
                onClick={() => setSelectedRole("customer")}
                className={`w-full flex items-center gap-4 rounded-2xl border p-4 transition ${selectedRole === "customer" ? "border-[#0D3B2E] bg-[#0D3B2E]/5" : "hover:border-[#0D3B2E]/40 bg-[#F9F9F8]"}`}
              >
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full ${selectedRole === "customer" ? "bg-[#0D3B2E] text-white" : "bg-white text-muted-foreground border shadow-sm"}`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[#0D3B2E]">I want to Hire</div>
                  <div className="text-xs font-medium text-muted-foreground">Post tasks and find trusted hustlers.</div>
                </div>
              </button>
              <button
                onClick={() => setSelectedRole("hustler")}
                className={`w-full flex items-center gap-4 rounded-2xl border p-4 transition ${selectedRole === "hustler" ? "border-[#0D3B2E] bg-[#0D3B2E]/5" : "hover:border-[#0D3B2E]/40 bg-[#F9F9F8]"}`}
              >
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full ${selectedRole === "hustler" ? "bg-[#0D3B2E] text-white" : "bg-white text-muted-foreground border shadow-sm"}`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[#0D3B2E]">I want to Hustle</div>
                  <div className="text-xs font-medium text-muted-foreground">Accept jobs and build your financial passport.</div>
                </div>
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full rounded-full bg-[#0D3B2E] py-3.5 text-sm font-bold text-white shadow-soft hover:bg-[#0D3B2E]/90 transition mt-4"
              >
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                    placeholder="18+"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                    placeholder="080..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NIN (National Identity Number)</label>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="11 digits"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border/60 bg-[#F9F9F8] px-4 py-3 text-sm outline-none focus:border-[#0D3B2E] focus:bg-white transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#0D3B2E] py-3.5 text-sm font-bold text-white shadow-soft hover:opacity-90 transition mt-2"
              >
                Verify & Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
