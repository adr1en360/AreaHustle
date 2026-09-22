import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import {
  Wallet,
  LogOut,
  Shield,
  LayoutDashboard,
  Briefcase,
  CreditCard,
  PlusCircle,
  User as UserIcon,
  Home,
  Search,
  ClipboardPlus,
  CircleUserRound,
  Settings,
  ChevronDown,
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import logo from "@/assets/logo.png"; // Change to .png or
import { toast } from "sonner";

export function Navbar() {
  const { isLoggedIn, userRole, user, logout, updateDemoBalance } = useAuth();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const walletBalance = user?.wallet_balance || 0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount);
    if (amt && amt <= walletBalance) {
      updateDemoBalance(userRole as string, -amt);
      toast.success(`Successfully withdrew ${naira(amt)} to bank.`);
      setWithdrawOpen(false);
      setWithdrawAmount("");
    } else {
      toast.error("Invalid amount or insufficient balance.");
    }
  };

  const openAuth = (m: "login" | "register") => {
    setAuthMode(m);
    setAuthOpen(true);
  };

  const mobileNavItems =
    userRole === "customer"
      ? [
          { to: "/customer-dashboard" as const, label: "Home", icon: Home },
          { to: "/post-task" as const, label: "Post task", icon: ClipboardPlus },
          { to: "/profile" as const, label: "Profile", icon: UserIcon },
        ]
      : [
          { to: "/jobs" as const, label: "Market", icon: Search },
          { to: "/passport" as const, label: "Passport", icon: CreditCard },
          { to: "/profile" as const, label: "Profile", icon: UserIcon },
        ];

  return (
    <>
      <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight hover:opacity-90 transition">
            <img src={logo} alt="AreaHustle Logo" className="h-8 w-auto object-contain" />
            <span className="hidden sm:inline">AreaHustle.</span>
          </Link>

          {isLoggedIn ? (
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <IconLink
                to={userRole === "customer" ? "/customer-dashboard" : "/jobs"}
                label={userRole === "customer" ? "Dashboard" : "Job market"}
                icon={userRole === "customer" ? LayoutDashboard : Briefcase}
              />
              {userRole === "customer" && <IconLink to="/post-task" label="Post task" icon={PlusCircle} />}
              {userRole === "hustler" && <IconLink to="/passport" label="Passport" icon={CreditCard} />}
              <button
                type="button"
                title="Wallet"
                aria-label="Open wallet"
                onClick={() => setWithdrawOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
              >
                <Wallet className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="flex h-10 items-center gap-1 rounded-full border bg-card px-1.5 pr-2 shadow-soft transition hover:border-primary/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CircleUserRound className="h-4 w-4" />
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {accountMenuOpen && <AccountMenu user={user} onClose={() => setAccountMenuOpen(false)} onLogout={logout} />}
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => openAuth("login")} className="text-sm font-medium hover:text-primary transition">
                Login
              </button>
              <button
                onClick={() => openAuth("register")}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </nav>

      {isLoggedIn && (
        <nav
          className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-white/60 bg-card/80 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-elevated backdrop-blur-xl supports-backdrop-filter:bg-card/65 sm:hidden"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-3 gap-1">
            {mobileNavItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold text-muted-foreground transition hover:text-foreground"
                activeProps={{
                  className:
                    "group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-2 py-2 text-[10px] font-semibold text-primary-foreground shadow-soft transition",
                }}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80 animate-fade-up">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border shadow-elevated p-8">
            <h2 className="font-display text-xl font-bold mb-2">Withdraw Funds</h2>
            <p className="text-xs text-muted-foreground mb-4">Available balance: {naira(walletBalance)}</p>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                max={walletBalance}
                className="w-full rounded-2xl border bg-muted/30 px-4 py-3 text-lg font-semibold mb-4 outline-none focus:border-primary"
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setWithdrawOpen(false)} className="flex-1 rounded-full border py-3 text-sm font-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!withdrawAmount}
                  className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  );
}

function IconLink({
  to,
  label,
  icon: Icon,
}: {
  to: "/customer-dashboard" | "/jobs" | "/post-task" | "/passport";
  label: string;
  icon: typeof Briefcase;
}) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
      activeProps={{ className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition" }}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

function AccountMenu({ user, onClose, onLogout }: { user: any; onClose: () => void; onLogout: () => void }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border bg-card p-2 shadow-elevated animate-scale-in">
      <div className="border-b px-3 py-2.5">
        <p className="truncate text-sm font-semibold">{user?.name || "Demo account"}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Link
        to="/profile"
        onClick={onClose}
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <UserIcon className="h-4 w-4" /> Profile
      </Link>
      <Link
        to="/settings"
        onClick={onClose}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Settings className="h-4 w-4" /> Settings
      </Link>
      <button
        type="button"
        onClick={() => {
          onClose();
          onLogout();
        }}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}
