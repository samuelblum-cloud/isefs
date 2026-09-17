import { createFileRoute } from "@tanstack/react-router";

import { InterestForm } from "@/components/site/InterestForm";
import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { CmsPageRenderer } from "@/cms/CmsPageRenderer";
import { getPublishedCmsPage } from "@/cms/cms.functions";
import { admissionNotes, membershipCategories, membershipValue } from "@/content/site";

export const Route = createFileRoute("/membership")({
  loader: () => getPublishedCmsPage({ data: { slug: "membership" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.metaTitle || "Membership — ISEFS" },
      {
        name: "description",
        content:
          loaderData?.metaDescription ||
          "Register your interest to receive news about the Society, membership and upcoming educational activities in endoscopic facial surgery.",
      },
      { property: "og:title", content: loaderData?.metaTitle || "Membership — ISEFS" },
      {
        property: "og:description",
        content:
          loaderData?.metaDescription ||
          "Professional exchange, educational resources, scientific collaboration and access to Society programmes.",
      },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  const cmsPage = Route.useLoaderData();
  if (cmsPage) return <CmsPageRenderer page={cmsPage} />;

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership of the Society"
        lead="Membership is intended to connect surgeons, residents, faculty and professional partners to the Society's educational and scientific work."
      />

      <Section>
        <SectionTitle eyebrow="Intended value" title="What membership is intended to offer" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
          {membershipValue.map((item) => (
            <div key={item.title} className="bg-background p-8">
              <h3>{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">
          Membership categories, conditions and any contribution are being prepared as part of the
          Society's establishment and will be published once approved. Nothing on this page
          constitutes an offer of membership or a commitment to any particular benefit.
        </p>
      </Section>

      <Section className="pt-0">
        <SectionTitle eyebrow="Planned categories" title="Membership categories foreseen" />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
          {membershipCategories.map((item) => (
            <li key={item.title} className="bg-background p-8">
              <h3>{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-sm border border-rule p-8 sm:p-10">
          <h3 className="text-xl">How admission is intended to work</h3>
          <ul className="mt-5 space-y-3">
            {admissionNotes.map((note) => (
              <li
                key={note}
                className="measure border-t border-rule pt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {note}
              </li>
            ))}
          </ul>
          <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
            Formal applications will open once the admission rules and membership regulations have
            been approved. Until then, please register your interest.
          </p>
        </div>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section id="register">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionTitle eyebrow="First step" title="Register your interest" />
              <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
                Register your interest to receive news about the Society, membership and upcoming
                educational activities.
              </p>
              <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
                Registering your interest does not constitute an application for membership and does
                not constitute admission. No payment is requested or required at this stage. When
                formal applications open, we will write to everyone who has registered.
              </p>
            </div>
            <div className="rounded-sm border border-rule bg-background p-7 sm:p-10">
              <InterestForm />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
