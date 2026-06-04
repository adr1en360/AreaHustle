import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { naira } from "@/lib/format";
import { Mic, Lock, MapPin, Tag, Wallet, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/post-task")({
  head: () => ({ meta: [{ title: "Post a Task · AreaHustle" }] }),
  component: PostTask,
});

type Phase = "idle" | "recording" | "processing" | "result" | "locked";

function PostTask() {
  const { isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!isLoggedIn) nav({ to: "/" });
  }, [isLoggedIn, nav]);

  const start = () => {
    setPhase("recording");
    setTimeout(() => setPhase("processing"), 2200);
    setTimeout(() => setPhase("result"), 3300);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-voice font-semibold mb-3">Task Terminal</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Speak your task.</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Aethex listens. Gemini structures. Lock escrow when it looks right.
        </p>
      </div>

      <div className="rounded-3xl bg-card border shadow-elevated p-8 sm:p-12">
        {/* Voice surface */}
        <div className="flex flex-col items-center text-center">
          <button
            onClick={start}
            disabled={phase !== "idle" && phase !== "locked"}
            className="relative h-32 w-32 rounded-full bg-voice text-voice-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition disabled:opacity-90"
          >
            <Mic className="h-10 w-10" />
            {(phase === "recording" || phase === "processing") && (
              <>
                <span className="absolute inset-0 rounded-full bg-voice animate-voice-pulse" />
                <span className="absolute inset-0 rounded-full bg-voice animate-voice-pulse" style={{ animationDelay: "0.6s" }} />
              </>
            )}
          </button>
          <div className="mt-6 font-display text-xl font-semibold">
            {phase === "idle" && "Speak Task"}
            {phase === "recording" && "Listening…"}
            {phase === "processing" && "Parsing intent…"}
            {phase === "result" && "Here's your task"}
            {phase === "locked" && "Escrow locked"}
          </div>
          <div className="text-sm text-muted-foreground mt-1 max-w-sm">
            {phase === "idle" && "Try: \"I need someone to service my generator in Lekki for ₦8,000\"."}
            {phase === "recording" && "Aethex Speech-to-Text active"}
            {phase === "processing" && "Gemini structuring fields"}
            {phase === "result" && "Review and lock escrow to publish to nearby hustlers."}
            {phase === "locked" && "Hustlers in your area have been notified."}
          </div>
        </div>

        {/* Waveform */}
        {(phase === "recording" || phase === "processing") && (
          <div className="mt-10 flex items-end justify-center gap-1.5 h-20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-voice/70 animate-wave"
                style={{
                  height: `${10 + Math.abs(Math.sin(i / 2.5)) * 80}%`,
                  animationDelay: `${i * 40}ms`,
                  animationDuration: `${0.7 + (i % 4) * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {(phase === "result" || phase === "locked") && (
          <div className="mt-10 animate-fade-up">
            <div className="rounded-2xl border bg-muted/40 p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Sparkles className="h-3.5 w-3.5 text-voice" /> Structured by Gemini
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field icon={Tag} label="Category" value="Generator Servicing" />
                <Field icon={Wallet} label="Budget" value={naira(8000)} />
                <Field icon={MapPin} label="Location" value="Lekki Phase 1" />
              </div>
              <div className="mt-5 rounded-xl bg-card border p-4 text-sm text-muted-foreground italic">
                "I need someone to come service my Tiger generator today in Lekki Phase 1, budget around eight thousand naira."
              </div>
            </div>
            <button
              onClick={() => {
                setPhase("locked");
                setTimeout(() => nav({ to: "/jobs" }), 1400);
              }}
              disabled={phase === "locked"}
              className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-90"
            >
              {phase === "locked" ? (<><Check className="h-4 w-4" /> Locked · Releasing to feed</>) : (<><Lock className="h-4 w-4" /> Lock Escrow to Confirm</>)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Mic; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card border p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-display font-semibold">{value}</div>
    </div>
  );
}
