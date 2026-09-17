import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { founders, management } from "@/content/site";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — ISEFS" },
      {
        name: "description",
        content:
          "The scientific founders of ISEFS and the Managing Director responsible for Society management and operational implementation.",
      },
      { property: "og:title", content: "Leadership — ISEFS" },
      {
        property: "og:description",
        content: "Scientific leadership and operational management of the Society.",
      },
    ],
  }),
  component: LeadershipPage,
});

function LeadershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Scientific founders and management"
        lead="The Society distinguishes between its scientific leadership and its operational management."
      />

      <Section>
        <SectionTitle eyebrow="Scientific founders" title="The founding surgeons" />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule lg:grid-cols-3">
          {founders.map((person) => (
            <li key={person.name} className="bg-background p-9 sm:p-10">
              <p className="eyebrow">{person.role}</p>
              <p className="mt-5 text-2xl font-semibold leading-snug text-ink">{person.name}</p>
            </li>
          ))}
        </ul>
        <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">
          The scientific founders and academic leads remain responsible for scientific content and
          professional assessment. This page presents the Society's scientific founders and
          executive management; it is not a complete Board roster.
        </p>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section>
          <SectionTitle eyebrow="Management" title="Society management" />
          <div className="mt-10 rounded-sm border border-rule bg-background p-9 sm:p-12">
            <p className="eyebrow">{management.role}</p>
            <p className="mt-5 text-3xl font-semibold text-ink">{management.name}</p>
            <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
              {management.summary}
            </p>
          </div>
        </Section>
      </div>
    </>
  );
}
