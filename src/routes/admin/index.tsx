import { createFileRoute } from "@tanstack/react-router";

import { CmsAdminApp } from "@/cms/CmsAdminApp";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "ISEFS administration" }] }),
  component: CmsAdminRoute,
});

function CmsAdminRoute() {
  return <CmsAdminApp />;
}
