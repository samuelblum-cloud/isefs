import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  GripVertical,
  History,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Monitor,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isefsLogoUrl } from "@/content/assets";
import type { Tables } from "@/integrations/supabase/types";

import {
  createCmsPage,
  publishCmsPage,
  restoreCmsPageVersion,
  saveCmsDraft,
  type CmsAdminPage,
} from "./admin-api";
import {
  cmsBlockDefinitionMap,
  cmsBlockDefinitions,
  cloneDefaultBlockData,
} from "./block-definitions";
import { CmsFieldEditor } from "./CmsFieldEditor";
import { CmsPageRenderer } from "./CmsPageRenderer";
import type { CmsBlockType, CmsContentBlock } from "./types";

export type CmsWorkspaceView =
  "dashboard" | "pages" | "media" | "registrations" | "enquiries" | "access";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

function blockSummary(block: CmsContentBlock) {
  for (const key of ["title", "lead", "body", "intro", "role", "statusMessage"]) {
    const value = block.data[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return cmsBlockDefinitionMap[block.type].description;
}

const toolNavigation = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "pages" as const, label: "Pages", icon: FileText },
  { id: "media" as const, label: "Media", icon: Image },
  { id: "registrations" as const, label: "Registrations", icon: Users },
  { id: "enquiries" as const, label: "Enquiries", icon: Inbox },
  { id: "access" as const, label: "Access", icon: ShieldCheck, ownerOnly: true },
];

