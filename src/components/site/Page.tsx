import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="border-b border-rule bg-surface">
      <div className="container-page py-16 lg:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl">{title}</h1>
        {lead ? <p className="measure mt-6 text-muted-foreground">{lead}</p> : null}
      </div>
    </header>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`container-page py-16 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3">{title}</h2>
    </div>
  );
}

export function StatusTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-rule bg-highlight px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
      {children}
    </span>
  );
}
