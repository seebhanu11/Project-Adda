import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { MOCK_ORDERS, MOCK_ENQUIRIES, MockOrder } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      let query = supabase
        .from("orders")
        .select(`
          *,
          enquiries(student_name, college_name, whatsapp_number, service_type, project_topic, reference_no),
          quotations(reference_no, quote_amount, advance_amount, remaining_balance),
          payments(*)
        `)
        .order("created_at", { ascending: false });

      if (status && status !== "All") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ orders: data || [] });
    }

    // Local / Offline fallback
    let orders = [...MOCK_ORDERS];
    if (status && status !== "All") {
      orders = orders.filter((o) => o.status === status);
    }

    return NextResponse.json({ orders });
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
    const { enquiryId, quotationId, totalAmount, targetDeliveryDate } = body;

    if (!enquiryId || !totalAmount) {
      return NextResponse.json(
        { error: "Enquiry ID and total amount are required" },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();

      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({
          enquiry_id: enquiryId,
          quotation_id: quotationId,
          order_number: orderNumber,
          total_amount: totalAmount,
          advance_paid: 0,
          final_paid: 0,
          balance_due: totalAmount,
          status: "Awaiting Advance",
          target_delivery_date: targetDeliveryDate || null,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Update enquiry status to Approved
      await supabase
        .from("enquiries")
        .update({ status: "Approved" })
        .eq("id", enquiryId);

      return NextResponse.json({ order: newOrder }, { status: 201 });
    }

    // Local fallback
    const enquiry =
      MOCK_ENQUIRIES.find((e) => e.id === enquiryId || e.reference_no === enquiryId) ||
      MOCK_ENQUIRIES[0];

    const localOrder: MockOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      enquiry_id: enquiry.id,
      enquiry_ref: enquiry.reference_no,
      quotation_id: quotationId || "qt-custom",
      student_name: enquiry.student_name,
      college_name: enquiry.college_name,
      whatsapp_number: enquiry.whatsapp_number,
      service_type: enquiry.service_type,
      project_topic: enquiry.project_topic,
      total_amount: Number(totalAmount),
      advance_paid: 0,
      final_paid: 0,
      balance_due: Number(totalAmount),
      status: "Awaiting Advance",
      target_delivery_date: targetDeliveryDate || enquiry.deadline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      payments: [],
    };

    MOCK_ORDERS.unshift(localOrder);
    enquiry.status = "Approved";

    return NextResponse.json({ order: localOrder }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

