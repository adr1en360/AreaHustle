import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type PostedJob } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { JobSlideOver } from "@/components/JobSlideOver";
import { MapPin, Star, Clock, Lock, Bell, Search, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Job Feed · AreaHustle" }] }),
  component: Jobs,
});

const JOBS: PostedJob[] = [
  {
    id: 101,
    title: "Generator Servicing",
    area: "Lekki Phase 1",
    dist: "1.2 km",
    budget: 5000,
    rating: 4.9,
    customer: "Sarah O.",
    cat: "Repairs",
    urgent: true,
    posted: "2m ago",
  },
  {
    id: 102,
    title: "Deep Clean - 3BR Apt",
    area: "Ikoyi",
    dist: "2.1 km",
    budget: 22000,
    rating: 4.7,
    customer: "Mr. Lawal",
    cat: "Cleaning",
    posted: "8m ago",
  },
  {
    id: 103,
    title: "Plumbing - Burst Pipe",
    area: "Lekki Phase 1",
    dist: "0.9 km",
    budget: 12000,
    rating: 4.8,
    customer: "Sade O.",
    cat: "Plumbing",
    urgent: true,
    posted: "12m ago",
  },
  {
    id: 104,
    title: "AC Installation (1.5HP)",
    area: "Yaba",
    dist: "5.3 km",
    budget: 15000,
    rating: 4.6,
    customer: "Chuka N.",
    cat: "Repairs",
    posted: "31m ago",
  },
  {
    id: 105,
    title: "Tutor - JSS2 Maths (1hr)",
    area: "Magodo",
    dist: "8.0 km",
    budget: 6500,
    rating: 5.0,
    customer: "Mrs. Bello",
    cat: "Tutoring",
    posted: "1h ago",
  },
  {
    id: 106,
    title: "Errand - Pickup at Shoprite",
    area: "Lekki Phase 1",
    dist: "0.6 km",
    budget: 3500,
    rating: 4.5,
    customer: "Tunde A.",
    cat: "Errands",
    posted: "1h ago",
  },
  {
    id: 107,
    title: "Hairdresser - Home visit",
    area: "Victoria Island",
    dist: "3.8 km",
    budget: 18000,
    rating: 4.9,
    customer: "Ada O.",
    cat: "Beauty",
    posted: "2h ago",
  },
  {
    id: 108,
    title: "Painting - Bedroom",
    area: "Ajah",
    dist: "6.4 km",
    budget: 25000,
    rating: 4.7,
    customer: "Mr. Eze",
    cat: "Repairs",
    posted: "3h ago",
  },
];

const CATS = ["All", "Repairs", "Cleaning", "Plumbing", "Tutoring", "Errands", "Beauty"];

function Jobs() {
  const { isLoggedIn, extraJobs } = useAuth();
  const nav = useNavigate();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState(true);
  const [selected, setSelected] = useState<PostedJob | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) nav({ to: "/" });
  }, [isLoggedIn, nav]);

  useEffect(() => {
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const allJobs = [...extraJobs, ...JOBS];
  const filtered = allJobs.filter((j) => (cat === "All" || j.cat === cat) && (q === "" || j.title.toLowerCase().includes(q.toLowerCase())));

  const openJob = (j: PostedJob) => {
    setSelected(j);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Job Feed</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Browse jobs in your area.</h1>
          <p className="text-muted-foreground mt-2">{filtered.length} matches across Lekki, Ikoyi, Yaba and more.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="bg-transparent outline-none text-sm w-56" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition border ${
              cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((j, i) => (
          <article
            key={j.id}
            onClick={() => openJob(j)}
            className="cursor-pointer rounded-3xl bg-card border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition p-6 flex flex-col animate-fade-up relative overflow-hidden"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {j.isNew && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-voice/10 text-voice text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">
                <Sparkles className="h-2.5 w-2.5" /> Just posted
              </span>
            )}
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{j.cat}</div>
                <h3 className="font-display text-xl font-bold leading-snug">{j.title}</h3>
              </div>
              {j.urgent && (
                <span className="rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">
                  Urgent
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {j.area} · {j.dist}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {j.posted}
              </span>
            </div>
            <div className="border-t -mx-6 mb-4" />
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs">
                <div className="text-muted-foreground">Customer</div>
                <div className="font-semibold">{j.customer}</div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-current text-foreground" />
                {j.rating}
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Budget</div>
                <div className="font-display text-2xl font-bold">{naira(j.budget)}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openJob(j);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-95 transition"
              >
                <Lock className="h-3.5 w-3.5" /> Bind Escrow
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 right-6 z-40 max-w-sm animate-slide-in-right">
          <div className="rounded-2xl bg-card border shadow-elevated p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">New {naira(5000)} job matches your area</div>
              <div className="text-xs text-muted-foreground">Generator Servicing · Sarah O. · 1.2km</div>
            </div>
            <button onClick={() => setToast(false)} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <JobSlideOver job={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
