import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Send, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AreaHustle" },
      { name: "description", content: "Reach the AreaHustle team for support, partnerships, press, or safety concerns." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    toast.success("Message received. We will be in touch soon.");
    event.currentTarget.reset();
  };
  return (
    <InfoPageShell
      eyebrow="Contact"
      title="Bring us a question, a partnership, or a problem to solve."
      intro="Whether you are looking for a trusted hustler, building a local business, or want to help us make AreaHustle better, our team is listening."
      aside={
        <div className="space-y-4">
          <ContactCard icon={Mail} title="General enquiries" detail="hello@areahustle.com" href="mailto:hello@areahustle.com" />
          <ContactCard icon={MessageCircle} title="Community support" detail="support@areahustle.com" href="mailto:support@areahustle.com" />
          <ContactCard icon={ShieldAlert} title="Safety concerns" detail="safety@areahustle.com" href="mailto:safety@areahustle.com" />
        </div>
      }
    >
      <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tell us a little about what you need and the right person will pick it up.</p>
        </div>
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Your name
            <input
              required
              name="name"
              className="rounded-2xl border bg-background px-4 py-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Ada Okafor"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email address
            <input
              required
              type="email"
              name="email"
              className="rounded-2xl border bg-background px-4 py-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            What can we help with?
            <select name="topic" className="rounded-2xl border bg-background px-4 py-3 font-normal outline-none focus:border-primary">
              <option>General question</option>
              <option>Account or payment support</option>
              <option>Partnership</option>
              <option>Press enquiry</option>
              <option>Safety concern</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Your message
            <textarea
              required
              name="message"
              rows={6}
              className="resize-y rounded-2xl border bg-background px-4 py-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="How can we help?"
            />
          </label>
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <p className="text-xs text-muted-foreground">We usually reply within one business day.</p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Send className="h-4 w-4" /> {sent ? "Send another" : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </InfoPageShell>
  );
}

function ContactCard({ icon: Icon, title, detail, href }: { icon: typeof Mail; title: string; detail: string; href: string }) {
  return (
    <a href={href} className="flex items-start gap-4 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <Icon className="mt-0.5 h-5 w-5 text-primary" />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
      </span>
    </a>
  );
}
