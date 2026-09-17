import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

import { ContactForm } from "@/components/site/ContactForm";
import { InterestForm } from "@/components/site/InterestForm";
import { PageHeader, Section, SectionTitle, StatusTag } from "@/components/site/Page";

import type { CmsContentBlock, CmsPageDocument } from "./types";

type UnknownRecord = Record<string, unknown>;

function text(data: UnknownRecord, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function flag(data: UnknownRecord, key: string) {
  return data[key] === true;
}

function records(data: UnknownRecord, key: string): UnknownRecord[] {
  const value = data[key];
  return Array.isArray(value)
    ? value.filter(
        (item): item is UnknownRecord =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

function strings(data: UnknownRecord, key: string): string[] {
  const value = data[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function safeUrl(value: string) {
  const url = value.trim();
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("#")) return url;
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : "";
}

function focalPosition(data: UnknownRecord) {
  const rawX = data["focusX"];
  const rawY = data["focusY"];
  const x =
    typeof rawX === "number" && Number.isFinite(rawX) ? Math.min(100, Math.max(0, rawX)) : 50;
  const y =
    typeof rawY === "number" && Number.isFinite(rawY) ? Math.min(100, Math.max(0, rawY)) : 50;
  return `${x}% ${y}%`;
}

function CmsLink({ url, label, button = false }: { url: string; label: string; button?: boolean }) {
  const href = safeUrl(url);
  if (!href || !label) return null;
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={button ? "btn-primary no-underline" : "link-inline"}
    >
      {label}
      {external ? (
        <ExternalLink className="h-4 w-4" aria-hidden />
      ) : (
        <ArrowRight className="h-4 w-4" aria-hidden />
      )}
    </a>
  );
}

function BlockShell({ block, children }: { block: CmsContentBlock; children: React.ReactNode }) {
  const data = block.data as UnknownRecord;
  return flag(data, "surface") ? (
    <div className="border-y border-rule bg-surface">
      <Section>{children}</Section>
    </div>
  ) : (
    <Section>{children}</Section>
  );
}

function Carousel({ data }: { data: UnknownRecord }) {
  const slides = records(data, "slides");
  const [active, setActive] = useState(0);
  if (slides.length === 0) return null;
  const safeActive = Math.min(active, slides.length - 1);
  const slide = slides[safeActive] ?? {};
  return (
    <div className="mt-10 overflow-hidden rounded-sm border border-rule bg-background">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-h-64 bg-surface">
          {text(slide, "imageUrl") ? (
            <img
              src={text(slide, "imageUrl")}
              alt={text(slide, "imageAlt")}
              className="h-full max-h-[560px] w-full object-cover"
              style={{ objectPosition: focalPosition(slide) }}
            />
          ) : (
            <div className="grid h-full min-h-64 place-items-center px-8 text-center text-sm text-muted-foreground">
              Add an image in the CMS media library.
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between p-8 sm:p-10">
          <div>
            <p className="eyebrow">
              {safeActive + 1} / {slides.length}
            </p>
            {text(slide, "title") ? <h3 className="mt-4">{text(slide, "title")}</h3> : null}
            {text(slide, "body") ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {text(slide, "body")}
              </p>
            ) : null}
            {text(slide, "caption") ? (
              <p className="mt-5 text-xs text-muted-foreground">{text(slide, "caption")}</p>
            ) : null}
            <div className="mt-6">
              <CmsLink url={text(slide, "linkUrl")} label={text(slide, "linkLabel")} />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              className="btn-secondary h-12 w-12 px-0"
              onClick={() => setActive((safeActive - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className="btn-secondary h-12 w-12 px-0"
              onClick={() => setActive((safeActive + 1) % slides.length)}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CmsBlockView({ block }: { block: CmsContentBlock }) {
  const data = block.data as UnknownRecord;

  if (block.type === "page_header") {
    return (
      <PageHeader
        eyebrow={text(data, "eyebrow")}
        title={text(data, "title")}
        lead={text(data, "lead")}
      />
    );
  }

  if (block.type === "hero") {
    return (
      <section className="border-b border-rule bg-surface">
        <div className="container-page grid gap-16 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-24">
          <div>
            {text(data, "eyebrow") ? <p className="eyebrow">{text(data, "eyebrow")}</p> : null}
            <h1 className="mt-5">{text(data, "title")}</h1>
            {text(data, "lead") ? (
              <p className="measure mt-6 text-muted-foreground">{text(data, "lead")}</p>
            ) : null}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CmsLink url={text(data, "primaryUrl")} label={text(data, "primaryLabel")} button />
              {text(data, "secondaryLabel") && safeUrl(text(data, "secondaryUrl")) ? (
                <a
                  href={safeUrl(text(data, "secondaryUrl"))}
                  className="btn-secondary no-underline"
                >
                  {text(data, "secondaryLabel")}
                </a>
              ) : null}
            </div>
            {text(data, "statusText") ? (
              <p className="mt-8 text-base text-muted-foreground">{text(data, "statusText")}</p>
            ) : null}
          </div>
          {text(data, "imageUrl") ? (
            <div className="rounded-sm border border-rule bg-background p-8 lg:p-12">
              <img
                src={text(data, "imageUrl")}
                alt={text(data, "imageAlt")}
                className="h-auto w-full"
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (block.type === "split_text") {
    return (
      <BlockShell block={block}>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
          <div className="measure space-y-5 text-base leading-relaxed text-muted-foreground">
            {strings(data, "paragraphs").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <CmsLink url={text(data, "linkUrl")} label={text(data, "linkLabel")} />
          </div>
        </div>
      </BlockShell>
    );
  }

  if (block.type === "card_grid") {
    const columns = text(data, "columns");
    const gridClass =
      columns === "4" ? "lg:grid-cols-4" : columns === "2" ? "lg:grid-cols-2" : "lg:grid-cols-3";
    return (
      <BlockShell block={block}>
        {text(data, "title") ? (
          <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        ) : null}
        {text(data, "intro") ? (
          <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
            {text(data, "intro")}
          </p>
        ) : null}
        <div
          className={`mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 ${gridClass}`}
        >
          {records(data, "items").map((item, index) => (
            <article key={index} className="bg-background p-7 sm:p-8">
              {text(item, "imageUrl") ? (
                <img
                  src={text(item, "imageUrl")}
                  alt={text(item, "imageAlt")}
                  className="mb-6 aspect-[4/3] w-full object-cover"
                  style={{ objectPosition: focalPosition(item) }}
                />
              ) : null}
              {text(item, "status") ? <StatusTag>{text(item, "status")}</StatusTag> : null}
              {text(item, "eyebrow") ? <p className="eyebrow">{text(item, "eyebrow")}</p> : null}
              <h3 className={text(item, "status") ? "mt-4" : ""}>{text(item, "title")}</h3>
              {text(item, "body") ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {text(item, "body")}
                </p>
              ) : null}
              {text(item, "detail") ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {text(item, "detail")}
                </p>
              ) : null}
              <div className="mt-5">
                <CmsLink url={text(item, "linkUrl")} label={text(item, "linkLabel")} />
              </div>
            </article>
          ))}
        </div>
        {text(data, "footer") ? (
          <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">
            {text(data, "footer")}
          </p>
        ) : null}
        <div className="mt-8">
          <CmsLink url={text(data, "linkUrl")} label={text(data, "linkLabel")} />
        </div>
      </BlockShell>
    );
  }

  if (block.type === "list") {
    return (
      <BlockShell block={block}>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
          <div>
            {text(data, "intro") ? (
              <p className="measure text-base leading-relaxed text-muted-foreground">
                {text(data, "intro")}
              </p>
            ) : null}
            <ul className="mt-6 space-y-3">
              {strings(data, "items").map((item, index) => (
                <li
                  key={index}
                  className="measure border-t border-rule pt-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
            {text(data, "footer") ? (
              <p className="measure mt-6 text-sm leading-relaxed text-muted-foreground">
                {text(data, "footer")}
              </p>
            ) : null}
          </div>
        </div>
      </BlockShell>
    );
  }

  if (block.type === "notice") {
    return (
      <BlockShell block={block}>
        <div className="rounded-sm border border-rule bg-surface p-8">
          {text(data, "status") ? <StatusTag>{text(data, "status")}</StatusTag> : null}
          {text(data, "title") ? <h2 className="mt-4">{text(data, "title")}</h2> : null}
          <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
            {text(data, "body")}
          </p>
        </div>
      </BlockShell>
    );
  }

  if (block.type === "event_feature") {
    return (
      <BlockShell block={block}>
        {text(data, "eyebrow") ? <p className="eyebrow">{text(data, "eyebrow")}</p> : null}
        <div className="mt-4 grid gap-10 rounded-sm border border-rule p-8 sm:p-12 lg:grid-cols-2">
          <div>
            {text(data, "status") ? <StatusTag>{text(data, "status")}</StatusTag> : null}
            <h2 className="mt-4">{text(data, "title")}</h2>
            <p className="measure mt-5 text-base leading-relaxed text-muted-foreground">
              {text(data, "body")}
            </p>
          </div>
          <div className="rule-top pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3>{text(data, "eventTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text(data, "meta")}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {text(data, "detail")}
            </p>
            <div className="mt-6">
              <CmsLink url={text(data, "linkUrl")} label={text(data, "linkLabel")} />
            </div>
          </div>
        </div>
      </BlockShell>
    );
  }

  if (block.type === "people_grid") {
    return (
      <BlockShell block={block}>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        {text(data, "intro") ? (
          <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
            {text(data, "intro")}
          </p>
        ) : null}
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {records(data, "people").map((person, index) => (
            <article key={index} className="bg-background p-8">
              {text(person, "imageUrl") ? (
                <img
                  src={text(person, "imageUrl")}
                  alt={text(person, "imageAlt")}
                  className="mb-6 aspect-[4/5] w-full object-cover"
                  style={{ objectPosition: focalPosition(person) }}
                />
              ) : null}
              <p className="eyebrow">{text(person, "role")}</p>
              <h3 className="mt-4">{text(person, "name")}</h3>
              {text(person, "summary") ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {text(person, "summary")}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        {text(data, "footer") ? (
          <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">
            {text(data, "footer")}
          </p>
        ) : null}
        <div className="mt-8">
          <CmsLink url={text(data, "linkUrl")} label={text(data, "linkLabel")} />
        </div>
      </BlockShell>
    );
  }

  if (block.type === "management_profile") {
    return (
      <BlockShell block={block}>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        <div className="mt-10 grid gap-8 rounded-sm border border-rule bg-background p-9 sm:p-12 lg:grid-cols-[1fr_2fr]">
          {text(data, "imageUrl") ? (
            <img
              src={text(data, "imageUrl")}
              alt={text(data, "imageAlt")}
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: focalPosition(data) }}
            />
          ) : null}
          <div>
            <p className="eyebrow">{text(data, "role")}</p>
            <p className="mt-5 text-3xl font-semibold text-ink">{text(data, "name")}</p>
            <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
              {text(data, "summary")}
            </p>
          </div>
        </div>
      </BlockShell>
    );
  }

  if (block.type === "cta") {
    return (
      <BlockShell block={block}>
        <div className="grid gap-8 rounded-sm border border-rule p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
            <p className="measure mt-5 text-base leading-relaxed text-muted-foreground">
              {text(data, "body")}
            </p>
          </div>
          <CmsLink url={text(data, "buttonUrl")} label={text(data, "buttonLabel")} button />
        </div>
      </BlockShell>
    );
  }

  if (block.type === "form_split") {
    const formType = text(data, "formType");
    return (
      <div className={flag(data, "surface") ? "border-y border-rule bg-surface" : ""}>
        <Section {...(text(data, "anchor") ? { id: text(data, "anchor") } : {})}>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
              <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">
                {text(data, "body")}
              </p>
              {text(data, "secondary") ? (
                <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">
                  {text(data, "secondary")}
                </p>
              ) : null}
            </div>
            <div className="rounded-sm border border-rule bg-background p-7 sm:p-10">
              {formType === "contact" ? <ContactForm /> : <InterestForm />}
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (block.type === "rich_sections") {
    return (
      <BlockShell block={block}>
        {text(data, "status") ? (
          <div className="mb-10 rounded-sm border border-rule bg-surface p-6">
            <StatusTag>{text(data, "status")}</StatusTag>
            <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
              {text(data, "statusMessage")}
            </p>
          </div>
        ) : null}
        <div className="measure space-y-8 text-base leading-relaxed">
          {records(data, "sections").map((section, index) => (
            <div key={index}>
              <SectionTitle title={text(section, "title")} />
              <p className="mt-4 whitespace-pre-line text-muted-foreground">
                {text(section, "body")}
              </p>
            </div>
          ))}
        </div>
      </BlockShell>
    );
  }

  if (block.type === "image_text") {
    const image = (
      <figure>
        {text(data, "imageUrl") ? (
          <img
            src={text(data, "imageUrl")}
            alt={text(data, "imageAlt")}
            className="w-full rounded-sm object-cover"
            style={{ objectPosition: focalPosition(data) }}
          />
        ) : null}
        {text(data, "caption") ? (
          <figcaption className="mt-3 text-xs text-muted-foreground">
            {text(data, "caption")}
          </figcaption>
        ) : null}
      </figure>
    );
    const copy = (
      <div>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        <p className="measure mt-5 text-base leading-relaxed text-muted-foreground">
          {text(data, "body")}
        </p>
        <div className="mt-6">
          <CmsLink url={text(data, "linkUrl")} label={text(data, "linkLabel")} />
        </div>
      </div>
    );
    return (
      <BlockShell block={block}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {text(data, "imageSide") === "right" ? (
            <>
              {copy}
              {image}
            </>
          ) : (
            <>
              {image}
              {copy}
            </>
          )}
        </div>
      </BlockShell>
    );
  }

  if (block.type === "gallery") {
    return (
      <BlockShell block={block}>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        {text(data, "intro") ? (
          <p className="measure mt-5 text-base text-muted-foreground">{text(data, "intro")}</p>
        ) : null}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records(data, "images").map((image, index) => (
            <figure
              key={index}
              className="overflow-hidden rounded-sm border border-rule bg-background"
            >
              <img
                src={text(image, "imageUrl")}
                alt={text(image, "imageAlt")}
                className="aspect-[4/3] w-full object-cover"
                style={{ objectPosition: focalPosition(image) }}
              />
              {text(image, "caption") ? (
                <figcaption className="p-4 text-sm text-muted-foreground">
                  {text(image, "caption")}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </BlockShell>
    );
  }

  if (block.type === "carousel") {
    return (
      <BlockShell block={block}>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        {text(data, "intro") ? (
          <p className="measure mt-5 text-base text-muted-foreground">{text(data, "intro")}</p>
        ) : null}
        <Carousel data={data} />
      </BlockShell>
    );
  }

  if (block.type === "resource_list") {
    return (
      <BlockShell block={block}>
        <SectionTitle eyebrow={text(data, "eyebrow")} title={text(data, "title")} />
        {text(data, "intro") ? (
          <p className="measure mt-5 text-base text-muted-foreground">{text(data, "intro")}</p>
        ) : null}
        <div className="mt-8 divide-y divide-rule border-y border-rule">
          {records(data, "items").map((item, index) => (
            <a
              key={index}
              href={safeUrl(text(item, "url")) || undefined}
              className="grid gap-3 py-6 no-underline sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="eyebrow">{text(item, "type")}</p>
                <h3 className="mt-2">{text(item, "title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text(item, "description")}</p>
              </div>
              <p className="text-sm text-muted-foreground">{text(item, "date")}</p>
            </a>
          ))}
        </div>
      </BlockShell>
    );
  }

  return null;
}

export function CmsPageRenderer({ page }: { page: CmsPageDocument }) {
  return (
    <>
      {page.blocks
        .filter((block) => block.visible)
        .map((block) => (
          <CmsBlockView key={block.id} block={block} />
        ))}
    </>
  );
}
