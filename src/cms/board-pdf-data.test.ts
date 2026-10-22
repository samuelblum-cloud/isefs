import { describe, expect, test } from "bun:test";

import type { Tables } from "@/integrations/supabase/types";

import { boardRegistrationRows } from "./board-pdf-data";

const record: Tables<"interest_registrations"> = {
  id: "private-uuid",
  first_name: "Zoë",
  last_name: "Müller",
  email: "zoe@example.com",
  email_normalised: "excluded-normalised",
  country: "Switzerland",
  specialty: "Surgeon",
  institution: "Clinical Institute",
  areas_of_interest: ["membership", "fellowship"],
  newsletter_consent: true,
  privacy_accepted_at: "excluded-privacy",
  source: "excluded-source",
  created_at: "2026-10-22T12:30:00Z",
  updated_at: "excluded-updated",
  workflow_status: "reviewing",
  internal_notes: "excluded-notes",
};

describe("Board registration export data", () => {
  test("includes every loaded record newest first without modifying the snapshot", () => {
    const records = [
      { ...record, created_at: "2026-10-20T12:00:00Z", first_name: "Older" },
      record,
    ];
    const rows = boardRegistrationRows(records);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.[1]).toBe("Zoë Müller");
    expect(rows[1]?.[0]).toBe("2");
    expect(records[0]?.first_name).toBe("Older");
  });
  test("exports only the nine approved Board fields", () => {
    expect(boardRegistrationRows([record])[0]).toEqual([
      "1",
      "Zoë Müller",
      "zoe@example.com",
      "Switzerland",
      "Surgeon",
      "Clinical Institute",
      "Membership, Fellowship",
      "22 Oct 2026, 12:30 UTC",
      "reviewing",
    ]);
  });
  test("handles an empty registration snapshot without fabricating records", () => {
    expect(boardRegistrationRows([])).toEqual([]);
  });
});
