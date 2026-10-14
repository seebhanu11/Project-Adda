import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  const redirectUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}

