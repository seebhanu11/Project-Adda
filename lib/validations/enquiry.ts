import { z } from "zod";

export const validServices = [
  "Project Documentation Editing & Formatting",
  "Seminar Presentation Design & Editing",
  "Internship Report Formatting",
  "Academic Project Guidance",
] as const;

export const enquirySchema = z.object({
  studentName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name cannot exceed 120 characters.")
    .trim(),

  collegeName: z
    .string()
    .min(2, "College name must be at least 2 characters.")
    .max(200, "College name cannot exceed 200 characters.")
    .trim(),

  courseBranchYear: z
    .string()
    .min(2, "Please specify course, branch, and current year.")
    .max(120, "Course details cannot exceed 120 characters.")
    .trim(),

  whatsappNumber: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "Please provide a valid WhatsApp number (10 to 15 digits)."
    )
    .trim(),

  serviceType: z.enum(validServices),

  projectTopic: z
    .string()
    .min(3, "Project topic must be at least 3 characters.")
    .max(255, "Project topic cannot exceed 255 characters.")
    .trim(),

  requirementDescription: z
    .string()
    .min(20, "Please describe your requirement in at least 20 characters.")
    .max(3000, "Requirement description cannot exceed 3000 characters.")
    .trim(),

  deadline: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Deadline date cannot be in the past."),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

