-- ============================================================================== 
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — COMPLETE ONE-CLICK MASTER SETUP
-- Run this entire script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Includes: All 25+ Tables, RLS Security Policies, Functions, BD Divisions, Roles & Seed Data
-- Rerunnable: Safe to run multiple times without conflict or constraint errors.
-- ==============================================================================

-- >>> PART 1: CORE DATABASE SCHEMA & RLS POLICIES <<<
-- ==============================================================================
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — INITIAL CORE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. AUTH & PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_profile_verified BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'bn' CHECK (preferred_language IN ('bn', 'en')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ROLES & RBAC
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.role_definitions (
    id VARCHAR(50) PRIMARY KEY,
    display_name_en VARCHAR(100) NOT NULL,
    display_name_bn VARCHAR(100) NOT NULL,
    description TEXT,
    badge_color VARCHAR(20) NOT NULL,
    rank_level INT NOT NULL,
    is_administrative BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id VARCHAR(50) REFERENCES public.role_definitions(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id VARCHAR(50) REFERENCES public.role_definitions(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    UNIQUE (user_id, role_id)
);

-- ------------------------------------------------------------------------------
-- 3. BANGLADESH ADMINISTRATIVE LOCATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.administrative_unit_types (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    hierarchy_level INT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    unit_type VARCHAR(50) REFERENCES public.administrative_unit_types(id),
    parent_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
    name_en VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    division_id UUID REFERENCES public.locations(id),
    district_id UUID REFERENCES public.locations(id),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.administrative_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id VARCHAR(50) REFERENCES public.role_definitions(id),
    location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
    appointed_by UUID REFERENCES public.profiles(id),
    approved_by UUID REFERENCES public.profiles(id),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending_approval', 'active', 'suspended', 'revoked', 'expired')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. DONOR DOMAIN & AVAILABILITY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donor_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    donor_id_number VARCHAR(50) UNIQUE NOT NULL,
    blood_group VARCHAR(10) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')),
    blood_group_verified BOOLEAN DEFAULT FALSE,
    blood_group_verified_by UUID REFERENCES public.profiles(id),
    primary_location_id UUID REFERENCES public.locations(id),
    weight_kg NUMERIC(5, 2),
    last_donation_date DATE,
    verified_donation_count INT DEFAULT 0,
    availability_status VARCHAR(40) DEFAULT 'available' CHECK (availability_status IN ('available', 'temporarily_unavailable', 'needs_confirmation', 'paused_by_donor', 'hidden_from_search', 'under_review', 'suspended')),
    next_eligible_date DATE,
    is_ready_to_donate BOOLEAN DEFAULT TRUE,
    allow_emergency_calls BOOLEAN DEFAULT TRUE,
    allow_sms_alerts BOOLEAN DEFAULT TRUE,
    public_discovery_consent BOOLEAN DEFAULT TRUE,
    hide_phone_from_public BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '06:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donor_availability_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
    previous_status VARCHAR(40) NOT NULL,
    new_status VARCHAR(40) NOT NULL,
    trigger_reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORGANIZATIONS & HOSPITALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) CHECK (org_type IN ('hospital', 'blood_bank', 'volunteer_club', 'ngo', 'educational_institution')),
    location_id UUID REFERENCES public.locations(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_in_org VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'active',
    UNIQUE (org_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. DONATION RECORDS & VERIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donation_types (
    id VARCHAR(30) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    cooldown_months INT DEFAULT 3,
    cooldown_days_min INT DEFAULT 90
);

CREATE TABLE IF NOT EXISTS public.donation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.donor_profiles(id) ON DELETE RESTRICT,
    donation_type_id VARCHAR(30) REFERENCES public.donation_types(id) DEFAULT 'whole_blood',
    hospital_id UUID REFERENCES public.organizations(id),
    donation_date DATE NOT NULL,
    units INT DEFAULT 1,
    bag_number VARCHAR(100),
    recipient_reference VARCHAR(100),
    evidence_document_url TEXT,
    submission_source VARCHAR(40) DEFAULT 'donor_self_report',
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'disputed')),
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. UNIVERSAL ROLE-BASED DIGITAL ID CARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.id_card_templates (
    id VARCHAR(50) PRIMARY KEY,
    role_id VARCHAR(50) REFERENCES public.role_definitions(id),
    primary_color VARCHAR(20) NOT NULL,
    secondary_color VARCHAR(20) NOT NULL,
    accent_color VARCHAR(20) NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    title_bn VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.id_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id VARCHAR(50) REFERENCES public.role_definitions(id),
    card_template_id VARCHAR(50) REFERENCES public.id_card_templates(id),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    secure_verification_token VARCHAR(120) UNIQUE NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    jurisdiction_name_en VARCHAR(255),
    jurisdiction_name_bn VARCHAR(255),
    designation_en VARCHAR(150),
    designation_bn VARCHAR(150),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    qr_code_payload TEXT NOT NULL,
    shareable_card_image_url TEXT
);

CREATE TABLE IF NOT EXISTS public.id_card_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES public.id_cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash VARCHAR(64),
    user_agent TEXT,
    result_status VARCHAR(30) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. ACHIEVEMENTS & BADGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
    id VARCHAR(50) PRIMARY KEY,
    title_en VARCHAR(100) NOT NULL,
    title_bn VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    category VARCHAR(40) DEFAULT 'blood_donation',
    required_count INT NOT NULL,
    badge_icon_url TEXT,
    badge_color VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.achievement_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) REFERENCES public.achievement_definitions(id) ON DELETE RESTRICT,
    milestone_count_at_award INT NOT NULL,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_url TEXT,
    UNIQUE (user_id, achievement_id)
);

-- ------------------------------------------------------------------------------
-- 9. EMERGENCY BLOOD REQUESTS & MATCHES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(30) UNIQUE NOT NULL,
    requester_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name_initials VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    component VARCHAR(40) DEFAULT 'whole_blood',
    units_needed INT NOT NULL CHECK (units_needed > 0 AND units_needed <= 20),
    units_fulfilled INT DEFAULT 0,
    urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('routine', 'urgent', 'critical_emergency')),
    hospital_name VARCHAR(255) NOT NULL,
    location_id UUID REFERENCES public.locations(id) NOT NULL,
    hospital_address TEXT,
    required_datetime TIMESTAMPTZ NOT NULL,
    requester_contact_phone VARCHAR(20) NOT NULL,
    description TEXT,
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    request_status VARCHAR(30) DEFAULT 'open' CHECK (request_status IN ('open', 'partially_fulfilled', 'fulfilled', 'cancelled', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.request_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
    notified_at TIMESTAMPTZ DEFAULT NOW(),
    response_status VARCHAR(30) DEFAULT 'notified' CHECK (response_status IN ('notified', 'interested', 'accepted', 'declined', 'unavailable')),
    phone_shared_with_requester BOOLEAN DEFAULT FALSE,
    response_time TIMESTAMPTZ,
    UNIQUE (request_id, donor_id)
);

-- ------------------------------------------------------------------------------
-- 10. CAMPAIGNS & AUDIT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    organizer_org_id UUID REFERENCES public.organizations(id),
    location_id UUID REFERENCES public.locations(id),
    venue_address TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming',
    banner_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action_type VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_donor_profiles_blood_group ON public.donor_profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_availability ON public.donor_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_location ON public.donor_profiles(primary_location_id);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON public.blood_requests(request_status, urgency);
CREATE INDEX IF NOT EXISTS idx_blood_requests_location ON public.blood_requests(location_id);
CREATE INDEX IF NOT EXISTS idx_id_cards_token ON public.id_cards(secure_verification_token);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON public.locations(parent_id);

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_unit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_availability_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Public read policies for reference data
DROP POLICY IF EXISTS "Public can read administrative unit types" ON public.administrative_unit_types;
CREATE POLICY "Public can read administrative unit types" ON public.administrative_unit_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read active locations" ON public.locations;
CREATE POLICY "Public can read active locations" ON public.locations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read role definitions" ON public.role_definitions;
CREATE POLICY "Public can read role definitions" ON public.role_definitions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read achievement definitions" ON public.achievement_definitions;
CREATE POLICY "Public can read achievement definitions" ON public.achievement_definitions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read id card templates" ON public.id_card_templates;
CREATE POLICY "Public can read id card templates" ON public.id_card_templates FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read verified organizations" ON public.organizations;
CREATE POLICY "Public can read verified organizations" ON public.organizations FOR SELECT USING (is_verified = true);

DROP POLICY IF EXISTS "Public can read upcoming campaigns" ON public.campaigns;
CREATE POLICY "Public can read upcoming campaigns" ON public.campaigns FOR SELECT USING (status IN ('upcoming', 'ongoing'));

-- Profiles: Users can read public profile summaries, edit own profile
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
CREATE POLICY "Public can view basic profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can edit own profile" ON public.profiles;
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Donor profiles: Public can view consenting available donors; donors manage own settings
DROP POLICY IF EXISTS "Public can discover consenting donors" ON public.donor_profiles;
CREATE POLICY "Public can discover consenting donors" ON public.donor_profiles FOR SELECT USING (public_discovery_consent = true);

DROP POLICY IF EXISTS "Donors can update own donor profile" ON public.donor_profiles;
CREATE POLICY "Donors can update own donor profile" ON public.donor_profiles FOR UPDATE USING (id = auth.uid());

-- ID Cards: Users can read own cards
DROP POLICY IF EXISTS "Users can view own ID cards" ON public.id_cards;
CREATE POLICY "Users can view own ID cards" ON public.id_cards FOR SELECT USING (user_id = auth.uid());

-- Blood requests: All authenticated can read open requests; requesters manage own
DROP POLICY IF EXISTS "Authenticated users can read open requests" ON public.blood_requests;
CREATE POLICY "Authenticated users can read open requests" ON public.blood_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Requesters can create requests" ON public.blood_requests;
CREATE POLICY "Requesters can create requests" ON public.blood_requests FOR INSERT WITH CHECK (requester_id = auth.uid());

DROP POLICY IF EXISTS "Requesters can update own requests" ON public.blood_requests;
CREATE POLICY "Requesters can update own requests" ON public.blood_requests FOR UPDATE USING (requester_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 13. SECURITY DEFINER FUNCTIONS (QR VERIFICATION GATEWAY)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_verified_id_card_summary(p_token TEXT)
RETURNS TABLE (
    card_number VARCHAR,
    full_name VARCHAR,
    avatar_url TEXT,
    role_title_en VARCHAR,
    role_title_bn VARCHAR,
    designation_en VARCHAR,
    designation_bn VARCHAR,
    jurisdiction_en VARCHAR,
    jurisdiction_bn VARCHAR,
    status VARCHAR,
    issued_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.card_number,
        p.full_name,
        p.avatar_url,
        r.display_name_en,
        r.display_name_bn,
        c.designation_en,
        c.designation_bn,
        c.jurisdiction_name_en,
        c.jurisdiction_name_bn,
        c.status,
        c.issued_at,
        c.expires_at
    FROM public.id_cards c
    JOIN public.profiles p ON p.id = c.user_id
    JOIN public.role_definitions r ON r.id = c.role_id
    WHERE c.secure_verification_token = p_token;
END;
$$;


-- >>> PART 2: ID CARD DESIGN STUDIO & TEMPLATE MIGRATIONS <<<
-- ==============================================================================
-- LALBINDU NATIONWIDE DIGITAL BLOOD DONATION ECOSYSTEM
-- MIGRATION 000002: ID CARD TEMPLATE MANAGEMENT & DESIGNER SYSTEM
-- ==============================================================================

-- 1. Extend id_card_templates table
ALTER TABLE public.id_card_templates
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS template_category VARCHAR(50) DEFAULT 'identity_card',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS active_version_id UUID,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Template Versions Table
CREATE TABLE IF NOT EXISTS public.id_card_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id VARCHAR(50) REFERENCES public.id_card_templates(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    version_tag VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    front_design_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    back_design_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    design_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    allowed_dynamic_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    version_status VARCHAR(30) DEFAULT 'draft' CHECK (version_status IN ('draft', 'published', 'archived')),
    UNIQUE(template_id, version_number)
);

-- 3. Template Assets Table
CREATE TABLE IF NOT EXISTS public.id_card_template_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id VARCHAR(50) REFERENCES public.id_card_templates(id) ON DELETE CASCADE,
    version_id UUID REFERENCES public.id_card_template_versions(id) ON DELETE SET NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'logo', 'landmark_silhouette', 'watermark', 'badge_icon'
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Template Audit Logs
CREATE TABLE IF NOT EXISTS public.id_card_template_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id VARCHAR(50) REFERENCES public.id_card_templates(id) ON DELETE SET NULL,
    version_id UUID,
    action VARCHAR(50) NOT NULL, -- 'TEMPLATE_CREATED', 'DRAFT_SAVED', 'VERSION_PUBLISHED', 'ROLLBACK', 'CARDS_MIGRATED'
    previous_version_tag VARCHAR(20),
    new_version_tag VARCHAR(20),
    details JSONB DEFAULT '{}'::jsonb,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    performed_by_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Extend id_cards table to link version and tracking
ALTER TABLE public.id_cards
ADD COLUMN IF NOT EXISTS template_version_id UUID REFERENCES public.id_card_template_versions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS reissuance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reissued_at TIMESTAMPTZ;

-- 6. Enable RLS on new tables
ALTER TABLE public.id_card_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_template_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_template_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for id_card_template_versions
DROP POLICY IF EXISTS "Public can view published template versions" ON public.id_card_template_versions;
CREATE POLICY "Public can view published template versions"
ON public.id_card_template_versions FOR SELECT
TO anon, authenticated
USING (version_status = 'published');

DROP POLICY IF EXISTS "Super Admins can manage all template versions" ON public.id_card_template_versions;
CREATE POLICY "Super Admins can manage all template versions"
ON public.id_card_template_versions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id IN ('super_admin', 'co_super_admin') AND ura.is_active = TRUE
    )
);

-- Policies for id_card_template_assets
DROP POLICY IF EXISTS "Public can view template assets" ON public.id_card_template_assets;
CREATE POLICY "Public can view template assets"
ON public.id_card_template_assets FOR SELECT
TO anon, authenticated
USING (TRUE);

DROP POLICY IF EXISTS "Super Admins can manage template assets" ON public.id_card_template_assets;
CREATE POLICY "Super Admins can manage template assets"
ON public.id_card_template_assets FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id IN ('super_admin', 'co_super_admin') AND ura.is_active = TRUE
    )
);

