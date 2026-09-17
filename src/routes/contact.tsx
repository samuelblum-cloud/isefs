import { createFileRoute } from "@tanstack/react-router";

import { ContactForm } from "@/components/site/ContactForm";
import { PageHeader, Section, SectionTitle } from "@/components/site/Page";
import { CmsPageRenderer } from "@/cms/CmsPageRenderer";
import { getPublishedCmsPage } from "@/cms/cms.functions";
import { contactDetails, legalForm } from "@/content/site";

export const Route = createFileRoute("/contact")({
  loader: () => getPublishedCmsPage({ data: { slug: "contact" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.metaTitle || "Contact — ISEFS" },
      {
        name: "description",
        content:
          loaderData?.metaDescription ||
          "Write to the International Society for Endoscopic Facial Surgery about membership, education, scientific collaboration or partnership.",
      },
      { property: "og:title", content: loaderData?.metaTitle || "Contact — ISEFS" },
      {
        property: "og:description",
        content:
          loaderData?.metaDescription ||
          "Send an enquiry to the Society's management office about membership, education or collaboration.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const cmsPage = Route.useLoaderData();
  if (cmsPage) return <CmsPageRenderer page={cmsPage} />;

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
                The Society's published contact details are being confirmed as part of its
                establishment. Until then, please use the form and the management office will reply
                to you directly.
              </p>
            )}
            <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
              The registered office of the Society will be in {legalForm.seat}.
            </p>
          </div>

          <div className="rounded-sm border border-rule bg-surface p-7 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
