import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { Wallet, LogOut, Shield, LayoutDashboard, Briefcase, CreditCard, PlusCircle } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { AuthModal } from "./AuthModal";
import logo from "@/assets/logo.png"; // Change to .png or .jpg depending on your file
import { toast } from "sonner";

export function Navbar() {
  const { isLoggedIn, userRole, customerWallet, user, logout, withdraw } = useAuth();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"customer" | "hustler">("customer");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount);
    if (amt && amt <= user.walletBalance) {
      withdraw(amt);
      toast.success(`Successfully withdrew ${naira(amt)} to bank.`);
      setWithdrawOpen(false);
      setWithdrawAmount("");
    } else {
      toast.error("Invalid amount or insufficient balance.");
    }
  };

  const openAuth = (r: "customer" | "hustler") => {
    setAuthRole(r);
    setAuthOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight hover:opacity-90 transition">
            <img src={logo} alt="AreaHustle Logo" className="h-8 w-auto object-contain" />
            <span className="hidden sm:inline">AreaHustle.</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 sm:gap-6">
              {userRole === "customer" ? (
                <>
                  <Link
                    to="/customer-dashboard"
                    title="Dashboard"
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
                  >
                    <LayoutDashboard className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link to="/post-task" title="Post Task" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition">
                    <PlusCircle className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Post Task</span>
                  </Link>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary">
                    <Wallet className="h-4 w-4" />
                    {naira(customerWallet)}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/jobs" title="Job Market" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition">
                    <Briefcase className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Job Market</span>
                  </Link>
                  <Link to="/passport" title="Passport" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition">
                    <CreditCard className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Passport</span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground" title="Trust Score">
                      <Shield className="h-4 w-4 text-success" /> {user.trustScore}
                    </div>
                    <button
                      onClick={() => setWithdrawOpen(true)}
                      className="flex items-center gap-2 rounded-full bg-primary/10 hover:bg-primary/20 transition px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary"
                    >
                      <Wallet className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        <AnimatedNumber value={user.walletBalance} />
                      </span>
                    </button>
                  </div>
                </>
              )}
              <button onClick={() => logout()} className="text-muted-foreground hover:text-foreground transition">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => openAuth("customer")} className="text-sm font-medium hover:text-primary transition">
                Hire a Hustler
              </button>
              <button
                onClick={() => openAuth("hustler")}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
              >
                Join
              </button>
            </div>
          )}
        </div>
      </nav>

      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80 animate-fade-up">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border shadow-elevated p-8">
            <h2 className="font-display text-xl font-bold mb-2">Withdraw Funds</h2>
            <p className="text-xs text-muted-foreground mb-4">Available balance: {naira(user.walletBalance)}</p>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                max={user.walletBalance}
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

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        role={authRole}
        redirectTo={authRole === "customer" ? "/customer-dashboard" : "/jobs"}
      />
    </>
  );
}
