import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type Job } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { MapPin, Lock, Sparkles, Phone, CheckCircle, Search, Mic, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Job Feed · AreaHustle" }] }),
  component: Jobs,
});

function Jobs() {
  const { isLoggedIn, userRole, jobs, acceptJob, markJobDone, user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"market" | "my-gigs">("market");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn || userRole !== "hustler") nav({ to: "/" });
  }, [isLoggedIn, userRole, nav]);

  const marketJobs = jobs?.filter((j) => j.state === "pending") || [];
  const myGigs = jobs?.filter((j) => j.state !== "pending" && j.state !== "done") || [];

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

  const filteredMarket = marketJobs.filter((j) => {
    const matchKeyword = keyword
      ? (j as any).title?.toLowerCase().includes(keyword.toLowerCase()) || j.category?.toLowerCase().includes(keyword.toLowerCase())
      : true;
    const matchLocation = location ? j.location?.toLowerCase().includes(location.toLowerCase()) : true;
    return matchKeyword && matchLocation;
  });

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
            className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition ${tab === "market" ? "bg-background shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
          >
            Market ({filteredMarket.length})
          </button>
          <button
            onClick={() => setTab("my-gigs")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition ${tab === "my-gigs" ? "bg-background shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
          >
            My Gigs ({myGigs.length})
          </button>
        </div>
      </div>

      {tab === "market" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-3xl shadow-soft border">
            <div className="flex-1 flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 focus-within:border-primary transition">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs by keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="sm:w-64 rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="">All Locations</option>
              <option value="Lekki Phase 1">Lekki Phase 1</option>
              <option value="Yaba">Yaba</option>
              <option value="Ikeja">Ikeja</option>
              <option value="Ajah">Ajah</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMarket.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-3xl">
                No available jobs match your search.
              </div>
            )}
            {filteredMarket.map((j, i) => (
              <article
                key={j.id}
                className="rounded-3xl bg-card border shadow-soft hover:shadow-elevated transition p-6 flex flex-col animate-fade-up relative overflow-hidden"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{j.category}</div>
                <h3 className="font-display text-xl font-bold leading-snug mb-2">{(j as any).title || j.category}</h3>
                {j.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{j.description}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {j.location}
                  </span>
                </div>
                <div className="border-t -mx-6 mb-4" />
                <div className="mt-auto flex flex-wrap gap-3 items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Payout</div>
                    <div className="font-display text-2xl font-bold">{naira(j.budget)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(j);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold hover:bg-muted transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleAccept(e, j.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 transition"
                    >
                      <Lock className="h-3.5 w-3.5" /> Accept
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
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
                <h3 className="font-display text-xl font-bold">{(j as any).title || j.category}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1 text-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> Exact Location Revealed
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-success">{naira(j.budget)} Locked</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                {j.state === "accepted" ? (
                  <>
                    <button className="flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition">
                      <Phone className="h-4 w-4" /> Call Customer
                    </button>
                    <button
                      onClick={() => handleMarkDone(j.id)}
                      className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-95 transition"
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

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80 animate-fade-up">
          <div className="relative w-full max-w-lg rounded-3xl bg-card border shadow-elevated p-8">
            <button onClick={() => setSelectedJob(null)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{selectedJob.category}</div>
            <h2 className="font-display text-2xl font-bold mb-4">{selectedJob.title || selectedJob.category}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" /> {selectedJob.location}
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 mb-6 text-sm text-foreground leading-relaxed">
              {selectedJob.description || "No detailed description provided by the customer."}
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Payout</div>
                <div className="font-display text-2xl font-bold text-success">{naira(selectedJob.budget)}</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition">
                  <Phone className="h-4 w-4" /> Contact
                </button>
                <button
                  onClick={(e) => {
                    setSelectedJob(null);
                    handleAccept(e, selectedJob.id);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-95 transition"
                >
                  <Lock className="h-4 w-4" /> Accept Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => toast.info("Listening for query...", { description: "Speak now to search or ask about a job." })}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-voice text-voice-foreground p-4 rounded-full shadow-elevated hover:scale-105 transition"
      >
        <Mic className="h-6 w-6" />
      </button>
    </div>
  );
}
