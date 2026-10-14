import Link from "next/link";
import { MessageSquare, Mail, Clock, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Contact Us — Project Adda",
  description:
    "Connect directly with Project Adda for academic project documentation, presentation design, and urgent quotation enquiries.",
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <div className="flex flex-col gap-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <span className="text-sm font-medium text-[#0099ff]">
          Get in touch
        </span>
        <h1 className="display-xl text-white">
          We Are Here To Help You Pass With Distinction.
        </h1>
        <p className="text-base sm:text-lg text-[#999999] leading-relaxed">
          Need a quick quotation, have an urgent submission tomorrow, or want to discuss specific college guidelines? Connect with our team directly.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Channel (Recommended) */}
        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22c55e]/20 text-[#22c55e]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-[#22c55e]">
                Fastest Response
              </span>
              <h3 className="text-xl font-semibold text-white mt-1">
                WhatsApp Direct Chat
              </h3>
            </div>
            <p className="text-sm text-[#999999] leading-relaxed">
              Open a real-time conversation with an academic editor. Send your drafts, ask questions, and receive your quotation quickly.
            </p>
          </div>

          <div className="mt-8 pt-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !py-3 !bg-[#22c55e] !text-black font-semibold text-sm"
            >
              <MessageSquare className="h-4 w-4 fill-current" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Email Support */}
        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0099ff]/20 text-[#0099ff]">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-[#0099ff]">
                Official Inquiries
              </span>
              <h3 className="text-xl font-semibold text-white mt-1">
                Email Support
              </h3>
            </div>
            <p className="text-sm text-[#999999] leading-relaxed">
              Prefer communicating via email? Send your project briefs, college rubrics, or institutional requests to our central inbox.
            </p>
            <div className="mt-2 text-sm text-white font-medium">
              {SITE_CONFIG.email}
            </div>
          </div>

          <div className="mt-8 pt-4">
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="btn-secondary w-full justify-center !py-3 text-sm text-[#999999] hover:text-white"
            >
              <Mail className="h-4 w-4" />
              <span>Send an Email</span>
            </a>
          </div>
        </div>

        {/* Working Hours & SLA */}
        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffffff]/10 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-[#999999]">
                Working Hours
              </span>
              <h3 className="text-xl font-semibold text-white mt-1">
                Active Operations
              </h3>
            </div>
            <p className="text-sm text-[#999999] leading-relaxed">
              Our technical editing desk is active 6 days a week. Urgent evening submissions are monitored for time-sensitive deadlines.
            </p>
            <div className="mt-2 text-sm text-white font-medium">
              {SITE_CONFIG.supportHours}
            </div>
          </div>

          <div className="mt-8 pt-4">
            <Link
              href="/quote"
              className="btn-secondary w-full justify-center !py-3 text-sm text-[#999999] hover:text-white"
            >
              <span>Submit Project Form</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Banner */}
      <div className="rounded-3xl bg-[#141414] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <h3 className="text-xl font-semibold text-white">
            Ready to Submit Your Project Files?
          </h3>
          <p className="text-sm text-[#999999]">
            Use our private requirement form to upload your files (PDF, DOCX, PPTX). You receive a unique tracking reference number upon submission.
          </p>
        </div>
        <Link href="/quote" className="btn-primary !px-7 !py-3 text-sm shrink-0">
          <span>Go to Requirement Form</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

