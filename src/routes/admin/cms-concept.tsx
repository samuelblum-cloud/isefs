import { createFileRoute } from "@tanstack/react-router";

import { CmsWorkspaceConcept } from "@/cms/CmsWorkspaceConcept";

export const Route = createFileRoute("/admin/cms-concept")({
  head: () => ({ meta: [{ title: "ISEFS CMS workspace concept" }] }),
  component: CmsConceptRoute,
});

function CmsConceptRoute() {
  if (!import.meta.env.DEV) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface p-6">
        <p className="text-sm text-muted-foreground">This local design concept is unavailable.</p>
      </main>
    );
  }
  return <CmsWorkspaceConcept />;
}
