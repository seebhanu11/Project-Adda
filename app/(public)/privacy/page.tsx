import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Privacy Policy and Document Retention — Project Adda",
  description:
    "Review Project Adda's privacy policy, encryption protocols, and student document retention standards.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-12 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-4">
        <span className="text-sm font-medium text-[#0099ff]">
          Legal and Data Protection
        </span>
        <h1 className="display-md text-white">
          Privacy and Document Confidentiality Policy
        </h1>
        <p className="text-xs text-[#999999]">
          Last Updated: Academic Year 2026, Project Adda Trust Protocol
        </p>
      </div>

      <div className="flex flex-col gap-10 text-sm text-[#cccccc] leading-relaxed">
        {/* Section 1 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            1. Our Commitment to Student Confidentiality
          </h2>
          <p>
            At <strong>Project Adda</strong> ("Your Ideas. Our Space."), we recognize that your academic project reports, seminar presentations, source code, and internship records represent your personal intellectual labor and academic standing. We treat all submitted documents with absolute confidentiality.
          </p>
          <p>
            We do not sell, license, share, or publicly publish any student materials, draft files, code repositories, or personal identification details under any circumstances.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            2. Information We Collect
          </h2>
          <p>When you submit a requirement or request a quotation, we collect:</p>
          <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2 text-[#999999]">
            <li>Student identification: Full Name, College or University, Course, Branch, and Current Year.</li>
            <li>Contact details: WhatsApp phone number and optional email address.</li>
            <li>Project specifics: Topic title, deadline date, and technical requirement description.</li>
            <li>Uploaded files: Draft documents in PDF, DOC, DOCX, PPT, or PPTX formats.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            3. File Storage and Encryption Architecture
          </h2>
          <p>
            All uploaded student files are transferred through secure TLS/SSL encrypted channels and stored in private cloud storage buckets protected by database-level Row Level Security (RLS).
          </p>
          <p>
            No student documents are accessible via public URLs or search engines. File access is restricted strictly to our verified editing administrators through short-lived cryptographic signed tokens.
          </p>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            4. Document Retention and Purge Policy
          </h2>
          <p>
            We maintain files solely for the duration required to complete your editing, formatting, and guide revision cycles:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2 text-[#999999]">
            <li><strong>Active Projects:</strong> Files are maintained throughout the quotation, editing, and college guide review period.</li>
            <li><strong>Completed Projects:</strong> Files are automatically scheduled for permanent deletion 30 days after project completion and final payment confirmation.</li>
            <li><strong>Immediate Purge on Request:</strong> Any student may request the immediate deletion of their uploaded drafts and records at any time by messaging our desk on WhatsApp with their reference number.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-white">
            5. Contact Us Regarding Your Data
          </h2>
          <p>
            For privacy inquiries, document deletion requests, or data protection questions, email us at{" "}
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#0099ff] underline">
              {SITE_CONFIG.email}
            </a>{" "}
            or contact us directly via our verified WhatsApp channel.
          </p>
        </div>
      </div>

      <div className="pt-8 flex items-center justify-between">
        <Link href="/terms" className="text-xs text-[#0099ff] hover:underline">
          Read Terms and Conditions →
        </Link>
        <Link href="/quote" className="btn-secondary !text-xs !py-2 !px-4">
          <span>Submit Project</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

