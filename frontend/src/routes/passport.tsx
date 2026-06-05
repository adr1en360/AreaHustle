import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiGetPassport, apiGetActiveLoan, apiGetTransactions } from "@/lib/api";
import { naira } from "@/lib/format";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, History, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passport")({
  component: PassportPage,
});

function PassportPage() {
  const { isLoggedIn, userRole, user } = useAuth();
  const nav = useNavigate();
  const [loan, setLoan] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn || userRole !== "hustler") nav({ to: "/" });

    // Attempt to load live data, fallback to mock state visually
    apiGetActiveLoan()
      .then(setLoan)
      .catch(() => {
        setLoan({ principal: 25000, remaining_balance: 12000, sweep_percentage: 0.2 });
      });

    apiGetTransactions()
      .then(setTxns)
      .catch(() => {
        setTxns([
          { id: 1, type: "job_payout", amount: 8000, desc: "Generator Servicing", date: "Just now" },
          { id: 2, type: "loan_sweep", amount: -1600, desc: "20% Auto-sweep for Loan", date: "Just now" },
          { id: 3, type: "withdrawal", amount: -5000, desc: "Withdrawal to Bank", date: "2 days ago" },
        ]);
      });
  }, [isLoggedIn, userRole, nav]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Financial Hub</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Your Passport.</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Track your earnings, monitor your Trust Score, and manage your micro-loans all in one place.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Wallet Card */}
        <div className="rounded-3xl bg-card border shadow-elevated p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-500">
            <Wallet className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
              <Wallet className="h-4 w-4" /> Available Balance
            </div>
            <div className="font-display text-4xl sm:text-5xl font-bold text-foreground">
              ₦<AnimatedNumber value={user.walletBalance} />
            </div>
          </div>
          <div className="mt-8 relative z-10 flex gap-3">
            <button className="flex-1 bg-primary text-primary-foreground rounded-2xl py-3.5 text-sm font-semibold hover:opacity-95 transition">
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Trust Score Card */}
        <div className="rounded-3xl bg-[#183620] text-white border border-[#2A4D33] shadow-elevated p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-48 h-48 bg-[#224A2D] rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A3C9AE] mb-4 font-semibold">
              <ShieldCheck className="h-4 w-4" /> AreaHustle Trust Score
            </div>
            <div className="flex items-end gap-3">
              <div className="font-display text-5xl sm:text-6xl font-bold text-[#E2F1E6]">
                <AnimatedNumber value={user.trustScore} />
              </div>
              <div className="text-[#A3C9AE] text-sm mb-2">/ 1000</div>
            </div>
            <p className="mt-4 text-sm text-[#A3C9AE] max-w-[250px]">
              Your score gives you access to higher paying jobs and better micro-loan rates.
            </p>
          </div>
        </div>
      </div>

      {/* Micro Loan Module */}
      {loan && (
        <div className="rounded-3xl bg-muted/30 border border-dashed border-primary/20 p-8 mb-8 flex flex-col text-center sm:text-left sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Active Micro-Loan
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Automatically sweeping {loan.sweep_percentage * 100}% of completed gigs.</p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Remaining</div>
            <div className="font-display text-2xl font-bold text-destructive">{naira(loan.remaining_balance)}</div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" /> Recent Transactions
      </h2>
      <div className="space-y-4">
        {txns.map((t, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-card border shadow-soft p-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center ${t.amount > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
              >
                {t.amount > 0 ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-bold">{t.desc}</div>
                <div className="text-xs text-muted-foreground">{t.date}</div>
              </div>
            </div>
            <div className={`font-display text-xl font-bold self-end sm:self-center ${t.amount > 0 ? "text-success" : "text-foreground"}`}>
              {t.amount > 0 ? "+" : ""}
              {naira(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
