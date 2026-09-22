import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe2, LockKeyhole, Moon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · AreaHustle" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-fade-up">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account controls</div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Settings</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Shape how AreaHustle communicates with you and how your workspace feels.</p>
      </div>
      <div className="mt-10 space-y-4 animate-fade-up [animation-delay:120ms]">
        <SettingRow icon={Bell} title="Notifications" description="Get updates about tasks, payments, and account activity.">
          <Toggle checked={notifications} onChange={() => setNotifications((value) => !value)} />
        </SettingRow>
        <SettingRow icon={Globe2} title="Language" description="Choose the language used across your workspace.">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option>English</option>
            <option>French</option>
            <option>Arabic</option>
          </select>
        </SettingRow>
        <SettingRow icon={Moon} title="Compact workspace" description="Use tighter spacing when you want to scan more information at once.">
          <Toggle checked={compactMode} onChange={() => setCompactMode((value) => !value)} />
        </SettingRow>
        <SettingRow icon={LockKeyhole} title="Account security" description="Your demo account is stored locally on this device.">
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-xs font-semibold text-success">
            <ShieldCheck className="h-4 w-4" /> Protected
          </span>
        </SettingRow>
      </div>
      <button
        onClick={() => toast.success("Settings saved locally.")}
        className="mt-8 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
      >
        Save settings
      </button>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
