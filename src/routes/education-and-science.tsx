import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { PageHeader, Section, SectionTitle, StatusTag } from "@/components/site/Page";
import { CmsPageRenderer } from "@/cms/CmsPageRenderer";
import { getPublishedCmsPage } from "@/cms/cms.functions";
import { announcement, educationAreas } from "@/content/site";

export const Route = createFileRoute("/education-and-science")({
  loader: () => getPublishedCmsPage({ data: { slug: "education-and-science" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.metaTitle || "Education & Science — ISEFS" },
      {
        name: "description",
        content:
          loaderData?.metaDescription ||
          "Congress, monographic courses, practical laboratories, a fellowship pathway under development, webinars and planned scientific collaboration.",
      },
      { property: "og:title", content: loaderData?.metaTitle || "Education & Science — ISEFS" },
      {
        property: "og:description",
        content:
          loaderData?.metaDescription ||
          "The educational and scientific activities of the International Society for Endoscopic Facial Surgery.",
      },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  const cmsPage = Route.useLoaderData();
  if (cmsPage) return <CmsPageRenderer page={cmsPage} />;

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
          <h2>A note on what these activities are</h2>
          <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
            ISEFS will develop a coordinated programme of scientific congresses, focused monographic
            courses, practical laboratories, webinars, fellowship training and collaborative
            scientific work. Dates, faculty and participation requirements will be published once
            the relevant programme has been approved.
          </p>
          <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">{"\n"}</p>
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
          <h2>Stay informed</h2>
          <p className="measure mt-4 text-base leading-relaxed text-muted-foreground">
            Register your interest to receive news about the Society, membership and upcoming
            educational activities as they are confirmed.
          </p>
          <Link to="/membership" hash="register" className="btn-primary mt-8 no-underline">
            Register your interest
          </Link>
        </div>
      </Section>
    </>
  );
}
