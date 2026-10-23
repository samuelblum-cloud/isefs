import { strict as assert } from "node:assert";
import { test } from "node:test";

import { deleteInboxRecordAsOwner } from "./inbox-deletion.server.ts";

const id = "1d3d60df-2be5-4e62-b43d-8d58430c1d51";
const input = { table: "interest_registrations", id, email: "test@example.com", confirmed: true };

function database(
  options: {
    role?: string;
    active?: boolean;
    missing?: boolean;
    ownerError?: boolean;
    deleteError?: boolean;
  } = {},
) {
  const rows = [
    { id, email: "test@example.com" },
    { id: "0fbe3df2-57bb-4cba-a57b-c79fe7437561", email: "keep@example.com" },
  ];
  const calls: string[] = [];
  const owner = {
    user_id: "owner-id",
    role: options.role ?? "owner",
    active: options.active ?? true,
  };
  const from = (table: string) => {
    calls.push(table);
    const filters: [string, unknown][] = [];
    let deleting = false;
    const chain = {
      select: () => chain,
      eq: (field: string, value: unknown) => {
        filters.push([field, value]);
        return chain;
      },
      delete: () => {
        deleting = true;
        return chain;
      },
      maybeSingle: async () => {
        if (table === "cms_admin_users")
          return {
            data:
              !options.missing &&
              filters.every(([field, value]) => owner[field as keyof typeof owner] === value)
                ? owner
                : null,
            error: options.ownerError ? new Error("database unavailable") : null,
          };
        assert.equal(deleting, true);
        if (options.deleteError) return { data: null, error: new Error("delete rejected") };
        const index = rows.findIndex((row) =>
          filters.every(([field, value]) => row[field as keyof typeof row] === value),
        );
        return { data: index < 0 ? null : rows.splice(index, 1)[0], error: null };
      },
    };
    return chain;
  };
  return {
    client: { from } as unknown as Parameters<typeof deleteInboxRecordAsOwner>[0],
    rows,
    calls,
  };
}

for (const table of ["interest_registrations", "contact_enquiries"]) {
  test(`owner can delete exactly the confirmed ${table} row; unrelated row survives`, async () => {
    const db = database();
    assert.deepEqual(await deleteInboxRecordAsOwner(db.client, "owner-id", { ...input, table }), {
      id,
      table,
    });
    assert.deepEqual(
      db.rows.map((row) => row.email),
      ["keep@example.com"],
    );
    assert.deepEqual(db.calls, ["cms_admin_users", table]);
  });
}

for (const options of [
  { role: "editor" },
  { active: false },
  { missing: true },
  { ownerError: true },
]) {
  test(`rejects forbidden access ${JSON.stringify(options)} before accessing records`, async () => {
    const db = database(options);
    await assert.rejects(deleteInboxRecordAsOwner(db.client, "owner-id", input));
    assert.deepEqual(db.calls, ["cms_admin_users"]);
    assert.equal(db.rows.length, 2);
  });
}

test("absent user is rejected without database access", async () => {
  const db = database();
  await assert.rejects(deleteInboxRecordAsOwner(db.client, "", input));
  assert.equal(db.calls.length, 0);
});

for (const override of [
  { table: "cms_admin_users" },
  { id: "" },
  { id: "not-a-uuid" },
  { confirmed: false },
  { confirmed: undefined },
  { email: "" },
]) {
  test(`invalid deletion request rejected: ${JSON.stringify(override)}`, async () => {
    const db = database();
    await assert.rejects(
      deleteInboxRecordAsOwner(db.client, "owner-id", { ...input, ...override }),
    );
    assert.equal(db.calls.length, 0);
  });
}

test("stale email confirmation does not delete a changed record", async () => {
  const db = database();
  await assert.rejects(
    deleteInboxRecordAsOwner(db.client, "owner-id", { ...input, email: "stale@example.com" }),
    /changed or was already removed/,
  );
  assert.equal(db.rows.length, 2);
});

test("repeated deletion fails clearly and never removes another record", async () => {
  const db = database();
  await deleteInboxRecordAsOwner(db.client, "owner-id", input);
  await assert.rejects(
    deleteInboxRecordAsOwner(db.client, "owner-id", input),
    /changed or was already removed/,
  );
  assert.equal(db.rows.length, 1);
});

test("database failure is not reported as successful deletion", async () => {
  const db = database({ deleteError: true });
  await assert.rejects(
    deleteInboxRecordAsOwner(db.client, "owner-id", input),
    /could not be deleted/,
  );
  assert.equal(db.rows.length, 2);
});
