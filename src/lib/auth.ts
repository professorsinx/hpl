import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/env";
import { createSessionClient } from "./supabase/server";

export type Admin = { id: string; email: string };

/**
 * The signed-in admin, or null. Verifies the session with Supabase and then
 * confirms membership of the `admins` allow-list; a valid login alone is not
 * enough. Deduplicated per request.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return null;

  return { id: user.id, email: user.email ?? "" };
});

/** For pages: redirect to the login screen unless an admin is signed in. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
