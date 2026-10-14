"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Presentation,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Lock,
  Clock,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export default function HomePage() {
  // Live Estimator State
  const [selectedService, setSelectedService] = useState("documentation");
  const [scopeVolume, setScopeVolume] = useState("medium");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 sm:pt-28 lg:pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center sm:text-left">
        <div className="flex flex-col gap-8 max-w-5xl">
          {/* Live indicator badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#141414] px-4 py-1.5 text-xs text-[#999999] w-fit mx-auto sm:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-[#22c55e]" />
            <span>Academic Season 2026 Admissions & Final Year Guidance Open</span>
          </div>

          {/* Poster-grade Display Headline */}
          <h1 className="display-xxl text-white">
            Your Ideas. <br />
            <span className="text-[#999999]">Our Space.</span>
          </h1>

          {/* Subhead narrative */}
          <p className="max-w-2xl text-lg sm:text-xl text-[#999999] leading-relaxed">
            Professional project documentation formatting, defense-grade seminar presentations, and internship report structuring for engineering and postgraduate students.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center sm:justify-start">
            <Link
              href="/quote"
              className="btn-primary !px-7 !py-3.5 text-base w-full sm:w-auto justify-center"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/portfolio"
              className="btn-secondary !px-7 !py-3.5 text-base w-full sm:w-auto justify-center text-[#999999] hover:text-white"
            >
              <span>View Sample Formats</span>
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#22c55e] hover:underline px-3 py-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Direct WhatsApp Help</span>
            </a>
          </div>

          {/* Reassurance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 text-xs text-[#999999]">
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-[#0099ff]" />
              <span>Strictly Private and Confidential</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-[#22c55e]" />
              <span>Guaranteed Deadline Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <CheckCircle2 className="h-4 w-4 text-[#ffffff]" />
              <span>50% Advance, 50% on Final Approval</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (Atmosphere Cards) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-12">
          <span className="text-sm font-medium text-[#0099ff]">
            What We Do
          </span>
          <h2 className="display-lg text-white">
            Engineered for Academic Rigor
          </h2>
          <p className="text-base text-[#999999] max-w-2xl">
            We do not use generic templates. Every documentation, slide deck, and report is aligned with your college guidelines and academic style books.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service 1: Documentation (Violet Atmosphere) */}
          <div className="group relative rounded-3xl bg-[#141414] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6a4cf5]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6a4cf5]/20 text-[#6a4cf5]">
                  <FileText className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-[#999999] bg-[#1c1c1c] rounded-full px-3 py-1">
                  IEEE, Springer, University Guide
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white tracking-tight mb-3">
                  Project Documentation Editing and Formatting
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Complete structural alignment: abstract, chapter breakdown, mathematical equation formatting, figure numbering, table of contents, and BibTeX/IEEE citations.
                </p>
              </div>

              <ul className="flex flex-col gap-2 text-xs text-[#cccccc]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6a4cf5]" />
                  <span>Grammar, tone, and technical flow enhancement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6a4cf5]" />
                  <span>Plagiarism-conscious rephrasing and structural review</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6a4cf5]" />
                  <span>LaTeX source files or Microsoft Word delivery</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between relative z-10">
              <span className="text-xs text-[#999999]">Personalized Quotation</span>
              <Link
                href="/quote?service=documentation"
                className="btn-secondary !text-xs !py-2 !px-4"
              >
                <span>Get Quote for Documentation</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 2: Seminar Presentation (Magenta Atmosphere) */}
          <div className="group relative rounded-3xl bg-[#141414] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d44df0]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d44df0]/20 text-[#d44df0]">
                  <Presentation className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-[#999999] bg-[#1c1c1c] rounded-full px-3 py-1">
                  16:9 HD Defense Ready
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white tracking-tight mb-3">
                  Seminar Presentation Design and Editing
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Turn dense technical reports into high-clarity seminar decks with clean typography, custom architecture diagrams, and speaker talking-points.
                </p>
              </div>

              <ul className="flex flex-col gap-2 text-xs text-[#cccccc]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d44df0]" />
                  <span>Clean slide structure built for 10 to 20 minute presentations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d44df0]" />
                  <span>System architecture flowcharts and block diagrams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d44df0]" />
                  <span>PowerPoint (.pptx) and PDF export with source assets</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between relative z-10">
              <span className="text-xs text-[#999999]">Personalized Quotation</span>
              <Link
                href="/quote?service=seminar"
                className="btn-secondary !text-xs !py-2 !px-4"
              >
                <span>Get Quote for Presentation</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 3: Internship Reports (Orange Atmosphere) */}
          <div className="group relative rounded-3xl bg-[#141414] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a3d]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff7a3d]/20 text-[#ff7a3d]">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-[#999999] bg-[#1c1c1c] rounded-full px-3 py-1">
                  Compliance Checked
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white tracking-tight mb-3">
                  Internship Report Formatting
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Tailored formatting for corporate training reports, weekly activity diaries, company profile inclusion, and official certificate page alignments.
                </p>
              </div>

              <ul className="flex flex-col gap-2 text-xs text-[#cccccc]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  <span>Weekly progress log tables and task breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  <span>Sign-off and approval page templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  <span>Clean executive summaries of tools and tech learned</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between relative z-10">
              <span className="text-xs text-[#999999]">Personalized Quotation</span>
              <Link
                href="/quote?service=internship"
                className="btn-secondary !text-xs !py-2 !px-4"
              >
                <span>Get Quote for Report</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 4: Academic Guidance (Coral Atmosphere) */}
          <div className="group relative rounded-3xl bg-[#141414] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5577]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5577]/20 text-[#ff5577]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-[#999999] bg-[#1c1c1c] rounded-full px-3 py-1">
                  1-on-1 Consultation
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white tracking-tight mb-3">
                  Academic Project Guidance
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Clarify difficult project requirements, organize methodology chapters, formulate problem statements, and prep for external viva evaluation.
                </p>
              </div>

              <ul className="flex flex-col gap-2 text-xs text-[#cccccc]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff5577]" />
                  <span>Problem statement framing and objective setting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff5577]" />
                  <span>Methodology and tech stack architecture validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ff5577]" />
                  <span>Viva-voce Q&A mock prep guidance</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 flex items-center justify-between relative z-10">
              <span className="text-xs text-[#999999]">Personalized Quotation</span>
              <Link
                href="/quote?service=guidance"
                className="btn-secondary !text-xs !py-2 !px-4"
              >
                <span>Get Guidance Quote</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SCOPE PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-[#0f0f0f] p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <span className="text-sm font-medium text-[#0099ff]">
              Interactive Scope Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
              Select Your Requirement Parameters
            </h2>
            <p className="text-sm text-[#999999] mt-2">
              Select your expected service details to preview turnaround milestones. Submit the form to receive an exact quotation on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control 1: Service */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#999999]">
                Service Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "documentation", label: "Documentation Formatting" },
                  { id: "seminar", label: "Seminar Slides Design" },
                  { id: "internship", label: "Internship Report" },
                  { id: "guidance", label: "Project Guidance" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                      selectedService === s.id
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#141414] text-[#999999] hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Scope Volume */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#999999]">
                Project Scale / Volume
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "small", label: "Compact (under 25 Pages or 15 Slides)", time: "24 to 48 Hours" },
                  { id: "medium", label: "Standard (25 to 60 Pages or 15 to 30 Slides)", time: "2 to 4 Days" },
                  { id: "large", label: "Extensive (60+ Pages or Full Thesis)", time: "4 to 7 Days" },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setScopeVolume(v.id)}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                      scopeVolume === v.id
                        ? "bg-[#1c1c1c] text-white"
                        : "bg-[#141414] text-[#999999] hover:text-white"
                    }`}
                  >
                    <div>{v.label}</div>
                    <div className="text-xs text-[#666666] mt-0.5">{v.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Indicator Result Panel */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#141414] p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs text-[#999999]">Estimated Timeline</span>
                  <span className="text-sm font-medium text-[#22c55e]">
                    {scopeVolume === "small"
                      ? "1 to 2 Business Days"
                      : scopeVolume === "medium"
                      ? "2 to 4 Business Days"
                      : "4 to 7 Business Days"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs text-[#999999]">
                  <div className="flex justify-between">
                    <span>Payment Model:</span>
                    <span className="text-white">50% Advance, 50% Final</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Formats:</span>
                    <span className="text-white">PDF and Editable DOCX/PPTX</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revisions:</span>
                    <span className="text-white">Included until Guide Approval</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#090909] p-3 text-xs text-[#999999]">
                  Pricing is customized per project based on technical depth, page volume, and deadline.
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  href={`/quote?service=${selectedService}&volume=${scopeVolume}`}
                  className="btn-primary w-full justify-center !py-3 text-sm"
                >
                  <span>Submit Exact Details</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW: 4 STEP PROCESS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-16 text-center sm:text-left">
          <span className="text-sm font-medium text-[#0099ff]">
            How It Works
          </span>
          <h2 className="display-lg text-white">
            Simple, Transparent, Protected
          </h2>
          <p className="text-base text-[#999999] max-w-2xl">
            From initial submission to final delivery, your requirements and documents remain confidential with zero hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "Step 1",
              title: "Submit Requirements",
              desc: "Provide your topic, college guidelines, deadline, and rough drafts or reference files through our private form.",
            },
            {
              step: "Step 2",
              title: "Receive Custom Quote",
              desc: "Our team reviews the complexity, formats, and timeline, then shares an itemized quotation directly on WhatsApp.",
            },
            {
              step: "Step 3",
              title: "50% Advance and Execution",
              desc: "Confirm via manual UPI payment. Work commences immediately with regular milestone previews.",
            },
            {
              step: "Step 4",
              title: "Final Payment and Delivery",
              desc: "Review the watermark or sample result. Settle the 50% balance to download your final clean source documents.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#141414] p-6 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-[#0099ff]">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SAMPLE WORK SNEAK PEEK */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-[#0099ff]">
              Standard Portfolio Previews
            </span>
            <h2 className="display-md text-white mt-1">
              Sample Formatting Layouts
            </h2>
            <p className="text-sm text-[#999999] mt-2">
              Every document is set with crisp margins, proper typography hierarchies, and compliant citations.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="btn-secondary !text-xs !py-2.5 !px-5 self-start sm:self-auto"
          >
            <span>Explore Complete Sample Gallery</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Sample Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#141414] p-5 flex flex-col gap-4">
            <div className="rounded-xl bg-[#090909] p-4 text-xs text-[#999999] h-40 flex flex-col justify-center">
              <div className="pb-2 text-[11px] text-[#0099ff] font-medium">
                IEEE Format Specification
              </div>
              <div className="mt-2 text-white text-sm font-medium">
                Two-column layout, Times / Computer Modern 10pt
              </div>
              <div className="mt-1 text-[11px] text-[#666666]">
                Equations numbered (1), (2), High-res SVG figure alignment
              </div>
            </div>
            <div className="text-xs text-[#999999]">
              <span className="text-white font-medium">Project Documentation Sample</span>
              <p className="mt-0.5 text-[11px] text-[#666666]">[Standard Engineering Thesis Layout]</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#141414] p-5 flex flex-col gap-4">
            <div className="rounded-xl bg-[#090909] p-4 text-xs text-[#999999] h-40 flex flex-col justify-center">
              <div className="pb-2 text-[11px] text-[#d44df0] font-medium">
                Seminar Slide Deck Architecture
              </div>
              <div className="mt-2 text-white text-sm font-medium">
                16:9 Dark and Light High-Contrast Presentation
              </div>
              <div className="mt-1 text-[11px] text-[#666666]">
                Modular cards, Visual flow diagrams, Zero bullet overload
              </div>
            </div>
            <div className="text-xs text-[#999999]">
              <span className="text-white font-medium">Seminar Deck Sample</span>
              <p className="mt-0.5 text-[11px] text-[#666666]">[Viva Presentation Template]</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#141414] p-5 flex flex-col gap-4">
            <div className="rounded-xl bg-[#090909] p-4 text-xs text-[#999999] h-40 flex flex-col justify-center">
              <div className="pb-2 text-[11px] text-[#ff7a3d] font-medium">
                Internship Compliance Record
              </div>
              <div className="mt-2 text-white text-sm font-medium">
                Tabular Weekly Work Logs and Certificate Framing
              </div>
              <div className="mt-1 text-[11px] text-[#666666]">
                Guide sign-off fields, Corporate training summary structure
              </div>
            </div>
            <div className="text-xs text-[#999999]">
              <span className="text-white font-medium">Internship Report Sample</span>
              <p className="mt-0.5 text-[11px] text-[#666666]">[University Compliance Template]</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center sm:text-left mb-10">
          <span className="text-sm font-medium text-[#0099ff]">
            Frequently Asked Questions
          </span>
          <h2 className="display-md text-white mt-1">
            Questions College Students Ask Us
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              q: "Why isn't there a fixed price listed for documentation or presentations?",
              a: "Academic projects differ wildly in scope. An 80-page computer vision documentation with custom mathematical formulas and architecture diagrams requires far more technical rigor than a 15-page survey report. We review your draft or syllabus requirements first and calculate an honest, affordable quote.",
            },
            {
              q: "Are my project documents, code, and personal details safe?",
              a: "100% yes. Files uploaded to Project Adda are stored inside private, encrypted storage buckets with zero public access. Your contact details and project files are accessible only to our active editing team and are never shared or resold.",
            },
            {
              q: "How does the payment workflow operate?",
              a: "Once we agree on your quotation on WhatsApp, you pay a 50% advance via UPI (Google Pay, PhonePe, Paytm). We complete the work, send you preview samples for review, make any necessary adjustments requested by your college guide, and release the complete source files after the remaining 50% balance payment.",
            },
            {
              q: "What if my college guide requests revisions in the documentation?",
              a: "We support reasonable revision rounds based on the initial agreed scope until your guide approves the formatting and presentation structure.",
            },
            {
              q: "Can you accommodate urgent deadlines?",
              a: "Yes. When submitting your requirement, specify your exact submission date and time. For urgent turnarounds (under 24 to 48 hours), we allocate dedicated priority time to meet your deadline.",
            },
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="rounded-2xl bg-[#141414] p-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left text-base font-medium text-white transition-colors hover:text-[#0099ff]"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#999999] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#999999] leading-relaxed pr-6">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. HIGH IMPACT FINAL CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl bg-[#141414] p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#6a4cf5]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <span className="text-sm font-medium text-[#0099ff]">
              Don't Risk Last-Minute Viva Stress
            </span>

            <h2 className="display-lg text-white">
              Get Your Project Formatted Professionally
            </h2>

            <p className="text-base text-[#999999]">
              Submit your project title, college guidelines, and rough draft now. Receive a clear, personalized quotation on WhatsApp within hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/quote" className="btn-primary !px-8 !py-3.5 text-base">
                <span>Request a Quote Now</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-6 !py-3.5 text-base text-[#999999] hover:text-white"
              >
                <MessageSquare className="h-4 w-4 text-[#22c55e]" />
                <span>Chat with an Editor</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

