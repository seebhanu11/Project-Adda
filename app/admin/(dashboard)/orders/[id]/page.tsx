"use client";

import { useState, use, Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Calendar,
  Send,
  Check,
  Receipt,
  User,
  ExternalLink,
  Lock,
} from "lucide-react";
import {
  MOCK_ORDERS,
  MockOrder,
  MockPayment,
} from "@/lib/mock-data";
import {
  buildAdvanceReceiptWhatsAppMessage,
  buildFinalPaymentRequestWhatsAppMessage,
  buildCompletionWhatsAppMessage,
  generateWhatsAppUrl,
} from "@/lib/whatsapp/message-builder";
import { SITE_CONFIG } from "@/lib/config";

function OrderDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  // Find order in mock data or fallback
  const initialOrder =
    MOCK_ORDERS.find(
      (o) => o.id === orderId || o.order_number === orderId
    ) || MOCK_ORDERS[0];

  const [order, setOrder] = useState<MockOrder>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState<MockOrder["status"]>(
    order.status
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Payment Recording States
  const [activePaymentModal, setActivePaymentModal] = useState<
    "Advance" | "Final" | null
  >(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [upiUtr, setUpiUtr] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const advanceDue = Math.max(
    0,
    Math.round(order.total_amount * 0.5) - order.advance_paid
  );
  const finalDue = Math.max(
    0,
    order.total_amount -
      order.advance_paid -
      order.final_paid
  );

  const openPaymentForm = (milestone: "Advance" | "Final") => {
    setActivePaymentModal(milestone);
    setPaymentAmount(milestone === "Advance" ? advanceDue : finalDue);
    setUpiUtr("");
    setPaymentNotes("");
    setPaymentError("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentModal) return;

    setIsSubmittingPayment(true);
    setPaymentError("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          paymentMilestone: activePaymentModal,
          amount: Number(paymentAmount),
          upiTransactionId: upiUtr,
          notes: paymentNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to record payment");
      }

      setOrder(data.order);
      setCurrentStatus(data.order.status);
      setActivePaymentModal(null);
      setStatusMsg(
        `${activePaymentModal} payment of ₹${paymentAmount.toLocaleString(
          "en-IN"
        )} verified and recorded successfully!`
      );
      setTimeout(() => setStatusMsg(""), 5000);

      // Open WhatsApp receipt if URL returned
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment error";
      setPaymentError(msg);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleStatusChange = async (newStatus: MockOrder["status"]) => {
    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setOrder(data.order);
      setStatusMsg(`Order status updated to ${newStatus}`);
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Status update error";
      setStatusMsg(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: MockOrder["status"]) => {
    switch (status) {
      case "Awaiting Advance":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "In Progress":
        return "bg-[#0099ff]/15 text-[#0099ff] border border-[#0099ff]/30";
      case "Awaiting Final Payment":
        return "bg-[#d44df0]/15 text-[#d44df0] border border-[#d44df0]/30";
      case "Completed":
        return "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30";
      case "Cancelled":
        return "bg-neutral-800 text-[#999999] border border-neutral-700";
    }
  };

  const advancePaymentRecord = order.payments.find(
    (p) => p.payment_milestone === "Advance" && p.is_confirmed
  );
  const finalPaymentRecord = order.payments.find(
    (p) => p.payment_milestone === "Final" && p.is_confirmed
  );

  // WhatsApp helper URLs
  const cleanWa = order.whatsapp_number.replace(/[^0-9]/g, "");

  const advanceReceiptWaUrl = generateWhatsAppUrl(
    cleanWa,
    buildAdvanceReceiptWhatsAppMessage({
      studentName: order.student_name,
      orderNumber: order.order_number,
      advanceAmount: order.advance_paid || Math.round(order.total_amount * 0.5),
      balanceDue: order.balance_due,
      targetDeliveryDate: order.target_delivery_date,
    })
  );

  const finalPaymentRequestWaUrl = generateWhatsAppUrl(
    cleanWa,
    buildFinalPaymentRequestWhatsAppMessage({
      studentName: order.student_name,
      orderNumber: order.order_number,
      projectTopic: order.project_topic,
      balanceDue: order.balance_due,
    })
  );

  const completionWaUrl = generateWhatsAppUrl(
    cleanWa,
    buildCompletionWhatsAppMessage({
      studentName: order.student_name,
      orderNumber: order.order_number,
      projectTopic: order.project_topic,
    })
  );

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="rounded-xl bg-[#141414] p-2 text-[#999999] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {order.order_number}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadge(
                  currentStatus
                )}`}
              >
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-[#999999] mt-0.5">
              Enquiry Ref: {order.enquiry_ref} • Ordered on{" "}
              {order.created_at.slice(0, 10)}
            </p>
          </div>
        </div>

        {/* Status Dropdown Controller */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#999999]">Status:</span>
          <select
            value={currentStatus}
            disabled={isUpdatingStatus}
            onChange={(e) =>
              handleStatusChange(e.target.value as MockOrder["status"])
            }
            className="rounded-xl border border-[#262626] bg-[#141414] px-3 py-1.5 text-xs text-white input-focus-ring"
          >
            <option value="Awaiting Advance">Awaiting Advance</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Final Payment">Awaiting Final Payment</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 p-3 text-xs text-[#22c55e] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Student & Quick WhatsApp Actions) */}
        <div className="flex flex-col gap-6">
          {/* Student Profile Card */}
          <div className="rounded-3xl bg-[#141414] p-6 flex flex-col gap-4 border border-[#1c1c1c]">
            <span className="text-xs font-semibold text-[#0099ff]">
              Student Information
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-[#666666] block">Student Name</span>
                <span className="text-sm font-semibold text-white">
                  {order.student_name}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">College / University</span>
                <span className="text-white font-medium">
                  {order.college_name}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">WhatsApp Number</span>
                <span className="text-white font-medium">
                  {order.whatsapp_number}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">Target Delivery</span>
                <span className="text-amber-400 font-semibold">
                  {order.target_delivery_date}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !py-2.5 text-xs !bg-[#22c55e] !text-black font-semibold mt-2"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              <span>Open Direct WhatsApp</span>
            </a>
          </div>

          {/* WhatsApp Stage Actions Card */}
          <div className="rounded-3xl bg-[#141414] p-6 flex flex-col gap-3 border border-[#1c1c1c]">
            <span className="text-xs font-semibold text-white">
              WhatsApp Notifications
            </span>
            <p className="text-[11px] text-[#666666]">
              Open prefilled messages to review and send to student:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href={advanceReceiptWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-between !py-2 !px-3 text-xs text-[#999999] hover:text-white"
              >
                <span>Send Advance Receipt</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href={finalPaymentRequestWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-between !py-2 !px-3 text-xs text-[#999999] hover:text-white"
              >
                <span>Request Final Payment (50%)</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href={completionWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-between !py-2 !px-3 text-xs text-[#999999] hover:text-white"
              >
                <span>Send Delivery Release</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right 2-Columns (Financial Milestones & Payment Verification) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Project Topic & Service Banner */}
          <div className="rounded-3xl bg-[#141414] p-6 sm:p-8 flex flex-col gap-3 border border-[#1c1c1c]">
            <span className="text-xs font-semibold text-[#0099ff]">
              {order.service_type}
            </span>
            <h2 className="text-lg font-semibold text-white">
              {order.project_topic}
            </h2>
          </div>

          {/* Commercial Milestones Breakdown (3 Pillars) */}
          <div className="rounded-3xl bg-[#141414] p-6 sm:p-8 flex flex-col gap-6 border border-[#1c1c1c]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-[#0099ff]" />
                <span>Financial Milestones Breakdown</span>
              </span>
              <span className="text-xs text-[#999999]">
                Manual UPI Verification Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-[#090909] p-5">
              <div>
                <span className="text-[11px] text-[#666666] block">
                  Total Agreed Fee
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  ₹{order.total_amount.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-[#888888]">100% Total</span>
              </div>

              <div>
                <span className="text-[11px] text-[#666666] block">
                  50% Advance Received
                </span>
                <span className="text-xl font-bold text-[#22c55e] mt-1 block">
                  ₹{order.advance_paid.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-[#888888]">
                  {order.advance_paid > 0 ? "Verified by Admin" : "Pending"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#666666] block">
                  Outstanding Balance Due
                </span>
                <span
                  className={`text-xl font-bold mt-1 block ${
                    order.balance_due > 0 ? "text-amber-400" : "text-[#22c55e]"
                  }`}
                >
                  ₹{order.balance_due.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-[#888888]">
                  {order.balance_due === 0 ? "Fully Settled" : "Awaiting final settlement"}
                </span>
              </div>
            </div>

            {/* UPI Payment Verification Desks */}
            <div className="flex flex-col gap-4">
              {/* Milestone 1: 50% Advance */}
              <div className="rounded-2xl bg-[#090909] p-5 border border-[#1c1c1c] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      Milestone 1: 50% Advance Payment
                    </span>
                    <span className="text-xs text-[#999999]">
                      (₹{Math.round(order.total_amount * 0.5).toLocaleString("en-IN")})
                    </span>
                  </div>

                  {advancePaymentRecord ? (
                    <span className="rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 px-2.5 py-0.5 text-[11px] text-[#22c55e] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified & Active</span>
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] text-amber-400 font-medium">
                      Awaiting Payment
                    </span>
                  )}
                </div>

                {advancePaymentRecord ? (
                  <div className="text-xs text-[#999999] flex flex-col gap-1.5 bg-[#141414] p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span>UPI Reference / UTR:</span>
                      <code className="text-white font-medium">
                        {advancePaymentRecord.upi_transaction_id}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Amount Verified:</span>
                      <span className="text-[#22c55e] font-semibold">
                        ₹{advancePaymentRecord.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified By:</span>
                      <span className="text-white">
                        {advancePaymentRecord.confirmed_by}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified Date:</span>
                      <span>{advancePaymentRecord.confirmed_at.slice(0, 10)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[#888888]">
                      Verify the student&apos;s UPI transfer in your bank statement before recording.
                    </p>
                    <button
                      type="button"
                      onClick={() => openPaymentForm("Advance")}
                      className="btn-primary !py-2 !px-4 text-xs whitespace-nowrap"
                    >
                      Record Advance Payment
                    </button>
                  </div>
                )}
              </div>

              {/* Milestone 2: 50% Final Payment */}
              <div className="rounded-2xl bg-[#090909] p-5 border border-[#1c1c1c] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      Milestone 2: 50% Final Settlement
                    </span>
                    <span className="text-xs text-[#999999]">
                      (₹{(order.total_amount - Math.round(order.total_amount * 0.5)).toLocaleString("en-IN")})
                    </span>
                  </div>

                  {finalPaymentRecord ? (
                    <span className="rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 px-2.5 py-0.5 text-[11px] text-[#22c55e] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified & Settled</span>
                    </span>
                  ) : order.advance_paid === 0 ? (
                    <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-[11px] text-[#888888] font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Locked (Advance Pending)</span>
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] text-amber-400 font-medium">
                      Awaiting Final Payment
                    </span>
                  )}
                </div>

                {finalPaymentRecord ? (
                  <div className="text-xs text-[#999999] flex flex-col gap-1.5 bg-[#141414] p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span>UPI Reference / UTR:</span>
                      <code className="text-white font-medium">
                        {finalPaymentRecord.upi_transaction_id}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Amount Verified:</span>
                      <span className="text-[#22c55e] font-semibold">
                        ₹{finalPaymentRecord.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified By:</span>
                      <span className="text-white">
                        {finalPaymentRecord.confirmed_by}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified Date:</span>
                      <span>{finalPaymentRecord.confirmed_at.slice(0, 10)}</span>
                    </div>
                  </div>
                ) : order.advance_paid > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[#888888]">
                      Record after student transfers the final remaining balance.
                    </p>
                    <button
                      type="button"
                      onClick={() => openPaymentForm("Final")}
                      className="btn-primary !py-2 !px-4 text-xs whitespace-nowrap"
                    >
                      Record Final Payment
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#666666]">
                    Final payment can be recorded once the advance payment is verified and work is in progress.
                  </p>
                )}
              </div>
            </div>

            {/* Payment Recording Form Modal/Section */}
            {activePaymentModal && (
              <form
                onSubmit={handleRecordPayment}
                className="rounded-2xl bg-[#090909] p-6 border border-[#262626] flex flex-col gap-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-3">
                  <span className="text-sm font-semibold text-white">
                    Record Manual UPI Payment: {activePaymentModal} Milestone
                  </span>
                  <span className="text-xs text-[#0099ff] font-medium">
                    UPI ID: {SITE_CONFIG.businessUpiId}
                  </span>
                </div>

                {paymentError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Verified Amount */}
                  <div>
                    <label className="text-xs text-[#999999] block mb-1">
                      Received Amount (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                        <IndianRupee className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#262626] bg-[#141414] pl-9 pr-4 py-2 text-xs text-white input-focus-ring"
                      />
                    </div>
                  </div>

                  {/* UPI Reference / UTR Number */}
                  <div>
                    <label className="text-xs text-[#999999] block mb-1">
                      12-Digit UPI Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428901928374 or UPI/428901..."
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value)}
                      className="w-full rounded-xl border border-[#262626] bg-[#141414] px-3 py-2 text-xs text-white input-focus-ring"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-[#999999] block mb-1">
                    Verification Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified with HDFC current account statement"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full rounded-xl border border-[#262626] bg-[#141414] px-3 py-2 text-xs text-white input-focus-ring"
                  />
                </div>

                {/* Verification Confirmation Disclaimer */}
                <p className="text-[11px] text-[#666666]">
                  By submitting, you confirm that this payment has been verified directly in your business bank account. The system does not trust unverified screenshots.
                </p>

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingPayment || !upiUtr || paymentAmount <= 0}
                    className="btn-primary !bg-[#22c55e] !text-black font-semibold !py-2.5 !px-5 text-xs"
                  >
                    {isSubmittingPayment ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Confirm & Record Payment</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePaymentModal(null)}
                    className="btn-secondary !py-2.5 !px-4 text-xs text-[#999999] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-[#999999] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Loading order and payment details...</span>
        </div>
      }
    >
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
