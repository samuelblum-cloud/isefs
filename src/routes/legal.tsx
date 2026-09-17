import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Section, SectionTitle, StatusTag } from "@/components/site/Page";
import { announcement, contactDetails, legalForm, legalStatus, society } from "@/content/site";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal information — ISEFS" },
      {
        name: "description",
        content:
          "Legal information about the International Society for Endoscopic Facial Surgery, its status, and the use of this website.",
      },
      { property: "og:title", content: "Legal information — ISEFS" },
      {
        property: "og:description",
        content: "Status, responsibility and terms of use for the ISEFS website.",
      },
    ],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Legal information"
        lead="Status of the Society, responsibility for this website and the limits of the information published here."
      />

      <Section>
        {!legalStatus.legalNoticeApproved ? (
          <div className="mb-10 rounded-sm border border-rule bg-surface p-6">
            <StatusTag>Draft — pending approval</StatusTag>
            <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
              This text is a working draft prepared for review and has not yet been approved.
            </p>
          </div>
        ) : null}

        <div className="measure space-y-8 text-base leading-relaxed">
          <div>
            <SectionTitle title="The Society" />
            <p className="mt-4 text-muted-foreground">
              {society.name} ({society.shortName}). {legalForm.summary} {society.status} Entries in
              the commercial register, a registration number and formal contact details will be
              published once available.
              {contactDetails.registrationNumber
                ? ` Registration number: ${contactDetails.registrationNumber}.`
                : ""}
            </p>
          </div>

          <div>
            <SectionTitle title="Status of the information" />
            <p className="mt-4 text-muted-foreground">
              Information about membership, educational activities, the fellowship pathway and
              scientific collaboration describes work in preparation. It does not constitute an
              offer of membership, a guarantee of any place on a programme, or a commitment to a
              particular benefit. Activities and dates require approval by the Society's Board.
            </p>
          </div>

          <div>
            <SectionTitle title="Independent events" />
            <p className="mt-4 text-muted-foreground">{announcement.courseNote}</p>
          </div>

          <div>
            <SectionTitle title="Medical information" />
            <p className="mt-4 text-muted-foreground">
              This website addresses medical professionals. Nothing published here is medical
              advice, a treatment recommendation or a substitute for individual clinical judgement,
              and no member designation is a confirmation of independently assessed clinical
              competence.
            </p>
          </div>

          <div>
            <SectionTitle title="Names, logos and content" />
            <p className="mt-4 text-muted-foreground">
              The names {society.shortName}, {society.name} and any {society.brand} signs, together
              with the logos, text, images and materials on this website, belong to the Society or
              to its respective rights holders. They may not be used without written permission.
            </p>
          </div>

          <div>
            <SectionTitle title="External links" />
            <p className="mt-4 text-muted-foreground">
              This website links to external sites operated by others. The Society is not
              responsible for their content.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
