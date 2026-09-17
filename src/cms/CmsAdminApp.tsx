import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isefsLogoUrl } from "@/content/assets";
import type { Json, Tables } from "@/integrations/supabase/types";

import {
  loadCmsAdminSnapshot,
  setCmsAdminInvitation,
  signOutCms,
  updateRegistration,
  uploadCmsMedia,
  type CmsAdminSnapshot,
} from "./admin-api";
import { CmsPageWorkspace, type CmsWorkspaceView } from "./CmsPageWorkspace";

type AdminView = CmsWorkspaceView;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

function MediaManager({
  snapshot,
  reload,
  demo,
}: {
  snapshot: CmsAdminSnapshot;
  reload: () => Promise<void>;
  demo: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    altText: "",
    caption: "",
    rightsHolder: "",
    rightsNote: "",
    focalX: 50,
    focalY: 50,
  });
  const [message, setMessage] = useState("");
  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    if (!metadata.altText.trim()) {
      setMessage("Alternative text is required for accessibility.");
      return;
    }
    try {
      if (!demo) await uploadCmsMedia(file, metadata);
      setMessage(demo ? "Upload is disabled in demo mode." : "Media uploaded.");
      if (!demo) await reload();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Upload failed.");
    }
  }
  return (
    <div className="p-6 lg:p-10">
      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={upload} className="h-fit rounded-sm border border-rule bg-background p-6">
          <p className="eyebrow">Media library</p>
          <h2 className="mt-3 text-2xl">Upload an image or document</h2>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="media-file">File</Label>
              <Input
                id="media-file"
                type="file"
                className="mt-2 h-12 py-2"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <Label htmlFor="media-title">Title</Label>
              <Input
                id="media-title"
                className="mt-2 h-11"
                value={metadata.title}
                onChange={(event) => setMetadata({ ...metadata, title: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="media-alt">Alternative text</Label>
              <Input
                id="media-alt"
                required
                className="mt-2 h-11"
                value={metadata.altText}
                onChange={(event) => setMetadata({ ...metadata, altText: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="media-caption">Caption</Label>
              <Input
                id="media-caption"
                className="mt-2 h-11"
                value={metadata.caption}
                onChange={(event) => setMetadata({ ...metadata, caption: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="media-rights">Rights holder</Label>
              <Input
                id="media-rights"
                className="mt-2 h-11"
                value={metadata.rightsHolder}
                onChange={(event) => setMetadata({ ...metadata, rightsHolder: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="media-rights-note">Rights note</Label>
              <Textarea
                id="media-rights-note"
                className="mt-2"
                value={metadata.rightsNote}
                onChange={(event) => setMetadata({ ...metadata, rightsNote: event.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="media-focus-x">Horizontal focus (%)</Label>
                <Input
                  id="media-focus-x"
                  type="number"
                  min="0"
                  max="100"
                  className="mt-2 h-11"
                  value={metadata.focalX}
                  onChange={(event) =>
                    setMetadata({ ...metadata, focalX: Number(event.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="media-focus-y">Vertical focus (%)</Label>
                <Input
                  id="media-focus-y"
                  type="number"
                  min="0"
                  max="100"
                  className="mt-2 h-11"
                  value={metadata.focalY}
                  onChange={(event) =>
                    setMetadata({ ...metadata, focalY: Number(event.target.value) })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              The focus point keeps the important part of an image visible when it is cropped.
            </p>
            <button className="btn-primary w-full" type="submit">
              <Upload className="h-4 w-4" /> Upload
            </button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </form>
        <div>
          <h2 className="text-2xl">Available media</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Copy a public URL into any image, gallery or carousel field.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {snapshot.media.map((asset) => (
              <article
                key={asset.id}
                className="overflow-hidden rounded-sm border border-rule bg-background"
              >
                {asset.mime_type.startsWith("image/") ? (
                  <img
                    src={asset.public_url}
                    alt={asset.alt_text}
                    className="aspect-[4/3] w-full object-cover"
                    style={{ objectPosition: `${asset.focal_x * 100}% ${asset.focal_y * 100}%` }}
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-surface">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold text-foreground">{asset.title || asset.file_name}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {asset.rights_holder || "Rights holder not recorded"}
                  </p>
                  <button
                    type="button"
                    className="mt-4 link-inline text-sm"
                    onClick={() => navigator.clipboard.writeText(asset.public_url)}
                  >
                    Copy URL
                  </button>
                </div>
              </article>
            ))}
            {snapshot.media.length === 0 ? (
              <p className="text-sm text-muted-foreground">No media has been uploaded yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxManager<T extends Tables<"interest_registrations"> | Tables<"contact_enquiries">>({
  title,
  records,
  table,
  statuses,
  reload,
  demo,
}: {
  title: string;
  records: T[];
  table: "interest_registrations" | "contact_enquiries";
  statuses: string[];
  reload: () => Promise<void>;
  demo: boolean;
}) {
  const [message, setMessage] = useState("");
  async function save(record: T, status: string, notes: string) {
    try {
      if (!demo) await updateRegistration(table, record.id, status, notes);
      setMessage(demo ? "Updates are disabled in demo mode." : "Record updated.");
      if (!demo) await reload();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Update failed.");
    }
  }
  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Management office</p>
          <h2 className="mt-3 text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{records.length} records</p>
        </div>
        {message ? <p className="rounded-sm bg-highlight px-4 py-2 text-sm">{message}</p> : null}
      </div>
      <div className="mt-8 space-y-4">
        {records.map((record) => (
          <InboxRecord key={record.id} record={record} statuses={statuses} onSave={save} />
        ))}
        {records.length === 0 ? (
          <div className="rounded-sm border border-rule bg-background p-8 text-sm text-muted-foreground">
            No records yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InboxRecord<T extends Tables<"interest_registrations"> | Tables<"contact_enquiries">>({
  record,
  statuses,
  onSave,
}: {
  record: T;
  statuses: string[];
  onSave: (record: T, status: string, notes: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(record.workflow_status);
  const [notes, setNotes] = useState(record.internal_notes);
  const isInterest = "first_name" in record;
  return (
    <article className="rounded-sm border border-rule bg-background p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_180px_1fr_auto] lg:items-start">
        <div>
          <p className="font-semibold text-foreground">
            {isInterest ? `${record.first_name} ${record.last_name}` : record.name}
          </p>
          <a className="mt-1 block text-sm" href={`mailto:${record.email}`}>
            {record.email}
          </a>
          <p className="mt-2 text-xs text-muted-foreground">{formatDate(record.created_at)}</p>
          {isInterest ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {record.specialty} · {record.country}
              {record.institution ? ` · ${record.institution}` : ""}
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm font-semibold">{record.subject}</p>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {record.message}
              </p>
            </>
          )}
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Internal notes</Label>
          <Textarea
            className="mt-2"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn-secondary min-h-11 px-4 text-sm lg:mt-7"
          onClick={() => onSave(record, status, notes)}
        >
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    </article>
  );
}

function AccessManager({
  snapshot,
  reload,
  demo,
}: {
  snapshot: CmsAdminSnapshot;
  reload: () => Promise<void>;
  demo: boolean;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "editor">("editor");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function authorise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (!demo) {
        await setCmsAdminInvitation(email, role);
        await reload();
      }
      setMessage(
        demo
          ? "Authorisation is disabled in demo mode."
          : "Email address authorised. The user can now activate an account at /admin/register.",
      );
      if (!demo) setEmail("");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Access could not be authorised.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={authorise}
          className="h-fit rounded-sm border border-rule bg-background p-6"
        >
          <p className="eyebrow">Owner controls</p>
          <h2 className="mt-3 text-2xl">Authorise CMS access</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Add the person’s email address and role. They then set their own password at the
            protected activation page.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <Label htmlFor="access-email">Email address</Label>
              <Input
                id="access-email"
                type="email"
                required
                className="mt-2 h-11"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="access-role">Role</Label>
              <select
                id="access-role"
                className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm"
                value={role}
                onChange={(event) => setRole(event.target.value as "owner" | "editor")}
              >
                <option value="editor">Editor — manage content and submissions</option>
                <option value="owner">Owner — includes access management</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              <ShieldCheck className="h-4 w-4" />
              {busy ? "Authorising…" : "Authorise email"}
            </button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </form>

        <div>
          <h2 className="text-2xl">Authorised accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each person uses an individual account. Passwords are never shared with or visible to
            ISEFS.
          </p>
          <div className="mt-6 overflow-hidden rounded-sm border border-rule bg-background">
            {snapshot.invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="grid gap-3 border-b border-rule p-5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-foreground">{invitation.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {invitation.accepted_at
                      ? `Activated ${formatDate(invitation.accepted_at)}`
                      : "Awaiting activation"}
                  </p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold capitalize text-foreground">
                  {invitation.role}
                </span>
                <span
                  className={`text-xs font-semibold ${invitation.active ? "text-accent" : "text-muted-foreground"}`}
                >
                  {invitation.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
            {snapshot.invitations.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No authorised accounts have been added.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({
  snapshot,
  setView,
}: {
  snapshot: CmsAdminSnapshot;
  setView: (view: AdminView) => void;
}) {
  const newRegistrations = snapshot.registrations.filter(
    (item) => item.workflow_status === "new",
  ).length;
  const newEnquiries = snapshot.enquiries.filter((item) => item.workflow_status === "new").length;
  const cards = [
    {
      label: "Managed pages",
      value: snapshot.pages.length,
      view: "pages" as const,
      icon: FileText,
    },
    { label: "Media assets", value: snapshot.media.length, view: "media" as const, icon: Image },
    {
      label: "New registrations",
      value: newRegistrations,
      view: "registrations" as const,
      icon: Users,
    },
    { label: "New enquiries", value: newEnquiries, view: "enquiries" as const, icon: Inbox },
  ];
  return (
    <div className="p-6 lg:p-10">
      <p className="eyebrow">Management office</p>
      <h1 className="mt-3 text-4xl">ISEFS administration</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        Manage the public website, media, interest registrations and contact enquiries from one
        protected workspace.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setView(card.view)}
            className="rounded-sm border border-rule bg-background p-6 text-left hover:border-primary"
          >
            <card.icon className="h-6 w-6 text-accent" />
            <p className="mt-6 text-3xl font-semibold text-ink">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </button>
        ))}
      </div>
      <div className="mt-10 rounded-sm border border-rule bg-background p-6">
        <h2 className="text-2xl">Publishing workflow</h2>
        <ol className="mt-5 grid gap-5 text-sm text-muted-foreground md:grid-cols-3">
          <li>
            <span className="eyebrow">1 · Edit</span>
            <p className="mt-2">Change text, images, links and content blocks in the draft.</p>
          </li>
          <li>
            <span className="eyebrow">2 · Preview</span>
            <p className="mt-2">Review the draft in the actual ISEFS layout on the right.</p>
          </li>
          <li>
            <span className="eyebrow">3 · Publish</span>
            <p className="mt-2">
              Publish deliberately. The previous public version remains in history.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}

export function CmsAdminApp({
  demo = false,
  initialSnapshot,
}: {
  demo?: boolean;
  initialSnapshot?: CmsAdminSnapshot;
}) {
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<CmsAdminSnapshot | null>(initialSnapshot ?? null);
  const [view, setView] = useState<AdminView>("dashboard");
  const [selectedPageId, setSelectedPageId] = useState(initialSnapshot?.pages[0]?.pageId ?? "");
  const [loading, setLoading] = useState(!initialSnapshot);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError("");
    try {
      const next = await loadCmsAdminSnapshot();
      setSnapshot(next);
      setSelectedPageId((current) => current || next.pages[0]?.pageId || "");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not load the CMS.";
      if (/login required|session/i.test(message)) await navigate({ to: "/admin/login" });
      else setError(message);
    } finally {
      setLoading(false);
    }
  }, [demo, navigate]);

  useEffect(() => {
    if (!initialSnapshot) void reload();
  }, [initialSnapshot, reload]);

  const selectedPage = useMemo(
    () => snapshot?.pages.find((page) => page.pageId === selectedPageId) ?? snapshot?.pages[0],
    [snapshot, selectedPageId],
  );

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading ISEFS administration…</p>
        </div>
      </div>
    );
  if (!snapshot)
    return (
      <div className="grid min-h-screen place-items-center bg-surface p-6">
        <div className="max-w-lg rounded-sm border border-rule bg-background p-8">
          <h1 className="text-2xl">CMS unavailable</h1>
          <p className="mt-4 text-sm text-destructive">{error}</p>
          <button type="button" className="btn-secondary mt-6" onClick={reload}>
            Try again
          </button>
        </div>
      </div>
    );

  const nav = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "pages" as const, label: "Pages", icon: FileText },
    { id: "media" as const, label: "Media", icon: Image },
    { id: "registrations" as const, label: "Registrations", icon: Users },
    { id: "enquiries" as const, label: "Enquiries", icon: Inbox },
    ...(snapshot.role === "owner"
      ? [{ id: "access" as const, label: "Access", icon: ShieldCheck }]
      : []),
  ];

  if (view === "pages" && selectedPage) {
    return (
      <CmsPageWorkspace
        key={`${selectedPage.pageId}-${selectedPage.versionId}`}
        source={selectedPage}
        pages={snapshot.pages}
        media={snapshot.media}
        userEmail={snapshot.userEmail}
        owner={snapshot.role === "owner"}
        demo={demo}
        onReload={reload}
        onSelectPage={setSelectedPageId}
        onChangeView={setView}
        onSignOut={async () => {
          if (!demo) await signOutCms();
          await navigate({ to: "/admin/login" });
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 border-r border-rule bg-primary text-primary-foreground lg:flex lg:flex-col">
        <div className="border-b border-white/15 p-6">
          <img src={isefsLogoUrl} alt="ISEFS" className="h-auto w-full rounded-sm bg-white p-3" />
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/60">
            Content management
          </p>
        </div>
        <nav className="flex-1 p-3">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm ${view === item.id ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/15 p-4">
          <p className="truncate px-2 text-xs text-white/60">{snapshot.userEmail}</p>
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            onClick={async () => {
              if (!demo) await signOutCms();
              await navigate({ to: "/admin/login" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-rule bg-background px-4 lg:px-6">
          <nav className="flex gap-1 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`rounded-sm px-3 py-2 text-sm ${view === item.id ? "bg-primary text-white" : "text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          {demo ? (
            <span className="rounded-sm bg-highlight px-3 py-1 text-xs font-semibold text-primary">
              Local design preview
            </span>
          ) : null}
          <a href="/" target="_blank" rel="noreferrer" className="link-inline text-sm">
            View website
          </a>
        </header>

        {error ? (
          <div className="border-b border-destructive/30 bg-destructive/5 px-6 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {view === "dashboard" ? <Dashboard snapshot={snapshot} setView={setView} /> : null}
        {view === "media" ? <MediaManager snapshot={snapshot} reload={reload} demo={demo} /> : null}
        {view === "registrations" ? (
          <InboxManager
            title="Interest registrations"
            records={snapshot.registrations}
            table="interest_registrations"
            statuses={["new", "reviewing", "contacted", "closed"]}
            reload={reload}
            demo={demo}
          />
        ) : null}
        {view === "enquiries" ? (
          <InboxManager
            title="Contact enquiries"
            records={snapshot.enquiries}
            table="contact_enquiries"
            statuses={["new", "reviewing", "answered", "closed"]}
            reload={reload}
            demo={demo}
          />
        ) : null}
        {view === "access" && snapshot.role === "owner" ? (
          <AccessManager snapshot={snapshot} reload={reload} demo={demo} />
        ) : null}
      </div>
    </div>
  );
}
