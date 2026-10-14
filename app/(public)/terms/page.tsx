import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Terms and Conditions — Project Adda",
  description:
    "Review Project Adda's terms of service, quotation validity, revision policy, and manual payment rules.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-12 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-4">
        <span className="text-sm font-medium text-[#0099ff]">
          Service Agreement
        </span>
        <h1 className="display-md text-white">
          Terms and Conditions of Service
        </h1>
        <p className="text-xs text-[#999999]">
          Effective Date: Academic Year 2026, Project Adda
        </p>
      </div>

      <div className="flex flex-col gap-10 text-sm text-[#cccccc] leading-relaxed">
        {/* Section 1 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            1. Nature of Academic Services
          </h2>
          <p>
            Project Adda provides professional project documentation editing, thesis formatting, seminar presentation slide design, internship report structuring, and academic technical guidance.
          </p>
          <p>
            Our services are intended to help students communicate their research and project findings cleanly, adhering to university rubrics and formatting standards.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            2. Quotations and Scope Confirmation
          </h2>
          <p>
            All quotations issued by Project Adda are calculated individually based on document page volume, technical complexity, equation and diagram requirements, and requested turnaround time.
          </p>
          <p>
            Quotations are valid for 7 calendar days from the date of issuance on WhatsApp. If additional requirements or chapters are introduced after quotation approval, an adjusted quotation will be provided.
          </p>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            3. Payment Terms (50% Advance Model)
          </h2>
          <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2 text-[#999999]">
            <li><strong>Advance Payment:</strong> Work begins immediately following receipt of the agreed 50% advance payment via manual UPI.</li>
            <li><strong>Preview and Verification:</strong> Upon completing the initial formatting or slide deck, an uneditable sample or preview document is shared with the student for review.</li>
            <li><strong>Final Delivery:</strong> The remaining 50% balance must be settled prior to the release of final, unwatermarked editable files (.docx, .pptx, LaTeX .tex).</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            4. Revision and Guide Feedback Policy
          </h2>
          <p>
            We accommodate reasonable revisions based on feedback from your project guide, department evaluator, or HOD within the original scope of work. Revision requests must be submitted within 14 days of initial draft delivery.
          </p>
          <p>
            Substantial changes to the project topic, fundamental methodology, or addition of new unquoted chapters will be treated as an addendum subject to additional quotation.
          </p>
        </div>

        {/* Section 5 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            5. Academic Integrity and Ethical Support Policy
          </h2>
          <p>
            Project Adda operates strictly as an editorial formatting, document compilation, presentation design, and technical viva preparation service. We assist students in refining the structure, LaTeX typography, IEEE compliance, and visual clarity of their own original research and academic work.
          </p>
          <p>
            Project Adda does not provide ghostwriting, examination proxy services, or fraudulent authoring. Students retain 100% intellectual property ownership of their materials and are solely responsible for adhering to their institution&apos;s academic honor code.
          </p>
        </div>

        {/* Section 6 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            6. Student Responsibility
          </h2>
          <p>
            Students are responsible for providing complete and accurate formatting guidelines issued by their specific university or department. Project Adda will strictly align the work with the guidelines provided during requirement submission.
          </p>
        </div>

        {/* Section 7 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            7. Contact and Dispute Resolution
          </h2>
          <p>
            Any questions regarding service milestones, payment confirmations, or delivery timelines can be addressed directly to our operations desk via WhatsApp or email at{" "}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#0099ff] underline">
              {SITE_CONFIG.email}
            </a>.
          </p>
        </div>
      </div>

      <div className="pt-8 flex items-center justify-between">
        <Link href="/privacy" className="text-xs text-[#0099ff] hover:underline">
          Read Privacy Policy
        </Link>
        <Link href="/quote" className="btn-secondary !text-xs !py-2 !px-4">
          <span>Submit Project</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

