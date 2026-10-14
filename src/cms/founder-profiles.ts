import { founders, management } from "@/content/site";
import type { Json } from "@/integrations/supabase/types";

type CmsData = Record<string, Json | undefined>;

const previousManagementSummary =
  "Samuel Blum leads the Society’s day-to-day operations and the implementation of its programme. His responsibilities include member administration, provider management, operational banking, communications, digital platforms and reporting to the Board. Executive management and secretariat responsibilities are combined in this single Managing Director role. The Board retains strategic oversight and its reserved decisions, while the founders and academic leads remain responsible for scientific content and professional assessment.";

const founderAliases = new Map<string, (typeof founders)[number]>([
  ["dr. marc mani", founders[0]],
  ["dr. gad renert", founders[1]],
  ["dr. gad ofir renert", founders[1]],
  ["dr. gad-ofir renert", founders[1]],
  ["dr. mubariz mammadli", founders[2]],
  ["dr. faycal el kouhen", founders[3]],
  ["dr. fayçal el kouhen", founders[3]],
  ["dr. artur diaz carandell", founders[4]],
  ["dr. artur díaz carandell", founders[4]],
]);

const previousFounderRoles = new Set([
  "scientific founder",
  "scientific founder · plastic & reconstructive surgeon",
  "scientific founder · plastic, reconstructive & aesthetic surgeon",
  "scientific founder · cranio-maxillofacial & facial plastic surgeon",
]);

const previousFounderSummaries = new Map<string, { home?: string; leadership?: string }>([
  [
    founders[0].name,
    {
      leadership:
        "A Beverly Hills-based plastic surgeon internationally recognised for advanced facial rejuvenation. Harvard-educated and trained in plastic surgery at Baylor College of Medicine, Dr. Mani has published and taught internationally on deep-plane and endoscopic lifting techniques.",
    },
  ],
  [
    founders[1].name,
    {
      leadership:
        "A Bucharest-based plastic, reconstructive and aesthetic surgeon with extensive experience in endoscopic facial procedures, deep-plane rejuvenation and complex revision surgery. Dr. Renert is internationally active as a faculty speaker, cadaver-lab instructor and live-surgery demonstrator.",
    },
  ],
  [
    founders[2].name,
    {
      home: "An Azerbaijan-based surgeon combining contemporary facial rejuvenation with international surgical education.",
      leadership:
        "An Azerbaijan-based plastic and reconstructive surgeon focused on contemporary facial rejuvenation and minimally invasive techniques. Dr. Mammadli is internationally engaged in surgical practice and education, with an emphasis on precision, individual anatomy and natural results.",
    },
  ],
  [
    founders[3].name,
    {
      home: "A Morocco-based surgeon recognised for refined facial procedures and minimally invasive techniques.",
      leadership:
        "A Morocco-based plastic and reconstructive surgeon whose work focuses on facial procedures and refined, minimally invasive techniques. Dr. El Kouhen’s approach emphasises individual anatomy, proportion, restraint and durable, natural-looking outcomes.",
    },
  ],
  [
    founders[4].name,
    {
      leadership:
        "A Barcelona-based cranio-maxillofacial and facial plastic surgeon with more than two decades of experience. A Fellow of the European Board of Oral and Maxillofacial Surgery and Medical Director of the Racine² Group, Dr. Díaz Carandell combines advanced endoscopic facial rejuvenation with international surgical teaching.",
    },
  ],
]);

const previousFounderFooter =
  "The scientific founders lead the Society’s academic direction and its educational and scientific programme. The Society’s complete governance and committee structure will be published as part of its formal establishment.";

const founderFooter =
  "Dr. Marc Mani will serve as the Society’s first President. The founders will determine the other offices for the first year. Together, they lead the Society’s academic direction and its educational and scientific programme.";

function record(value: Json): CmsData | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function valueText(value: Json | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseName(value: string) {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Enriches only untouched legacy founder cards. Once an editor changes a role or
 * profile beyond the known earlier copy, the CMS value remains authoritative.
 */
export function enrichFounderPeopleData(pageSlug: string, data: CmsData): CmsData {
  if (pageSlug !== "home" && pageSlug !== "leadership") return data;

  const people = data["people"];
  if (!Array.isArray(people)) return data;

  let changed = false;
  const enrichedPeople = people.map((value) => {
    const person = record(value);
    if (!person) return value;

    const name = valueText(person["name"]);
    const role = valueText(person["role"]);
    const summary = valueText(person["summary"]);
    const founder = founderAliases.get(normaliseName(name));

    if (founder) {
      const canonicalSummary = pageSlug === "home" ? founder.shortSummary : founder.summary;
      const previousSummary = previousFounderSummaries.get(founder.name)?.[pageSlug];
      const shouldUpdateName = name !== founder.name;
      const shouldUpdateRole = previousFounderRoles.has(role.toLocaleLowerCase("en"));
      const shouldUpdateSummary = !summary || summary === previousSummary;

      if (shouldUpdateName || shouldUpdateRole || shouldUpdateSummary) {
        changed = true;
        return {
          ...person,
          name: founder.name,
          role: shouldUpdateRole ? founder.role : role,
          summary: shouldUpdateSummary ? canonicalSummary : summary,
        } satisfies CmsData;
      }
    }

    if (pageSlug === "home" && name === management.name && role === management.role && !summary) {
      changed = true;
      return {
        ...person,
        summary: "Leads the Society’s day-to-day operations and programme implementation.",
      } satisfies CmsData;
    }

    return value;
  });

  const currentFounders = new Map<string, CmsData>();
  const otherPeople: Json[] = [];

  for (const value of enrichedPeople) {
    const person = record(value);
    const name = person ? valueText(person["name"]) : "";
    const founder = founderAliases.get(normaliseName(name));
    if (person && founder) currentFounders.set(founder.name, person);
    else otherPeople.push(value);
  }

  if (currentFounders.size < founders.length) {
    changed = true;
    const completeFounderRoster = founders.map(
      (founder) =>
        currentFounders.get(founder.name) ?? {
          name: founder.name,
          role: founder.role,
          summary: pageSlug === "home" ? founder.shortSummary : founder.summary,
          imageUrl: "",
          imageAlt: "",
        },
    );
    enrichedPeople.splice(0, enrichedPeople.length, ...completeFounderRoster, ...otherPeople);
  }

  const footer = valueText(data["footer"]);
  const updatedFooter = pageSlug === "leadership" && footer === previousFounderFooter;
  if (updatedFooter) changed = true;

  return changed
    ? {
        ...data,
        people: enrichedPeople,
        ...(updatedFooter ? { footer: founderFooter } : {}),
      }
    : data;
}

/**
 * Updates the untouched management profile shipped before the shorter public
 * biography was approved. Any text changed in the CMS remains authoritative.
 */
export function enrichManagementProfileData(pageSlug: string, data: CmsData): CmsData {
  if (pageSlug !== "leadership") return data;

  const name = valueText(data["name"]);
  const role = valueText(data["role"]);
  const summary = valueText(data["summary"]);

  if (
    name !== management.name ||
    role !== management.role ||
    summary !== previousManagementSummary
  ) {
    return data;
  }

  return { ...data, summary: management.summary };
}
