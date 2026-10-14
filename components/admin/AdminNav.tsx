"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ShoppingBag } from "lucide-react";

function AdminNavLinks() {
  const pathname = usePathname();

  const isEnquiries = pathname.startsWith("/admin/enquiries");
  const isOrders = pathname.startsWith("/admin/orders");

  return (
    <nav className="flex items-center gap-2 pl-2 sm:pl-4">
      <Link
        href="/admin/enquiries"
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
          isEnquiries
            ? "bg-[#1c1c1c] text-white"
            : "text-[#999999] hover:bg-[#1c1c1c] hover:text-white"
        }`}
      >
        <FileText
          className={`h-3.5 w-3.5 ${
            isEnquiries ? "text-[#0099ff]" : "text-[#888888]"
          }`}
        />
        <span>Enquiries</span>
      </Link>

      <Link
        href="/admin/orders"
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
          isOrders
            ? "bg-[#1c1c1c] text-white"
            : "text-[#999999] hover:bg-[#1c1c1c] hover:text-white"
        }`}
      >
        <ShoppingBag
          className={`h-3.5 w-3.5 ${
            isOrders ? "text-[#22c55e]" : "text-[#888888]"
          }`}
        />
        <span>Orders & Payments</span>
      </Link>
    </nav>
  );
}

export function AdminNav() {
  return (
    <Suspense
      fallback={
        <nav className="flex items-center gap-2 pl-2 sm:pl-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1c1c1c] px-4 py-2 text-xs font-medium text-white">
            <FileText className="h-3.5 w-3.5 text-[#0099ff]" />
            <span>Enquiries</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#999999]">
            <ShoppingBag className="h-3.5 w-3.5 text-[#22c55e]" />
            <span>Orders & Payments</span>
          </span>
        </nav>
      }
    >
      <AdminNavLinks />
    </Suspense>
  );
}

