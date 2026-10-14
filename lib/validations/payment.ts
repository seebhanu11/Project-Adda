import { z } from "zod";

export const paymentMilestones = ["Advance", "Final"] as const;
export const orderStatuses = [
  "Awaiting Advance",
  "In Progress",
  "Awaiting Final Payment",
  "Completed",
  "Cancelled",
] as const;

export const recordPaymentSchema = z.object({
  orderId: z.string().min(1, "Order reference is required"),
  paymentMilestone: z.enum(paymentMilestones),
  amount: z
    .number()
    .positive("Payment amount must be greater than zero")
    .max(500000, "Payment amount cannot exceed ₹5,00,000"),
  upiTransactionId: z
    .string()
    .min(6, "Please provide the UPI reference / UTR transaction ID (at least 6 characters)")
    .max(80, "Transaction reference cannot exceed 80 characters")
    .trim(),
  notes: z.string().max(1000).optional(),
});

export type RecordPaymentData = z.infer<typeof recordPaymentSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
  notes: z.string().max(1000).optional(),
});

export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;

