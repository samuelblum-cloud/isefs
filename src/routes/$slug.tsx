import { createFileRoute, notFound } from "@tanstack/react-router";

import { CmsPageRenderer } from "@/cms/CmsPageRenderer";
import { getPublishedCmsPage } from "@/cms/cms.functions";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const page = await getPublishedCmsPage({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData, params }) =>
    pageSeo({
      path: `/${params.slug}`,
      title: loaderData?.metaTitle || "ISEFS",
      description: loaderData?.metaDescription || "",
    }),
  component: DynamicCmsPage,
});

function DynamicCmsPage() {
  return <CmsPageRenderer page={Route.useLoaderData()} />;
}
