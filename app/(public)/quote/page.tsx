"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  UploadCloud,
  FileCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface UploadedFilePreview {
  file: File;
  name: string;
  size: string;
  type: string;
}

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "documentation";

  // Form Field States
  const [studentName, setStudentName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [courseBranchYear, setCourseBranchYear] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [serviceType, setServiceType] = useState(
    preselectedService === "seminar"
      ? "Seminar Presentation Design & Editing"
      : preselectedService === "internship"
      ? "Internship Report Formatting"
      : preselectedService === "guidance"
      ? "Academic Project Guidance"
      : "Project Documentation Editing & Formatting"
  );
  const [projectTopic, setProjectTopic] = useState("");
  const [requirementDescription, setRequirementDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<UploadedFilePreview[]>([]);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  // File Upload Handlers
  const allowedExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
  const maxFileSizeBytes = 25 * 1024 * 1024; // 25 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incomingFiles = Array.from(e.target.files);

    if (files.length + incomingFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        files: "Maximum 5 files can be uploaded per enquiry.",
      }));
      return;
    }

    const validNewFiles: UploadedFilePreview[] = [];
    let fileError = "";

    for (const f of incomingFiles) {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        fileError = `File "${f.name}" has an unsupported format. Only PDF, DOC, DOCX, PPT, and PPTX are allowed.`;
        break;
      }
      if (f.size > maxFileSizeBytes) {
        fileError = `File "${f.name}" exceeds the 25 MB size limit.`;
        break;
      }

      validNewFiles.push({
        file: f,
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
        type: ext.toUpperCase().replace(".", ""),
      });
    }

    if (fileError) {
      setErrors((prev) => ({ ...prev, files: fileError }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.files;
        return copy;
      });
      setFiles((prev) => [...prev, ...validNewFiles]);
    }

    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Validation
  const validateForm = () => {
    const err: { [key: string]: string } = {};

    if (!studentName.trim()) err.studentName = "Please enter your full name.";
    if (!collegeName.trim()) err.collegeName = "College name is required.";
    if (!courseBranchYear.trim())
      err.courseBranchYear = "Please specify course, branch, and current year.";

    const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
    if (!cleanWa || cleanWa.length < 10) {
      err.whatsappNumber = "Please enter a valid 10-digit WhatsApp number.";
    }

    if (!projectTopic.trim()) err.projectTopic = "Project topic or title is required.";
    if (!requirementDescription.trim() || requirementDescription.trim().length < 20) {
      err.requirementDescription =
        "Please provide a requirement description (at least 20 characters) explaining what you need.";
    }
    if (!deadline) {
      err.deadline = "Please select your college submission deadline.";
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        err.deadline = "Deadline date cannot be in the past.";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append("studentName", studentName);
      formData.append("collegeName", collegeName);
      formData.append("courseBranchYear", courseBranchYear);
      formData.append("whatsappNumber", whatsappNumber);
      formData.append("serviceType", serviceType);
      formData.append("projectTopic", projectTopic);
      formData.append("requirementDescription", requirementDescription);
      formData.append("deadline", deadline);

      files.forEach((f) => {
        formData.append("files", f.file);
      });

      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.details) {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error || "Failed to submit enquiry. Please try again." });
        }
        return;
      }

      setSubmittedReference(result.referenceNo);
    } catch (err: any) {
      setErrors({
        general: err.message || "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* SUCCESS CONFIRMATION STATE */}
      {submittedReference ? (
        <div className="rounded-3xl border border-[#22c55e]/40 bg-[#141414] p-8 sm:p-14 text-center flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/20 text-[#22c55e]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="flex flex-col gap-2 max-w-lg">
            <span className="text-sm font-medium text-[#22c55e]">
              Requirement Successfully Logged
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              We Have Received Your Project Details
            </h1>
            <p className="text-sm text-[#999999] leading-relaxed">
              Your reference number is below. An academic editor is reviewing your scope, guidelines, and uploaded files. You will receive an itemized quotation directly on WhatsApp.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="rounded-2xl bg-[#090909] px-6 py-4 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-[#999999]">
              Enquiry Reference Number
            </span>
            <span className="text-2xl font-bold text-white tracking-wider">
              {submittedReference}
            </span>
          </div>

          <div className="rounded-xl bg-[#090909] p-4 text-xs text-[#999999] max-w-md text-left flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" />
            <span>
              Your uploaded documents are securely stored in private encrypted storage. Only our authorized editors have access to your submission.
            </span>
          </div>

          {/* WhatsApp Direct Link with prefilled reference */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hello Project Adda, I have submitted requirement enquiry reference: ${submittedReference}. Please confirm review.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !bg-[#22c55e] !text-black !px-7 !py-3.5 text-sm font-semibold"
            >
              <MessageSquare className="h-4 w-4 fill-current" />
              <span>Connect on WhatsApp with Reference</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setSubmittedReference(null);
                setFiles([]);
                setProjectTopic("");
                setRequirementDescription("");
              }}
              className="btn-secondary !px-5 !py-3 text-xs text-[#999999] hover:text-white"
            >
              Submit Another Project
            </button>
          </div>
        </div>
      ) : (
        /* REQUIREMENT FORM */
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[#0099ff]">
              Personalized Academic Quotation
            </span>
            <h1 className="display-lg text-white">
              Submit Your Project Requirements
            </h1>
            <p className="text-sm sm:text-base text-[#999999] leading-relaxed">
              Fill in your academic and document details below. Upload any draft files, guidelines, or college format rubrics. We calculate an honest quotation and message you directly on WhatsApp.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#141414] p-6 sm:p-10 flex flex-col gap-8"
            noValidate
          >
            {errors.general && (
              <div className="rounded-2xl bg-red-950/40 border border-red-500/30 p-4 text-xs text-red-300 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Step 1: Student Information */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-white pb-2">
                1. Student and College Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Student Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  {errors.studentName && (
                    <span className="text-xs text-red-400">{errors.studentName}</span>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    WhatsApp Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  <span className="text-[11px] text-[#666666]">
                    Quotation and draft updates will be shared on this number.
                  </span>
                  {errors.whatsappNumber && (
                    <span className="text-xs text-red-400">{errors.whatsappNumber}</span>
                  )}
                </div>

                {/* College Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    College / University Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. BMS College of Engineering"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  {errors.collegeName && (
                    <span className="text-xs text-red-400">{errors.collegeName}</span>
                  )}
                </div>

                {/* Course / Branch / Year */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    Course, Branch & Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={courseBranchYear}
                    onChange={(e) => setCourseBranchYear(e.target.value)}
                    placeholder="e.g. B.Tech CSE, 4th Year / 8th Sem"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  {errors.courseBranchYear && (
                    <span className="text-xs text-red-400">{errors.courseBranchYear}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Project Specifications */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-white pb-2">
                2. Project Scope and Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Service Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    Required Service <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white input-focus-ring"
                  >
                    <option value="Project Documentation Editing & Formatting">
                      Project Documentation Editing & Formatting
                    </option>
                    <option value="Seminar Presentation Design & Editing">
                      Seminar Presentation Design & Editing
                    </option>
                    <option value="Internship Report Formatting">
                      Internship Report Formatting
                    </option>
                    <option value="Academic Project Guidance">
                      Academic Project Guidance
                    </option>
                  </select>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    College Submission Deadline <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white input-focus-ring"
                  />
                  {errors.deadline && (
                    <span className="text-xs text-red-400">{errors.deadline}</span>
                  )}
                </div>

                {/* Project Topic */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    Project Topic / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectTopic}
                    onChange={(e) => setProjectTopic(e.target.value)}
                    placeholder="e.g. Distributed Deep Learning for Autonomous Driving Perception"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  {errors.projectTopic && (
                    <span className="text-xs text-red-400">{errors.projectTopic}</span>
                  )}
                </div>

                {/* Requirement Description */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white">
                    Detailed Requirement & College Format Notes{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={requirementDescription}
                    onChange={(e) => setRequirementDescription(e.target.value)}
                    placeholder="Describe what needs to be done: e.g. 'We have a rough 45-page Word file. Need it formatted in IEEE double-column format with bibliography, equation numbering, and system architecture diagram cleanup before our guide review on Friday.'"
                    className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
                  />
                  {errors.requirementDescription && (
                    <span className="text-xs text-red-400">
                      {errors.requirementDescription}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Secure File Uploads */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-sm font-semibold text-white">
                  3. Upload Draft Documents and Guidelines (Optional)
                </h2>
                <span className="text-xs text-[#999999] flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#22c55e]" />
                  <span>Encrypted Private Storage</span>
                </span>
              </div>

              {/* Upload Drop Area */}
              <div className="relative rounded-2xl border-2 border-dashed border-[#262626] bg-[#090909] p-6 text-center hover:border-[#444444] transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={files.length >= 5}
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141414] text-[#0099ff]">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white">
                      Click to browse or drag & drop files here
                    </span>
                    <p className="text-xs text-[#999999] mt-0.5">
                      Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max 25 MB each, up to 5 files)
                    </p>
                  </div>
                </div>
              </div>

              {errors.files && (
                <span className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  {errors.files}
                </span>
              )}

              {/* Uploaded File Badges */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-xs font-medium text-[#999999]">
                    Attached Files ({files.length}/5):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-[#090909] border border-[#262626] p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="rounded bg-[#1c1c1c] px-2 py-1 text-[11px] font-medium text-[#0099ff]">
                            {f.type}
                          </span>
                          <span className="truncate text-white font-medium">
                            {f.name}
                          </span>
                          <span className="text-[#666666] shrink-0">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-[#999999] hover:text-red-400 p-1"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#999999] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
                <span>Zero spam · Strictly private · 50% advance model</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto !px-8 !py-3.5 text-sm font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Logging Requirements...</span>
                ) : (
                  <>
                    <span>Request Quotation</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-[#999999] flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Loading requirement form...</span>
        </div>
      }
    >
      <QuoteFormContent />
    </Suspense>
  );
}
