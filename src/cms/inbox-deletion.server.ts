import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "../integrations/supabase/types";

const deletionSchema = z.object({
  table: z.enum(["interest_registrations", "contact_enquiries"]),
  id: z.string().uuid(),
  email: z.string().min(1).max(320),
  confirmed: z.literal(true),
});

// Called only after requireSupabaseAuth has verified the session. Check the
// current owner role here as well; a hidden button is not an access control.
export async function deleteInboxRecordAsOwner(
  client: Pick<SupabaseClient<Database>, "from">,
  userId: string,
  input: unknown,
) {
  if (!userId) throw new Error("CMS owner access required.");
  const data = deletionSchema.parse(input);
  const { data: owner, error: ownerError } = await client
    .from("cms_admin_users")
    .select("user_id, role, active")
    .eq("user_id", userId)
    .eq("active", true)
    .eq("role", "owner")
    .maybeSingle();

  if (ownerError) throw new Error("Could not verify CMS owner access. Nothing was deleted.");
  if (!owner || !owner.active || owner.role !== "owner" || owner.user_id !== userId) {
    throw new Error("Only an active CMS owner can delete records.");
  }

  const { data: deleted, error } = await client
    .from(data.table)
    .delete()
    .eq("id", data.id)
    .eq("email", data.email)
    .select("id")
    .maybeSingle();

  if (error) throw new Error("The record could not be deleted. Please refresh and try again.");
  if (!deleted) {
    throw new Error("The record has changed or was already removed. Please refresh the list.");
  }
  return { id: deleted.id, table: data.table };
}
