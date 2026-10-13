import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "../../lib/supabase/server";

// Cached per request, so the layout, page and actions share one auth lookup.
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
});
