import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteCmsInboxRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => input)
  .handler(async ({ data, context }) => {
    const { deleteInboxRecordAsOwner } = await import("./inbox-deletion.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return deleteInboxRecordAsOwner(supabaseAdmin, context.userId, data);
  });
