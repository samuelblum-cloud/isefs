import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { PageHeader, Section, SectionTitle, StatusTag } from "@/components/site/Page";
import { announcement, educationAreas } from "@/content/site";

export const Route = createFileRoute("/education-and-science")({
  head: () => ({
    meta: [
      { title: "Education & Science — ISEFS" },
      {
        name: "description",
        content:
          "Congress, monographic courses, practical laboratories, a fellowship pathway under development, webinars and planned scientific collaboration.",
      },
      { property: "og:title", content: "Education & Science — ISEFS" },
      {
        property: "og:description",
        content:
          "The educational and scientific activities of the International Society for Endoscopic Facial Surgery.",
      },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Education & Science"
        title="Our educational and scientific programme"
        lead="Six distinct areas of activity. Each is described according to its current stage of development; activities still in preparation are labelled as such."
      />

      <Section>
        <ul className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule lg:grid-cols-2">
          {educationAreas.map((area) => (
            <li key={area.title} className="bg-background p-8 sm:p-10">
              <StatusTag>{area.status}</StatusTag>
              <h2 className="mt-4 text-xl">{area.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{area.summary}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-sm bg-surface p-8">
          <h2 className="text-lg">A note on what these activities are</h2>
          <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
            A scientific congress is a meeting for presenting and debating research. It is not the
            same as a course that includes surgical observation or laboratory teaching, which has
            different aims, different supervision requirements and different participant criteria.
            The Society will publish the specific conditions for each activity when it is confirmed.
          </p>
          <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
            No dates, locations, faculty appointments or booking options are published until they
            are confirmed. ISEFS does not currently offer guaranteed fellowship places, CME credits
            or professional certification.
          </p>
        </div>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section>
          <SectionTitle eyebrow="Related course" title={announcement.courseName} />
          <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
            {announcement.courseName} takes place in {announcement.courseLocation} on{" "}
            {announcement.courseDates}. {announcement.courseNote}
          </p>
          <a
            href={announcement.courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 link-inline"
          >
            Visit the official course website
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </Section>
      </div>

      <Section>
        <div className="rounded-sm border border-rule p-8 sm:p-12">
          <h2 className="text-2xl">Stay informed</h2>
          <p className="measure mt-4 text-base leading-relaxed text-muted-foreground">
            Register your interest to receive news about the Society, membership and upcoming
            educational activities as they are confirmed.
          </p>
          <Link
            to="/membership"
            hash="register"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Register your interest
          </Link>
        </div>
      </Section>
    </>
  );
}
