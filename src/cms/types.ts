import type { Json } from "@/integrations/supabase/types";

export type CmsBlockType =
  | "hero"
  | "page_header"
  | "split_text"
  | "card_grid"
  | "list"
  | "notice"
  | "event_feature"
  | "people_grid"
  | "management_profile"
  | "cta"
  | "form_split"
  | "rich_sections"
  | "image_text"
  | "gallery"
  | "carousel"
  | "resource_list";

export interface CmsContentBlock {
  id: string;
  pageVersionId: string;
  type: CmsBlockType;
  internalName: string;
  position: number;
  visible: boolean;
  data: Record<string, Json | undefined>;
}

export interface CmsPageDocument {
  pageId: string;
  slug: string;
  internalName: string;
  versionId: string;
  versionNumber: number;
  status: "draft" | "published" | "archived";
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string | null;
  blocks: CmsContentBlock[];
}

export interface CmsSeedBlock {
  type: CmsBlockType;
  internalName: string;
  visible?: boolean;
  data: Record<string, Json | undefined>;
}

export interface CmsSeedPage {
  slug: string;
  internalName: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  blocks: CmsSeedBlock[];
}

export type CmsFieldKind =
  "text" | "textarea" | "url" | "boolean" | "number" | "select" | "string_list" | "item_list";

export interface CmsFieldDefinition {
  key: string;
  label: string;
  kind: CmsFieldKind;
  help?: string;
  options?: Array<{ label: string; value: string }>;
  itemFields?: CmsFieldDefinition[];
  defaultValue?: Json;
}

export interface CmsBlockDefinition {
  type: CmsBlockType;
  label: string;
  description: string;
  fields: CmsFieldDefinition[];
  defaultData: Record<string, Json | undefined>;
}
