import { createFileRoute } from "@tanstack/react-router";

import { ContactForm } from "@/components/site/ContactForm";
import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { contactDetails, legalForm, submissions } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ISEFS" },
      {
        name: "description",
        content:
          "Write to the International Society for Endoscopic Facial Surgery about membership, education, scientific collaboration or partnership.",
      },
      { property: "og:title", content: "Contact — ISEFS" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://isefs.lovable.app/contact" },
      {
        property: "og:description",
        content:
          "Send an enquiry to the Society's management office about membership, education or collaboration.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact — ISEFS" },
      {
        name: "twitter:description",
        content: "Contact information for the International Society for Endoscopic Facial Surgery.",
      },
    ],
    links: [{ rel: "canonical", href: "https://isefs.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const hasDetails = Boolean(
    contactDetails.email || contactDetails.telephone || contactDetails.address,
  );

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact the Society"
        lead="Enquiries about membership, education, scientific collaboration and partnership are handled by the Society's management office."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionTitle eyebrow="Management office" title="How to reach us" />
            {hasDetails ? (
              <dl className="mt-6 space-y-4 text-sm leading-relaxed">
                {contactDetails.email ? (
                  <div>
                    <dt className="eyebrow">Email</dt>
                    <dd className="mt-1">
                      <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
                    </dd>
                  </div>
                ) : null}
                {contactDetails.telephone ? (
                  <div>
                    <dt className="eyebrow">Telephone</dt>
                    <dd className="mt-1">{contactDetails.telephone}</dd>
                  </div>
                ) : null}
                {contactDetails.address ? (
                  <div>
                    <dt className="eyebrow">Address</dt>
                    <dd className="mt-1 whitespace-pre-line">{contactDetails.address}</dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
                The Society's responsible contact details are being confirmed. They will be
                published here before enquiries open.
              </p>
            )}
            <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
              The registered office of the Society will be in {legalForm.seat}.
            </p>
          </div>

          <div className="rounded-sm border border-rule bg-surface p-7 sm:p-10">
            {submissions.available ? (
              <ContactForm />
            ) : (
              <div role="status" className="border-l-4 border-accent pl-5">
                <h2 className="text-xl">Enquiries opening soon</h2>
                <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
                  {submissions.unavailableMessage} A contact route will appear here once confirmed.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
