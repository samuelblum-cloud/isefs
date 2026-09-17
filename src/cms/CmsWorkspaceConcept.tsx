import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  GripVertical,
  History,
  Image,
  Inbox,
  LayoutDashboard,
  Monitor,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isefsLogoUrl } from "@/content/assets";

import { cmsBlockDefinitionMap } from "./block-definitions";
import { defaultCmsPages } from "./default-pages";
import type { CmsFieldDefinition, CmsSeedBlock } from "./types";

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function blockSummary(block: CmsSeedBlock) {
  const candidates = ["title", "lead", "body", "intro", "role", "statusMessage"];
  for (const key of candidates) {
    const value = block.data[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return cmsBlockDefinitionMap[block.type].description;
}

function FieldPreview({ field, block }: { field: CmsFieldDefinition; block: CmsSeedBlock }) {
  const value = block.data[field.key];

  if (field.kind === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 rounded-md border border-rule bg-surface px-4 py-3 text-sm">
        <span className="font-medium text-foreground">{field.label}</span>
        <input
          type="checkbox"
          defaultChecked={Boolean(value)}
          className="h-4 w-4 accent-[hsl(var(--accent))]"
        />
      </label>
    );
  }

  if (field.kind === "textarea") {
    return (
      <div>
        <Label>{field.label}</Label>
        <Textarea className="mt-2 min-h-28 bg-white" defaultValue={textValue(value)} />
      </div>
    );
  }

  if (field.kind === "string_list") {
    const items = Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="mt-2 space-y-2">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={`${field.key}-${index}`}
              className="flex gap-2 rounded-md border border-rule bg-white p-3"
            >
              <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-foreground">{item}</p>
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <Plus className="h-4 w-4" /> Add paragraph
          </button>
        </div>
      </div>
    );
  }

  if (field.kind === "item_list") {
    const items = Array.isArray(value) ? value : [];
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="mt-2 space-y-2">
          {items.slice(0, 3).map((item, index) => {
            const record = item && typeof item === "object" && !Array.isArray(item) ? item : {};
            const label =
              "title" in record && typeof record["title"] === "string"
                ? record["title"]
                : "name" in record && typeof record["name"] === "string"
                  ? record["name"]
                  : `Item ${index + 1}`;
            return (
              <div
                key={`${field.key}-${index}`}
                className="flex items-center gap-3 rounded-md border border-rule bg-white px-3 py-3"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>
      </div>
    );
  }

  if (field.kind === "select") {
    return (
      <div>
        <Label>{field.label}</Label>
        <select
          className="mt-2 h-11 w-full rounded-md border border-input bg-white px-3 text-sm"
          defaultValue={textValue(value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <Label>{field.label}</Label>
      <Input
        className="mt-2 h-11 bg-white"
        type={field.kind === "number" ? "number" : "text"}
        defaultValue={typeof value === "number" ? String(value) : textValue(value)}
      />
      {field.help ? <p className="mt-1 text-xs text-muted-foreground">{field.help}</p> : null}
    </div>
  );
}

const toolNavigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Pages", icon: FileText, active: true },
  { label: "Media", icon: Image },
  { label: "Registrations", icon: Users },
  { label: "Enquiries", icon: Inbox },
  { label: "Access", icon: ShieldCheck },
];

export function CmsWorkspaceConcept() {
  const [pageSlug, setPageSlug] = useState("home");
  const page = useMemo(
    () => defaultCmsPages.find((candidate) => candidate.slug === pageSlug) ?? defaultCmsPages[0]!,
    [pageSlug],
  );
  const [blockIndex, setBlockIndex] = useState(0);
  const selectedBlock = page.blocks[Math.min(blockIndex, Math.max(page.blocks.length - 1, 0))]!;
  const selectedDefinition = cmsBlockDefinitionMap[selectedBlock.type];

  function selectPage(slug: string) {
    setPageSlug(slug);
    setBlockIndex(0);
  }

  return (
    <main className="min-h-screen bg-[#edf2f4] text-foreground">
      <header className="flex h-[72px] items-center border-b border-[#d7e0e3] bg-white px-5 shadow-[0_1px_0_rgba(5,38,54,0.03)]">
        <div className="flex w-[294px] items-center gap-4">
          <img src={isefsLogoUrl} alt="ISEFS" className="h-10 w-auto" />
          <span className="rounded-full bg-[#e4f4f2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#187b7d]">
            CMS concept
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Website</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{page.internalName}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold">Edit page</h1>
              <span className="rounded-full bg-[#fff2d7] px-2 py-0.5 text-[11px] font-semibold text-[#8d6413]">
                Unpublished changes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary min-h-10 px-3 text-sm">
              <Monitor className="h-4 w-4" /> Preview
            </button>
            <button type="button" className="btn-secondary min-h-10 px-3 text-sm">
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button type="button" className="btn-primary min-h-10 px-4 text-sm">
              <Send className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>
      </header>

      <div className="grid h-[calc(100vh-72px)] grid-cols-[64px_230px_minmax(370px,0.95fr)_minmax(360px,1.05fr)] overflow-hidden">
        <aside className="flex flex-col items-center bg-[#082f44] py-4 text-white">
          <nav className="flex flex-1 flex-col gap-2">
            {toolNavigation.map((item) => (
              <button
                key={item.label}
                type="button"
                title={item.label}
                className={`grid h-11 w-11 place-items-center rounded-md ${item.active ? "bg-white text-[#082f44]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
              >
                <item.icon className="h-[19px] w-[19px]" />
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md text-white/65 hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </button>
          <div className="mt-3 grid h-9 w-9 place-items-center rounded-full bg-[#2c8b8d] text-xs font-bold">
            SB
          </div>
        </aside>

        <aside className="overflow-y-auto border-r border-[#d7e0e3] bg-[#f7f9fa]">
          <div className="sticky top-0 z-10 border-b border-[#d7e0e3] bg-[#f7f9fa] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Website
                </p>
                <h2 className="mt-1 text-base font-semibold">Page tree</h2>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-md border border-[#d7e0e3] bg-white pl-9 pr-3 text-sm"
                placeholder="Find a page"
              />
            </div>
          </div>
          <div className="p-3">
            <button
              type="button"
              onClick={() => selectPage("home")}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm ${page.slug === "home" ? "bg-[#dff0ef] font-semibold text-[#075c62]" : "hover:bg-white"}`}
            >
              <ChevronDown className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              Home
            </button>
            <div className="ml-4 mt-1 border-l border-[#ccd8dc] pl-2">
              {defaultCmsPages
                .filter((candidate) => candidate.slug !== "home")
                .map((candidate) => (
                  <button
                    key={candidate.slug}
                    type="button"
                    onClick={() => selectPage(candidate.slug)}
                    className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm ${page.slug === candidate.slug ? "bg-[#dff0ef] font-semibold text-[#075c62]" : "text-[#365260] hover:bg-white"}`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{candidate.internalName}</span>
                  </button>
                ))}
            </div>
          </div>
        </aside>

        <section className="overflow-y-auto border-r border-[#d7e0e3] bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d7e0e3] bg-white px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2c8b8d]">
                /{page.slug === "home" ? "" : page.slug}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{page.pageTitle}</h2>
            </div>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Content elements</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Drag to reorder. Select an element to edit it.
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {page.blocks.length} elements
              </span>
            </div>

            <div className="space-y-3">
              {page.blocks.map((block, index) => {
                const selected = index === blockIndex;
                const summary = blockSummary(block);
                return (
                  <button
                    key={`${page.slug}-${block.internalName}-${index}`}
                    type="button"
                    onClick={() => setBlockIndex(index)}
                    className={`group flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${selected ? "border-[#2c8b8d] bg-[#f0f9f8] shadow-[0_0_0_1px_#2c8b8d]" : "border-[#d7e0e3] bg-white hover:border-[#9fb5bd]"}`}
                  >
                    <GripVertical className="mt-1 h-5 w-5 shrink-0 text-[#9aaeB5]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold">{block.internalName}</p>
                        <span className="shrink-0 rounded-full bg-[#e9eef0] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#526d79]">
                          {cmsBlockDefinitionMap[block.type].label}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {summary}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#2b787c]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Visible
                      </div>
                    </div>
                    <ChevronRight
                      className={`mt-1 h-4 w-4 shrink-0 ${selected ? "text-[#2c8b8d]" : "text-muted-foreground"}`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#8fa9b2] bg-[#f7fafb] px-4 py-4 text-sm font-semibold text-[#285c6b] hover:bg-[#eef5f6]"
            >
              <Plus className="h-4 w-4" /> Add content element
            </button>
          </div>
        </section>

        <aside className="overflow-y-auto bg-[#f7f9fa]">
          <div className="sticky top-0 z-10 border-b border-[#d7e0e3] bg-[#f7f9fa] px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2c8b8d]">
                  Edit content element
                </p>
                <h2 className="mt-1 text-xl font-semibold">{selectedBlock.internalName}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{selectedDefinition.label}</p>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="rounded-md border border-[#cfe1e2] bg-[#ebf6f5] p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2c8b8d]" />
                <div>
                  <p className="text-sm font-semibold">Draft autosaved locally</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Publishing remains a separate, deliberate step.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label>Internal element name</Label>
              <Input className="mt-2 h-11 bg-white" defaultValue={selectedBlock.internalName} />
            </div>

            <div className="space-y-5">
              {selectedDefinition.fields.slice(0, 6).map((field) => (
                <FieldPreview
                  key={`${selectedBlock.type}-${field.key}`}
                  field={field}
                  block={selectedBlock}
                />
              ))}
            </div>

            {selectedDefinition.fields.length > 6 ? (
              <details className="rounded-md border border-[#d7e0e3] bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold">
                  Additional settings ({selectedDefinition.fields.length - 6})
                </summary>
              </details>
            ) : null}

            <div className="rounded-md border border-[#d7e0e3] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Visibility</p>
                  <p className="mt-1 text-xs text-muted-foreground">Shown on the public page</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[hsl(var(--accent))]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#d7e0e3] pt-5">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
              >
                <History className="h-4 w-4" /> Version history
              </button>
              <div className="flex gap-1 text-muted-foreground">
                <Monitor className="h-4 w-4" />
                <Smartphone className="h-4 w-4" />
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
