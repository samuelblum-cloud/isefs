import { createFileRoute } from "@tanstack/react-router";

import { InterestForm } from "@/components/site/InterestForm";
import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { membershipValue } from "@/content/site";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — ISEFS" },
      {
        name: "description",
        content:
          "Register your interest to receive news about the Society, membership and upcoming educational activities in endoscopic facial surgery.",
      },
      { property: "og:title", content: "Membership — ISEFS" },
      {
        property: "og:description",
        content:
          "Professional exchange, educational resources, scientific collaboration and access to Society programmes.",
      },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
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
              <h3 className="text-lg">{item.title}</h3>
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
                Registering your interest does not constitute an application for membership and
                does not constitute admission. No payment is requested or required at this stage.
                When formal applications open, we will write to everyone who has registered.
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
