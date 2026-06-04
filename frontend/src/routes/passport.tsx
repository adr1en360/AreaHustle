import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Mic, TrendingUp, Wallet, Shield, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passport")({
  head: () => ({ meta: [{ title: "Financial Passport · AreaHustle" }] }),
  component: Passport,
});

interface LedgerRow {
  t: string;
  type: "IN" | "SWEEP" | "WALLET";
  amount: number;
  when: string;
  note: string;
  highlight?: boolean;
}

const BASE_LEDGER: LedgerRow[] = [
  { t: "Deep Clean - 2BR", type: "IN", amount: 15000, when: "Yesterday", note: "Mr. Lawal · Ikoyi" },
  { t: "Loan Repayment (20%)", type: "SWEEP", amount: -3000, when: "Yesterday", note: "Auto-swept" },
  { t: "Final Credit", type: "WALLET", amount: 12000, when: "Yesterday", note: "Net to wallet" },
  { t: "AC Repair", type: "IN", amount: 12000, when: "Mon", note: "Chuka N. · Yaba" },
  { t: "Final Credit", type: "WALLET", amount: 12000, when: "Mon", note: "No active loan" },
];

function Passport() {
  const { isLoggedIn, user, pendingSweep, consumePendingSweep } = useAuth();
  const nav = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const [sweepFlash, setSweepFlash] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) nav({ to: "/" });
  }, [isLoggedIn, nav]);

  useEffect(() => {
    if (!pendingSweep) return;
    setSweepFlash(true);
    toast.success("Job Complete · Escrow Sweep Executed", {
      description: `+${naira(pendingSweep.net)} credited to your wallet`,
      duration: 5000,
    });
    const t = setTimeout(() => {
      setSweepFlash(false);
      consumePendingSweep();
    }, 8000);
    return () => clearTimeout(t);
  }, [pendingSweep, consumePendingSweep]);

  const ledger = useMemo<LedgerRow[]>(() => {
    if (!pendingSweep) return BASE_LEDGER;
    return [
      { t: pendingSweep.title, type: "IN", amount: pendingSweep.gross, when: "Just now", note: `${pendingSweep.customer}`, highlight: true },
      { t: "Loan Repayment (20%)", type: "SWEEP", amount: -pendingSweep.sweep, when: "Just now", note: "Auto-swept", highlight: true },
      { t: "Final Credit", type: "WALLET", amount: pendingSweep.net, when: "Just now", note: "Net to wallet", highlight: true },
      ...BASE_LEDGER,
    ];
  }, [pendingSweep]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Financial Passport</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className="text-muted-foreground mt-2">Your hustle is your credit. Here's the proof.</p>
        </div>
        <button
          onClick={() => setAiOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-voice text-voice-foreground px-5 py-3 text-sm font-semibold shadow-soft hover:opacity-95 transition"
        >
          <Mic className="h-4 w-4" /> Ask Aethex
        </button>
      </div>

      {/* Bento */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* Trust Score */}
        <div className="lg:col-span-1 rounded-3xl bg-card border shadow-soft p-7 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Trust Score</div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <BigDial value={user.trustScore} />
            <div className="mt-3 text-xs inline-flex items-center gap-1 text-success font-semibold">
              <TrendingUp className="h-3 w-3" /> +24 this month
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-5 border-t">
            <Stat label="Jobs" value="142" />
            <Stat label="On-time" value="98%" />
            <Stat label="Rating" value="4.9" />
          </div>
        </div>

        {/* Wallet */}
        <div className="rounded-3xl bg-primary text-primary-foreground p-7 shadow-soft flex flex-col justify-between">
          <div>
            <div className="text-xs opacity-70 uppercase tracking-widest">Wallet Balance</div>
            <div className={`font-display text-4xl font-bold mt-2 tabular-nums transition-all ${sweepFlash ? "scale-105" : ""}`}>
              ₦<AnimatedNumber value={user.walletBalance} />
            </div>
            <div className="text-xs opacity-70 mt-1">Available for withdrawal</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button className="rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/20 py-2.5 text-xs font-semibold transition">
              Withdraw
            </button>
            <button className="rounded-2xl bg-primary-foreground text-primary py-2.5 text-xs font-semibold">Top up</button>
          </div>
        </div>

        {/* Loan eligibility */}
        <div className="rounded-3xl bg-card border shadow-soft p-7">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-success" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Loan Eligibility</div>
          </div>
          <div className="font-display text-3xl font-bold mt-2">{naira(150000)}</div>
          <div className="text-xs text-muted-foreground">@ 2.4% / month · 14% APR</div>
          <div className="mt-5 rounded-2xl bg-muted/60 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Active loan</span>
              <span className="font-semibold">
                {naira(40000)} / {naira(50000)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-card overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: "80%" }} />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">Auto-sweeping 15% of every job</div>
          </div>
          <button className="mt-5 w-full rounded-2xl border py-2.5 text-xs font-semibold hover:bg-muted transition">Request top-up</button>
        </div>
      </div>

      {/* Ledger */}
      <div className="rounded-3xl bg-card border shadow-soft p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">Escrow Sweep Ledger</h2>
            <p className="text-xs text-muted-foreground mt-1">Every job, every sweep, every credit - fully auditable.</p>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground">Export CSV</button>
        </div>
        <div className="overflow-x-auto -mx-7">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-muted-foreground border-b">
                <th className="text-left font-medium py-3 px-7">Description</th>
                <th className="text-left font-medium py-3 hidden sm:table-cell">When</th>
                <th className="text-left font-medium py-3 hidden md:table-cell">Type</th>
                <th className="text-right font-medium py-3 px-7">Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row: LedgerRow, i: number) => {
                const isIn = row.type === "IN";
                const isSweep = row.type === "SWEEP";
                const isWallet = row.type === "WALLET";
                return (
                  <tr key={i} className={`border-b last:border-0 transition ${row.highlight ? "bg-success/5 animate-fade-up" : "hover:bg-muted/40"}`}>
                    <td className="py-4 px-7">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isIn ? "bg-primary/10 text-primary" : isSweep ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                          }`}
                        >
                          {isIn ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : isSweep ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <Wallet className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{row.t}</div>
                          <div className="text-xs text-muted-foreground">{row.note}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground hidden sm:table-cell">{row.when}</td>
                    <td className="py-4 hidden md:table-cell">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-1 ${
                          isIn ? "bg-primary/10 text-primary" : isSweep ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-7 text-right font-display font-bold tabular-nums ${
                        isSweep ? "text-destructive/80" : isWallet ? "text-success" : ""
                      }`}
                    >
                      {row.amount > 0 ? "+" : ""}
                      {naira(row.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voice AI Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-up">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setAiOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-card shadow-elevated p-8 animate-scale-in">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-voice font-semibold mb-3">
              <Sparkles className="h-3 w-3" /> Aethex · Voice Assistant
            </div>
            <div className="flex flex-col items-center text-center py-4">
              <div className="relative h-24 w-24 rounded-full bg-voice flex items-center justify-center">
                <Mic className="h-9 w-9 text-voice-foreground" />
                <span className="absolute inset-0 rounded-full bg-voice animate-voice-pulse" />
              </div>
              <div className="mt-5 font-display text-xl font-semibold">"What is my current Trust Score?"</div>
              <div className="mt-4 rounded-2xl bg-muted p-4 text-sm">
                Your Trust Score is <span className="font-bold text-foreground">{user.trustScore} out of 1000</span>. You've climbed 24 points this
                month and are eligible for up to {naira(150000)} in financing.
              </div>
              <button onClick={() => setAiOpen(false)} className="mt-5 rounded-full border px-5 py-2 text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-lg">{value}</div>
    </div>
  );
}

function BigDial({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setShown(value), 150);
    return () => clearTimeout(t);
  }, [value]);
  const max = 1000;
  const pct = shown / max;
  const r = 64;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct * 0.75);
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 160 160" className="h-44 w-44 -rotate-[135deg]">
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * 0.25}
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-primary transition-all duration-[1800ms] ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-4xl font-bold tabular-nums">
          <AnimatedNumber value={shown} duration={1600} />
        </div>
        <div className="text-xs text-muted-foreground">/ 1000 · Excellent</div>
      </div>
    </div>
  );
}
