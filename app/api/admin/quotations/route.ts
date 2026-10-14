import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { quotationSchema, calculateMilestones } from "@/lib/validations/quotation";
import { MOCK_QUOTATIONS, MOCK_ENQUIRIES, MockQuotation } from "@/lib/mock-data";
import {
  buildQuotationWhatsAppMessage,
  generateWhatsAppUrl,
} from "@/lib/whatsapp/message-builder";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const enquiryId = searchParams.get("enquiryId");

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      let query = supabase
        .from("quotations")
        .select("*, enquiries(student_name, whatsapp_number, project_topic, service_type, reference_no)")
        .order("created_at", { ascending: false });

      if (enquiryId) {
        query = query.eq("enquiry_id", enquiryId);
      }

      const { data, error } = await query;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ quotations: data || [] });
    }

    // Local / Offline fallback
    let filtered = [...MOCK_QUOTATIONS];
    if (enquiryId) {
      filtered = filtered.filter((q) => q.enquiry_id === enquiryId);
    }

    return NextResponse.json({ quotations: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = quotationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quotation data", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { enquiryId, quoteAmount, scopeSummary, validityDays, notes } = parsed.data;
    const { advanceAmount, remainingBalance } = calculateMilestones(quoteAmount);
    const quoteRef = `QT-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();

      // Retrieve enquiry details to generate WhatsApp text
      const { data: enquiry, error: enqError } = await supabase
        .from("enquiries")
        .select("*")
        .eq("id", enquiryId)
        .single();

      if (enqError || !enquiry) {
        return NextResponse.json(
          { error: "Referenced enquiry not found" },
          { status: 404 }
        );
      }

      // Insert quotation
      const { data: createdQuote, error: insertError } = await supabase
        .from("quotations")
        .insert({
          enquiry_id: enquiryId,
          reference_no: quoteRef,
          quote_amount: quoteAmount,
          advance_amount: advanceAmount,
          remaining_balance: remainingBalance,
          scope_summary: scopeSummary,
          validity_days: validityDays,
          status: "Draft",
          notes: notes || null,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      // Update enquiry status to Quoted
      await supabase
        .from("enquiries")
        .update({ status: "Quoted" })
        .eq("id", enquiryId);

      const whatsappText = buildQuotationWhatsAppMessage({
        studentName: enquiry.student_name,
        refNo: enquiry.reference_no,
        quoteRef,
        projectTopic: enquiry.project_topic,
        serviceType: enquiry.service_type,
        totalAmount: quoteAmount,
        advanceAmount,
        remainingBalance,
        validityDays,
      });

      const whatsappUrl = generateWhatsAppUrl(enquiry.whatsapp_number, whatsappText);

      return NextResponse.json({
        quotation: createdQuote,
        whatsappText,
        whatsappUrl,
      });
    }

    // Local / Offline fallback
    const targetEnquiry =
      MOCK_ENQUIRIES.find((e) => e.id === enquiryId || e.reference_no === enquiryId) ||
      MOCK_ENQUIRIES[0];

    const newQuote: MockQuotation = {
      id: `qt-${Date.now()}`,
      enquiry_id: targetEnquiry.id,
      reference_no: quoteRef,
      student_name: targetEnquiry.student_name,
      whatsapp_number: targetEnquiry.whatsapp_number,
      project_topic: targetEnquiry.project_topic,
      service_type: targetEnquiry.service_type,
      quote_amount: quoteAmount,
      advance_amount: advanceAmount,
      remaining_balance: remainingBalance,
      scope_summary: scopeSummary,
      validity_days: validityDays,
      status: "Draft",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    MOCK_QUOTATIONS.unshift(newQuote);
    targetEnquiry.status = "Quoted";

    const whatsappText = buildQuotationWhatsAppMessage({
      studentName: targetEnquiry.student_name,
      refNo: targetEnquiry.reference_no,
      quoteRef,
      projectTopic: targetEnquiry.project_topic,
      serviceType: targetEnquiry.service_type,
      totalAmount: quoteAmount,
      advanceAmount,
      remainingBalance,
      validityDays,
    });

    const whatsappUrl = generateWhatsAppUrl(targetEnquiry.whatsapp_number, whatsappText);

    return NextResponse.json({
      quotation: newQuote,
      whatsappText,
      whatsappUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

