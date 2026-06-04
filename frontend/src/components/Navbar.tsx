import { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./AuthModal";
import { AnimatedNumber } from "./AnimatedNumber";
import { Mic, ChevronDown, LogOut, Menu, X, Wallet } from "lucide-react";

const NAV = [
  { to: "/jobs", label: "Find a Hustler" },
  { to: "/jobs", label: "Browse Jobs" },
  { to: "/passport", label: "Financial Passport" },
];

export function Navbar() {
  const { isLoggedIn, user, logout, setVoiceOpen } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [role, setRole] = useState<"customer" | "hustler">("customer");
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const openAuth = (r: "customer" | "hustler") => {
    setRole(r);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">AreaHustle</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((n) => {
                const active = path === n.to;
                return (
                  <Link
                    key={n.label}
                    to={n.to}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${
                      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setVoiceOpen(true)}
                    className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-2 text-sm font-medium hover:bg-accent transition"
                    title="Voice Assistant"
                  >
                    <Mic className="h-4 w-4 text-voice" />
                    <span className="h-1.5 w-1.5 rounded-full bg-voice animate-pulse" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-2 text-sm">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-semibold tabular-nums">
                      ₦<AnimatedNumber value={user.walletBalance} />
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setDropdown((s) => !s)}
                      className="flex items-center gap-1.5 rounded-full hover:bg-muted pl-1 pr-2 py-1 transition"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {user.avatar}
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    {dropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-card shadow-elevated border p-2 animate-scale-in">
                        <div className="px-3 py-2 text-sm">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground">Trust Score · {user.trustScore}</div>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setDropdown(false);
                            navigate({ to: "/" });
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted text-left"
                        >
                          <LogOut className="h-4 w-4" /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("customer")}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth("hustler")}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
                  >
                    Join as Hustler
                  </button>
                </>
              )}
            </div>

            <button className="md:hidden p-2" onClick={() => setMenu((s) => !s)}>
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menu && (
            <div className="md:hidden py-4 space-y-1 border-t animate-fade-up">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setMenu(false)}
                  className="block px-3 py-2 rounded-xl text-sm hover:bg-muted"
                >
                  {n.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      logout();
                      setMenu(false);
                    }}
                    className="flex-1 rounded-xl border py-2.5 text-sm"
                  >
                    Log Out
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openAuth("customer");
                        setMenu(false);
                      }}
                      className="flex-1 rounded-xl border py-2.5 text-sm"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        openAuth("hustler");
                        setMenu(false);
                      }}
                      className="flex-1 rounded-xl bg-primary py-2.5 text-sm text-primary-foreground"
                    >
                      Join as Hustler
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} role={role} />
    </>
  );
}
