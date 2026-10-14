-- ==============================================================================
-- PROJECT ADDA — PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- Target: Supabase PostgreSQL (Row Level Security Enforced)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper security function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE id = auth.uid()
    );
$$;

-- ------------------------------------------------------------------------------
-- 2. ENQUIRIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no VARCHAR(25) UNIQUE NOT NULL, -- e.g. 'PA-2026-1042'
    student_name VARCHAR(120) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    course_branch_year VARCHAR(120) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    project_topic VARCHAR(255) NOT NULL,
    requirement_description TEXT NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'New' 
        CHECK (status IN ('New', 'Under Review', 'Quoted', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. UPLOADED ENQUIRY FILES METADATA TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiry_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    storage_path TEXT NOT NULL, -- Path in private 'student-uploads' bucket
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. QUOTATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    reference_no VARCHAR(25) NOT NULL,
    quote_amount NUMERIC(10, 2) NOT NULL,
    advance_amount NUMERIC(10, 2) NOT NULL,     -- 50% Advance
    remaining_balance NUMERIC(10, 2) NOT NULL,  -- 50% Remaining
    scope_summary TEXT NOT NULL,
    validity_days INT NOT NULL DEFAULT 7,
    status VARCHAR(30) NOT NULL DEFAULT 'Draft' 
        CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Declined')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE RESTRICT,
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE RESTRICT,
    order_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'ORD-2026-1042'
    total_amount NUMERIC(10, 2) NOT NULL,
    advance_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10, 2) NOT NULL,
    status VARCHAR(35) NOT NULL DEFAULT 'Awaiting Advance'
        CHECK (status IN ('Awaiting Advance', 'In Progress', 'Awaiting Final Payment', 'Completed', 'Cancelled')),
    target_delivery_date DATE,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. MANUAL UPI PAYMENT RECORDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_milestone VARCHAR(20) NOT NULL CHECK (payment_milestone IN ('Advance', 'Final')),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'UPI',
    upi_transaction_id VARCHAR(100),
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_by UUID REFERENCES auth.users(id),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING & DASHBOARD FILTERS
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_reference ON public.enquiries(reference_no);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiry_files_enquiry ON public.enquiry_files(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_enquiry ON public.quotations(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies
CREATE POLICY "Admins can view their own record"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- 2. enquiries policies
-- Anonymous visitors can submit enquiries via service-role / validated server route
CREATE POLICY "Admins can view all enquiries"
    ON public.enquiries FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update enquiries"
    ON public.enquiries FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete enquiries"
    ON public.enquiries FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 3. enquiry_files policies
CREATE POLICY "Admins can view uploaded files metadata"
    ON public.enquiry_files FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can delete uploaded files metadata"
    ON public.enquiry_files FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 4. quotations policies
CREATE POLICY "Admins can view quotations"
    ON public.quotations FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert quotations"
    ON public.quotations FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update quotations"
    ON public.quotations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. orders policies
CREATE POLICY "Admins can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. payments policies
CREATE POLICY "Admins can view payments"
    ON public.payments FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert payments"
    ON public.payments FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update payments"
    ON public.payments FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
-- Note: Insert private bucket 'student-uploads' into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'student-uploads',
    'student-uploads',
    FALSE, -- Strictly private bucket!
    26214400, -- 25 MB max per file
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = FALSE,
    file_size_limit = 26214400;

-- Storage RLS Policies: Allow admins to download files via signed URLs
CREATE POLICY "Admins can access student-uploads bucket"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'student-uploads' AND public.is_admin());

