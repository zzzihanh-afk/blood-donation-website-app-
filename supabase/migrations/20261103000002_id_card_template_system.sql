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
CREATE POLICY "Public can view published template versions"
ON public.id_card_template_versions FOR SELECT
TO anon, authenticated
USING (version_status = 'published');

CREATE POLICY "Super Admins can manage all template versions"
ON public.id_card_template_versions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id = 'super_admin' AND ura.is_active = TRUE
    )
);

-- Policies for id_card_template_assets
CREATE POLICY "Public can view template assets"
ON public.id_card_template_assets FOR SELECT
TO anon, authenticated
USING (TRUE);

CREATE POLICY "Super Admins can manage template assets"
ON public.id_card_template_assets FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id = 'super_admin' AND ura.is_active = TRUE
    )
);

-- Policies for id_card_template_audit_logs
CREATE POLICY "Super Admins can view and write template audit logs"
ON public.id_card_template_audit_logs FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_role_assignments ura
        WHERE ura.user_id = auth.uid() AND ura.role_id = 'super_admin' AND ura.is_active = TRUE
    )
);

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
    '{"showQr": true, "showVerifyBadge": true, "showSlogan": true, "watermarkType": "blood_drop"}'::jsonb,
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
