"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  IndianRupee,
  Calendar,
} from "lucide-react";
import { MOCK_ORDERS, MockOrder } from "@/lib/mock-data";

const STATUS_FILTERS = [
  "All",
  "Awaiting Advance",
  "In Progress",
  "Awaiting Final Payment",
  "Completed",
  "Cancelled",
] as const;

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("status") || "All";

  const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate high-level pipeline totals
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const awaitingAdvanceCount = orders.filter(
      (o) => o.status === "Awaiting Advance"
    ).length;
    const inProgressCount = orders.filter(
      (o) => o.status === "In Progress"
    ).length;
    const completedCount = orders.filter(
      (o) => o.status === "Completed"
    ).length;
    const totalPipelineValue = orders.reduce(
      (acc, o) => acc + Number(o.total_amount),
      0
    );
    const totalOutstandingBalance = orders.reduce(
      (acc, o) => acc + Number(o.balance_due),
      0
    );

    return {
      totalCount,
      awaitingAdvanceCount,
      inProgressCount,
      completedCount,
      totalPipelineValue,
      totalOutstandingBalance,
    };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        selectedFilter === "All" || order.status === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.order_number.toLowerCase().includes(q) ||
        order.student_name.toLowerCase().includes(q) ||
        order.college_name.toLowerCase().includes(q) ||
        order.project_topic.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

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

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Orders & Manual Payments
            </h1>
            <span className="rounded-full bg-[#1c1c1c] px-2.5 py-0.5 text-xs text-[#22c55e] font-semibold">
              {stats.totalCount} active
            </span>
          </div>
          <p className="text-xs text-[#999999] mt-1">
            Track student projects, 50% advance milestones, UPI verification, and final handoffs.
          </p>
        </div>

        <Link
          href="/admin/enquiries"
          className="btn-secondary !text-xs !py-2 !px-4 text-[#999999] hover:text-white self-start sm:self-auto"
        >
          <span>View Enquiries Desk</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Metric Cards (Taste-compliant, non-slop restrained surface styling) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1 border border-[#1c1c1c]">
          <span className="text-[11px] text-[#666666] font-medium">
            Awaiting Advance (50%)
          </span>
          <span className="text-2xl font-bold text-amber-400">
            {stats.awaitingAdvanceCount}
          </span>
          <span className="text-[11px] text-[#888888]">
            Pending student transfer
          </span>
        </div>

        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1 border border-[#1c1c1c]">
          <span className="text-[11px] text-[#666666] font-medium">
            In Progress
          </span>
          <span className="text-2xl font-bold text-[#0099ff]">
            {stats.inProgressCount}
          </span>
          <span className="text-[11px] text-[#888888]">
            Advance confirmed & active
          </span>
        </div>

        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1 border border-[#1c1c1c]">
          <span className="text-[11px] text-[#666666] font-medium">
            Completed Projects
          </span>
          <span className="text-2xl font-bold text-[#22c55e]">
            {stats.completedCount}
          </span>
          <span className="text-[11px] text-[#888888]">
            100% settled & delivered
          </span>
        </div>

        <div className="rounded-2xl bg-[#141414] p-4 flex flex-col gap-1 border border-[#1c1c1c]">
          <span className="text-[11px] text-[#666666] font-medium">
            Outstanding Due
          </span>
          <span className="text-2xl font-bold text-white">
            ₹{stats.totalOutstandingBalance.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-[#888888]">
            Remaining balance pending
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-white text-neutral-950 font-semibold"
                  : "bg-[#141414] text-[#999999] hover:bg-[#1c1c1c] hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ref, student, topic..."
            className="w-full rounded-full border border-[#262626] bg-[#141414] pl-9 pr-4 py-1.5 text-xs text-white input-focus-ring"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div data-ui="orders-table" className="overflow-hidden rounded-3xl bg-[#141414]">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090909] text-[#666666]">
                <tr>
                  <th className="py-3.5 px-6 font-medium">Order Number</th>
                  <th className="py-3.5 px-6 font-medium">Student & College</th>
                  <th className="py-3.5 px-6 font-medium">Service & Topic</th>
                  <th className="py-3.5 px-6 font-medium">Financials (₹)</th>
                  <th className="py-3.5 px-6 font-medium">Target Delivery</th>
                  <th className="py-3.5 px-6 font-medium">Status</th>
                  <th className="py-3.5 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const cleanWa = order.whatsapp_number.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${cleanWa}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#1a1a1a] transition-colors"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-6 font-medium text-white whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-[#0099ff] transition-colors flex flex-col"
                        >
                          <span className="font-semibold">{order.order_number}</span>
                          <span className="text-[11px] text-[#666666]">
                            Ref: {order.enquiry_ref}
                          </span>
                        </Link>
                      </td>

                      {/* Student & College */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {order.student_name}
                          </span>
                          <span className="text-[11px] text-[#888888] truncate max-w-[180px]">
                            {order.college_name}
                          </span>
                        </div>
                      </td>

                      {/* Service & Topic */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-white line-clamp-1">
                            {order.project_topic}
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            {order.service_type}
                          </span>
                        </div>
                      </td>

                      {/* Financials (Total / Advance / Due) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">
                              ₹{order.total_amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-[#22c55e]">
                              Adv: ₹{order.advance_paid.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[#666666]">•</span>
                            <span
                              className={
                                order.balance_due > 0
                                  ? "text-amber-400 font-medium"
                                  : "text-[#666666]"
                              }
                            >
                              Due: ₹{order.balance_due.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Target Delivery */}
                      <td className="py-4 px-6 whitespace-nowrap text-[#999999]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-[#666666]" />
                          <span>{order.target_delivery_date}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#1c1c1c] p-2 text-[#22c55e] hover:bg-[#262626] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5 fill-current" />
                          </a>

                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="btn-secondary !text-xs !py-1.5 !px-3 text-[#999999] hover:text-white"
                          >
                            <span>Manage</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#999999] flex flex-col items-center justify-center gap-3">
            <ShoppingBag className="h-8 w-8 text-[#666666]" />
            <p className="text-sm font-medium text-white">No orders match criteria</p>
            <p className="text-xs text-[#666666]">
              Try adjusting your filter or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-[#999999] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Loading orders pipeline...</span>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
