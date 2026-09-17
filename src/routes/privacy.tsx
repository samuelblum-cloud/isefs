import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Section, SectionTitle, StatusTag } from "@/components/site/Page";
import { contactDetails, legalForm, legalStatus, submissions } from "@/content/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy information — ISEFS" },
      {
        name: "description",
        content:
          "How the International Society for Endoscopic Facial Surgery handles personal data submitted through its interest registration and contact forms.",
      },
      { property: "og:title", content: "Privacy information — ISEFS" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://isefs.lovable.app/privacy" },
      {
        property: "og:description",
        content: "How ISEFS handles personal data submitted through its website forms.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy information — ISEFS" },
      { name: "twitter:description", content: "How ISEFS handles personal data submitted through its website." },
    ],
    links: [{ rel: "canonical", href: "https://isefs.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy information"
        lead="How personal data submitted through this website is handled."
      />

      <Section>
        {!legalStatus.privacyApproved ? (
          <div className="mb-10 rounded-sm border border-rule bg-surface p-6">
            <StatusTag>Draft — pending approval</StatusTag>
            <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
              This text is a working draft prepared for review. It has not yet been approved and
              may change before the Society's formal establishment is completed.
            </p>
          </div>
        ) : null}

        <div className="measure space-y-8 text-base leading-relaxed">
          <div>
            <SectionTitle title="Who is responsible" />
            <p className="mt-4 text-muted-foreground">
              The International Society for Endoscopic Facial Surgery (ISEFS), being established as
              an association under Swiss law with its registered office in {legalForm.seat}, is
              responsible for the personal data collected through this website. Its management
               office will administer enquiries and interest registrations once a responsible
               contact has been confirmed.
               {contactDetails.email ? ` Contact: ${contactDetails.email}.` : ""}
            </p>
          </div>

          <div>
            <SectionTitle title="What we collect" />
            <p className="mt-4 text-muted-foreground">
              Interest registration: first name, last name, email address, country, specialty, an
              optional institution, your selected areas of interest, whether you agreed to receive
              news, and the time of submission. Contact enquiries: your name, email address,
              subject and message.
            </p>
          </div>

          <div>
            <SectionTitle title="Why we use it" />
            <p className="mt-4 text-muted-foreground">
              To respond to your enquiry, to inform you about the Society, its membership and its
              educational activities, and to prepare membership processes once these are approved.
              News is only sent where you have agreed to receive it.
            </p>
          </div>

          <div>
            <SectionTitle title="Who can see it" />
            <p className="mt-4 text-muted-foreground">
               When submissions open, they will be stored privately and will not be publicly
               readable. Access arrangements for authorised management staff and the relevant
               technical service providers must be confirmed before collection begins.
            </p>
          </div>

          <div>
            <SectionTitle title="How long we keep it" />
            <p className="mt-4 text-muted-foreground">
              Registrations and enquiries are kept for as long as needed to respond to you and to
              administer the Society's membership processes, and are then deleted or anonymised.
            </p>
          </div>

          <div>
            <SectionTitle title="Your rights" />
            <p className="mt-4 text-muted-foreground">
               You may ask for access to your data, for its correction or deletion, and you may
               withdraw your consent to receive news at any time. The approved contact route for
               these requests will be published before submissions open.
            </p>
          </div>

          <div>
            <SectionTitle title="Cookies and analytics" />
            <p className="mt-4 text-muted-foreground">
               This website does not use advertising cookies or third-party tracking. Its typeface
               is served with the website rather than requested from Google Fonts.
            </p>
          </div>

          {!submissions.available ? (
            <p className="rounded-sm border border-rule bg-surface p-5 text-sm text-muted-foreground">
              Online forms are currently unavailable and are not collecting personal data.
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