-- Policies for id_card_template_audit_logs
DROP POLICY IF EXISTS "Super Admins can view and write template audit logs" ON public.id_card_template_audit_logs;
CREATE POLICY "Super Admins can view and write template audit logs"
ON public.id_card_template_audit_logs FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id IN ('super_admin', 'co_super_admin') AND ura.is_active = TRUE
    )
);

-- 6.5. Ensure parent roles and templates exist before versions are inserted
INSERT INTO public.role_definitions (id, display_name_en, display_name_bn, description, badge_color, rank_level, is_administrative) VALUES
('super_admin', 'Super Administrator', 'প্রধান প্রশাসক', 'Full platform administrative oversight', '#580F1A', 100, true),
('co_super_admin', 'Co-Super Administrator (Equal Power)', 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)', 'Full nationwide equal administrative authority', '#580F1A', 100, true),
('division_admin', 'Division Administrator', 'বিভাগীয় প্রশাসক', 'Regional administrative coordinator', '#0D3B66', 80, true),
('district_admin', 'District Administrator', 'জেলা সমন্বয়ক ও প্রশাসক', 'District operational coordinator', '#006A4E', 70, true),
('upazila_admin', 'Upazila Administrator', 'উপজেলা প্রশাসক', 'Sub-district operational lead', '#D84A1B', 60, true),
('thana_admin', 'Metropolitan Thana Admin', 'মেট্রোপলিটন থানা প্রশাসক', 'Metropolitan urban coordinator', '#008080', 60, true),
('union_admin', 'Union Administrator', 'ইউনিয়ন সমন্বয়ক', 'Grassroots rural coordinator', '#4A154B', 40, true),
('donor', 'Voluntary Blood Donor', 'স্বেচ্ছাসেবী রক্তদাতা', 'Verified blood donor', '#C8102E', 10, false),
('volunteer', 'Registered Volunteer', 'স্বেচ্ছাসেবক', 'Grassroots platform volunteer', '#006A4E', 20, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.id_card_templates (id, role_id, primary_color, secondary_color, accent_color, title_en, title_bn, is_active) VALUES
('tpl-super-admin', 'super_admin', '#580F1A', '#30080E', '#D4AF37', 'Super Administrator Card', 'প্রধান প্রশাসক পরিচয়পত্র', true),
('tpl-co-super-admin', 'co_super_admin', '#580F1A', '#30080E', '#D4AF37', 'Co-Super Administrator Card', 'কো-সুপার প্রশাসক পরিচয়পত্র', true),
('tpl-donor', 'donor', '#006A4E', '#C8102E', '#C8102E', 'Voluntary Donor Card', 'স্বেচ্ছাসেবী রক্তদাতা কার্ড', true),
('tpl-division-admin', 'division_admin', '#0D3B66', '#062038', '#F4D35E', 'Division Administrator Card', 'বিভাগীয় প্রশাসক পরিচয়পত্র', true),
('tpl-district-admin', 'district_admin', '#006A4E', '#004532', '#A7F3D0', 'District Administrator Card', 'জেলা সমন্বয়ক পরিচয়পত্র', true),
('tpl-upazila-admin', 'upazila_admin', '#D84A1B', '#93300E', '#FED7AA', 'Upazila Administrator Card', 'উপজেলা প্রশাসক পরিচয়পত্র', true),
('tpl-thana-admin', 'thana_admin', '#008080', '#004C4C', '#99F6E4', 'Thana Administrator Card', 'থানা প্রশাসক পরিচয়পত্র', true),
('tpl-union-admin', 'union_admin', '#4A154B', '#2B082C', '#E9D5FF', 'Union Administrator Card', 'ইউনিয়ন সমন্বয়ক পরিচয়পত্র', true),
('tpl-volunteer', 'volunteer', '#1B4931', '#0C2618', '#A7F3D0', 'Volunteer Card', 'স্বেচ্ছাসেবক পরিচয়পত্র', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Initial Published Template Versions
INSERT INTO public.id_card_template_versions 
(id, template_id, version_number, version_tag, front_design_config, back_design_config, design_settings, allowed_dynamic_fields, version_status, published_at)
VALUES
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'tpl-super-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "smriti_soudho", "badgeIcon": "gold_star"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#580F1A", "secondaryColor": "#30080E", "accentColor": "#D4AF37", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Super Admin"}'::jsonb,
    '["full_name", "unique_id", "role_name", "organization_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'tpl-donor',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showBloodGroup": true, "showDonations": true, "showValidity": true, "watermarkType": "blood_drop", "badgeIcon": "community"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#006A4E", "secondaryColor": "#C8102E", "accentColor": "#C8102E", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Donor"}'::jsonb,
    '["full_name", "unique_id", "role_name", "blood_group", "verified_donation_count", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'tpl-division-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "sangsad_bhaban", "badgeIcon": "star"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#0D3B66", "secondaryColor": "#062038", "accentColor": "#F4D35E", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Division Administrator"}'::jsonb,
    '["full_name", "unique_id", "role_name", "division_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000004'::uuid,
    'tpl-district-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "ahsan_manzil", "badgeIcon": "fort"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#006A4E", "secondaryColor": "#004532", "accentColor": "#A7F3D0", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "District Administrator"}'::jsonb,
    '["full_name", "unique_id", "role_name", "district_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000005'::uuid,
    'tpl-upazila-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "shat_gombuj", "badgeIcon": "mosque"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#D84A1B", "secondaryColor": "#93300E", "accentColor": "#FED7AA", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Upazila Administrator"}'::jsonb,
    '["full_name", "unique_id", "role_name", "upazila_name", "district_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000006'::uuid,
    'tpl-thana-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "smriti_soudho", "badgeIcon": "building"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#008080", "secondaryColor": "#004C4C", "accentColor": "#99F6E4", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Metropolitan Thana Administrator"}'::jsonb,
    '["full_name", "unique_id", "role_name", "thana_name", "district_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000007'::uuid,
    'tpl-union-admin',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "rural_landscape", "badgeIcon": "star"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#4A154B", "secondaryColor": "#2B082C", "accentColor": "#E9D5FF", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Union Administrator"}'::jsonb,
    '["full_name", "unique_id", "role_name", "union_name", "district_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000008'::uuid,
    'tpl-volunteer',
    1,
    'v1.0.0',
    '{"showLogo": true, "showPhoto": true, "showBadge": true, "showJurisdiction": true, "showValidity": true, "watermarkType": "volunteers", "badgeIcon": "user"}'::jsonb,
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "bd_map"}'::jsonb,
    '{"primaryColor": "#1B4931", "secondaryColor": "#0C2618", "accentColor": "#A7F3D0", "textColor": "#171717", "borderRadius": "24px", "ribbonLabel": "Volunteer"}'::jsonb,
    '["full_name", "unique_id", "role_name", "district_name", "issued_at", "expires_at", "verification_qr"]'::jsonb,
    'published',
    NOW()
)
ON CONFLICT (template_id, version_number) DO UPDATE
SET 
    front_design_config = EXCLUDED.front_design_config,
    back_design_config = EXCLUDED.back_design_config,
    design_settings = EXCLUDED.design_settings,
    version_status = 'published';

