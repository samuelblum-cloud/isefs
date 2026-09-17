import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

import { bootstrapCms } from "./cms.functions";
import type { CmsBlockType, CmsContentBlock, CmsPageDocument } from "./types";

export type CmsAdminRole = "owner" | "editor";

export interface CmsAdminVersion {
  id: string;
  versionNumber: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  publishedAt: string | null;
}

export interface CmsAdminPage extends CmsPageDocument {
  publishedVersionNumber: number | null;
  versions: CmsAdminVersion[];
}

export interface CmsAdminSnapshot {
  userId: string;
  userEmail: string;
  role: CmsAdminRole;
  pages: CmsAdminPage[];
  media: Tables<"cms_media_assets">[];
  registrations: Tables<"interest_registrations">[];
  enquiries: Tables<"contact_enquiries">[];
  invitations: Tables<"cms_admin_invitations">[];
}

export async function signInCms(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutCms() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function registerInvitedCmsUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/admin/login` },
  });
  if (error) throw error;
  return data;
}

export async function getCmsSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function ensureCmsBootstrap() {
  return bootstrapCms();
}

function toRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export async function loadCmsAdminSnapshot(): Promise<CmsAdminSnapshot> {
  const session = await getCmsSession();
  if (!session?.user) throw new Error("CMS login required.");

  const { data: admin, error: adminError } = await supabase
    .from("cms_admin_users")
    .select("role")
    .eq("user_id", session.user.id)
    .eq("active", true)
    .maybeSingle();

  if (adminError) throw adminError;
  if (!admin) throw new Error("This account has no ISEFS CMS administrator role.");

  await ensureCmsBootstrap();

  const [pageResult, versionResult, blockResult, mediaResult, registrationResult, enquiryResult] =
    await Promise.all([
      supabase.from("cms_pages").select("*").order("internal_name"),
      supabase.from("cms_page_versions").select("*").order("version_number", { ascending: false }),
      supabase.from("cms_content_blocks").select("*").order("position"),
      supabase.from("cms_media_assets").select("*").order("created_at", { ascending: false }),
      supabase.from("interest_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_enquiries").select("*").order("created_at", { ascending: false }),
    ]);

  const firstError = [
    pageResult,
    versionResult,
    blockResult,
    mediaResult,
    registrationResult,
    enquiryResult,
  ]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) throw firstError;

  const versions = versionResult.data ?? [];
  const blocks = blockResult.data ?? [];
  let invitations: Tables<"cms_admin_invitations">[] = [];
  if (admin.role === "owner") {
    const invitationResult = await supabase
      .from("cms_admin_invitations")
      .select("*")
      .order("created_at", { ascending: false });
    if (invitationResult.error) throw invitationResult.error;
    invitations = invitationResult.data ?? [];
  }

  const pages = (pageResult.data ?? []).flatMap<CmsAdminPage>((page) => {
    const draft = versions.find(
      (version) => version.page_id === page.id && version.status === "draft",
    );
    if (!draft) return [];
    const published = versions.find(
      (version) => version.page_id === page.id && version.status === "published",
    );
    return [
      {
        pageId: page.id,
        slug: page.slug,
        internalName: page.internal_name,
        versionId: draft.id,
        versionNumber: draft.version_number,
        status: draft.status,
        pageTitle: draft.page_title,
        metaTitle: draft.meta_title,
        metaDescription: draft.meta_description,
        publishedAt: published?.published_at ?? null,
        publishedVersionNumber: published?.version_number ?? null,
        versions: versions
          .filter((version) => version.page_id === page.id)
          .map((version) => ({
            id: version.id,
            versionNumber: version.version_number,
            status: version.status,
            createdAt: version.created_at,
            publishedAt: version.published_at,
          })),
        blocks: blocks
          .filter((block) => block.page_version_id === draft.id)
          .map<CmsContentBlock>((block) => ({
            id: block.id,
            pageVersionId: block.page_version_id,
            type: block.block_type as CmsBlockType,
            internalName: block.internal_name,
            position: block.position,
            visible: block.visible,
            data: toRecord(block.data),
          })),
      },
    ];
  });

  return {
    userId: session.user.id,
    userEmail: session.user.email ?? "",
    role: admin.role,
    pages,
    media: mediaResult.data ?? [],
    registrations: registrationResult.data ?? [],
    enquiries: enquiryResult.data ?? [],
    invitations,
  };
}

export async function saveCmsDraft(page: CmsAdminPage) {
  const inputBlocks = page.blocks.map((block) => ({
    blockType: block.type,
    internalName: block.internalName,
    visible: block.visible,
    data: block.data,
  }));
  const { error } = await supabase.rpc("save_cms_draft", {
    target_version_id: page.versionId,
    input_page_title: page.pageTitle,
    input_meta_title: page.metaTitle,
    input_meta_description: page.metaDescription,
    input_blocks: inputBlocks as Json,
  });
  if (error) throw error;
}

export async function publishCmsPage(pageId: string) {
  const { error } = await supabase.rpc("publish_cms_page", { target_page_id: pageId });
  if (error) throw error;
}

export async function restoreCmsPageVersion(pageId: string, versionId: string) {
  const { error } = await supabase.rpc("restore_cms_page_version", {
    target_page_id: pageId,
    source_version_id: versionId,
  });
  if (error) throw error;
}

export async function createCmsPage(slug: string, internalName: string, pageTitle: string) {
  const { error } = await supabase.rpc("create_cms_page", {
    input_slug: slug,
    input_internal_name: internalName,
    input_page_title: pageTitle,
  });
  if (error) throw error;
}

export async function setCmsAdminInvitation(email: string, role: CmsAdminRole) {
  const { error } = await supabase.rpc("set_cms_admin_invitation", {
    input_email: email,
    input_role: role,
  });
  if (error) throw error;
}

export async function updateRegistration(
  table: "interest_registrations" | "contact_enquiries",
  id: string,
  workflowStatus: string,
  internalNotes: string,
) {
  const { error } = await supabase
    .from(table)
    .update({ workflow_status: workflowStatus, internal_notes: internalNotes })
    .eq("id", id);
  if (error) throw error;
}

export async function uploadCmsMedia(
  file: File,
  metadata: {
    title: string;
    altText: string;
    caption: string;
    rightsHolder: string;
    rightsNote: string;
    focalX: number;
    focalY: number;
  },
) {
  const session = await getCmsSession();
  if (!session?.user) throw new Error("CMS login required.");
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
  const storagePath = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}-${cleanName}`;
  const { error: uploadError } = await supabase.storage
    .from("cms-media")
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from("cms-media").getPublicUrl(storagePath);
  const { error: metadataError } = await supabase.from("cms_media_assets").insert({
    storage_path: storagePath,
    public_url: publicData.publicUrl,
    file_name: file.name,
    mime_type: file.type || "application/octet-stream",
    title: metadata.title,
    alt_text: metadata.altText,
    caption: metadata.caption,
    rights_holder: metadata.rightsHolder,
    rights_note: metadata.rightsNote,
    focal_x: metadata.focalX / 100,
    focal_y: metadata.focalY / 100,
    uploaded_by: session.user.id,
  });
  if (metadataError) throw metadataError;
}
