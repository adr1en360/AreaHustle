import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type Job } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { MapPin, Lock, Sparkles, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Job Feed · AreaHustle" }] }),
  component: Jobs,
});

function Jobs() {
  const { isLoggedIn, userRole, activeJobs, extraJobs, acceptJob, markJobDone, user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"market" | "my-gigs">("market");

  useEffect(() => {
    if (!isLoggedIn || userRole !== "hustler") nav({ to: "/" });
  }, [isLoggedIn, userRole, nav]);

  const myGigs = activeJobs.filter((j) => j.hustler === user.name && j.state !== "closed");

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    acceptJob(id);
    toast.success("Job accepted! Contact details unlocked.");
    setTab("my-gigs");
  };

  const handleMarkDone = (id: string) => {
    markJobDone(id);
    toast.success("Job marked as done! Awaiting customer confirmation.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Job Feed</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Hustler Dashboard</h1>
        </div>
        <div className="flex bg-muted/50 rounded-full p-1 border">
          <button
            onClick={() => setTab("market")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${tab === "market" ? "bg-background shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
          >
            Market ({extraJobs.length})
          </button>
          <button
            onClick={() => setTab("my-gigs")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${tab === "my-gigs" ? "bg-background shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
          >
            My Gigs ({myGigs.length})
          </button>
        </div>
      </div>

      {tab === "market" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {extraJobs.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">No available jobs in your area.</div>}
          {extraJobs.map((j, i) => (
            <article
              key={j.id}
              className="rounded-3xl bg-card border shadow-soft hover:shadow-elevated transition p-6 flex flex-col animate-fade-up relative overflow-hidden"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {j.isNew && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-voice/10 text-voice text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">
                  <Sparkles className="h-2.5 w-2.5" /> New
                </span>
              )}
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{j.cat}</div>
              <h3 className="font-display text-xl font-bold leading-snug mb-4">{j.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {j.area}
                </span>
              </div>
              <div className="border-t -mx-6 mb-4" />
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Payout</div>
                  <div className="font-display text-2xl font-bold">{naira(j.budget)}</div>
                </div>
                <button
                  onClick={(e) => handleAccept(e, j.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-95 transition"
                >
                  <Lock className="h-3.5 w-3.5" /> Accept Job
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "my-gigs" && (
        <div className="space-y-4">
          {myGigs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-3xl">
              You have no active gigs. Head to the market!
            </div>
          )}
          {myGigs.map((j) => (
            <div
              key={j.id}
              className="rounded-3xl bg-card border shadow-soft p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up"
            >
              <div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${j.state === "accepted" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-600"}`}
                >
                  {j.state === "accepted" ? "Active" : "Awaiting Confirmation"}
                </span>
                <h3 className="font-display text-xl font-bold">{j.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1 text-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> Exact Location Revealed
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-success">{naira(j.budget)} Locked</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {j.state === "accepted" ? (
                  <>
                    <button className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition">
                      <Phone className="h-4 w-4" /> Call Customer
                    </button>
                    <button
                      onClick={() => handleMarkDone(j.id)}
                      className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-95 transition"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Done
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground italic px-4">Waiting for customer to release escrow...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