-- Update id_card_templates active_version_id
UPDATE public.id_card_templates t
SET active_version_id = v.id, status = 'published'
FROM public.id_card_template_versions v
WHERE v.template_id = t.id AND v.version_number = 1;


-- >>> PART 3: NATIONWIDE BROADCAST & NOTIFICATIONS ENGINE <<<
-- ==============================================================================
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — NOTIFICATIONS & BROADCASTS SCHEMA
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BROADCAST NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('emergency', 'achievement', 'verification', 'id_card', 'campaign', 'system')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    message_en TEXT NOT NULL,
    message_bn TEXT NOT NULL,
    action_link VARCHAR(255) DEFAULT '/blood-requests',
    target_group VARCHAR(50) DEFAULT 'all' CHECK (target_group IN ('all', 'specific_blood_group', 'division', 'admins_only')),
    target_value VARCHAR(100),
    sender_name VARCHAR(255) DEFAULT 'LalBindu Authority',
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USER NOTIFICATION READ RECEIPTS & PREFERENCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.broadcast_notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (notification_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_active ON public.broadcast_notifications(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_target ON public.broadcast_notifications(target_group, target_value);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications(user_id, is_read);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone can read active broadcasts intended for all, or their matching segment
DROP POLICY IF EXISTS "Public & donors can view active broadcasts" ON public.broadcast_notifications;
CREATE POLICY "Public & donors can view active broadcasts"
    ON public.broadcast_notifications
    FOR SELECT
    USING (
        is_active = TRUE AND (
            target_group = 'all' OR
            target_group IS NULL OR
            auth.role() = 'authenticated'
        )
    );

-- Insert/Update/Delete policy: Only administrators can dispatch, update or delete broadcasts
DROP POLICY IF EXISTS "Admins can manage broadcast notifications" ON public.broadcast_notifications;
CREATE POLICY "Admins can manage broadcast notifications"
    ON public.broadcast_notifications
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = TRUE
            AND ura.role_id IN ('super_admin', 'co_super_admin', 'division_admin', 'district_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = TRUE
            AND ura.role_id IN ('super_admin', 'co_super_admin', 'division_admin', 'district_admin')
        )
    );

-- User notifications policies: Users manage their own read receipts
DROP POLICY IF EXISTS "Users can view their notification read receipts" ON public.user_notifications;
CREATE POLICY "Users can view their notification read receipts"
    ON public.user_notifications
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notification read receipts" ON public.user_notifications;
CREATE POLICY "Users can update their notification read receipts"
    ON public.user_notifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify their notification read receipts" ON public.user_notifications;
CREATE POLICY "Users can modify their notification read receipts"
    ON public.user_notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. SEED INITIAL NOTIFICATIONS
-- ------------------------------------------------------------------------------
INSERT INTO public.broadcast_notifications (
    type, priority, title_en, title_bn, message_en, message_bn, 
    action_link, target_group, target_value, sender_name
) VALUES
(
    'emergency', 
    'urgent', 
    'Critical Emergency: O+ Blood Needed', 
    'সংকটাপন্ন জরুরি: O+ রক্তের আবেদন', 
    'Open-heart surgery at NICVD. Matches your O+ blood group and location.', 
    'এনআইসিভিডিতে উন্মুক্ত হার্ট সার্জারি। আপনার রক্তের গ্রুপ ও এলাকার সাথে ম্যাচ করেছে।', 
    '/blood-requests', 
    'specific_blood_group', 
    'O+', 
    'National Emergency Dispatch'
),
(
    'achievement', 
    'normal', 
    'Achievement Unlocked: Life Saver!', 
    'অর্জন আনলক: জীবন রক্ষক!', 
    'Congratulations! You have completed 5 verified donations.', 
    'অভিনন্দন! আপনি সফলভাবে ৫টি যাচাইকৃত রক্তদান সম্পন্ন করেছেন।', 
    '/achievements', 
    'all', 
    NULL, 
    'LalBindu Recognition Board'
),
(
    'verification', 
    'high', 
    'Donation Record Verified by Hospital', 
    'হাসপাতাল কর্তৃক রক্তদান রেকর্ড যাচাই সম্পন্ন', 
    'Dhaka Medical College has approved your whole blood donation from Aug 10.', 
    'ঢাকা মেডিকেল কলেজ হাসপাতাল আপনার ১০ আগস্টের রক্তদান অনুমোদন করেছে।', 
    '/dashboard/donor', 
    'all', 
    NULL, 
    'Hospital Verification Desk'
),
(
    'id_card', 
    'normal', 
    'LalBindu Digital ID Card Active', 
    'লালবিন্দু ডিজিটাল পরিচয়পত্র সক্রিয়', 
    'Your cryptographic QR ID is active and ready for verification.', 
    'আপনার কিউআর সমৃদ্ধ ডিজিটাল কার্ড প্রস্তুত ও সক্রিয় রয়েছে।', 
    '/dashboard/donor#id-card', 
    'all', 
    NULL, 
    'LalBindu Identity Secretariat'
);


-- >>> PART 4: GEOGRAPHICAL, ADMINISTRATIVE & ROLE SEED DATA <<<
-- ==============================================================================
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — SEED DATA
-- ==============================================================================

-- 1. Administrative Unit Types
INSERT INTO public.administrative_unit_types (id, name_en, name_bn, hierarchy_level) VALUES
('division', 'Division', 'বিভাগ', 1),
('district', 'District (Zilla)', 'জেলা', 2),
('upazila', 'Upazila (Sub-district)', 'উপজেলা', 3),
('metropolitan_thana', 'Metropolitan Thana', 'মেট্রোপলিটন থানা', 3),
('city_corporation', 'City Corporation', 'সিটি কর্পোরেশন', 3),
('municipality', 'Municipality (Pourashava)', 'পৌরসভা', 3),
('union', 'Union Parishad', 'ইউনিয়ন পরিষদ', 4),
('ward', 'Ward', 'ওয়ার্ড', 4)
ON CONFLICT (id) DO NOTHING;

-- 2. Role Definitions
INSERT INTO public.role_definitions (id, display_name_en, display_name_bn, description, badge_color, rank_level, is_administrative) VALUES
('super_admin', 'Super Administrator', 'প্রধান প্রশাসক', 'Full platform administrative oversight', '#580F1A', 100, true),
('co_super_admin', 'Co-Super Administrator (Equal Power)', 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)', 'Full nationwide equal administrative authority', '#580F1A', 100, true),
('division_admin', 'Division Administrator', 'বিভাগীয় প্রশাসক', 'Regional administrative coordinator', '#0D3B66', 80, true),
('district_admin', 'District Administrator', 'জেলা সমন্বয়ক ও প্রশাসক', 'District operational coordinator', '#006A4E', 70, true),
('upazila_admin', 'Upazila Administrator', 'উপজেলা প্রশাসক', 'Sub-district operational lead', '#D84A1B', 60, true),
('thana_admin', 'Metropolitan Thana Admin', 'মেট্রোপলিটন থানা প্রশাসক', 'Metropolitan urban coordinator', '#008080', 60, true),
('city_corp_admin', 'City Corporation Admin', 'সিটি কর্পোরেশন প্রশাসক', 'Megacity municipal administrative lead', '#1B4931', 60, true),
('municipality_admin', 'Municipality Administrator', 'পৌরসভা প্রশাসক', 'Pourashava town coordinator', '#1D3557', 50, true),
('union_admin', 'Union Administrator', 'ইউনিয়ন সমন্বয়ক', 'Grassroots rural coordinator', '#4A154B', 40, true),
('ward_admin', 'Ward Administrator', 'ওয়ার্ড প্রতিনিধি', 'Local ward coordinator', '#9B111E', 30, true),
('hospital_admin', 'Hospital Administrator', 'হাসপাতাল প্রশাসক', 'Hospital account manager', '#1565C0', 50, false),
('hospital_staff', 'Hospital Clinical Staff', 'হাসপাতাল প্রতিনিধি', 'Clinical blood bank verifier', '#1565C0', 35, false),
('verification_officer', 'Donation Verification Officer', 'রক্তদান যাচাইকরণ কর্মকর্তা', 'Independent donation validator', '#2E7D32', 55, false),
('moderator', 'Community Moderator', 'প্ল্যাটফর্ম মডারেটর', 'Trust, safety and feedback moderator', '#E69A17', 45, false),
('campaign_manager', 'Campaign Organizer', 'ক্যাম্পেইন সমন্বয়ক', 'Blood drive coordinator', '#D84A1B', 35, false),
('volunteer', 'Registered Volunteer', 'স্বেচ্ছাসেবক', 'Grassroots platform volunteer', '#006A4E', 20, false),
('donor', 'Voluntary Blood Donor', 'স্বেচ্ছাসেবী রক্তদাতা', 'Verified blood donor', '#C8102E', 10, false),
('requester', 'Blood Requester', 'রক্ত গ্রহীতা / আবেদনকারী', 'Patient family member or requester', '#707070', 10, false)
ON CONFLICT (id) DO NOTHING;

-- 3. ID Card Templates
INSERT INTO public.id_card_templates (id, role_id, primary_color, secondary_color, accent_color, title_en, title_bn, is_active) VALUES
('super_admin_card', 'super_admin', '#580F1A', '#30080E', '#D4AF37', 'Super Administrator Card', 'প্রধান প্রশাসক পরিচয়পত্র', true),
('co_super_admin_card', 'co_super_admin', '#580F1A', '#30080E', '#D4AF37', 'Co-Super Administrator Card', 'কো-সুপার প্রশাসক পরিচয়পত্র', true),
('division_admin_card', 'division_admin', '#0D3B66', '#062038', '#F4D35E', 'Division Administrator Card', 'বিভাগীয় প্রশাসক পরিচয়পত্র', true),
('district_admin_card', 'district_admin', '#006A4E', '#004532', '#E8F5E9', 'District Administrator Card', 'জেলা সমন্বয়ক পরিচয়পত্র', true),
('upazila_admin_card', 'upazila_admin', '#D84A1B', '#93300E', '#FFF3E0', 'Upazila Administrator Card', 'উপজেলা প্রশাসক পরিচয়পত্র', true),
('thana_admin_card', 'thana_admin', '#008080', '#004C4C', '#E0F2F1', 'Thana Administrator Card', 'থানা প্রশাসক পরিচয়পত্র', true),
('city_corp_card', 'city_corp_admin', '#1B4931', '#0C2618', '#D4AF37', 'City Corporation Admin Card', 'সিটি কর্পোরেশন প্রশাসক কার্ড', true),
('municipality_card', 'municipality_admin', '#1D3557', '#0E1D33', '#A8DADC', 'Municipality Administrator Card', 'পৌরসভা প্রশাসক পরিচয়পত্র', true),
('union_card', 'union_admin', '#4A154B', '#2B082C', '#F3E5F5', 'Union Administrator Card', 'ইউনিয়ন সমন্বয়ক পরিচয়পত্র', true),
('ward_card', 'ward_admin', '#9B111E', '#580A11', '#FFEBEE', 'Ward Administrator Card', 'ওয়ার্ড প্রতিনিধি পরিচয়পত্র', true),
('donor_card', 'donor', '#C8102E', '#8E0B20', '#FFF5F6', 'Voluntary Donor Card', 'স্বেচ্ছাসেবী রক্তদাতা কার্ড', true),
('volunteer_card', 'volunteer', '#006A4E', '#004734', '#E8F5E9', 'Volunteer Card', 'স্বেচ্ছাসেবক পরিচয়পত্র', true),
('hospital_staff_card', 'hospital_staff', '#1565C0', '#0B3F7A', '#E3F2FD', 'Hospital Clinical Card', 'হাসপাতাল প্রতিনিধি কার্ড', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Achievement Definitions
INSERT INTO public.achievement_definitions (id, title_en, title_bn, description_en, description_bn, category, required_count, badge_color, is_active) VALUES
('first_drop', 'First Drop', 'প্রথম বিন্দু', 'Completed your first verified whole blood donation.', 'আপনার প্রথম সফল ও যাচাইকৃত রক্তদান সম্পন্ন করেছেন।', 'blood_donation', 1, '#C8102E', true),
('life_saver', 'Life Saver', 'জীবন রক্ষক', 'Completed 5 verified blood donations.', '৫ বার রক্তদান করে জীবন রক্ষায় গৌরবময় অবদান রেখেছেন।', 'blood_donation', 5, '#1565C0', true),
('hero_donor', 'Hero Donor', 'বীর রক্তদাতা', 'Completed 10 verified blood donations.', '১০ বার রক্তদান করে মানবতার বিরল দৃষ্টান্ত স্থাপন করেছেন।', 'blood_donation', 10, '#D4AF37', true),
('guardian_of_life', 'Guardian of Life', 'জীবনের অভিভাবক', 'Completed 25 verified blood donations.', '২৫ বার রক্তদান করে দেশের অন্যতম শ্রেষ্ঠ জীবন রক্ষক হিসেবে স্বীকৃতি।', 'blood_donation', 25, '#580F1A', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Donation Types
INSERT INTO public.donation_types (id, name_en, name_bn, cooldown_months, cooldown_days_min) VALUES
('whole_blood', 'Whole Blood (পূর্ণাঙ্গ রক্ত)', 'পূর্ণাঙ্গ রক্ত', 3, 90),
('platelets', 'Platelets (অণুচক্রিকা - এফেরেসিস)', 'অণুচক্রিকা (প্লেটলেট)', 0, 14),
('plasma', 'Plasma (প্লাজমা)', 'প্লাজমা', 1, 28)
ON CONFLICT (id) DO NOTHING;

-- 6. Bangladesh Divisions
INSERT INTO public.locations (id, code, unit_type, parent_id, name_en, name_bn, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'BD-DHA', 'division', NULL, 'Dhaka', 'ঢাকা', true),
('a0000000-0000-0000-0000-000000000002', 'BD-CTG', 'division', NULL, 'Chattogram', 'চট্টগ্রাম', true),
('a0000000-0000-0000-0000-000000000003', 'BD-RAJ', 'division', NULL, 'Rajshahi', 'রাজশাহী', true),
('a0000000-0000-0000-0000-000000000004', 'BD-KHU', 'division', NULL, 'Khulna', 'খুলনা', true),
('a0000000-0000-0000-0000-000000000005', 'BD-BAR', 'division', NULL, 'Barishal', 'বরিশাল', true),
('a0000000-0000-0000-0000-000000000006', 'BD-SYL', 'division', NULL, 'Sylhet', 'সিলেট', true),
('a0000000-0000-0000-0000-000000000007', 'BD-RAN', 'division', NULL, 'Rangpur', 'রংপুর', true),
('a0000000-0000-0000-0000-000000000008', 'BD-MYM', 'division', NULL, 'Mymensingh', 'ময়মনসিংহ', true)
ON CONFLICT (code) DO NOTHING;

-- 7. Bangladesh Sample Districts
INSERT INTO public.locations (id, code, unit_type, parent_id, division_id, name_en, name_bn, is_active) VALUES
('b0000000-0000-0000-0000-000000000013', 'BD-13', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dhaka', 'ঢাকা', true),
('b0000000-0000-0000-0000-000000000018', 'BD-18', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Gazipur', 'গাজীপুর', true),
('b0000000-0000-0000-0000-000000000040', 'BD-40', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Narayanganj', 'নারায়ণগঞ্জ', true),
('b0000000-0000-0000-0000-000000000010', 'BD-10', 'district', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Chattogram', 'চট্টগ্রাম', true),
('b0000000-0000-0000-0000-000000000054', 'BD-54', 'district', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Rajshahi', 'রাজশাহী', true),
('b0000000-0000-0000-0000-000000000027', 'BD-27', 'district', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'Khulna', 'খুলনা', true),
('b0000000-0000-0000-0000-000000000060', 'BD-60', 'district', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'Sylhet', 'সিলেট', true),
('b0000000-0000-0000-0000-000000000006', 'BD-06', 'district', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'Barishal', 'বরিশাল', true),
('b0000000-0000-0000-0000-000000000055', 'BD-55', 'district', 'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'Rangpur', 'রংপুর', true),
('b0000000-0000-0000-0000-000000000039', 'BD-39', 'district', 'a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'Mymensingh', 'ময়মনসিংহ', true)
ON CONFLICT (code) DO NOTHING;