export function CmsPageWorkspace({
  source,
  pages,
  media,
  userEmail,
  owner,
  demo,
  onReload,
  onSelectPage,
  onChangeView,
  onSignOut,
}: {
  source: CmsAdminPage;
  pages: CmsAdminPage[];
  media: Tables<"cms_media_assets">[];
  userEmail: string;
  owner: boolean;
  demo: boolean;
  onReload: () => Promise<void>;
  onSelectPage: (pageId: string) => void;
  onChangeView: (view: CmsWorkspaceView) => void;
  onSignOut: () => Promise<void>;
}) {
  const [page, setPage] = useState(() => clone(source));
  const [selectedBlockId, setSelectedBlockId] = useState(source.blocks[0]?.id ?? "");
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState("");
  const [newPage, setNewPage] = useState({ slug: "", internalName: "", title: "" });

  useEffect(() => {
    setPage(clone(source));
    setSelectedBlockId(source.blocks[0]?.id ?? "");
    setDirty(false);
    setMessage("");
  }, [source]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const selectedBlock = page.blocks.find((block) => block.id === selectedBlockId);
  const selectedBlockIndex = page.blocks.findIndex((block) => block.id === selectedBlockId);
  const filteredPages = useMemo(() => {
    const query = pageSearch.trim().toLowerCase();
    return query
      ? pages.filter(
          (candidate) =>
            candidate.internalName.toLowerCase().includes(query) ||
            candidate.slug.toLowerCase().includes(query),
        )
      : pages;
  }, [pageSearch, pages]);

  function replacePage(next: CmsAdminPage) {
    setPage(next);
    setDirty(true);
    setMessage("");
  }

  function updateBlock(next: CmsContentBlock) {
    replacePage({
      ...page,
      blocks: page.blocks.map((block) => (block.id === next.id ? next : block)),
    });
  }

  function addBlock(type: CmsBlockType) {
    const definition = cmsBlockDefinitionMap[type];
    const block: CmsContentBlock = {
      id: crypto.randomUUID(),
      pageVersionId: page.versionId,
      type,
      internalName: definition.label,
      position: page.blocks.length,
      visible: true,
      data: cloneDefaultBlockData(type),
    };
    replacePage({ ...page, blocks: [...page.blocks, block] });
    setSelectedBlockId(block.id);
    setAddOpen(false);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= page.blocks.length) return;
    const blocks = clone(page.blocks);
    [blocks[index], blocks[target]] = [blocks[target]!, blocks[index]!];
    replacePage({
      ...page,
      blocks: blocks.map((block, position) => ({ ...block, position })),
    });
  }

  function duplicateBlock(block: CmsContentBlock) {
    const duplicate = {
      ...clone(block),
      id: crypto.randomUUID(),
      internalName: `${block.internalName} copy`,
      position: page.blocks.length,
    };
    replacePage({ ...page, blocks: [...page.blocks, duplicate] });
    setSelectedBlockId(duplicate.id);
  }

  function dropBlock(targetId: string) {
    if (!draggedBlockId || draggedBlockId === targetId) return;
    const blocks = clone(page.blocks);
    const sourceIndex = blocks.findIndex((block) => block.id === draggedBlockId);
    const targetIndex = blocks.findIndex((block) => block.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = blocks.splice(sourceIndex, 1);
    if (!moved) return;
    blocks.splice(targetIndex, 0, moved);
    replacePage({
      ...page,
      blocks: blocks.map((block, position) => ({ ...block, position })),
    });
    setDraggedBlockId("");
  }

  function confirmDiscard() {
    return !dirty || window.confirm("Leave this page without saving the current draft changes?");
  }

  async function save() {
    setBusy("save");
    setMessage("");
    try {
      if (!demo) await saveCmsDraft(page);
      setDirty(false);
      setMessage(demo ? "Demo draft updated locally." : "Draft saved.");
      if (!demo) await onReload();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not save the draft.");
    } finally {
      setBusy("");
    }
  }

  async function publish() {
    if (
      !window.confirm(
        "Publish this draft to the public website? The current published version will remain in history.",
      )
    )
      return;
    setBusy("publish");
    setMessage("");
    try {
      if (!demo) {
        await saveCmsDraft(page);
        await publishCmsPage(page.pageId);
        await onReload();
      }
      setDirty(false);
      setMessage(
        demo ? "Publishing is disabled in demo mode." : "Page published and a new draft created.",
      );
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not publish the page.");
    } finally {
      setBusy("");
    }
  }

  async function restoreVersion(versionId: string, versionNumber: number) {
    if (
      !window.confirm(
        `Restore version ${versionNumber} as a new draft? Your current draft will be replaced.`,
      )
    )
      return;
    setBusy(`restore-${versionId}`);
    setMessage("");
    try {
      if (!demo) {
        await restoreCmsPageVersion(page.pageId, versionId);
        await onReload();
      }
      setDirty(false);
      setMessage(
        demo
          ? "Restoring is disabled in demo mode."
          : `Version ${versionNumber} restored as a new draft.`,
      );
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not restore this version.");
    } finally {
      setBusy("");
    }
  }

  async function createPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("create-page");
    setMessage("");
    try {
      if (!demo) await createCmsPage(newPage.slug, newPage.internalName, newPage.title);
      setCreateOpen(false);
      setNewPage({ slug: "", internalName: "", title: "" });
      setMessage(demo ? "Page creation is disabled in demo mode." : "Page draft created.");
      if (!demo) await onReload();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not create the page.");
    } finally {
      setBusy("");
    }
  }

  const previewDocument = { ...page, status: "draft" as const };

  return (
    <main className="min-h-screen bg-[#edf2f4] text-foreground">
      <header className="flex min-h-[72px] items-center border-b border-[#d7e0e3] bg-white px-4 shadow-[0_1px_0_rgba(5,38,54,0.03)] lg:px-5">
        <div className="hidden w-[294px] items-center gap-4 lg:flex">
          <img src={isefsLogoUrl} alt="ISEFS" className="h-10 w-auto" />
          <span className="rounded-full bg-[#e4f4f2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#187b7d]">
            CMS
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Website</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="truncate font-semibold text-foreground">{page.internalName}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold">
                {preview ? "Preview page" : "Edit page"}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${dirty ? "bg-[#fff2d7] text-[#8d6413]" : "bg-[#e4f4f2] text-[#187b7d]"}`}
              >
                {dirty ? "Unpublished changes" : "Draft saved"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary min-h-10 px-3 text-sm"
              onClick={() => setPreview((current) => !current)}
            >
              {preview ? <FileText className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              className="btn-secondary min-h-10 px-3 text-sm"
              onClick={save}
              disabled={Boolean(busy)}
            >
              <Save className="h-4 w-4" /> {busy === "save" ? "Saving…" : "Save draft"}
            </button>
            {owner ? (
              <button
                type="button"
                className="btn-primary min-h-10 px-4 text-sm"
                onClick={publish}
                disabled={Boolean(busy)}
              >
                <Send className="h-4 w-4" /> {busy === "publish" ? "Publishing…" : "Publish"}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {message ? (
        <div className="border-b border-[#cfe1e2] bg-[#ebf6f5] px-5 py-2 text-sm text-[#285c6b]">
          {message}
        </div>
      ) : null}

      <div
        className={`grid overflow-hidden ${message ? "h-[calc(100vh-109px)]" : "h-[calc(100vh-72px)]"} lg:grid-cols-[64px_230px_minmax(370px,0.95fr)_minmax(360px,1.05fr)]`}
      >
        <aside className="hidden flex-col items-center bg-[#082f44] py-4 text-white lg:flex">
          <nav className="flex flex-1 flex-col gap-2">
            {toolNavigation
              .filter((item) => !item.ownerOnly || owner)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  onClick={() => {
                    if (confirmDiscard()) onChangeView(item.id);
                  }}
                  className={`grid h-11 w-11 place-items-center rounded-md ${item.id === "pages" ? "bg-white text-[#082f44]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
                >
                  <item.icon className="h-[19px] w-[19px]" />
                </button>
              ))}
          </nav>
          <button
            type="button"
            title="Sign out"
            className="grid h-11 w-11 place-items-center rounded-md text-white/65 hover:bg-white/10 hover:text-white"
            onClick={() => {
              if (confirmDiscard()) void onSignOut();
            }}
          >
            <LogOut className="h-5 w-5" />
          </button>
          <div
            className="mt-3 grid h-9 w-9 place-items-center rounded-full bg-[#2c8b8d] text-xs font-bold"
            title={userEmail}
          >
            {userEmail
              .split(/[.@_-]/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("")}
          </div>
        </aside>

        <aside className="hidden overflow-x-hidden overflow-y-auto border-r border-[#d7e0e3] bg-[#f7f9fa] lg:block">
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
                aria-label="Create a page"
                className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
                onClick={() => setCreateOpen((current) => !current)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-md border border-[#d7e0e3] bg-white pl-9 pr-3 text-sm"
                placeholder="Find a page"
                value={pageSearch}
                onChange={(event) => setPageSearch(event.target.value)}
              />
            </div>
          </div>

          {createOpen ? (
            <form
              onSubmit={createPage}
              className="space-y-3 border-b border-[#d7e0e3] bg-white p-4"
            >
              <p className="text-sm font-semibold">Create a page draft</p>
              <Input
                required
                placeholder="URL slug"
                value={newPage.slug}
                onChange={(event) =>
                  setNewPage({
                    ...newPage,
                    slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                  })
                }
              />
              <Input
                required
                placeholder="Internal name"
                value={newPage.internalName}
                onChange={(event) => setNewPage({ ...newPage, internalName: event.target.value })}
              />
              <Input
                required
                placeholder="Page title"
                value={newPage.title}
                onChange={(event) => setNewPage({ ...newPage, title: event.target.value })}
              />
              <button type="submit" className="btn-primary w-full text-sm" disabled={Boolean(busy)}>
                {busy === "create-page" ? "Creating…" : "Create draft"}
              </button>
            </form>
          ) : null}

          <div className="p-3">
            {filteredPages.map((candidate) => (
              <button
                key={candidate.pageId}
                type="button"
                onClick={() => {
                  if (candidate.pageId !== page.pageId && confirmDiscard()) {
                    onSelectPage(candidate.pageId);
                  }
                }}
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm ${candidate.pageId === page.pageId ? "bg-[#dff0ef] font-semibold text-[#075c62]" : "text-[#365260] hover:bg-white"} ${candidate.slug !== "home" ? "ml-4 w-[calc(100%-1rem)]" : ""}`}
              >
                {candidate.slug === "home" ? <ChevronDown className="h-4 w-4" /> : null}
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{candidate.internalName}</span>
              </button>
            ))}
          </div>
        </aside>

        {preview ? (
          <section className="col-span-1 overflow-y-auto bg-white lg:col-span-2">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d7e0e3] bg-white px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2c8b8d]">
                  Draft preview
                </p>
                <h2 className="mt-1 text-xl font-semibold">{page.pageTitle}</h2>
              </div>
              <a
                href={page.slug === "home" ? "/" : `/${page.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary min-h-10 px-3 text-sm"
              >
                <ExternalLink className="h-4 w-4" /> Open published page
              </a>
            </div>
            <CmsPageRenderer page={previewDocument} />
          </section>
        ) : (
          <>
            <section className="overflow-y-auto border-r border-[#d7e0e3] bg-white">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d7e0e3] bg-white px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2c8b8d]">
                    /{page.slug === "home" ? "" : page.slug}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{page.pageTitle}</h2>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {page.blocks.length} elements
                </span>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">Content elements</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Drag to reorder. Select an element to edit it.
                  </p>
                </div>

                <div className="space-y-3">
                  {page.blocks.map((block) => {
                    const selected = block.id === selectedBlockId;
                    return (
                      <button
                        key={block.id}
                        type="button"
                        draggable
                        onDragStart={() => setDraggedBlockId(block.id)}
                        onDragEnd={() => setDraggedBlockId("")}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => dropBlock(block.id)}
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`group flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${selected ? "border-[#2c8b8d] bg-[#f0f9f8] shadow-[0_0_0_1px_#2c8b8d]" : "border-[#d7e0e3] bg-white hover:border-[#9fb5bd]"}`}
                      >
                        <GripVertical className="mt-1 h-5 w-5 shrink-0 cursor-grab text-[#9aaeb5]" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold">{block.internalName}</p>
                            <span className="shrink-0 rounded-full bg-[#e9eef0] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#526d79]">
                              {cmsBlockDefinitionMap[block.type].label}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {blockSummary(block)}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#2b787c]">
                            {block.visible ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" /> Visible
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" /> Hidden
                              </>
                            )}
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
                  onClick={() => setAddOpen((current) => !current)}
                >
                  <Plus className="h-4 w-4" /> Add content element
                </button>
                {addOpen ? (
                  <div className="mt-3 grid gap-2 rounded-lg border border-[#d7e0e3] bg-[#f7f9fa] p-3 sm:grid-cols-2">
                    {cmsBlockDefinitions.map((definition) => (
                      <button
                        key={definition.type}
                        type="button"
                        className="rounded-md border border-[#d7e0e3] bg-white p-3 text-left hover:border-[#2c8b8d]"
                        onClick={() => addBlock(definition.type)}
                      >
                        <span className="block text-sm font-semibold">{definition.label}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {definition.description}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <aside className="overflow-y-auto bg-[#f7f9fa]">
              {selectedBlock ? (
                <>
                  <div className="sticky top-0 z-10 border-b border-[#d7e0e3] bg-[#f7f9fa] px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2c8b8d]">
                          Edit content element
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">{selectedBlock.internalName}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {cmsBlockDefinitionMap[selectedBlock.type].label}
                        </p>
                      </div>
                      <button
                        type="button"
                        title="Duplicate element"
                        className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
                        onClick={() => duplicateBlock(selectedBlock)}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 p-6">
                    <div className="rounded-md border border-[#cfe1e2] bg-[#ebf6f5] p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2c8b8d]" />
                        <div>
                          <p className="text-sm font-semibold">
                            {dirty ? "Changes not yet saved" : "Draft saved"}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            Publishing remains a separate, deliberate step.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="block-name">Internal element name</Label>
                      <Input
                        id="block-name"
                        className="mt-2 h-11 bg-white"
                        value={selectedBlock.internalName}
                        onChange={(event) =>
                          updateBlock({ ...selectedBlock, internalName: event.target.value })
                        }
                      />
                    </div>

                    <CmsFieldEditor
                      fields={cmsBlockDefinitionMap[selectedBlock.type].fields}
                      value={selectedBlock.data}
                      onChange={(data) => updateBlock({ ...selectedBlock, data })}
                      media={media}
                    />

                    <div className="rounded-md border border-[#d7e0e3] bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Visibility</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Shown on the public page
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedBlock.visible}
                          onChange={(event) =>
                            updateBlock({ ...selectedBlock, visible: event.target.checked })
                          }
                          className="h-4 w-4 accent-[hsl(var(--accent))]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#d7e0e3] pt-5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
                          title="Move element up"
                          onClick={() => moveBlock(selectedBlockIndex, -1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="grid h-9 w-9 place-items-center rounded-md border border-[#d7e0e3] bg-white"
                          title="Move element down"
                          onClick={() => moveBlock(selectedBlockIndex, 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                      <a
                        href={page.slug === "home" ? "/" : `/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
                      >
                        <ExternalLink className="h-4 w-4" /> Published page
                      </a>
                    </div>

                    <details className="rounded-md border border-[#d7e0e3] bg-white p-4">
                      <summary className="cursor-pointer text-sm font-semibold">
                        Page settings
                      </summary>
                      <div className="mt-5 space-y-4">
                        <div>
                          <Label htmlFor="page-title">Internal page title</Label>
                          <Input
                            id="page-title"
                            className="mt-2 h-11"
                            value={page.pageTitle}
                            onChange={(event) =>
                              replacePage({ ...page, pageTitle: event.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta-title">Browser and search title</Label>
                          <Input
                            id="meta-title"
                            className="mt-2 h-11"
                            value={page.metaTitle}
                            onChange={(event) =>
                              replacePage({ ...page, metaTitle: event.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta-description">Search description</Label>
                          <Textarea
                            id="meta-description"
                            className="mt-2"
                            value={page.metaDescription}
                            onChange={(event) =>
                              replacePage({ ...page, metaDescription: event.target.value })
                            }
                          />
                        </div>
                      </div>
                    </details>

                    <details className="rounded-md border border-[#d7e0e3] bg-white p-4">
                      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                        <History className="h-4 w-4" /> Version history
                      </summary>
                      <div className="mt-4 space-y-3">
                        {page.versions.map((version) => (
                          <div
                            key={version.id}
                            className="flex items-center justify-between gap-3 border-t border-[#d7e0e3] pt-3 text-xs"
                          >
                            <div>
                              <p className="font-semibold capitalize">
                                Version {version.versionNumber} · {version.status}
                              </p>
                              <p className="mt-1 text-muted-foreground">
                                {formatDate(version.publishedAt ?? version.createdAt)}
                              </p>
                            </div>
                            {version.status !== "draft" ? (
                              <button
                                type="button"
                                className="btn-secondary min-h-9 px-3 text-xs"
                                disabled={Boolean(busy)}
                                onClick={() => restoreVersion(version.id, version.versionNumber)}
                              >
                                {busy === `restore-${version.id}` ? "Restoring…" : "Restore"}
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </>
              ) : (
                <div className="p-6 text-sm text-muted-foreground">Select a content element.</div>
              )}
            </aside>
          </>
        )}
      </div>
    </main>
  );
}
