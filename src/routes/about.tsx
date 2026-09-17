import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { society } from "@/content/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Society — ISEFS" },
      {
        name: "description",
        content:
          "ISEFS connects an international professional community through structured education, practical learning, discussion of outcomes and scientific collaboration.",
      },
      { property: "og:title", content: "About the Society — ISEFS" },
      {
        property: "og:description",
        content:
          "The mission of the International Society for Endoscopic Facial Surgery, currently being established.",
      },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    title: "Structured education",
    body: "Teaching built on a clear curriculum rather than isolated events, so that surgeons at different stages can follow a coherent path.",
  },
  {
    title: "Practical learning",
    body: "Supervised laboratory and technical training that allows technique to be examined carefully, under appropriate guidance.",
  },
  {
    title: "Discussion of outcomes",
    body: "Honest, evidence-led examination of results, including complications, as the basis for improving practice.",
  },
  {
    title: "Scientific collaboration",
    body: "Shared work between centres and countries, so that knowledge accumulates instead of remaining local.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Connecting an international professional community"
        lead="ISEFS exists to advance endoscopic facial surgery through education, practical training and scientific exchange between surgeons, residents, faculty and professional partners."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle eyebrow="Mission" title="Why the Society exists" />
          <div className="measure space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Endoscopic approaches to facial surgery have developed rapidly, but the knowledge
              behind them is still dispersed. Techniques are refined in individual centres, taught
              informally and discussed at occasional meetings. Surgeons who wish to learn
              systematically often have no clear route to follow.
            </p>
            <p>
              The {society.name} is being established to address this. Its purpose is to provide a
              stable, international framework for teaching the discipline, for supervised practical
              learning, for open discussion of surgical outcomes and for collaborative scientific
              work.
            </p>
            <p>
              The Society is intended for the professional community: surgeons in practice,
              residents in training, faculty who teach, and the institutional and professional
              partners who support their work.
            </p>
          </div>
        </div>
      </Section>

      <div className="border-y border-rule bg-surface">
        <Section>
          <SectionTitle eyebrow="Principles" title="How we intend to work" />
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="bg-background p-8">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section>
        <div className="rounded-sm border border-rule p-8 sm:p-12">
          <h2 className="text-2xl">Current status</h2>
          <p className="measure mt-5 text-base leading-relaxed text-muted-foreground">
            The Society is currently being established. Its governing documents, formal
            registration and admission rules are being prepared, and this website will be updated
            as each step is completed. Until then, ISEFS makes no claim to registered, charitable,
            tax-exempt or accredited status, and its programmes are described according to their
            actual stage of development.
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
