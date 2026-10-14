# Project Adda — Production Deployment Guide

> **Tagline:** Your Ideas. Our Space.  
> **Platform:** Next.js 16 (App Router) + Supabase (PostgreSQL, Storage, Auth) + Vercel

This document outlines the step-by-step procedures required to deploy **Project Adda** to production on **Vercel** backed by **Supabase**.

---

## 1. Architecture & Security Overview

Project Adda operates with a zero-trust security model:

```
[Student / Visitor]
       │
       ▼ HTTPS (TLS 1.3)
[Next.js 16 Edge / Server Routes]
  • Input validation (Zod v4)
  • Rate limiting (10 req/hr per IP)
  • Binary magic-byte inspection (%PDF-, PK\x03\x04, etc.)
       │
       ├──────────────────────────┐
       ▼                          ▼
[Supabase Storage]        [Supabase PostgreSQL]
• Bucket: 'student-uploads' • Tables: enquiries, enquiry_files,
• Visibility: PRIVATE        quotations, orders, payments, admin_users
• Signed URLs (60s lifetime)• Row Level Security (RLS) enabled
       ▲
       │ Authenticated with Supabase Auth + admin_users whitelist
[Admin Operations Desk]
• /admin/enquiries
• /admin/orders
• Manual UPI Payment Verification (12-digit UTR verification against bank statement)
• Controlled WhatsApp message generation (no automatic invisible transmission)
```

---

## 2. Prerequisites

Before beginning deployment, ensure you have:

1. A **Supabase** account ([supabase.com](https://supabase.com))
2. A **Vercel** account ([vercel.com](https://vercel.com))
3. A **GitHub / GitLab** repository containing the Project Adda source code
4. A verified business WhatsApp phone number (in international format without symbols, e.g., `+919876543210`)
5. A business UPI ID for manual payment tracking (e.g., `projectadda@okhdfcbank`)

---

## 3. Step 1: Configure Supabase Database & Storage

### 3.1. Create a New Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com) and click **New Project**.
2. Set the project name (e.g. `project-adda-prod`).
3. Choose a strong database password and select a region close to your primary student demographic (e.g., `South Asia (Mumbai)`).

### 3.2. Run Database Migrations

1. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left navigation bar.
2. Open [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) in this repository.
3. Copy the entire contents of the SQL file, paste it into the Supabase SQL Editor, and click **Run**.
4. The migration will automatically create:
   - Tables: `admin_users`, `enquiries`, `enquiry_files`, `quotations`, `orders`, `payments`
   - Enums and constraints for all workflow statuses
   - Performance indexes on status, foreign keys, and reference numbers
   - Row Level Security (RLS) policies enforcing zero-trust access
   - The private storage bucket `student-uploads`

### 3.3. Verify Private Storage Bucket

1. In the Supabase dashboard, navigate to **Storage**.
2. Verify that the bucket `student-uploads` is present.
3. Ensure that the **Public bucket** toggle is **OFF** (Disabled). Student files must never be publicly accessible.

### 3.4. Provision the Initial Administrator Account

Because public registration for administrators is strictly disabled to prevent unauthorized account creation, administrators must be provisioned manually:

1. Go to **Authentication** → **Users** in the Supabase dashboard.
2. Click **Add User** → **Create User**.
3. Enter the administrator's business email and a strong password. Click **Create User**.
4. Copy the generated **User UID** (a UUID such as `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
5. Open the **SQL Editor** and run the following insert statement, replacing the UUID and email with your values:

```sql
INSERT INTO public.admin_users (id, email, full_name, role)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Paste the Auth User UID here
  'admin@projectadda.com',
  'Primary Operations Admin',
  'super_admin'
);
```

6. The administrator can now securely log in at `/admin/login`.

---

## 4. Step 2: Configure Environment Variables

Create your production environment variables in Vercel (or `.env.local` for local production testing).

| Variable Name | Environment | Description | Example / Format |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Project API URL | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Anonymous Client Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | Privileged Supabase Admin Key | `eyJhbGciOi...` *(Keep Secret!)* |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | Business WhatsApp Number | `+919876543210` |
| `NEXT_PUBLIC_BUSINESS_UPI_ID` | Public | UPI ID for Student Payments | `projectadda@okhdfcbank` |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical Production Domain | `https://projectadda.com` |

> [!CAUTION]
> **Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code.** It must not start with `NEXT_PUBLIC_`. In Vercel, leave it unscoped so it is only available to Serverless Functions / Server Components.

---

## 5. Step 3: Deploy to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New** → **Project**.
3. Select your `project-adda` repository and click **Import**.
4. In **Project Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (or Next.js default)
   - **Output Directory:** `.next`
5. Expand the **Environment Variables** section and add all 6 variables defined in Section 4.
6. Click **Deploy**. Vercel will run Turbopack, compile static routes, set up partial prerendering, and deploy edge-optimized assets.

---

## 6. Step 4: Post-Deployment Smoke Test Checklist

Execute these 7 smoke tests to verify complete end-to-end operational integrity:

- [ ] **1. Public Pages:** Visit `/`, `/services`, `/portfolio`, `/about`, `/contact`, `/privacy`, `/terms`. Verify fast loading and responsive rendering on mobile and desktop.
- [ ] **2. Submit Enquiry (`/quote`):**
  - Fill out student details (Name, College, Course, WhatsApp, Deadline).
  - Attach a test PDF or Word file (`.docx`).
  - Submit the form.
  - Verify that a reference number (e.g., `PA-2026-1084`) is generated and displayed.
- [ ] **3. Verify Supabase Records:**
  - Check `enquiries` table for the submission.
  - Check `student-uploads` bucket for the encrypted file.
- [ ] **4. Admin Login (`/admin/login`):**
  - Sign in with your provisioned administrator credentials.
  - Verify redirection to `/admin/enquiries`.
- [ ] **5. File Download:**
  - Open the submitted enquiry detail view.
  - Click **Download** on the uploaded document.
  - Verify that a 60-second temporary signed URL streams the file directly and safely.
- [ ] **6. Quotation & WhatsApp Offering:**
  - Enter an amount (e.g., ₹3,000) in the quotation builder.
  - Verify the 50% advance (₹1,500) and 50% final balance (₹1,500) compute accurately.
  - Click **Save Quotation & Open WhatsApp**.
  - Verify that WhatsApp opens with a properly formatted message containing topic, quote reference, fee breakdown, and UPI instructions.
- [ ] **7. Order Conversion & Manual UPI Verification:**
  - Convert the quotation into an active order.
  - Navigate to `/admin/orders/[id]`.
  - Click **Record Advance Payment**, input a test 12-digit UPI UTR (`428901928374`), and submit.
  - Verify the order status transitions from `Awaiting Advance` to `In Progress`.
  - Click **Send Advance Receipt** to verify the WhatsApp receipt template.
  - Record the final milestone payment and verify status updates to `Completed`.

---

## 7. Data Retention & Maintenance Protocol

1. **Document Purge Schedule:**
   - As stated in the Privacy Policy, draft student documents are retained during the active drafting and guide review cycle.
   - All files are scheduled for deletion 30 days post-order completion.
   - To purge files manually in Supabase Storage, delete the corresponding reference folder in the `student-uploads` bucket.
2. **Student Immediate Purge Requests:**
   - When a student requests immediate deletion via WhatsApp with their reference number, open the enquiry in the admin dashboard, delete the file records, and remove the files from the storage bucket.
3. **Admin Password Rotations:**
   - Rotate administrator passwords every 90 days in the Supabase Authentication dashboard.

