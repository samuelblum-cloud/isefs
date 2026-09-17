import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";

import endofaceLogo from "@/assets/endoface-logo.png.asset.json";
import { Section, SectionTitle, StatusTag } from "@/components/site/Page";
import { announcement, educationAreas, founders, management, society } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISEFS — Advancing endoscopic facial surgery" },
      {
        name: "description",
        content:
          "ISEFS is an international scientific society being established to advance education, practical training and scientific exchange in endoscopic facial surgery.",
      },
      { property: "og:title", content: "ISEFS — Advancing endoscopic facial surgery" },
      {
        property: "og:description",
        content:
          "An international scientific society dedicated to education, practical training and the exchange of surgical knowledge.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <section className="border-b border-rule bg-surface">
        <div className="container-page grid gap-16 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
          <div className="fade-up">
            <p className="eyebrow">
              {society.brand} · by {society.shortName}
            </p>
            <h1 className="mt-5">{society.tagline}</h1>
            <p className="measure mt-6 text-muted-foreground">{society.intro}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/education-and-science"
                className="btn-primary no-underline"
              >
                Explore education
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/membership"
                hash="register"
                className="btn-secondary no-underline"
              >
                Register interest
              </Link>
            </div>
            <p className="mt-8 text-base text-muted-foreground">{society.status}</p>
          </div>

          <div className="rounded-sm border border-rule bg-background p-8 lg:p-12">
            <img
              src={endofaceLogo.url}
              alt="ENDOFACE by ISEFS — International Society for Endoscopic Facial Surgery logo"
              className="h-auto w-full"
              width={1920}
              height={628}
            />
            <p className="mt-8 border-t border-rule pt-6 text-base leading-relaxed text-muted-foreground">
              {society.brand} is the Society's flagship educational programme and brand, bringing
              its education, practical training and scientific exchange into a shared programme.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle eyebrow="The Society" title="A professional community for a demanding discipline" />
          <div className="measure space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Endoscopic facial surgery is a precise, technically demanding field. Progress depends
              on careful teaching, honest discussion of outcomes and sustained contact between
              surgeons working in different centres and health systems.
            </p>
            <p>
              ISEFS is being established to give that work a permanent home: a scientific society
              that brings together surgeons, residents, faculty and professional partners around
              structured education, supervised practical learning and shared scientific enquiry.
            </p>
            <Link
              to="/about"
              className="link-inline"
            >
              Read about our mission
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section>
          <SectionTitle eyebrow="Education & Science" title="Our areas of activity" />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {educationAreas.map((area) => (
              <li key={area.title} className="bg-background p-7">
                <StatusTag>{area.status}</StatusTag>
                <h3 className="mt-4">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.summary}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/education-and-science"
            className="mt-9 link-inline"
          >
            See the full programme
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Section>
      </div>

      <Section>
        <div className="grid gap-10 rounded-sm border border-rule p-8 sm:p-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <StatusTag>{announcement.confirmed ? "Announced" : "Planned"}</StatusTag>
            <h2 className="mt-4">{announcement.heading}</h2>
            <p className="measure mt-5 text-base leading-relaxed text-muted-foreground">
              {announcement.body}
            </p>
          </div>
          <div className="rule-top pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3>{announcement.courseName}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {announcement.courseDates} · {announcement.courseLocation}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {announcement.courseNote}
            </p>
            <a
              href={announcement.courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 link-inline"
            >
              Visit the official course website
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section>
          <SectionTitle eyebrow="Leadership" title="Founders and management" />
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {founders.map((person) => (
              <div key={person.name} className="bg-background p-7">
                <p className="eyebrow">{person.role}</p>
                <p className="mt-3 text-lg font-semibold text-ink">{person.name}</p>
              </div>
            ))}
            <div className="bg-background p-7">
              <p className="eyebrow">{management.role}</p>
              <p className="mt-3 text-lg font-semibold text-ink">{management.name}</p>
            </div>
          </div>
          <Link
            to="/leadership"
            className="mt-9 link-inline"
          >
            More about the Society's leadership
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Section>
      </div>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTitle eyebrow="Membership" title="Register your interest" />
            <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
              Register your interest to receive news about the Society, membership and upcoming
              educational activities. Registering interest does not constitute admission to
              membership.
            </p>
          </div>
          <Link
            to="/membership"
            hash="register"
            className="btn-primary no-underline lg:justify-self-start"
          >
            Register your interest
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Section>
    </>
  );
}
