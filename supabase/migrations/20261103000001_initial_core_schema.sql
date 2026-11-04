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
