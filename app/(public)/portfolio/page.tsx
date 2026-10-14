import Link from "next/link";
import { ArrowUpRight, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Sample Work & Formats — Project Adda",
  description:
    "Explore sample academic project documentation layouts, seminar presentation slide decks, and internship report structures produced by Project Adda.",
};

export default function PortfolioPage() {
  const sampleItems = [
    {
      category: "Documentation Formatting",
      title: "IEEE Two-Column Technical Documentation Format",
      subtitle: "Machine Learning and Signal Processing Project",
      tag: "IEEE Standard Layout",
      features: [
        "Times New Roman / Computer Modern 10pt with strict 0.75-inch margins",
        "Numbered equations, inline symbol typesetting, and tabular alignments",
        "Sub-figure captions with vector rendering",
        "Standard IEEE BibTeX reference list with cross-references",
      ],
      sampleBadge: "Sample Format Preview",
      disclaimer: "Demonstration format representing formatting standard. Contains mock academic technical text.",
    },
    {
      category: "Seminar Presentation",
      title: "16:9 Defense-Grade Viva Presentation Deck",
      subtitle: "Autonomous Vehicle Obstacle Detection Seminar",
      tag: "Viva Defense Template",
      features: [
        "High-contrast dark canvas slide master with clean visual hierarchy",
        "System architecture block diagrams and step-by-step pipeline flows",
        "Benchmark comparison tables with accuracy and FPS metrics",
        "Timed 15-minute presentation flow with concise bullet limits",
      ],
      sampleBadge: "Sample Format Preview",
      disclaimer: "Demonstration slide architecture. Contains representative seminar slide layouts.",
    },
    {
      category: "Internship Report",
      title: "Corporate Industrial Training Compliance Report",
      subtitle: "Full-Stack Web Development and Cloud Deployment Internship",
      tag: "University Compliance Template",
      features: [
        "Company profile, technology stack overview, and tools breakdown",
        "Weekly task journal tables with mentor review checkmarks",
        "Certificate page and institutional sign-off placeholders",
        "Clear technical outcome summaries with clean code snippets",
      ],
      sampleBadge: "Sample Format Preview",
      disclaimer: "Demonstration industrial report format complying with standard university criteria.",
    },
    {
      category: "Academic Project Guidance",
      title: "Comprehensive Methodology and Architecture Blueprint",
      subtitle: "IoT Smart Agriculture Monitoring System",
      tag: "System Design Sample",
      features: [
        "Structured hardware and software block diagrams and circuit pinouts",
        "Entity-Relationship (ER) and dataflow diagrams",
        "Mathematical sensor calibration formulas and sampling algorithms",
        "Scope breakdown matching typical 8th-semester engineering rubrics",
      ],
      sampleBadge: "Sample Format Preview",
      disclaimer: "Demonstration system architecture blueprint. Illustrates technical structuring approach.",
    },
  ];

  return (
    <div className="flex flex-col gap-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <span className="text-sm font-medium text-[#0099ff]">
          Sample Work and Formatting Standards
        </span>
        <h1 className="display-xl text-white">
          Defensive Standards. Clean Architecture.
        </h1>
        <p className="text-base sm:text-lg text-[#999999] leading-relaxed">
          Inspect our structural layouts and formatting standards below. In adherence to student privacy and academic confidentiality, all items shown below are illustrative sample templates developed by our editorial team.
        </p>

        {/* Honest Transparency Notice */}
        <div className="inline-flex items-center gap-2.5 rounded-xl bg-[#141414] p-3 text-xs text-[#999999] mt-2">
          <AlertCircle className="h-4 w-4 text-[#0099ff] shrink-0" />
          <span>
            <strong>Confidentiality Guarantee:</strong> We never display or share actual student documents or proprietary college submissions publicly.
          </span>
        </div>
      </div>

      {/* Sample Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sampleItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-[#141414] p-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              {/* Category & Tag */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium text-[#0099ff]">
                  {item.category}
                </span>
                <span className="text-[11px] font-medium text-[#999999] bg-[#1c1c1c] rounded-full px-2.5 py-0.5">
                  {item.tag}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#999999] mt-1">
                  {item.subtitle}
                </p>
              </div>

              {/* Preview Window Graphic */}
              <div className="rounded-xl bg-[#090909] p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 text-[11px] text-[#666666]">
                  <span>{item.sampleBadge}</span>
                  <span className="text-[#22c55e]">Verified Layout</span>
                </div>

                <ul className="flex flex-col gap-2 text-xs text-[#cccccc] pt-1">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-[#0099ff] font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#666666] italic">
                {item.disclaimer}
              </p>
            </div>

            {/* Action */}
            <div className="mt-8 pt-4 flex items-center justify-between">
              <span className="text-xs text-[#999999]">Need this standard?</span>
              <Link
                href="/quote"
                className="btn-secondary !text-xs !py-2 !px-4 hover:border-white"
              >
                <span>Request Similar Format</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="rounded-3xl bg-[#141414] p-8 sm:p-12 text-center flex flex-col items-center gap-6">
        <h3 className="display-md text-white">
          Have Your College Guideline Document?
        </h3>
        <p className="text-sm text-[#999999] max-w-xl">
          Upload your department handbook or template with your enquiry. We will cross-reference margins, fonts, citation guidelines, and preliminaries line-by-line.
        </p>
        <Link href="/quote" className="btn-primary !px-7 !py-3 text-sm">
          <span>Upload Guidelines for Quotation</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

