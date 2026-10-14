import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/enquiry";
import { validateFileMagicBytes } from "@/lib/security/magic-bytes";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting & Spam Protection
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 10, 3600000); // 10 submissions/hr
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${Math.ceil(
            rateLimit.resetInSeconds / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();

    const rawData = {
      studentName: formData.get("studentName"),
      collegeName: formData.get("collegeName"),
      courseBranchYear: formData.get("courseBranchYear"),
      whatsappNumber: formData.get("whatsappNumber"),
      serviceType: formData.get("serviceType"),
      projectTopic: formData.get("projectTopic"),
      requirementDescription: formData.get("requirementDescription"),
      deadline: formData.get("deadline"),
    };

    // 3. Server-side Zod Validation
    const validationResult = enquirySchema.safeParse(rawData);
    if (!validationResult.success) {
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return NextResponse.json(
        { error: "Validation failed.", details: fieldErrors },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 4. File Upload & Binary Magic-Byte Security Inspection
    const files = formData.getAll("files") as File[];
    if (files.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 files allowed per enquiry submission." },
        { status: 400 }
      );
    }

    const verifiedFiles: {
      file: File;
      fileName: string;
      fileSizeBytes: number;
      mimeType: string;
    }[] = [];

    for (const file of files) {
      if (!file || typeof file === "string" || file.size === 0) continue;

      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum 25 MB size limit.` },
          { status: 400 }
        );
      }

      // Check binary magic bytes
      const magicByteCheck = await validateFileMagicBytes(file);
      if (!magicByteCheck.valid) {
        return NextResponse.json(
          {
            error:
              magicByteCheck.error ||
              `File "${file.name}" failed binary integrity inspection.`,
          },
          { status: 400 }
        );
      }

      verifiedFiles.push({
        file,
        fileName: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"), // Sanitize filename
        fileSizeBytes: file.size,
        mimeType: magicByteCheck.detectedType,
      });
    }

    // 5. Generate Reference Number
    const currentYear = 2026;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `PA-${currentYear}-${randomDigits}`;

    // 6. Supabase Persistence
    let enquiryId: string = "mock-" + Date.now();

    if (isSupabaseConfigured()) {
      const adminClient = createAdminClient();

      // Insert Enquiry Record
      const { data: enquiryRecord, error: enquiryError } = await adminClient
        .from("enquiries")
        .insert({
          reference_no: referenceNo,
          student_name: validData.studentName,
          college_name: validData.collegeName,
          course_branch_year: validData.courseBranchYear,
          whatsapp_number: validData.whatsappNumber,
          service_type: validData.serviceType,
          project_topic: validData.projectTopic,
          requirement_description: validData.requirementDescription,
          deadline: validData.deadline,
          status: "New",
        })
        .select("id")
        .single();

      if (enquiryError) {
        console.error("Supabase insert error:", enquiryError);
        return NextResponse.json(
          { error: "Failed to persist enquiry in database." },
          { status: 500 }
        );
      }

      enquiryId = enquiryRecord.id;

      // Upload Verified Files to Private Storage & Record Metadata
      for (const item of verifiedFiles) {
        const storagePath = `${referenceNo}/${Date.now()}-${item.fileName}`;
        const arrayBuffer = await item.file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await adminClient.storage
          .from("student-uploads")
          .upload(storagePath, buffer, {
            contentType: item.mimeType,
            upsert: false,
          });

        if (uploadError) {
          console.error("File upload error:", uploadError);
          // Non-fatal for whole submission, but log error
        } else {
          await adminClient.from("enquiry_files").insert({
            enquiry_id: enquiryId,
            file_name: item.fileName,
            file_size_bytes: item.fileSizeBytes,
            mime_type: item.mimeType,
            storage_path: storagePath,
          });
        }
      }
    } else {
      // Local development fallback log when credentials are not yet entered
      console.log(`[LOCAL DEV MODE] Enquiry received: ${referenceNo}`);
      console.log(`Student: ${validData.studentName} (${validData.whatsappNumber})`);
      console.log(`Service: ${validData.serviceType} | Topic: ${validData.projectTopic}`);
      console.log(`Files count: ${verifiedFiles.length}`);
    }

    return NextResponse.json({
      success: true,
      referenceNo,
      enquiryId,
      message: "Enquiry submitted successfully.",
    });
  } catch (error: any) {
    console.error("Enquiry API Exception:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
