"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error code for diagnostics without sensitive payload exposure
    console.error("Application error boundary triggered:", error.digest || error.message);
  }, [error]);

  const whatsappSupportUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Hello Project Adda Support, I encountered a system error (Code: ${
      error.digest || "ERR_RUNTIME"
    }).`
  )}`;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#090909] text-white py-16">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* Error Icon Badge */}
        <div className="h-16 w-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-red-400">
            System Notice
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Something Went Wrong
          </h1>
          <p className="text-xs text-[#999999] leading-relaxed mt-1">
            An unexpected error occurred while loading this view. Your session and entered data are safeguarded.
          </p>
          {error.digest && (
            <p className="text-[11px] text-[#666666] mt-1">
              Error Reference: <code>{error.digest}</code>
            </p>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="btn-secondary w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs text-[#cccccc] hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* WhatsApp Help */}
        <div className="pt-2 w-full text-center">
          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>Contact Technical Desk on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
