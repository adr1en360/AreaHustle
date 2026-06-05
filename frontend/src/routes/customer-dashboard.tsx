import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Plus, CheckCircle, Clock, MapPin, Phone, Edit, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer-dashboard")({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const { isLoggedIn, userRole, walletBalance, jobs, updateJob, confirmJobDone } = useAuth();
  const nav = useNavigate();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [editingJob, setEditingJob] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn || userRole !== "customer") nav({ to: "/" });
  }, [isLoggedIn, userRole, nav]);

  const myJobs = jobs || [];

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(topUpAmount);
    if (amt && amt > 0) {
      toast.success(`Successfully topped up ${naira(amt)}`);
      setTopUpOpen(false);
      setTopUpAmount("");
    }
  };

  const handleConfirm = (id: string) => {
    confirmJobDone(id);
    toast.success("Job confirmed! Escrow released to Hustler.");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob && editingJob.editsRemaining > 0) {
      updateJob(editingJob.id, { description: editingJob.description, budget: editingJob.budget, title: editingJob.title } as any);
      setEditingJob(null);
      toast.success(`Job updated. ${editingJob.editsRemaining - 1} edits remaining.`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Customer Dashboard</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Manage your requests.</h1>
        </div>
        <button
          onClick={() => nav({ to: "/post-task" })}
          className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full bg-voice text-voice-foreground px-5 py-3 text-sm font-semibold shadow-soft hover:opacity-95 transition"
        >
          <Plus className="h-4 w-4" /> Post New Task
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="rounded-3xl bg-primary text-primary-foreground p-7 shadow-soft flex flex-col justify-between">
          <div>
            <div className="text-xs opacity-70 uppercase tracking-widest">Wallet Balance</div>
            <div className="font-display text-4xl font-bold mt-2 tabular-nums">
              ₦<AnimatedNumber value={walletBalance} />
            </div>
          </div>
          <button
            onClick={() => setTopUpOpen(true)}
            className="mt-6 rounded-2xl bg-primary-foreground text-primary py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            Top Up Balance
          </button>
        </div>

        <div className="md:col-span-2 rounded-3xl bg-card border shadow-soft p-7 flex flex-col justify-center text-center items-center">
          <h3 className="font-display text-xl font-bold mb-2">Need something done fast?</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">Use our voice-enabled task terminal to post a job in seconds.</p>
          <button
            onClick={() => nav({ to: "/post-task" })}
            className="rounded-full bg-muted border px-6 py-2.5 text-sm font-semibold hover:bg-muted/80 transition"
          >
            Try Voice Terminal
          </button>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-6">Active Jobs</h2>
      <div className="space-y-4">
        {myJobs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-3xl">No active jobs found.</div>
        ) : (
          myJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl bg-card border shadow-soft p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${job.state === "pending" ? "bg-muted text-muted-foreground" : job.state === "accepted" ? "bg-primary/10 text-primary" : job.state === "awaiting_confirmation" ? "bg-orange-500/10 text-orange-600" : "bg-success/10 text-success"}`}
                  >
                    {job.state === "awaiting_confirmation" ? "completed" : job.state}
                  </span>
                  <span className="text-xs text-muted-foreground">{job.category}</span>
                </div>
                <h3 className="font-display text-lg font-bold">{job.title}</h3>
                {job.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.description}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {naira(job.budget)} in Escrow
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                {job.state === "pending" && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground italic">Waiting for Hustler...</span>
                    <button
                      onClick={() => setEditingJob(job)}
                      disabled={job.editsRemaining <= 0}
                      className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit ({job.editsRemaining} left)
                    </button>
                  </div>
                )}
                {job.state === "accepted" && (
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      Assigned: <span className="font-semibold">{job.assignedHustler || "A Hustler"}</span>
                    </div>
                    <button className="h-10 w-10 shrink-0 rounded-full bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {job.state === "awaiting_confirmation" && (
                  <button
                    onClick={() => handleConfirm(job.id)}
                    className="w-full sm:w-auto justify-center rounded-full bg-[#183620] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-soft animate-pulse"
                  >
                    <CheckCircle className="h-4 w-4" /> Confirm & Release Escrow
                  </button>
                )}
                {job.state === "done" && (
                  <div className="text-sm text-success font-semibold sm:px-4 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Job Done
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {topUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80 animate-fade-up">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border shadow-elevated p-8">
            <h2 className="font-display text-xl font-bold mb-4">Top Up Wallet</h2>
            <form onSubmit={handleTopUp}>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Amount (e.g. 10000)"
                className="w-full rounded-2xl border bg-muted/30 px-4 py-3 text-lg font-semibold mb-4 outline-none focus:border-primary"
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setTopUpOpen(false)} className="flex-1 rounded-full border py-3 text-sm font-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!topUpAmount}
                  className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Paystack Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80 animate-fade-up">
          <div className="relative w-full max-w-md rounded-3xl bg-card border shadow-elevated p-8">
            <button onClick={() => setEditingJob(null)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={editingJob.title || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  required
                  className="mt-1 w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  required
                  rows={3}
                  className="mt-1 w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget (₦)</label>
                <input
                  type="number"
                  value={editingJob.budget}
                  onChange={(e) => setEditingJob({ ...editingJob, budget: Number(e.target.value) })}
                  required
                  className="mt-1 w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
