import { z } from "zod";

export const quotationSchema = z.object({
  enquiryId: z.string().min(1, "Enquiry reference is required"),
  quoteAmount: z
    .number()
    .min(100, "Quotation amount must be at least ₹100")
    .max(500000, "Quotation amount cannot exceed ₹5,00,000"),
  scopeSummary: z
    .string()
    .min(10, "Scope summary must be at least 10 characters")
    .max(2000, "Scope summary cannot exceed 2000 characters")
    .trim(),
  validityDays: z
    .number()
    .int()
    .min(1, "Validity must be at least 1 day")
    .max(60, "Validity cannot exceed 60 days")
    .default(7),
  notes: z.string().max(1000).optional(),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;

/**
 * Calculates accurate 50% advance and remaining balance.
 * Ensures the two parts always sum exactly to totalAmount even with odd numbers.
 */
export function calculateMilestones(totalAmount: number) {
  const advanceAmount = Math.round(totalAmount * 0.5);
  const remainingBalance = totalAmount - advanceAmount;
  return {
    advanceAmount,
    remainingBalance,
  };
}

