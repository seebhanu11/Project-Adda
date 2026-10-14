import Link from "next/link";
import {
  FileText,
  Presentation,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Our Academic Services — Project Adda",
  description:
    "Explore our professional academic services: project documentation editing, seminar presentation design, internship report formatting, and technical project guidance.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <span className="text-sm font-medium text-[#0099ff]">
          Specialized Academic Services
        </span>
        <h1 className="display-xl text-white">
          Precision Formatting for College Submissions
        </h1>
        <p className="text-base sm:text-lg text-[#999999] leading-relaxed">
          From first-draft chaos to publication-grade documentation. We structure, edit, and polish your academic work according to your department's exact guidelines. No fixed pricing: every quotation is tailored to your document's volume and technical complexity.
        </p>
      </div>

      {/* Services Detailed Breakdown */}
      <div className="flex flex-col gap-16">
        {/* Service 1: Documentation */}
        <div
          id="documentation"
          className="rounded-3xl bg-[#141414] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#6a4cf5]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6a4cf5]/20 text-[#6a4cf5]">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-[#6a4cf5]">
                    Documentation Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    Project Documentation Editing and Formatting
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
                Whether you are submitting an engineering final-year thesis, an MCA project report, or an M.Tech dissertation, formatting mistakes and broken citations are the fastest way to lose marks. We format your entire report to meet IEEE, Springer, ACM, or your university's official template.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    What We Format:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#6a4cf5] shrink-0 mt-0.5" />
                      <span>Title page, Certificate, Declaration, and Acknowledgements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#6a4cf5] shrink-0 mt-0.5" />
                      <span>Auto-updating Table of Contents, Figures, and Tables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#6a4cf5] shrink-0 mt-0.5" />
                      <span>Mathematical equation typesetting and indexing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#6a4cf5] shrink-0 mt-0.5" />
                      <span>BibTeX and IEEE reference consistency</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Key Deliverables:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Ready-to-print PDF file with correct margins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Fully editable Microsoft Word (.docx) or LaTeX source</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>High-resolution figure and diagram embeds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Free post-review guide adjustments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-2xl bg-[#090909] p-6 flex flex-col gap-5">
              <span className="text-xs font-semibold text-white">
                Quotation Details
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#999999]">
                <div className="flex justify-between py-1">
                  <span>Turnaround:</span>
                  <span className="text-white">2 to 4 Days (Urgent available)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Payment:</span>
                  <span className="text-white">50% Advance, 50% Delivery</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Pricing:</span>
                  <span className="text-[#0099ff]">Personalized Quote</span>
                </div>
              </div>

              <Link
                href="/quote?service=documentation"
                className="btn-primary w-full justify-center text-sm !py-3 mt-2"
              >
                <span>Request Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Service 2: Seminar Presentation */}
        <div
          id="seminar"
          className="rounded-3xl bg-[#141414] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d44df0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d44df0]/20 text-[#d44df0]">
                  <Presentation className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-[#d44df0]">
                    Seminar Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    Seminar Presentation Design and Editing
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
                Most students make the mistake of pasting paragraphs onto PowerPoint slides. College evaluators want visual clarity, concise bullet hierarchies, and readable architecture diagrams. We convert your raw documentation into a clean 16:9 defense presentation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    What We Design:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#d44df0] shrink-0 mt-0.5" />
                      <span>Problem statement, motivation, and objectives slides</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#d44df0] shrink-0 mt-0.5" />
                      <span>Visual block diagrams and dataflow architectures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#d44df0] shrink-0 mt-0.5" />
                      <span>Results, performance charts, and comparison graphs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#d44df0] shrink-0 mt-0.5" />
                      <span>Conclusion, future enhancements, and key references</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Key Deliverables:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Editable PowerPoint (.pptx) file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>High-resolution PDF version for direct projection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Speaker notes outline for viva presentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Consistent typography, color, and slide timing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-2xl bg-[#090909] p-6 flex flex-col gap-5">
              <span className="text-xs font-semibold text-white">
                Quotation Details
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#999999]">
                <div className="flex justify-between py-1">
                  <span>Turnaround:</span>
                  <span className="text-white">24 to 48 Hours</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Slide Count:</span>
                  <span className="text-white">Custom (15 to 35 slides typical)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Pricing:</span>
                  <span className="text-[#0099ff]">Personalized Quote</span>
                </div>
              </div>

              <Link
                href="/quote?service=seminar"
                className="btn-primary w-full justify-center text-sm !py-3 mt-2"
              >
                <span>Request Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Service 3: Internship Reports */}
        <div
          id="internship"
          className="rounded-3xl bg-[#141414] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff7a3d]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff7a3d]/20 text-[#ff7a3d]">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-[#ff7a3d]">
                    Internship Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    Internship Report Formatting
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
                Mandatory internship and industrial training reports require specific college compliance: weekly work log tables, company mentor evaluations, and technical learning summaries. We format your raw company notes into a structured report ready for evaluation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    What We Format:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7a3d] shrink-0 mt-0.5" />
                      <span>Company profile, department overview, and tools used</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7a3d] shrink-0 mt-0.5" />
                      <span>Weekly and bi-weekly industrial diary formatting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7a3d] shrink-0 mt-0.5" />
                      <span>Internship certificate and completion letter alignment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff7a3d] shrink-0 mt-0.5" />
                      <span>Skills acquired and technical outcome summary</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Key Deliverables:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Compliance-aligned Word document and PDF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Proper sign-off table for internal guide and HOD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Clean typography and structured headers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-2xl bg-[#090909] p-6 flex flex-col gap-5">
              <span className="text-xs font-semibold text-white">
                Quotation Details
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#999999]">
                <div className="flex justify-between py-1">
                  <span>Turnaround:</span>
                  <span className="text-white">1 to 3 Days</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Payment:</span>
                  <span className="text-white">50% Advance, 50% Final</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Pricing:</span>
                  <span className="text-[#0099ff]">Personalized Quote</span>
                </div>
              </div>

              <Link
                href="/quote?service=internship"
                className="btn-primary w-full justify-center text-sm !py-3 mt-2"
              >
                <span>Request Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Service 4: Academic Guidance */}
        <div
          id="guidance"
          className="rounded-3xl bg-[#141414] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff5577]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5577]/20 text-[#ff5577]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-[#ff5577]">
                    Guidance Service
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    Academic Project Guidance
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
                Stuck on defining your system architecture? Don't know how to defend your chosen algorithms during viva voce? Our academic mentors provide structural guidance to help you clearly articulate your technical findings and project workflow.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Areas We Cover:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff5577] shrink-0 mt-0.5" />
                      <span>Topic scoping and problem statement formulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff5577] shrink-0 mt-0.5" />
                      <span>Literature survey organization and gap analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff5577] shrink-0 mt-0.5" />
                      <span>System design and technical architecture review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#ff5577] shrink-0 mt-0.5" />
                      <span>Viva defense mock questions and talking points</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Guidance Approach:
                  </span>
                  <ul className="flex flex-col gap-2 text-xs text-[#999999]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Direct 1-on-1 consultations via WhatsApp and Meet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Written feedback on your existing chapters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>Ethical guidance aligned with university rules</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-2xl bg-[#090909] p-6 flex flex-col gap-5">
              <span className="text-xs font-semibold text-white">
                Quotation Details
              </span>
              <div className="flex flex-col gap-2 text-xs text-[#999999]">
                <div className="flex justify-between py-1">
                  <span>Format:</span>
                  <span className="text-white">Structured Mentorship Sessions</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Timeline:</span>
                  <span className="text-white">Flexible milestone schedule</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Pricing:</span>
                  <span className="text-[#0099ff]">Personalized Quote</span>
                </div>
              </div>

              <Link
                href="/quote?service=guidance"
                className="btn-primary w-full justify-center text-sm !py-3 mt-2"
              >
                <span>Request Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl bg-[#141414] p-8 sm:p-12 text-center flex flex-col items-center gap-6">
        <h3 className="display-md text-white max-w-xl">
          Have a Custom College Requirement?
        </h3>
        <p className="text-sm text-[#999999] max-w-lg">
          Send us your syllabus guidelines, deadline date, and draft files. We will review your project and propose a customized timeline and quotation.
        </p>
        <Link href="/quote" className="btn-primary !px-7 !py-3 text-sm">
          <span>Submit Your Requirements</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

