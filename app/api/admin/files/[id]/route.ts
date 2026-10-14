import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify Admin Session
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized access to private student files." },
      { status: 401 }
    );
  }

  const { id: fileId } = await params;

  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();

      // Retrieve storage_path from enquiry_files
      const { data: fileRecord, error: fileError } = await adminClient
        .from("enquiry_files")
        .select("storage_path, file_name")
        .eq("id", fileId)
        .single();

      if (fileError || !fileRecord) {
        return NextResponse.json(
          { error: "Requested file record not found." },
          { status: 404 }
        );
      }

      // Generate a 60-second temporary signed URL
      const { data: signedData, error: signError } = await adminClient.storage
        .from("student-uploads")
        .createSignedUrl(fileRecord.storage_path, 60);

      if (signError || !signedData?.signedUrl) {
        return NextResponse.json(
          { error: "Failed to generate signed download link." },
          { status: 500 }
        );
      }

      // Redirect directly to the temporary signed URL
      return NextResponse.redirect(signedData.signedUrl);
    } catch (err: any) {
      console.error("Signed URL generation exception:", err);
      return NextResponse.json(
        { error: "Internal error generating secure download." },
        { status: 500 }
      );
    }
  }

  // Local Development Preview Mode
  return NextResponse.json({
    message: "Local Development Mode: File secure download preview.",
    fileId,
    signedUrlLifetime: "60 seconds",
    note: "In production with Supabase configured, this directly opens a temporary 60-second signed URL.",
  });
}

