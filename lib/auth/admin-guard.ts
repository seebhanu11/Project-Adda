import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/admin";

export interface AdminUserSession {
  userId: string;
  email: string;
  role: "admin" | "super_admin";
}

/**
 * Server-side guard to verify that current requester is an authenticated administrator.
 * Returns the admin session if authorized, or null if unauthenticated or not in admin_users.
 */
export async function getAdminSession(): Promise<AdminUserSession | null> {
  // If Supabase is not configured yet (local dev mode), return mock admin session
  // to allow testing and reviewing the dashboard UI locally.
  if (!isSupabaseConfigured()) {
    return {
      userId: "mock-admin-id",
      email: "admin@projectadda.com",
      role: "super_admin",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Verify user exists in public.admin_users table
    const adminClient = createAdminClient();
    const { data: adminRecord, error: adminError } = await adminClient
      .from("admin_users")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    if (adminError || !adminRecord) {
      return null;
    }

    return {
      userId: adminRecord.id,
      email: adminRecord.email,
      role: adminRecord.role as "admin" | "super_admin",
    };
  } catch (err) {
    console.error("Admin verification error:", err);
    return null;
  }
}

