import Link from "next/link";
import { ArrowUpRight, ShieldCheck, HeartHandshake, Eye } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "About Us — Project Adda",
  description:
    "Learn about Project Adda's mission, ethics, and academic formatting standards for college students across engineering, science, and computer applications.",
};

export default function AboutPage() {
  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <div className="flex flex-col gap-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <span className="text-sm font-medium text-[#0099ff]">
          About Project Adda
        </span>
        <h1 className="display-xl text-white">
          Your Ideas. Our Space.
        </h1>
        <p className="text-base sm:text-lg text-[#999999] leading-relaxed">
          Project Adda was built to solve a universal struggle in higher education: students spend months writing code, conducting experiments, and building hardware, only to lose crucial grades because of disorganized documentation, broken citations, and rushed slide decks.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0099ff]/15 text-[#0099ff]">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Academic Precision
            </h3>
            <p className="text-sm text-[#999999] leading-relaxed">
              We understand the exact rules of academic formatting: margin symmetry for hard-binding, roman numeral preliminaries, IEEE citation styles, mathematical typesetting, and auto-generated tables of contents.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22c55e]/15 text-[#22c55e]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Absolute Confidentiality
            </h3>
            <p className="text-sm text-[#999999] leading-relaxed">
              Your research, code, project topics, and student identity are treated with strict confidentiality. Files submitted are stored on private encrypted storage and are never published, shared, or indexed.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Student-First Fairness
            </h3>
            <p className="text-sm text-[#999999] leading-relaxed">
              We do not charge inflated flat fees or demand 100% upfront payment. We review your document first, provide an honest quotation, and work on a clear 50% advance and 50% completion model.
            </p>
          </div>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="rounded-3xl bg-[#141414] p-8 sm:p-14 flex flex-col gap-8 max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Why Project Adda?
        </h2>
        <div className="flex flex-col gap-4 text-sm sm:text-base text-[#999999] leading-relaxed">
          <p>
            In Indian student culture, an Adda is the trusted meeting place where ideas take shape, where seniors mentor juniors, and where intense exam discussions happen over chai.
          </p>
          <p>
            We created <strong>Project Adda</strong> as that exact digital space: a reliable, stress-free haven where engineering, BCA, MCA, and science students can bring their rough project drafts and walk out with defense-grade, publication-quality documents.
          </p>
          <p>
            Whether your deadline is three weeks away or in 48 hours, our technical team works with you directly on WhatsApp to ensure your documentation earns the presentation marks your hard work deserves.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="text-xs text-[#999999]">
            Ready to collaborate with our team?
          </div>
          <div className="flex items-center gap-3">
            <Link href="/quote" className="btn-primary !text-xs !py-2.5 !px-5">
              <span>Request a Quote</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-xs !py-2.5 !px-5 text-[#999999]"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

