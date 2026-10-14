"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { SITE_CONFIG } from "@/lib/config";
import { MessageSquare, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Our Services", href: "/services" },
    { label: "Sample Work", href: "/portfolio" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090909] transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#141414] text-white"
                    : "text-[#999999] hover:bg-[#141414]/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* WhatsApp Direct Connect */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !px-3.5 !py-2 text-xs text-[#999999] hover:text-white"
            title="Chat directly with our team on WhatsApp"
          >
            <MessageSquare className="h-4 w-4 text-[#22c55e]" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Primary CTA: Request a Quote */}
          <Link href="/quote" className="btn-primary">
            <span>Request a Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-white md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="bg-[#0c0c0c] px-4 pt-3 pb-6 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#141414] text-white"
                      : "text-[#999999] hover:bg-[#141414] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-3 pt-4">
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center !py-3 text-sm"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center !py-3 text-sm text-[#999999]"
            >
              <MessageSquare className="h-4 w-4 text-[#22c55e]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

