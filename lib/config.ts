export const SITE_CONFIG = {
  name: "Project Adda",
  tagline: "Your Ideas. Our Space.",
  description:
    "Professional project documentation editing, presentation design, internship reports, and technical guidance for college students.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210",
  whatsappDefaultMessage:
    "Hello Project Adda, I would like to get a personalized quotation for my college project requirements.",
  businessUpiId: process.env.NEXT_PUBLIC_BUSINESS_UPI_ID || "projectadda@upi",
  upiPayeeName: "Project Adda",
  email: "support@projectadda.com",
  supportHours: "Mon – Sat: 9:00 AM – 9:00 PM IST",
  services: [
    {
      id: "doc-formatting",
      title: "Project Documentation Editing & Formatting",
      shortDescription:
        "Comprehensive IEEE, Springer, and university-standard formatting, LaTeX conversions, indexing, citations, and structural polishing.",
      slug: "/services#documentation",
      accent: "violet",
    },
    {
      id: "presentation-design",
      title: "Seminar Presentation Design & Editing",
      shortDescription:
        "High-impact slide decks, visual diagrams, executive summaries, and defense-ready presentation narratives.",
      slug: "/services#seminar",
      accent: "magenta",
    },
    {
      id: "internship-report",
      title: "Internship Report Formatting",
      shortDescription:
        "Professional company training summaries, certificate formatting, weekly progress logs, and university compliance alignment.",
      slug: "/services#internship",
      accent: "orange",
    },
    {
      id: "academic-guidance",
      title: "Academic Project Guidance",
      shortDescription:
        "Step-by-step topic breakdown, architecture clarification, requirement framing, and viva-voce preparation support.",
      slug: "/services#guidance",
      accent: "coral",
    },
  ],
};

