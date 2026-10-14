"use client";

import { MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function WhatsAppFloat() {
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip prompt on desktop hover */}
      <div className="mr-3 hidden rounded-xl border border-[#262626] bg-[#141414] px-3.5 py-1.5 text-xs font-medium text-white transition-opacity md:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
        Chat with our team
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Project Adda on WhatsApp"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#22c55e] text-black transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="h-6 w-6 text-black fill-current" />
      </a>
    </div>
  );
}
