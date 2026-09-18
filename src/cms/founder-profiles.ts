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
  ["dr. artur diaz carandell", founders[2]],
  ["dr. artur díaz carandell", founders[2]],
]);

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
 * profile, the CMS value remains authoritative and is no longer replaced here.
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

    if (founder && role.toLocaleLowerCase("en") === "scientific founder" && !summary) {
      changed = true;
      return {
        ...person,
        name: founder.name,
        role: founder.role,
        summary: pageSlug === "home" ? founder.shortSummary : founder.summary,
      } satisfies CmsData;
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

  return changed ? { ...data, people: enrichedPeople } : data;
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
