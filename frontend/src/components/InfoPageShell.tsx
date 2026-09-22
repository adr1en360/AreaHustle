import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type InfoPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  aside?: ReactNode;
};

export function InfoPageShell({ eyebrow, title, intro, children, aside }: InfoPageShellProps) {
  return (
    <div className="overflow-hidden bg-[#F9F9F8]">
      <section className="relative border-b bg-card/50">
        <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <div className="relative max-w-3xl animate-fade-up">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-20">
        <article className="min-w-0 animate-fade-up [animation-delay:120ms]">{children}</article>
        {aside && <aside className="animate-slide-in-right [animation-delay:180ms]">{aside}</aside>}
      </div>
    </div>
  );
}

export function PageLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
      <CheckCircle2 className="h-4 w-4" />
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
