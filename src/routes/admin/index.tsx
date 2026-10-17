import { createFileRoute } from "@tanstack/react-router";

import { CmsAdminApp } from "@/cms/CmsAdminApp";
import { adminNoIndexMeta } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "ISEFS administration" }, ...adminNoIndexMeta] }),
  component: CmsAdminRoute,
});

function CmsAdminRoute() {
  return <CmsAdminApp />;
}
