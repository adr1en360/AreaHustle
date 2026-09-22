import { createFileRoute } from "@tanstack/react-router";
import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service | AreaHustle" }, { name: "description", content: "The terms that apply when you use AreaHustle." }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPageShell
      eyebrow="Legal · Last updated September 22, 2026"
      title="Terms that keep the marketplace fair."
      intro="These terms explain the responsibilities we share when AreaHustle connects customers and hustlers. We have written them to be readable, practical, and clear about where our service begins and ends."
      aside={
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">In a hurry?</p>
          <p className="mt-4 font-display text-xl font-bold">The short version</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Be honest, keep commitments, communicate clearly, and use AreaHustle lawfully. We provide the connection and the tools; you remain
            responsible for the work you offer or request.
          </p>
          <a href="#questions" className="mt-5 inline-block text-sm font-semibold text-primary">
            Questions about these terms →
          </a>
        </div>
      }
    >
      <LegalContent>
        <Section title="1. Using AreaHustle">
          <p>
            AreaHustle is a marketplace and trust infrastructure for local work. By creating an account, browsing listings, posting a task, accepting
            an engagement, or using a Financial Passport, you agree to these Terms of Service and our Privacy Policy.
          </p>
          <p>
            You must be legally able to enter into this agreement. You are responsible for keeping your login details secure and for all activity
            carried out through your account. Tell us promptly if you believe your account has been accessed without permission.
          </p>
        </Section>
        <Section title="2. Accounts and honest information">
          <p>
            Use your real identity and provide information that is accurate, current, and complete. Do not impersonate another person, create accounts
            to evade a restriction, manipulate reviews, or misrepresent your skills, availability, location, or completed work.
          </p>
          <p>
            We may ask for verification when it helps protect the community. Verification is a signal, not a guarantee of a person’s identity,
            qualifications, or conduct.
          </p>
        </Section>
        <Section title="3. Jobs, payments, and escrow">
          <p>
            Customers are responsible for writing a truthful brief, agreeing a fair price, and making sure a task is lawful and safe. Hustlers are
            responsible for confirming what they can deliver, communicating changes early, and completing accepted work with reasonable care.
          </p>
          <p>
            Where escrow is available, payment is held according to the job flow shown in the product and released after completion or an applicable
            resolution. Payment providers may apply their own terms and fees. You must not move a transaction off-platform to avoid fees, safeguards,
            or a dispute process.
          </p>
          <p>
            AreaHustle does not employ hustlers and is not a party to the underlying service contract between a customer and a hustler. Each party is
            responsible for taxes, permits, insurance, tools, and legal obligations that apply to them.
          </p>
        </Section>
        <Section title="4. Safety and prohibited conduct">
          <p>
            Do not use AreaHustle for illegal services, harassment, discrimination, threats, fraud, trafficking, unsafe work, weapons, or requests
            that put another person at unreasonable risk. Never share another person’s private information without permission.
          </p>
          <p>
            Trust your judgment when meeting someone. Keep early communication and payment inside the platform, meet in an appropriate place where
            possible, and report urgent danger to the relevant emergency service first, then to our safety team.
          </p>
        </Section>
        <Section title="5. Reviews and Financial Passport">
          <p>
            Reviews must describe a genuine experience and must not contain private data, hate, threats, extortion, or knowingly false claims. We may
            remove content that violates these rules or undermines the integrity of the marketplace.
          </p>
          <p>
            The Financial Passport summarizes activity and signals such as completed work, punctuality, payment history, and reviews. It is not a bank
            account, a credit report, a promise of a loan, or a guarantee of future earnings. You should review important information before relying
            on it for a financial decision.
          </p>
        </Section>
        <Section title="6. Content and our service">
          <p>
            You keep ownership of content you submit, but grant AreaHustle permission to host, display, and use it to operate, improve, secure, and
            promote the service. Do not submit content you do not have the right to use.
          </p>
          <p>
            We work to keep AreaHustle available and useful, but the service may change, pause, or contain errors. We may suspend accounts, listings,
            or payments when necessary to investigate abuse, protect users, comply with law, or maintain platform integrity.
          </p>
        </Section>
        <Section title="7. Disputes and liability">
          <p>
            Try to resolve job questions directly and promptly using the platform’s support channels. If we need to step in, we may review messages,
            payment records, and completion evidence to apply the marketplace rules.
          </p>
          <p>
            To the extent permitted by law, AreaHustle is not liable for indirect losses, lost profits, or the acts or omissions of another user.
            Nothing in these terms limits rights or responsibilities that cannot legally be limited.
          </p>
        </Section>
        <Section title="8. Changes and contact">
          <p>
            We may update these terms as AreaHustle evolves. We will post the updated version here and change the date above. Continued use after an
            update means you accept the revised terms.
          </p>
          <p id="questions">
            Questions or formal notices can be sent to{" "}
            <a className="font-semibold text-primary" href="mailto:legal@areahustle.com">
              legal@areahustle.com
            </a>
            . We aim to acknowledge requests within one business day.
          </p>
        </Section>
      </LegalContent>
    </InfoPageShell>
  );
}

function LegalContent({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl space-y-10 text-sm leading-7 text-muted-foreground">{children}</div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
