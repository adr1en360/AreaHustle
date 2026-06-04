import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Check, Globe, MapPin } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get Started · AreaHustle" }] }),
  component: Onboarding,
});

const LANGS = [
  { id: "English", flag: "🇬🇧", note: "Default · Pidgin variants supported" },
  { id: "French", flag: "🇫🇷", note: "West-African francophone regions" },
  { id: "Arabic", flag: "🇸🇦", note: "RTL-ready voice prompts" },
] as const;

const AREAS = [
  "Lekki Phase 1","Lekki Phase 2","Victoria Island","Ikoyi","Yaba","Surulere",
  "Ikeja GRA","Ajah","Magodo","Gbagada","Festac","Ikorodu",
];

function Onboarding() {
  const { isLoggedIn, language, setLanguage, areas, setAreas } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isLoggedIn) nav({ to: "/" });
  }, [isLoggedIn, nav]);

  const toggleArea = (a: string) => {
    setAreas(areas.includes(a) ? areas.filter((x) => x !== a) : [...areas, a]);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
      <div className="rounded-3xl bg-card shadow-elevated p-8 sm:p-12 animate-scale-in">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded-full transition ${n <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Step 1 of 2</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Choose your voice.</h1>
            <p className="text-muted-foreground mb-8">Aethex will speak and listen in your preferred language.</p>
            <div className="space-y-3">
              {LANGS.map((l) => {
                const active = language === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      active ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{l.id}</div>
                      <div className="text-xs text-muted-foreground">{l.note}</div>
                    </div>
                    {active && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Step 2 of 2</div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Pick your service areas.</h1>
            <p className="text-muted-foreground mb-6">Match only with jobs in neighborhoods you actually cover.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {AREAS.map((a) => {
                const active = areas.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleArea(a)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition ${
                      active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" /> {a}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 rounded-2xl border py-3.5 text-sm font-semibold">Back</button>
              <button
                onClick={() => nav({ to: "/passport" })}
                disabled={areas.length === 0}
                className="flex-[2] rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Enter AreaHustle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
