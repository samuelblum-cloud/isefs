import { createFileRoute } from "@tanstack/react-router";

import { CmsAdminApp } from "@/cms/CmsAdminApp";
import { defaultCmsPages } from "@/cms/default-pages";
import type { CmsAdminSnapshot } from "@/cms/admin-api";
import { endofaceLogoUrl } from "@/content/assets";

export const Route = createFileRoute("/admin/demo")({
  head: () => ({ meta: [{ title: "ISEFS CMS design preview" }] }),
  component: CmsAdminDemoRoute,
});

const demoSnapshot: CmsAdminSnapshot = {
  userId: "local-design-preview",
  userEmail: "samuel.blum@zurich-law.com",
  role: "owner",
  pages: defaultCmsPages.map((page, pageIndex) => ({
    pageId: `page-${pageIndex}`,
    slug: page.slug,
    internalName: page.internalName,
    versionId: `version-${pageIndex}`,
    versionNumber: 2,
    status: "draft",
    pageTitle: page.pageTitle,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    publishedAt: "2026-09-17T12:00:00.000Z",
    publishedVersionNumber: 1,
    versions: [
      {
        id: `version-${pageIndex}`,
        versionNumber: 2,
        status: "draft",
        createdAt: "2026-09-17T12:00:00.000Z",
        publishedAt: null,
      },
      {
        id: `published-${pageIndex}`,
        versionNumber: 1,
        status: "published",
        createdAt: "2026-09-17T11:00:00.000Z",
        publishedAt: "2026-09-17T12:00:00.000Z",
      },
    ],
    blocks: page.blocks.map((block, position) => ({
      id: `block-${pageIndex}-${position}`,
      pageVersionId: `version-${pageIndex}`,
      type: block.type,
      internalName: block.internalName,
      position,
      visible: block.visible ?? true,
      data: block.data,
    })),
  })),
  media: [
    {
      id: "media-endoface-logo",
      storage_path: "identity/endoface-logo.webp",
      public_url: endofaceLogoUrl,
      file_name: "endoface-logo.webp",
      mime_type: "image/webp",
      title: "ENDOFACE by ISEFS logo",
      alt_text: "ENDOFACE by ISEFS — International Society for Endoscopic Facial Surgery logo",
      caption: "ENDOFACE by ISEFS",
      rights_holder: "ISEFS",
      rights_note: "ISEFS identity asset",
      focal_x: 0.5,
      focal_y: 0.5,
      is_public: true,
      uploaded_by: "local-design-preview",
      created_at: "2026-09-17T11:00:00.000Z",
      updated_at: "2026-09-17T11:00:00.000Z",
    },
  ],
  registrations: [],
  enquiries: [],
  invitations: [
    {
      id: "invitation-owner",
      email: "samuel.blum@zurich-law.com",
      email_normalised: "samuel.blum@zurich-law.com",
      role: "owner",
      active: true,
      accepted_by: "local-design-preview",
      accepted_at: "2026-09-17T12:00:00.000Z",
      created_at: "2026-09-17T11:00:00.000Z",
    },
  ],
};

function CmsAdminDemoRoute() {
  if (!import.meta.env.DEV) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface p-6">
        <p className="text-sm text-muted-foreground">This local design preview is unavailable.</p>
      </main>
    );
  }
  return <CmsAdminApp demo initialSnapshot={demoSnapshot} />;
}
