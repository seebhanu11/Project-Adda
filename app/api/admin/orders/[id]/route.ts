import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { updateOrderStatusSchema } from "@/lib/validations/payment";
import { MOCK_ORDERS } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          enquiries(*),
          quotations(*),
          payments(*)
        `)
        .or(`id.eq.${id},order_number.eq.${id}`)
        .single();

      if (error || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({ order });
    }

    // Local / Offline fallback
    const order =
      MOCK_ORDERS.find((o) => o.id === id || o.order_number === id) ||
      MOCK_ORDERS[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status data", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "Completed") {
        updatePayload.delivered_at = new Date().toISOString();
      }

      const { data: updated, error } = await supabase
        .from("orders")
        .update(updatePayload)
        .or(`id.eq.${id},order_number.eq.${id}`)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ order: updated });
    }

    // Local fallback
    const targetOrder =
      MOCK_ORDERS.find((o) => o.id === id || o.order_number === id);

    if (targetOrder) {
      targetOrder.status = status;
      targetOrder.updated_at = new Date().toISOString();
      if (status === "Completed") {
        targetOrder.delivered_at = new Date().toISOString();
      }
    }

    return NextResponse.json({ order: targetOrder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

