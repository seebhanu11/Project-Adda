import { SITE_CONFIG } from "@/lib/config";

/**
 * Strips non-digit characters from a phone string and ensures international format.
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  // If user entered 10 digits without country code, assume India (+91)
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Generates a valid wa.me URL with properly URL-encoded text.
 */
export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Builds quotation message text to be reviewed and sent by the admin via WhatsApp.
 */
export function buildQuotationWhatsAppMessage({
  studentName,
  refNo,
  quoteRef,
  projectTopic,
  serviceType,
  totalAmount,
  advanceAmount,
  remainingBalance,
  validityDays = 7,
}: {
  studentName: string;
  refNo: string;
  quoteRef: string;
  projectTopic: string;
  serviceType: string;
  totalAmount: number;
  advanceAmount: number;
  remainingBalance: number;
  validityDays?: number;
}): string {
  return [
    `Hello ${studentName},`,
    ``,
    `Greetings from *${SITE_CONFIG.name}*!`,
    `We have reviewed your project requirements (Ref: ${refNo}) for *${serviceType}*.`,
    ``,
    `*Project Topic:* ${projectTopic}`,
    `*Quotation Reference:* ${quoteRef}`,
    ``,
    `*Commercials:*`,
    `• Total Project Fee: ₹${totalAmount.toLocaleString("en-IN")}`,
    `• 50% Advance to Begin: ₹${advanceAmount.toLocaleString("en-IN")}`,
    `• 50% Remaining Balance on Completion: ₹${remainingBalance.toLocaleString("en-IN")}`,
    `• Quote Validity: ${validityDays} Days`,
    ``,
    `*UPI Payment Instructions:*`,
    `UPI ID: \`${SITE_CONFIG.businessUpiId}\``,
    `Payee Name: ${SITE_CONFIG.upiPayeeName}`,
    ``,
    `To proceed, please transfer the 50% advance (₹${advanceAmount.toLocaleString("en-IN")}) to the UPI ID above and share the transaction screenshot / 12-digit UTR reference here.`,
    ``,
    `Once confirmed, our technical team will begin your project immediately.`,
    ``,
    `Warm regards,`,
    `${SITE_CONFIG.name} Team`,
  ].join("\n");
}

/**
 * Builds advance payment receipt confirmation message for WhatsApp.
 */
export function buildAdvanceReceiptWhatsAppMessage({
  studentName,
  orderNumber,
  advanceAmount,
  balanceDue,
  targetDeliveryDate,
}: {
  studentName: string;
  orderNumber: string;
  advanceAmount: number;
  balanceDue: number;
  targetDeliveryDate?: string;
}): string {
  return [
    `Hello ${studentName},`,
    ``,
    `We have received and verified your *50% advance payment* of *₹${advanceAmount.toLocaleString("en-IN")}* for Order *${orderNumber}*.`,
    ``,
    `*Order Status:* In Progress 🚀`,
    targetDeliveryDate ? `*Target Completion:* ${targetDeliveryDate}` : ``,
    `*Remaining Balance Due on Completion:* ₹${balanceDue.toLocaleString("en-IN")}`,
    ``,
    `Our team has commenced work on your project according to the agreed guidelines. We will notify you once your draft is ready for review.`,
    ``,
    `Thank you for choosing ${SITE_CONFIG.name}!`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Builds final payment milestone request message when work is completed and ready for release.
 */
export function buildFinalPaymentRequestWhatsAppMessage({
  studentName,
  orderNumber,
  projectTopic,
  balanceDue,
}: {
  studentName: string;
  orderNumber: string;
  projectTopic: string;
  balanceDue: number;
}): string {
  return [
    `Hello ${studentName},`,
    ``,
    `Great news! Your project work for *${orderNumber}* ("${projectTopic}") is complete and ready for final delivery.`,
    ``,
    `*Remaining Balance to Settle:* ₹${balanceDue.toLocaleString("en-IN")}`,
    ``,
    `*UPI Payment Instructions:*`,
    `UPI ID: \`${SITE_CONFIG.businessUpiId}\``,
    `Payee Name: ${SITE_CONFIG.upiPayeeName}`,
    ``,
    `Kindly transfer the remaining balance and share the UTR reference. Upon confirmation, your complete high-resolution documentation and source files will be delivered immediately.`,
    ``,
    `Warm regards,`,
    `${SITE_CONFIG.name} Team`,
  ].join("\n");
}

/**
 * Builds completion and final handoff message.
 */
export function buildCompletionWhatsAppMessage({
  studentName,
  orderNumber,
  projectTopic,
}: {
  studentName: string;
  orderNumber: string;
  projectTopic: string;
}): string {
  return [
    `Hello ${studentName},`,
    ``,
    `Your final payment for Order *${orderNumber}* has been verified! 🎉`,
    ``,
    `All finalized deliverables for *"${projectTopic}"* are now released. Please review your documents and verify all requirements.`,
    ``,
    `If you need any minor adjustments within your revision scope, please let us know within 48 hours.`,
    ``,
    `All the best with your submission and academic defense!`,
    `– ${SITE_CONFIG.name} Team`,
  ].join("\n");
}

