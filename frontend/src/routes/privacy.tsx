import { createFileRoute } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | AreaHustle" },
      { name: "description", content: "How AreaHustle collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPageShell
      eyebrow="Legal · Last updated September 22, 2026"
      title="Your information should work for you, too."
      intro="This policy explains what AreaHustle collects, why we use it, who we share it with, and the choices you have. We collect what helps people find work safely, not a dossier for its own sake."
      aside={
        <div className="space-y-4">
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-elevated">
            <LockKeyhole className="mb-7 h-6 w-6" />
            <p className="font-display text-2xl font-bold">Clear data. Useful control.</p>
            <p className="mt-3 text-sm leading-6 opacity-75">You can ask what we hold, correct it, or ask us to close your account.</p>
          </div>
          <div className="rounded-3xl border bg-card p-5 shadow-soft">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm font-semibold">Privacy questions</p>
            <a className="mt-1 block text-sm text-muted-foreground hover:text-foreground" href="mailto:privacy@areahustle.com">
              privacy@areahustle.com
            </a>
          </div>
        </div>
      }
    >
      <LegalContent>
        <Section title="1. The information we collect">
          <p>
            <strong className="text-foreground">Account information:</strong> name, phone number, email address, password credentials, role, and
            profile details you choose to add.
          </p>
          <p>
            <strong className="text-foreground">Work information:</strong> task descriptions, skills, availability, approximate location, messages,
            reviews, completion evidence, and transaction details. Voice features may process an audio recording to transcribe and structure a
            request.
          </p>
          <p>
            <strong className="text-foreground">Device and usage information:</strong> browser type, device identifiers, approximate location, pages
            or features used, error data, and basic security logs. We use this to keep the service reliable and prevent abuse.
          </p>
          <p>
            <strong className="text-foreground">Payment information:</strong> payment providers process sensitive card, bank, or wallet details.
            AreaHustle receives limited transaction information needed to show status, reconcile payments, and support disputes.
          </p>
        </Section>
        <Section title="2. How we use information">
          <p>
            We use information to create and secure accounts, match tasks with relevant hustlers, process payments, provide support, calculate
            marketplace signals, improve voice and search experiences, prevent fraud, investigate safety reports, and meet legal obligations.
          </p>
          <p>
            We may send service messages about account activity, jobs, payments, and safety. With your permission where required, we may send product
            updates or community news. You can unsubscribe from marketing messages at any time.
          </p>
        </Section>
        <Section title="3. What we share">
          <p>
            We share the minimum information needed to operate the marketplace. For example, a customer may see a hustler’s public profile and
            relevant trust signals, while a hustler may receive the task details and location context needed to decide whether to accept a job.
          </p>
          <p>
            We may share information with payment processors, hosting and infrastructure providers, analytics and communication partners, identity or
            safety vendors, professional advisers, and authorities when legally required. Service providers must handle data for the purposes we
            authorize.
          </p>
          <p>
            We do not sell personal information. We do not publish private contact details, payment credentials, or message contents as public profile
            data.
          </p>
        </Section>
        <Section title="4. Voice, location, and visibility">
          <p>
            Voice input is optional. If you use it, the recording and transcript may be processed by technology providers that help us transcribe or
            interpret your request. We keep the resulting task information so the job can be fulfilled, and retain audio only according to our
            operational needs and applicable law.
          </p>
          <p>
            Location features use the least precise information that can support a useful match. You control what you include in a task or profile,
            but a public listing may reveal the neighborhood or service area you provide.
          </p>
        </Section>
        <Section title="5. Retention and security">
          <p>
            We retain information while your account is active and for as long as needed for the purposes described here, including accounting,
            dispute resolution, safety investigations, and legal compliance. Retention periods vary by data type.
          </p>
          <p>
            We use access controls, encryption in transit, monitoring, and provider safeguards designed to protect information. No online service can
            promise absolute security, so please choose a strong password and contact us quickly if something looks wrong.
          </p>
        </Section>
        <Section title="6. Your choices and rights">
          <p>
            Depending on where you live, you may have rights to access, correct, delete, restrict, or receive a copy of your information, and to
            object to certain uses. You can update much of your profile from the product or email{" "}
            <a className="font-semibold text-primary" href="mailto:privacy@areahustle.com">
              privacy@areahustle.com
            </a>{" "}
            with your request.
          </p>
          <p>
            We may need to verify your identity before completing a request. Deleting information can affect our ability to provide a Financial
            Passport, resolve a dispute, or meet a legal obligation.
          </p>
        </Section>
        <Section title="7. Children, transfers, and changes">
          <p>
            AreaHustle is not intended for children who are not legally able to use a paid work marketplace. If you believe a child has provided
            personal information, contact us so we can review and remove it where appropriate.
          </p>
          <p>
            Our providers may process information in countries other than yours. When we do so, we use appropriate safeguards required by applicable
            law. We may update this policy as our service changes and will post the new version with a revised date.
          </p>
        </Section>
        <Section title="8. Contact us">
          <p>
            For privacy requests, complaints, or questions about this policy, email{" "}
            <a className="font-semibold text-primary" href="mailto:privacy@areahustle.com">
              privacy@areahustle.com
            </a>
            . You can also write to AreaHustle, Lagos, Nigeria. We will acknowledge a request and explain the next steps.
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
