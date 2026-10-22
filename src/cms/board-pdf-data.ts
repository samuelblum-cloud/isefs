import type { Tables } from "@/integrations/supabase/types";

export function boardRegistrationRows(records: readonly Tables<"interest_registrations">[]) {
  return [...records]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .map((record, index) => [
      String(index + 1),
      `${record.first_name} ${record.last_name}`.trim(),
      record.email,
      record.country,
      record.specialty,
      record.institution || "—",
      record.areas_of_interest
        .map((area) => area.charAt(0).toUpperCase() + area.slice(1))
        .join(", "),
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(new Date(record.created_at)) + " UTC",
      record.workflow_status,
    ]);
}
