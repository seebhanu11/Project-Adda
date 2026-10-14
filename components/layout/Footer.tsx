import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE_CONFIG } from "@/lib/config";
import { ShieldCheck, MessageSquare, Mail, Lock } from "lucide-react";

export function Footer() {
  const currentYear = 2026;
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <footer className="w-full bg-[#070707] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo withTagline={true} />
            <p className="max-w-sm text-sm leading-relaxed text-[#999999]">
              Specialized academic formatting and presentation design for college students. We turn your research, code, and project ideas into defense-ready documentation.
            </p>

            <div className="mt-2 flex flex-col gap-2 text-xs text-[#999999]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
                <span>100% Private and Confidential Student Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0099ff]" />
                <span>Encrypted Private Storage for Submitted Files</span>
              </div>
            </div>
          </div>

          {/* Column 1: Services */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-white">
              Services
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#999999]">
              <li>
                <Link href="/services#documentation" className="hover:text-white transition-colors">
                  Documentation Editing
                </Link>
              </li>
              <li>
                <Link href="/services#seminar" className="hover:text-white transition-colors">
                  Seminar Presentation Design
                </Link>
              </li>
              <li>
                <Link href="/services#internship" className="hover:text-white transition-colors">
                  Internship Report Formatting
                </Link>
              </li>
              <li>
                <Link href="/services#guidance" className="hover:text-white transition-colors">
                  Academic Project Guidance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-white">
              Navigation
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#999999]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Sample Work / Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white transition-colors">
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors text-xs text-[#666666]">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-white">
              Direct Contact
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#999999]">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#22c55e] hover:underline"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#999999]" />
                <span>{SITE_CONFIG.email}</span>
              </li>
              <li className="text-xs text-[#666666] pt-1">
                {SITE_CONFIG.supportHours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 text-xs text-[#999999] sm:flex-row">
          <p>© {currentYear} Project Adda. All rights reserved. Your Ideas. Our Space.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#333333]">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

