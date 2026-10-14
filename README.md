# Project Adda — Your Ideas. Our Space.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%7C_Auth_%7C_Storage-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)

**Project Adda** is a premium, secure full-stack web platform built for college students seeking project documentation editing, seminar slide design, internship report formatting, and technical academic guidance, paired with an end-to-end private admin operations desk for managing enquiries, quotations, orders, and manual UPI payments.

---

## 🌟 Key Features

### 🎓 1. Public Student Platform
- **Atmospheric Dark Visual Identity:** Built strictly to the design system in [`DESIGN.md`](./DESIGN.md) and audited with **Taste Skill 2.0** (no generic templates, no fake testimonials, 0 linter violations).
- **Core Service Catalog:**
  1. *Project Documentation Editing & Formatting* (IEEE, Springer, university thesis standards, LaTeX conversion)
  2. *Seminar Presentation Design & Editing* (Defense-ready slides, architecture diagrams)
  3. *Internship Report Formatting* (Weekly log tables, company certificate alignment)
  4. *Academic Project Guidance* (Topic breakdown, viva preparation)
- **Interactive Scope & Timeline Estimator:** Dynamic turnaround and complexity estimation widget.
- **Secure Requirement Submission Form (`/quote`):**
  - Binary magic-byte file inspection (`.pdf`, `.docx`, `.pptx`).
  - IP-based rate limiting & spam deterrence.
  - Automatic enquiry reference generation (`PA-2026-XXXX`).
- **Academic Integrity & Privacy Policy:** Clear 30-day file retention schedule, 100% student IP retention, and strict anti-ghostwriting policies.

### 🛡️ 2. Private Admin Operations Desk (`/admin`)
- **Zero-Trust Admin Authorization:** Server-verified whitelist (`admin_users` table). Public registration disabled.
- **Enquiry Management:** Search, status filtering, student contact details, and private document downloads via 60-second cryptographic signed URLs.
- **Quotation Generator:** Real-time 50% advance / 50% completion milestone calculations.
- **Controlled WhatsApp Integration:** Generates prefilled WhatsApp offer links with quote reference, breakdown, and UPI instructions (never sends automated or unreviewed messages).
- **Orders Pipeline (`/admin/orders`):** Complete project tracking (`Awaiting Advance` → `In Progress` → `Awaiting Final Payment` → `Completed`).
- **Manual UPI Payment Tracker:** Admin logs 12-digit UPI UTR references verified against bank statements before releasing milestones.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16.4.0 (App Router, Turbopack, Partial Prerendering)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 + Custom Tokens (`globals.css`)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) + Supabase Auth
- **Storage:** Supabase Storage (Private `student-uploads` bucket)
- **Validation:** Zod v4 (Client & Server)
- **Icons:** Lucide React
- **Hosting:** Vercel (Edge-optimized)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/your-username/project-adda.git
cd project-adda
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

> **Note on Offline / Mock Mode:**  
> If Supabase credentials are left as placeholders, Project Adda automatically falls back to **Local Mock Mode**. You can immediately test the entire public site, submit sample enquiries, log into the admin desk (`admin@projectadda.com`), create quotations, and verify UPI payments using high-fidelity mock data.

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Public Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🧪 Quality Assurance & Verification Commands

```bash
# 1. Type Check (TypeScript strict mode)
npx tsc --noEmit

# 2. Taste Skill 2.0 Anti-Slop Linter (Verifies zero design rule violations)
node .agents/skills/design-taste-frontend/scripts/lint.mjs app components

# 3. Production Build Check
npm run build
```

---

## 📖 Documentation & References

- [`DEPLOYMENT.md`](./DEPLOYMENT.md): Complete guide for Supabase setup, database migration, admin user provisioning, and Vercel production deployment.
- [`DESIGN.md`](./DESIGN.md): Visual hierarchy, typography, dark color palette tokens, and layout guidelines.
- [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql): PostgreSQL tables, RLS policies, performance indexes, and storage bucket configuration.

---

## 📄 License & Intellectual Property

Copyright © 2026 Project Adda. All rights reserved.  
Student submitted documents and research belong 100% to the respective student authors.
