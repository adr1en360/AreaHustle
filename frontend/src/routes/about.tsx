import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MapPinned, ShieldCheck, Sparkles, Users } from "lucide-react";
import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AreaHustle | Work that counts" },
      { name: "description", content: "Learn why AreaHustle is building a more trusted, local way to find work and get things done." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPageShell
      eyebrow="About AreaHustle"
      title="The work is already happening. We help it count."
      intro="AreaHustle is the local work network for the people who keep neighborhoods moving, connecting everyday needs with trusted talent and turning completed work into a financial track record."
      aside={
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-elevated">
          <Sparkles className="mb-8 h-6 w-6" />
          <p className="font-display text-2xl font-bold leading-tight">Trust should be built from what you do, not just what a bank can see.</p>
          <p className="mt-4 text-sm leading-6 opacity-75">Our passport makes reliable work visible.</p>
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            icon: MapPinned,
            title: "Local by design",
            text: "A generator technician in Lekki, a cleaner in Yaba, and a customer in Ikeja should not have to compete with a national algorithm. We match around real neighborhoods and real context.",
          },
          {
            icon: ShieldCheck,
            title: "Trust is a product",
            text: "Clear briefs, escrow protection, verified completion, and useful reviews give both sides the confidence to say yes.",
          },
          {
            icon: Users,
            title: "People before profiles",
            text: "We are building for informal workers as they are: multilingual, mobile-first, resourceful, and often invisible to traditional financial systems.",
          },
          {
            icon: HeartHandshake,
            title: "Progress that travels",
            text: "Every job well done can become proof of consistency. Your AreaHustle Financial Passport is designed to grow with your work.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elevated">
            <Icon className="mb-8 h-6 w-6 text-primary" />
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <section className="mt-16 max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our point of view</div>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight">A better economy starts with better evidence.</h2>
        <div className="mt-6 space-y-5 text-muted-foreground leading-8">
          <p>
            Millions of people earn through a mix of services, referrals, short jobs, and small businesses. That work is valuable, but it rarely
            produces the paperwork traditional systems ask for.
          </p>
          <p>
            AreaHustle creates a practical bridge. Customers get a safer way to hire locally. Hustlers get more consistent access to demand,
            transparent payments, and a portable record of reliability.
          </p>
          <p>
            We are starting in Lagos because the need is immediate and the energy is unmistakable. The ambition is much bigger: make trustworthy local
            work easier to find, easier to complete, and easier to build a future on.
          </p>
        </div>
      </section>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          to="/jobs"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Explore the network <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
        <Link to="/contact" className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold hover:bg-card transition">
          Talk to our team
        </Link>
      </div>
    </InfoPageShell>
  );
}
