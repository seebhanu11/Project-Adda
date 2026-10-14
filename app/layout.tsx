import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Adda — Your Ideas. Our Space.",
  description:
    "Professional project documentation formatting, seminar presentation design, internship reports, and academic guidance for college students.",
  keywords: [
    "Project Adda",
    "academic project guidance",
    "project documentation editing",
    "seminar presentation design",
    "internship report formatting",
    "IEEE format documentation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090909] text-white selection:bg-[#0099ff]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
