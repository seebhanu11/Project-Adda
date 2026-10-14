import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify Admin Session
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 }
    );
  }

  const { id: enquiryId } = await params;
  const body = await request.json().catch(() => ({}));
  const { status } = body;

  const validStatuses = ["New", "Under Review", "Quoted", "Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status "${status}". Allowed values: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { error: updateError } = await adminClient
        .from("enquiries")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", enquiryId);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update enquiry status in database." },
          { status: 500 }
        );
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      return NextResponse.json(
        { error: "Internal server error updating status." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    enquiryId,
    status,
    updatedAt: new Date().toISOString(),
  });
}

