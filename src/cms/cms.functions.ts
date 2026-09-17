import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { defaultCmsPages } from "./default-pages";
import type { CmsBlockType, CmsPageDocument } from "./types";

const slugSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/)
    .max(100),
});

async function readPage(slug: string, status: "draft" | "published") {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return null;

  let supabaseAdmin: Awaited<
    typeof import("@/integrations/supabase/client.server")
  >["supabaseAdmin"];
  try {
    ({ supabaseAdmin } = await import("@/integrations/supabase/client.server"));
  } catch (cause) {
    if (cause instanceof Error && cause.message.includes("Missing Supabase environment variable")) {
      return null;
    }
    throw cause;
  }

  const { data: page, error: pageError } = await supabaseAdmin
    .from("cms_pages")
    .select("id, slug, internal_name")
    .eq("slug", slug)
    .maybeSingle();

  if (pageError?.code === "42P01" || pageError?.code === "PGRST205") return null;
  if (pageError) throw new Error(`CMS page lookup failed: ${pageError.message}`);
  if (!page) return null;

  const { data: version, error: versionError } = await supabaseAdmin
    .from("cms_page_versions")
    .select(
      "id, page_id, version_number, status, page_title, meta_title, meta_description, published_at",
    )
    .eq("page_id", page.id)
    .eq("status", status)
    .maybeSingle();

  if (versionError) throw new Error(`CMS page version lookup failed: ${versionError.message}`);
  if (!version) return null;

  const { data: blocks, error: blockError } = await supabaseAdmin
    .from("cms_content_blocks")
    .select("id, page_version_id, block_type, internal_name, position, visible, data")
    .eq("page_version_id", version.id)
    .order("position", { ascending: true });

  if (blockError) throw new Error(`CMS block lookup failed: ${blockError.message}`);

  return {
    pageId: page.id,
    slug: page.slug,
    internalName: page.internal_name,
    versionId: version.id,
    versionNumber: version.version_number,
    status: version.status,
    pageTitle: version.page_title,
    metaTitle: version.meta_title,
    metaDescription: version.meta_description,
    publishedAt: version.published_at,
    blocks: (blocks ?? []).map((block) => ({
      id: block.id,
      pageVersionId: block.page_version_id,
      type: block.block_type as CmsBlockType,
      internalName: block.internal_name,
      position: block.position,
      visible: block.visible,
      data:
        typeof block.data === "object" && block.data && !Array.isArray(block.data)
          ? block.data
          : {},
    })),
  } satisfies CmsPageDocument;
}

export const getPublishedCmsPage = createServerFn({ method: "GET" })
  .validator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => readPage(data.slug, "published"));

export const bootstrapCms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: admin, error: adminError } = await supabaseAdmin
      .from("cms_admin_users")
      .select("user_id, active")
      .eq("user_id", context.userId)
      .eq("active", true)
      .maybeSingle();

    if (adminError) throw new Error(`CMS administrator check failed: ${adminError.message}`);
    if (!admin) throw new Error("CMS administrator access required.");

    const { count, error: countError } = await supabaseAdmin
      .from("cms_pages")
      .select("id", { count: "exact", head: true });

    if (countError) throw new Error(`CMS page count failed: ${countError.message}`);

    let createdCount = 0;

    for (const seed of defaultCmsPages) {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from("cms_pages")
        .select("id")
        .eq("slug", seed.slug)
        .maybeSingle();

      if (existingError)
        throw new Error(`CMS page lookup failed for ${seed.slug}: ${existingError.message}`);

      // Already seeded (or partially seeded) — leave existing content untouched.
      if (existing) continue;

      const { data: page, error: pageError } = await supabaseAdmin
        .from("cms_pages")
        .insert({ slug: seed.slug, internal_name: seed.internalName, created_by: context.userId })
        .select("id")
        .single();

      if (pageError)
        throw new Error(`Could not create CMS page ${seed.slug}: ${pageError.message}`);

      createdCount += 1;


      const { data: published, error: publishedError } = await supabaseAdmin
        .from("cms_page_versions")
        .insert({
          page_id: page.id,
          version_number: 1,
          status: "published",
          page_title: seed.pageTitle,
          meta_title: seed.metaTitle,
          meta_description: seed.metaDescription,
          published_at: new Date().toISOString(),
          created_by: context.userId,
        })
        .select("id")
        .single();

      if (publishedError) {
        throw new Error(
          `Could not create published CMS version ${seed.slug}: ${publishedError.message}`,
        );
      }

      const { data: draft, error: draftError } = await supabaseAdmin
        .from("cms_page_versions")
        .insert({
          page_id: page.id,
          version_number: 2,
          status: "draft",
          page_title: seed.pageTitle,
          meta_title: seed.metaTitle,
          meta_description: seed.metaDescription,
          created_by: context.userId,
        })
        .select("id")
        .single();

      if (draftError)
        throw new Error(`Could not create CMS draft ${seed.slug}: ${draftError.message}`);

      const publishedBlocks = seed.blocks.map((block, position) => ({
        page_version_id: published.id,
        block_type: block.type,
        internal_name: block.internalName,
        position,
        visible: block.visible ?? true,
        data: block.data,
      }));
      const draftBlocks = seed.blocks.map((block, position) => ({
        page_version_id: draft.id,
        block_type: block.type,
        internal_name: block.internalName,
        position,
        visible: block.visible ?? true,
        data: block.data,
      }));

      const { error: publishedBlockError } = await supabaseAdmin
        .from("cms_content_blocks")
        .insert(publishedBlocks);
      if (publishedBlockError) {
        throw new Error(
          `Could not create published blocks for ${seed.slug}: ${publishedBlockError.message}`,
        );
      }

      const { error: draftBlockError } = await supabaseAdmin
        .from("cms_content_blocks")
        .insert(draftBlocks);
      if (draftBlockError) {
        throw new Error(
          `Could not create draft blocks for ${seed.slug}: ${draftBlockError.message}`,
        );
      }
    }

    return { created: createdCount > 0, pages: (count ?? 0) + createdCount };
  });
