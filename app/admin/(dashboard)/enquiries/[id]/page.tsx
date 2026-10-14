"use client";

import { useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  ExternalLink,
  Receipt,
  PlusCircle,
  IndianRupee,
  Send,
  Eye,
  Check,
} from "lucide-react";
import {
  MOCK_ENQUIRIES,
  MOCK_QUOTATIONS,
  MockEnquiry,
  MockQuotation,
} from "@/lib/mock-data";
import {
  buildQuotationWhatsAppMessage,
  generateWhatsAppUrl,
} from "@/lib/whatsapp/message-builder";

function EnquiryDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const enquiryId = resolvedParams.id;

  // Find enquiry in mock data or fallback
  const initialEnquiry =
    MOCK_ENQUIRIES.find(
      (e) => e.id === enquiryId || e.reference_no === enquiryId
    ) || MOCK_ENQUIRIES[0];

  const initialQuote =
    MOCK_QUOTATIONS.find(
      (q) => q.enquiry_id === initialEnquiry.id || q.enquiry_id === enquiryId
    ) || null;

  const [enquiry, setEnquiry] = useState<MockEnquiry>(initialEnquiry);
  const [currentStatus, setCurrentStatus] = useState(enquiry.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

  // Quotation states
  const [quotation, setQuotation] = useState<MockQuotation | null>(initialQuote);
  const [showQuoteForm, setShowQuoteForm] = useState(!initialQuote);
  const [quoteAmount, setQuoteAmount] = useState<number>(
    initialQuote ? initialQuote.quote_amount : 2500
  );
  const [scopeSummary, setScopeSummary] = useState(
    initialQuote
      ? initialQuote.scope_summary
      : `Complete end-to-end delivery of ${initialEnquiry.service_type} for "${initialEnquiry.project_topic}", formatted strictly according to institutional guidelines.`
  );
  const [validityDays, setValidityDays] = useState(7);
  const [internalNotes, setInternalNotes] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isConvertingOrder, setIsConvertingOrder] = useState(false);

  // Milestone 50/50 calculations
  const advanceAmount = Math.round((quoteAmount || 0) * 0.5);
  const remainingAmount = (quoteAmount || 0) - advanceAmount;

  const handleStatusChange = async (newStatus: MockEnquiry["status"]) => {
    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus);

    try {
      await fetch(`/api/admin/enquiries/${enquiry.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatusSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusSuccessMsg(""), 3000);
    } catch {
      setStatusSuccessMsg(`Status updated to ${newStatus} (Local)`);
      setTimeout(() => setStatusSuccessMsg(""), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteError("");

    try {
      const res = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          quoteAmount: Number(quoteAmount),
          scopeSummary,
          validityDays: Number(validityDays),
          notes: internalNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create quotation");
      }

      setQuotation(data.quotation);
      setCurrentStatus("Quoted");
      setShowQuoteForm(false);
      setQuoteSuccessMsg(
        `Quotation ${data.quotation.reference_no} created successfully!`
      );

      // Open WhatsApp prefilled message in a new window
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error";
      setQuoteError(msg);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleConvertToOrder = async () => {
    if (!quotation) return;
    setIsConvertingOrder(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          quotationId: quotation.id,
          totalAmount: quotation.quote_amount,
          targetDeliveryDate: enquiry.deadline,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to convert into order");
      }

      // Redirect directly to the newly created/existing order page
      router.push(`/admin/orders/${data.order.id || data.order.order_number}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order creation error";
      alert(msg);
      setIsConvertingOrder(false);
    }
  };

  const cleanWa = enquiry.whatsapp_number.replace(/[^0-9]/g, "");
  const defaultWhatsAppMsg = `Hello ${enquiry.student_name}, this is Project Adda reviewing your enquiry (${enquiry.reference_no}) regarding "${enquiry.project_topic}".`;
  const enquiryWhatsAppUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    defaultWhatsAppMsg
  )}`;

  // Preview quotation WhatsApp message
  const previewText = buildQuotationWhatsAppMessage({
    studentName: enquiry.student_name,
    refNo: enquiry.reference_no,
    quoteRef: quotation ? quotation.reference_no : "QT-2026-PREVIEW",
    projectTopic: enquiry.project_topic,
    serviceType: enquiry.service_type,
    totalAmount: Number(quoteAmount) || 0,
    advanceAmount,
    remainingBalance: remainingAmount,
    validityDays,
  });

  const getStatusBadge = (status: MockEnquiry["status"]) => {
    switch (status) {
      case "New":
        return "bg-[#0099ff]/15 text-[#0099ff] border border-[#0099ff]/30";
      case "Under Review":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "Quoted":
        return "bg-[#d44df0]/15 text-[#d44df0] border border-[#d44df0]/30";
      case "Approved":
        return "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30";
      case "Rejected":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="rounded-xl bg-[#141414] p-2 text-[#999999] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {enquiry.reference_no}
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
              Submitted on {enquiry.created_at.slice(0, 10)}
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
              handleStatusChange(e.target.value as MockEnquiry["status"])
            }
            className="rounded-xl border border-[#262626] bg-[#141414] px-3 py-1.5 text-xs text-white input-focus-ring"
          >
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Quoted">Quoted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {statusSuccessMsg && (
        <div className="rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 p-3 text-xs text-[#22c55e] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Student & Quick Actions) */}
        <div className="flex flex-col gap-6">
          {/* Student Profile Card */}
          <div className="rounded-3xl bg-[#141414] p-6 flex flex-col gap-4">
            <span className="text-xs font-semibold text-[#0099ff]">
              Student Details
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-[#666666] block">Full Name</span>
                <span className="text-sm font-medium text-white">
                  {enquiry.student_name}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">College / University</span>
                <span className="text-white font-medium">
                  {enquiry.college_name}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">Course & Year</span>
                <span className="text-white font-medium">
                  {enquiry.course_branch_year}
                </span>
              </div>

              <div>
                <span className="text-[#666666] block">WhatsApp Number</span>
                <span className="text-white font-medium">
                  {enquiry.whatsapp_number}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={enquiryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !py-2.5 text-xs !bg-[#22c55e] !text-black font-semibold mt-2"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-3xl bg-[#141414] p-6 flex flex-col gap-3">
            <span className="text-xs font-semibold text-white">
              Workflow Status
            </span>

            {quotation ? (
              <div className="rounded-2xl bg-[#090909] p-4 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#999999]">Active Quote:</span>
                  <span className="font-semibold text-white">
                    {quotation.reference_no}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#999999]">Total Fee:</span>
                  <span className="font-semibold text-[#22c55e]">
                    ₹{quotation.quote_amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#888888]">
                  <span>50% Advance:</span>
                  <span>₹{quotation.advance_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#999999]">
                No official quotation created yet for this student requirement.
              </p>
            )}

            {!showQuoteForm && (
              <button
                type="button"
                onClick={() => setShowQuoteForm(true)}
                className="btn-secondary w-full justify-center !py-2.5 text-xs text-[#999999] hover:text-white"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create New / Revised Quote</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 2-Columns (Project Scope, Files, and Quotation Section) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Requirement Scope Card */}
          <div className="rounded-3xl bg-[#141414] p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0099ff]">
                Project Requirement Scope
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Target Deadline: {enquiry.deadline}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#666666] block">Project Topic</span>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                {enquiry.project_topic}
              </h2>
            </div>

            <div>
              <span className="text-xs text-[#666666] block">Selected Service</span>
              <span className="inline-block mt-1 rounded-full bg-[#1c1c1c] px-3 py-1 text-xs text-white font-medium">
                {enquiry.service_type}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#666666] block">
                Requirement Description & Guidelines
              </span>
              <div className="mt-2 rounded-2xl bg-[#090909] p-4 text-xs text-[#cccccc] leading-relaxed">
                {enquiry.requirement_description}
              </div>
            </div>
          </div>

          {/* Uploaded Documents Card */}
          <div className="rounded-3xl bg-[#141414] p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0099ff]">
                Uploaded Student Files ({enquiry.files.length})
              </span>
              <span className="text-xs text-[#22c55e] flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Encrypted Private Storage</span>
              </span>
            </div>

            {enquiry.files.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                {enquiry.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-2xl bg-[#090909] p-3.5 text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1c1c1c] text-[#0099ff]">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-white truncate max-w-xs sm:max-w-md">
                          {file.file_name}
                        </span>
                        <span className="text-[11px] text-[#666666]">
                          {(file.file_size_bytes / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/api/admin/files/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !text-xs !py-1.5 !px-3 text-[#999999] hover:text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#090909] p-6 text-center text-xs text-[#999999]">
                No files were attached with this submission.
              </div>
            )}
          </div>

          {/* Quotation Management Section */}
          <div className="rounded-3xl bg-[#141414] p-6 sm:p-8 flex flex-col gap-6 border border-[#262626]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#0099ff]" />
                <span className="text-sm font-semibold text-white">
                  Official Quotation & WhatsApp Offer
                </span>
              </div>

              {quotation && !showQuoteForm && (
                <span className="rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 px-2.5 py-0.5 text-[11px] text-[#22c55e] font-medium">
                  {quotation.reference_no}
                </span>
              )}
            </div>

            {quoteSuccessMsg && (
              <div className="rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 p-3 text-xs text-[#22c55e] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{quoteSuccessMsg}</span>
              </div>
            )}

            {/* Display existing quotation card */}
            {quotation && !showQuoteForm ? (
              <div className="rounded-2xl bg-[#090909] p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
                  <div>
                    <span className="text-[11px] text-[#666666] block">
                      Total Agreed Fee
                    </span>
                    <span className="text-xl font-bold text-white mt-1 block">
                      ₹{quotation.quote_amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#666666] block">
                      50% Advance Required
                    </span>
                    <span className="text-lg font-semibold text-[#0099ff] mt-1 block">
                      ₹{quotation.advance_amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#666666] block">
                      50% On Completion
                    </span>
                    <span className="text-lg font-semibold text-[#999999] mt-1 block">
                      ₹{quotation.remaining_balance.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#666666] block">
                    Defined Scope
                  </span>
                  <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">
                    {quotation.scope_summary}
                  </p>
                </div>

                {/* Direct Actions on Quotation */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <a
                    href={generateWhatsAppUrl(
                      enquiry.whatsapp_number,
                      buildQuotationWhatsAppMessage({
                        studentName: enquiry.student_name,
                        refNo: enquiry.reference_no,
                        quoteRef: quotation.reference_no,
                        projectTopic: enquiry.project_topic,
                        serviceType: enquiry.service_type,
                        totalAmount: quotation.quote_amount,
                        advanceAmount: quotation.advance_amount,
                        remainingBalance: quotation.remaining_balance,
                        validityDays: quotation.validity_days,
                      })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !bg-[#22c55e] !text-black font-semibold !py-2.5 !px-4 text-xs w-full sm:w-auto justify-center"
                  >
                    <MessageSquare className="h-3.5 w-3.5 fill-current" />
                    <span>Send / Re-Open in WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleConvertToOrder}
                    disabled={isConvertingOrder}
                    className="btn-primary !py-2.5 !px-4 text-xs w-full sm:w-auto justify-center"
                  >
                    {isConvertingOrder ? (
                      <span>Converting to Order...</span>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Accept & Convert to Active Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Quotation Creation Form */}
            {showQuoteForm && (
              <form
                onSubmit={handleCreateQuotation}
                className="flex flex-col gap-5"
              >
                {quoteError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{quoteError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Quote Amount Input */}
                  <div>
                    <label className="text-xs text-[#999999] block mb-1">
                      Total Quotation Amount (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                        <IndianRupee className="h-4 w-4" />
                      </div>
                      <input
                        type="number"
                        required
                        min="100"
                        step="50"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#262626] bg-[#090909] pl-9 pr-4 py-2.5 text-sm text-white input-focus-ring"
                        placeholder="e.g. 3500"
                      />
                    </div>
                  </div>

                  {/* Quote Validity */}
                  <div>
                    <label className="text-xs text-[#999999] block mb-1">
                      Quotation Validity (Days) *
                    </label>
                    <select
                      value={validityDays}
                      onChange={(e) => setValidityDays(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white input-focus-ring"
                    >
                      <option value={3}>3 Days (Urgent)</option>
                      <option value={5}>5 Days</option>
                      <option value={7}>7 Days (Standard)</option>
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                    </select>
                  </div>
                </div>

                {/* Real-time 50/50 Breakdown Display */}
                <div className="rounded-2xl bg-[#090909] p-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#666666] block">
                      50% Advance to Begin
                    </span>
                    <span className="text-base font-bold text-[#0099ff] mt-0.5 block">
                      ₹{advanceAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      Required before technical team starts
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666666] block">
                      50% Final Payment
                    </span>
                    <span className="text-base font-bold text-white mt-0.5 block">
                      ₹{remainingAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      Due upon completion before delivery
                    </span>
                  </div>
                </div>

                {/* Scope Summary Textarea */}
                <div>
                  <label className="text-xs text-[#999999] block mb-1">
                    Deliverable Scope Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={scopeSummary}
                    onChange={(e) => setScopeSummary(e.target.value)}
                    className="w-full rounded-xl border border-[#262626] bg-[#090909] p-3 text-xs text-white input-focus-ring leading-relaxed"
                    placeholder="Describe deliverables, IEEE format compliance, LaTeX or Word draft, number of slides..."
                  />
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="text-xs text-[#999999] block mb-1">
                    Internal Admin Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full rounded-xl border border-[#262626] bg-[#090909] px-4 py-2 text-xs text-white input-focus-ring"
                    placeholder="e.g. Student requested urgent turnaround by Friday morning"
                  />
                </div>

                {/* WhatsApp Message Preview Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0099ff] hover:underline"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>
                      {showPreview
                        ? "Hide WhatsApp Message Preview"
                        : "Preview WhatsApp Message"}
                    </span>
                  </button>

                  {showPreview && (
                    <pre className="mt-2 rounded-2xl bg-[#090909] p-4 text-xs font-mono text-[#aaaaaa] whitespace-pre-wrap leading-relaxed">
                      {previewText}
                    </pre>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingQuote || quoteAmount <= 0}
                    className="btn-primary !bg-[#22c55e] !text-black font-semibold !py-2.5 !px-5 text-xs justify-center"
                  >
                    {isSubmittingQuote ? (
                      <span>Generating Quotation...</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 fill-current" />
                        <span>Save Quotation & Open WhatsApp</span>
                      </>
                    )}
                  </button>

                  {quotation && (
                    <button
                      type="button"
                      onClick={() => setShowQuoteForm(false)}
                      className="btn-secondary !py-2.5 !px-4 text-xs text-[#999999] hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-[#999999] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Loading enquiry details...</span>
        </div>
      }
    >
      <EnquiryDetailContent params={params} />
    </Suspense>
  );
}
