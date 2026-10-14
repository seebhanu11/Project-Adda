import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageSquare, Compass } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "404 — Page Not Found | Project Adda",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Project Adda, I encountered a 404 page error and need assistance.")}`;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#090909] text-white py-16">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* Visual Icon Badge */}
        <div className="h-16 w-16 rounded-3xl bg-[#141414] flex items-center justify-center text-[#0099ff] border border-[#1c1c1c]">
          <Compass className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#0099ff]">
            Error 404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-xs text-[#999999] leading-relaxed mt-1">
            The page you are looking for does not exist, may have been relocated, or requires administrative clearance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
          <Link
            href="/"
            className="btn-primary w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/quote"
            className="btn-secondary w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs text-[#cccccc] hover:text-white"
          >
            <span>Request a Quote</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Direct WhatsApp help link */}
        <div className="pt-2 w-full text-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>Need immediate help? Message us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
