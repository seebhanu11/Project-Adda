# Project Adda — Deployment Guide

Step-by-step instructions to take Project Adda from your local machine to a live production website.

You will need three things:
- A **Supabase** account (free tier works) — [supabase.com](https://supabase.com)
- A **Vercel** account (free tier works) — [vercel.com](https://vercel.com)
- A **GitHub** account with this repository pushed to it

---

## Step 1: Push Code to GitHub

If you have not already pushed this project to GitHub:

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g., `project-adda`). Keep it **Private**.
2. Run these commands in your project folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/project-adda.git
git push -u origin main
```

---

## Step 2: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) and sign in.
2. Click the **New Project** button.
3. Fill in the details:
   - **Name:** `project-adda` (or any name you prefer)
   - **Database Password:** Choose a strong password and **save it somewhere safe**
   - **Region:** Pick the one closest to you (e.g., `South Asia (Mumbai)` for India)
4. Click **Create new project** and wait for it to finish setting up (takes about 1 minute).

---

## Step 3: Copy Your Supabase Keys

Once your project is ready:

1. In the Supabase dashboard, click **Project Settings** (gear icon in the left sidebar).
2. Click **API** under the Configuration section.
3. You will see these values — copy each one and keep them handy:

| What to copy | Where to find it |
| :--- | :--- |
| **Project URL** | Under "Project URL" (looks like `https://abcdef.supabase.co`) |
| **anon public key** | Under "Project API Keys" → `anon` `public` |
| **service_role secret key** | Under "Project API Keys" → `service_role` `secret` (click the eye icon to reveal) |

> **Keep the `service_role` key secret.** Anyone with this key has full access to your database.

---

## Step 4: Set Up the Database

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) from this repository on your computer.
4. Copy **everything** inside that file.
5. Paste it into the Supabase SQL Editor.
6. Click **Run** (or press `Ctrl + Enter`).

You should see a green "Success" message. This creates all the database tables, security policies, and the private file storage bucket.

**To verify it worked:**
- Click **Table Editor** in the left sidebar. You should see these tables:
  - `admin_users`
  - `enquiries`
  - `enquiry_files`
  - `quotations`
  - `orders`
  - `payments`
- Click **Storage** in the left sidebar. You should see a bucket called `student-uploads` with the Public toggle **OFF**.

---

## Step 5: Create Your Admin Account

Your admin panel does not allow public registration. You must create the admin user manually.

**Part A — Create the auth user:**

1. In Supabase, click **Authentication** in the left sidebar.
2. Click **Users** tab, then click **Add User** → **Create User**.
3. Enter your email and a strong password. Click **Create User**.
4. You will see the new user appear in the list. Click on it and **copy the User UID** (the long UUID value).

**Part B — Register them as an admin:**

1. Go back to **SQL Editor**.
2. Click **New query**.
3. Paste this SQL, replacing the UUID and email with your actual values:

```sql
INSERT INTO public.admin_users (id, email, role)
VALUES (
  'PASTE-YOUR-USER-UID-HERE',
  'your-email@example.com',
  'super_admin'
);
```

4. Click **Run**. You should see "Success".

Your admin account is now ready. You will use these credentials to log into `/admin/login` on your live site.

---

## Step 6: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** → **Project**.
3. Connect your GitHub account if you have not already.
4. Find your `project-adda` repository in the list and click **Import**.
5. On the configuration screen:
   - **Framework Preset:** Leave as `Next.js` (auto-detected)
   - **Root Directory:** Leave as `./`
   - Leave everything else as default
6. Scroll down to the **Environment Variables** section. Add these 6 variables **one by one**:

| Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (e.g., `https://abcdef.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase `service_role` secret key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your business WhatsApp number (e.g., `+919876543210`) |
| `NEXT_PUBLIC_BUSINESS_UPI_ID` | Your business UPI ID (e.g., `projectadda@okhdfcbank`) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., `https://project-adda.vercel.app`) |

> For `NEXT_PUBLIC_SITE_URL`, use `https://YOUR-PROJECT-NAME.vercel.app` for now. You can update it later if you add a custom domain.

7. Click **Deploy**.
8. Wait for the build to finish (usually 1-2 minutes). You will see a green "Congratulations!" screen with your live URL.

---

## Step 7: Test Everything Works

Open your live site URL and run through these checks:

**Public pages:**
- [ ] Visit the homepage (`/`). Make sure it loads with correct branding.
- [ ] Visit `/services`, `/about`, `/portfolio`, `/contact`, `/privacy`, `/terms`. All should load.

**Student form:**
- [ ] Go to `/quote`. Fill in a test submission with a sample PDF or Word file.
- [ ] Submit the form. You should see a confirmation with a reference number like `PA-2026-XXXX`.
- [ ] In Supabase, check **Table Editor** → `enquiries` table. Your submission should appear.
- [ ] In Supabase, check **Storage** → `student-uploads`. The uploaded file should be there.

**Admin panel:**
- [ ] Go to `/admin/login`. Sign in with the email and password you created in Step 5.
- [ ] You should be redirected to `/admin/enquiries`. Your test submission should appear.
- [ ] Click on the submission to see the details. Try downloading the attached file.
- [ ] Create a test quotation (enter an amount, verify the 50/50 split looks correct).
- [ ] Click "Save Quotation & Open WhatsApp" to verify the WhatsApp message preview.

**Orders and payments:**
- [ ] Convert a quotation to an order and navigate to `/admin/orders`.
- [ ] Try recording a test advance payment with a fake UTR number.
- [ ] Verify the order status changes from "Awaiting Advance" to "In Progress".

---

## Optional: Add a Custom Domain

1. In your Vercel project dashboard, go to **Settings** → **Domains**.
2. Type your custom domain (e.g., `projectadda.com`) and click **Add**.
3. Vercel will show you DNS records to add. Go to your domain registrar (GoDaddy, Namecheap, etc.) and add the records.
4. Wait for DNS propagation (can take up to 48 hours, usually much faster).
5. Once active, update the `NEXT_PUBLIC_SITE_URL` environment variable in Vercel to your custom domain.
6. Redeploy by clicking **Deployments** → click the three dots on the latest deployment → **Redeploy**.

---

## Troubleshooting

**Build fails on Vercel:**
- Check that all 6 environment variables are added correctly (no extra spaces, no missing quotes).
- Make sure `SUPABASE_SERVICE_ROLE_KEY` does NOT start with `NEXT_PUBLIC_`.

**Admin login does not work:**
- Verify the user exists in Supabase **Authentication** → **Users**.
- Verify the same UUID is inserted into the `admin_users` table (check **Table Editor**).
- Make sure you used the correct email and password.

**File uploads fail:**
- Check that the `student-uploads` storage bucket exists in Supabase Storage.
- Make sure the bucket is set to **Private** (Public toggle OFF).

**WhatsApp button does not work:**
- Check that `NEXT_PUBLIC_WHATSAPP_NUMBER` is set correctly with the country code (e.g., `+919876543210`).

---

## Ongoing Maintenance

- **Student file cleanup:** Delete files from the `student-uploads` bucket 30 days after an order is completed, as stated in the Privacy Policy.
- **Password rotation:** Change admin passwords every 90 days in Supabase Authentication.
- **Updating the site:** Push new code to GitHub. Vercel will automatically rebuild and deploy.
