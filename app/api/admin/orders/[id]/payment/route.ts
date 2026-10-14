import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { recordPaymentSchema } from "@/lib/validations/payment";
import { MOCK_ORDERS, MockPayment } from "@/lib/mock-data";
import {
  buildAdvanceReceiptWhatsAppMessage,
  buildCompletionWhatsAppMessage,
  generateWhatsAppUrl,
} from "@/lib/whatsapp/message-builder";

export async function POST(
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
    const parsed = recordPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment record", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { paymentMilestone, amount, upiTransactionId, notes } = parsed.data;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();

      // Retrieve current order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*, enquiries(student_name, whatsapp_number, project_topic)")
        .or(`id.eq.${id},order_number.eq.${id}`)
        .single();

      if (orderError || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Insert confirmed UPI payment record
      const { data: paymentRecord, error: payError } = await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          payment_milestone: paymentMilestone,
          amount: amount,
          payment_method: "UPI",
          upi_transaction_id: upiTransactionId,
          is_confirmed: true,
          confirmed_by: session.userId,
          confirmed_at: new Date().toISOString(),
          notes: notes || null,
        })
        .select()
        .single();

      if (payError) {
        return NextResponse.json({ error: payError.message }, { status: 500 });
      }

      // Calculate updated balances and status
      let newAdvancePaid = Number(order.advance_paid);
      let newFinalPaid = Number(order.final_paid);
      let newStatus = order.status;

      if (paymentMilestone === "Advance") {
        newAdvancePaid += amount;
        if (order.status === "Awaiting Advance") {
          newStatus = "In Progress";
        }
      } else {
        newFinalPaid += amount;
        if (order.total_amount - newAdvancePaid - newFinalPaid <= 0) {
          newStatus = "Completed";
        }
      }

      const newBalanceDue = Math.max(
        0,
        Number(order.total_amount) - newAdvancePaid - newFinalPaid
      );

      const updatePayload: Record<string, unknown> = {
        advance_paid: newAdvancePaid,
        final_paid: newFinalPaid,
        balance_due: newBalanceDue,
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "Completed") {
        updatePayload.delivered_at = new Date().toISOString();
      }

      const { data: updatedOrder, error: updateOrderError } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", order.id)
        .select()
        .single();

      if (updateOrderError) {
        return NextResponse.json(
          { error: updateOrderError.message },
          { status: 500 }
        );
      }

      // Build WhatsApp confirmation text
      let whatsappText = "";
      if (paymentMilestone === "Advance") {
        whatsappText = buildAdvanceReceiptWhatsAppMessage({
          studentName: order.enquiries.student_name,
          orderNumber: order.order_number,
          advanceAmount: amount,
          balanceDue: newBalanceDue,
          targetDeliveryDate: order.target_delivery_date,
        });
      } else {
        whatsappText = buildCompletionWhatsAppMessage({
          studentName: order.enquiries.student_name,
          orderNumber: order.order_number,
          projectTopic: order.enquiries.project_topic,
        });
      }

      const whatsappUrl = generateWhatsAppUrl(
        order.enquiries.whatsapp_number,
        whatsappText
      );

      return NextResponse.json({
        payment: paymentRecord,
        order: updatedOrder,
        whatsappText,
        whatsappUrl,
      });
    }

    // Local / Offline fallback
    const targetOrder =
      MOCK_ORDERS.find((o) => o.id === id || o.order_number === id) ||
      MOCK_ORDERS[0];

    const paymentRecord: MockPayment = {
      id: `pay-${Date.now()}`,
      order_id: targetOrder.id,
      payment_milestone: paymentMilestone,
      amount,
      payment_method: "UPI",
      upi_transaction_id: upiTransactionId,
      is_confirmed: true,
      confirmed_by: session.email,
      confirmed_at: new Date().toISOString(),
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    if (paymentMilestone === "Advance") {
      targetOrder.advance_paid += amount;
      if (targetOrder.status === "Awaiting Advance") {
        targetOrder.status = "In Progress";
      }
    } else {
      targetOrder.final_paid += amount;
      if (
        targetOrder.total_amount -
          targetOrder.advance_paid -
          targetOrder.final_paid <=
        0
      ) {
        targetOrder.status = "Completed";
        targetOrder.delivered_at = new Date().toISOString();
      }
    }

    targetOrder.balance_due = Math.max(
      0,
      targetOrder.total_amount -
        targetOrder.advance_paid -
        targetOrder.final_paid
    );
    targetOrder.updated_at = new Date().toISOString();
    targetOrder.payments.push(paymentRecord);

    let whatsappText = "";
    if (paymentMilestone === "Advance") {
      whatsappText = buildAdvanceReceiptWhatsAppMessage({
        studentName: targetOrder.student_name,
        orderNumber: targetOrder.order_number,
        advanceAmount: amount,
        balanceDue: targetOrder.balance_due,
        targetDeliveryDate: targetOrder.target_delivery_date,
      });
    } else {
      whatsappText = buildCompletionWhatsAppMessage({
        studentName: targetOrder.student_name,
        orderNumber: targetOrder.order_number,
        projectTopic: targetOrder.project_topic,
      });
    }

    const whatsappUrl = generateWhatsAppUrl(
      targetOrder.whatsapp_number,
      whatsappText
    );

    return NextResponse.json({
      payment: paymentRecord,
      order: targetOrder,
      whatsappText,
      whatsappUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

