"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { MOCK_ENQUIRIES, MockEnquiry } from "@/lib/mock-data";

function EnquiriesDashboardContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [enquiries] = useState<MockEnquiry[]>(MOCK_ENQUIRIES);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Status Metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "New").length;
  const underReviewCount = enquiries.filter((e) => e.status === "Under Review").length;
  const quotedCount = enquiries.filter((e) => e.status === "Quoted").length;
  const approvedCount = enquiries.filter((e) => e.status === "Approved").length;

  // Filter & Search Logic
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus =
      statusFilter === "All" ? true : enq.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      enq.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.reference_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.project_topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const isUrgent = (deadlineDate: string) => {
    if (!isMounted) return false;
    const d = new Date(deadlineDate);
    const now = new Date();
    const diffHours = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 72;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Student Requirement Enquiries
          </h1>
          <p className="text-xs text-[#999999] mt-1">
            Review incoming student project requests, inspect files, and prepare customized quotations.
          </p>
        </div>

        <Link
          href="/quote"
          target="_blank"
          className="btn-secondary !text-xs !py-2 !px-4 self-start sm:self-auto"
        >
          <span>Open Public Form Preview</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1">
          <span className="text-xs text-[#999999]">Total Enquiries</span>
          <span className="text-2xl font-semibold text-white">{totalCount}</span>
        </div>
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1">
          <span className="text-xs text-[#0099ff]">New Submissions</span>
          <span className="text-2xl font-semibold text-[#0099ff]">{newCount}</span>
        </div>
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1">
          <span className="text-xs text-amber-400">Under Review</span>
          <span className="text-2xl font-semibold text-amber-400">
            {underReviewCount}
          </span>
        </div>
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1">
          <span className="text-xs text-[#d44df0]">Quoted</span>
          <span className="text-2xl font-semibold text-[#d44df0]">{quotedCount}</span>
        </div>
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
          <span className="text-xs text-[#22c55e]">Approved Orders</span>
          <span className="text-2xl font-semibold text-[#22c55e]">
            {approvedCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            "All",
            "New",
            "Under Review",
            "Quoted",
            "Approved",
            "Rejected",
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                statusFilter === status
                  ? "bg-[#1c1c1c] text-white border border-[#333333]"
                  : "bg-[#141414] text-[#999999] hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, topic, reference..."
            className="w-full rounded-full border border-[#262626] bg-[#141414] pl-10 pr-4 py-2 text-xs text-white placeholder-[#555555] input-focus-ring"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-3xl bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-[#999999]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Reference</th>
                <th className="py-3.5 px-4 font-medium">Student & College</th>
                <th className="py-3.5 px-4 font-medium">Service</th>
                <th className="py-3.5 px-4 font-medium">Deadline</th>
                <th className="py-3.5 px-4 font-medium">Files</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => {
                  const urgent = isUrgent(enq.deadline);
                  const cleanWa = enq.whatsapp_number.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `Hello ${enq.student_name}, this is Project Adda regarding your enquiry ${enq.reference_no} for "${enq.project_topic}".`
                  )}`;

                  return (
                    <tr
                      key={enq.id}
                      className="hover:bg-[#181818]/70 transition-colors"
                    >
                      {/* Reference No */}
                      <td className="py-4 px-4 font-medium text-white whitespace-nowrap">
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="text-[#0099ff] hover:underline"
                        >
                          {enq.reference_no}
                        </Link>
                      </td>

                      {/* Student & College */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="font-medium text-white truncate">
                          {enq.student_name}
                        </div>
                        <div className="text-[#666666] truncate text-[11px] mt-0.5">
                          {enq.college_name}
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-4 max-w-[200px] text-[#cccccc]">
                        <span className="truncate block">
                          {enq.service_type}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={urgent ? "text-amber-400 font-medium" : "text-[#999999]"}>
                            {enq.deadline}
                          </span>
                          {urgent && (
                            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400 font-medium">
                              Urgent
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Files */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {enq.files.length > 0 ? (
                          <div className="inline-flex items-center gap-1 text-[#999999]">
                            <Paperclip className="h-3 w-3" />
                            <span>{enq.files.length}</span>
                          </div>
                        ) : (
                          <span className="text-[#555555]">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadge(
                            enq.status
                          )}`}
                        >
                          {enq.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#22c55e]/15 p-1.5 text-[#22c55e] hover:bg-[#22c55e]/25 transition-colors"
                            title="Open direct WhatsApp conversation"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>

                          <Link
                            href={`/admin/enquiries/${enq.id}`}
                            className="rounded-lg bg-[#1c1c1c] px-3 py-1.5 text-xs text-white hover:bg-[#262626] transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#999999]">
                    No enquiries match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function EnquiriesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-[#999999] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Loading enquiries dashboard...</span>
        </div>
      }
    >
      <EnquiriesDashboardContent />
    </Suspense>
  );
}
