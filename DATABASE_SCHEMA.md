# LALBINDU — DATABASE SCHEMA SPECIFICATION

## 1. Schema Groups

The database uses PostgreSQL with Supabase extensions (`uuid-ossp`, `pgcrypto`, optional `postgis`). All tables enforce strict referential integrity, UUID primary keys, and timestamp audit columns.

---

### A. Authentication & User Identity

#### `profiles`
Primary user profile linked directly to `auth.users.id`.
- `id`: UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
- `full_name`: VARCHAR(255) NOT NULL
- `phone`: VARCHAR(20) UNIQUE NOT NULL (normalized with +880)
- `email`: VARCHAR(255)
- `avatar_url`: TEXT
- `date_of_birth`: DATE
- `gender`: VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'))
- `nid_number`: VARCHAR(50) -- encrypted or hashed
- `is_phone_verified`: BOOLEAN DEFAULT FALSE
- `is_email_verified`: BOOLEAN DEFAULT FALSE
- `is_profile_verified`: BOOLEAN DEFAULT FALSE
- `preferred_language`: VARCHAR(10) DEFAULT 'bn' CHECK (preferred_language IN ('bn', 'en'))
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

#### `role_definitions`
Canonical system roles.
- `id`: VARCHAR(50) PRIMARY KEY (e.g. 'super_admin', 'division_admin', 'district_admin', 'donor', 'volunteer', 'hospital_admin', 'hospital_staff', 'verification_officer', 'moderator')
- `display_name_en`: VARCHAR(100) NOT NULL
- `display_name_bn`: VARCHAR(100) NOT NULL
- `description`: TEXT
- `badge_color`: VARCHAR(20) NOT NULL
- `rank_level`: INT NOT NULL -- Higher rank indicates higher administrative precedence
- `is_administrative`: BOOLEAN DEFAULT FALSE

#### `permissions`
Granular platform capabilities.
- `id`: VARCHAR(100) PRIMARY KEY (e.g. 'donors.read', 'donations.verify', 'cards.revoke', 'admins.appoint')
- `category`: VARCHAR(50) NOT NULL
- `description`: TEXT

#### `role_permissions`
Join table mapping roles to permissions.
- `role_id`: VARCHAR(50) REFERENCES role_definitions(id) ON DELETE CASCADE
- `permission_id`: VARCHAR(100) REFERENCES permissions(id) ON DELETE CASCADE
- PRIMARY KEY (role_id, permission_id)

#### `user_role_assignments`
Tracks multiple assigned roles per user, along with authorization provenance.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `role_id`: VARCHAR(50) REFERENCES role_definitions(id) ON DELETE CASCADE
- `assigned_by`: UUID REFERENCES profiles(id)
- `is_active`: BOOLEAN DEFAULT TRUE
- `assigned_at`: TIMESTAMPTZ DEFAULT NOW()
- `revoked_at`: TIMESTAMPTZ
- UNIQUE (user_id, role_id)

---

### B. Bangladesh Locations & Administrative Jurisdictions

#### `administrative_unit_types`
- `id`: VARCHAR(50) PRIMARY KEY (e.g. 'division', 'district', 'upazila', 'metropolitan_thana', 'city_corporation', 'municipality', 'union', 'ward')
- `name_en`: VARCHAR(100) NOT NULL
- `name_bn`: VARCHAR(100) NOT NULL
- `hierarchy_level`: INT NOT NULL

#### `locations`
Hierarchical geographical master dataset for all Bangladesh entities.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `code`: VARCHAR(50) UNIQUE NOT NULL (e.g. 'BD-DHA', 'BD-DHA-MIRPUR')
- `unit_type`: VARCHAR(50) REFERENCES administrative_unit_types(id)
- `parent_id`: UUID REFERENCES locations(id) ON DELETE RESTRICT
- `name_en`: VARCHAR(150) NOT NULL
- `name_bn`: VARCHAR(150) NOT NULL
- `division_id`: UUID REFERENCES locations(id)
- `district_id`: UUID REFERENCES locations(id)
- `latitude`: NUMERIC(10, 7)
- `longitude`: NUMERIC(10, 7)
- `is_active`: BOOLEAN DEFAULT TRUE
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

#### `administrative_assignments`
Binds an administrator account to a specific jurisdictional location.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `role_id`: VARCHAR(50) REFERENCES role_definitions(id)
- `location_id`: UUID REFERENCES locations(id) ON DELETE RESTRICT
- `appointed_by`: UUID REFERENCES profiles(id)
- `approved_by`: UUID REFERENCES profiles(id)
- `status`: VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending_approval', 'active', 'suspended', 'revoked', 'expired'))
- `started_at`: TIMESTAMPTZ DEFAULT NOW()
- `ended_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

---

### C. Donor Profile & Availability Engine

#### `donor_profiles`
Specialized donor details, blood group, privacy, and public discovery consents.
- `id`: UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE
- `donor_id_number`: VARCHAR(50) UNIQUE NOT NULL (e.g. 'LB-0004278')
- `blood_group`: VARCHAR(10) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'))
- `blood_group_verified`: BOOLEAN DEFAULT FALSE
- `blood_group_verified_by`: UUID REFERENCES profiles(id)
- `primary_location_id`: UUID REFERENCES locations(id)
- `weight_kg`: NUMERIC(5, 2)
- `last_donation_date`: DATE
- `verified_donation_count`: INT DEFAULT 0
- `availability_status`: VARCHAR(40) DEFAULT 'available' CHECK (availability_status IN ('available', 'temporarily_unavailable', 'needs_confirmation', 'paused_by_donor', 'hidden_from_search', 'under_review', 'suspended'))
- `next_eligible_date`: DATE
- `is_ready_to_donate`: BOOLEAN DEFAULT TRUE
- `allow_emergency_calls`: BOOLEAN DEFAULT TRUE
- `allow_sms_alerts`: BOOLEAN DEFAULT TRUE
- `public_discovery_consent`: BOOLEAN DEFAULT TRUE
- `hide_phone_from_public`: BOOLEAN DEFAULT TRUE
- `quiet_hours_start`: TIME DEFAULT '22:00'
- `quiet_hours_end`: TIME DEFAULT '06:00'
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

#### `donor_availability_events`
Audit log of every state change in a donor's availability.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `donor_id`: UUID REFERENCES donor_profiles(id) ON DELETE CASCADE
- `previous_status`: VARCHAR(40) NOT NULL
- `new_status`: VARCHAR(40) NOT NULL
- `trigger_reason`: VARCHAR(100) NOT NULL (e.g. 'verified_whole_blood_donation', 'donor_manual_pause', 'cron_review_window_reached', 'donor_confirmed_availability')
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

---

### D. Donation Records & Verifications

#### `donation_types`
- `id`: VARCHAR(30) PRIMARY KEY (e.g. 'whole_blood', 'platelets', 'plasma', 'red_cells')
- `name_en`: VARCHAR(100) NOT NULL
- `name_bn`: VARCHAR(100) NOT NULL
- `cooldown_months`: INT DEFAULT 3
- `cooldown_days_min`: INT DEFAULT 90

#### `donation_records`
Submitted blood donation events.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `donor_id`: UUID REFERENCES donor_profiles(id) ON DELETE RESTRICT
- `donation_type_id`: VARCHAR(30) REFERENCES donation_types(id) DEFAULT 'whole_blood'
- `hospital_id`: UUID REFERENCES organizations(id)
- `donation_date`: DATE NOT NULL
- `units`: INT DEFAULT 1
- `bag_number`: VARCHAR(100)
- `recipient_reference`: VARCHAR(100)
- `evidence_document_url`: TEXT
- `submission_source`: VARCHAR(40) DEFAULT 'donor_self_report' CHECK (submission_source IN ('donor_self_report', 'hospital_entry', 'campaign_drive'))
- `verification_status`: VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'disputed'))
- `verified_by`: UUID REFERENCES profiles(id)
- `verified_at`: TIMESTAMPTZ
- `rejection_reason`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

---

### E. Universal Role-Based Digital ID Cards

#### `id_card_templates`
Visual configurations per role.
- `id`: VARCHAR(50) PRIMARY KEY (e.g. 'donor_card', 'super_admin_card', 'division_admin_card', 'district_admin_card', 'hospital_staff_card', 'volunteer_card')
- `role_id`: VARCHAR(50) REFERENCES role_definitions(id)
- `primary_color`: VARCHAR(20) NOT NULL
- `secondary_color`: VARCHAR(20) NOT NULL
- `accent_color`: VARCHAR(20) NOT NULL
- `title_en`: VARCHAR(100) NOT NULL
- `title_bn`: VARCHAR(100) NOT NULL
- `is_active`: BOOLEAN DEFAULT TRUE

#### `id_cards`
Digital ID cards issued to users for their specific active roles.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `role_id`: VARCHAR(50) REFERENCES role_definitions(id)
- `card_template_id`: VARCHAR(50) REFERENCES id_card_templates(id)
- `card_number`: VARCHAR(50) UNIQUE NOT NULL (e.g. 'LB-CARD-DNR-0004278', 'LB-CARD-ADM-DHAKA-01')
- `secure_verification_token`: VARCHAR(120) UNIQUE NOT NULL
- `token_hash`: VARCHAR(128) NOT NULL
- `jurisdiction_name_en`: VARCHAR(255)
- `jurisdiction_name_bn`: VARCHAR(255)
- `designation_en`: VARCHAR(150)
- `designation_bn`: VARCHAR(150)
- `status`: VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked', 'expired'))
- `issued_at`: TIMESTAMPTZ DEFAULT NOW()
- `expires_at`: TIMESTAMPTZ
- `revoked_at`: TIMESTAMPTZ
- `revocation_reason`: TEXT
- `qr_code_payload`: TEXT NOT NULL
- `shareable_card_image_url`: TEXT

#### `id_card_verifications`
Audit trail of public QR scans.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `card_id`: UUID REFERENCES id_cards(id) ON DELETE CASCADE
- `scanned_at`: TIMESTAMPTZ DEFAULT NOW()
- `ip_hash`: VARCHAR(64)
- `user_agent`: TEXT
- `result_status`: VARCHAR(30) NOT NULL

---

### F. Achievements & Badges

#### `achievement_definitions`
- `id`: VARCHAR(50) PRIMARY KEY (e.g. 'first_drop', 'life_saver', 'hero_donor', 'guardian_of_life')
- `title_en`: VARCHAR(100) NOT NULL
- `title_bn`: VARCHAR(100) NOT NULL
- `description_en`: TEXT NOT NULL
- `description_bn`: TEXT NOT NULL
- `category`: VARCHAR(40) DEFAULT 'blood_donation' CHECK (category IN ('blood_donation', 'volunteering', 'campaign_organizing', 'community_service'))
- `required_count`: INT NOT NULL
- `badge_icon_url`: TEXT
- `badge_color`: VARCHAR(30) NOT NULL
- `is_active`: BOOLEAN DEFAULT TRUE

#### `achievement_awards`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `achievement_id`: VARCHAR(50) REFERENCES achievement_definitions(id) ON DELETE RESTRICT
- `milestone_count_at_award`: INT NOT NULL
- `awarded_at`: TIMESTAMPTZ DEFAULT NOW()
- `certificate_url`: TEXT
- UNIQUE (user_id, achievement_id)

---

### G. Emergency Blood Requests & Smart Donor Matching

#### `blood_requests`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `request_code`: VARCHAR(30) UNIQUE NOT NULL (e.g. 'REQ-2026-00812')
- `requester_id`: UUID REFERENCES profiles(id) ON DELETE SET NULL
- `patient_name_initials`: VARCHAR(50) NOT NULL
- `blood_group`: VARCHAR(10) NOT NULL
- `component`: VARCHAR(40) DEFAULT 'whole_blood'
- `units_needed`: INT NOT NULL CHECK (units_needed > 0 AND units_needed <= 20)
- `units_fulfilled`: INT DEFAULT 0
- `urgency`: VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('routine', 'urgent', 'critical_emergency'))
- `hospital_name`: VARCHAR(255) NOT NULL
- `location_id`: UUID REFERENCES locations(id) NOT NULL
- `hospital_address`: TEXT
- `required_datetime`: TIMESTAMPTZ NOT NULL
- `requester_contact_phone`: VARCHAR(20) NOT NULL
- `description`: TEXT
- `verification_status`: VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'))
- `request_status`: VARCHAR(30) DEFAULT 'open' CHECK (request_status IN ('open', 'partially_fulfilled', 'fulfilled', 'cancelled', 'expired'))
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

#### `request_matches`
Donors notified of this specific request.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `request_id`: UUID REFERENCES blood_requests(id) ON DELETE CASCADE
- `donor_id`: UUID REFERENCES donor_profiles(id) ON DELETE CASCADE
- `notified_at`: TIMESTAMPTZ DEFAULT NOW()
- `response_status`: VARCHAR(30) DEFAULT 'notified' CHECK (response_status IN ('notified', 'interested', 'accepted', 'declined', 'unavailable'))
- `phone_shared_with_requester`: BOOLEAN DEFAULT FALSE
- `response_time`: TIMESTAMPTZ
- UNIQUE (request_id, donor_id)

---

### H. Organizations, Hospitals & Campaigns

#### `organizations`
Registered healthcare, NGO, and donor societies.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name_en`: VARCHAR(255) NOT NULL
- `name_bn`: VARCHAR(255) NOT NULL
- `org_type`: VARCHAR(50) CHECK (org_type IN ('hospital', 'blood_bank', 'volunteer_club', 'ngo', 'educational_institution'))
- `location_id`: UUID REFERENCES locations(id)
- `contact_email`: VARCHAR(255)
- `contact_phone`: VARCHAR(30)
- `is_verified`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

#### `organization_memberships`
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `org_id`: UUID REFERENCES organizations(id) ON DELETE CASCADE
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `role_in_org`: VARCHAR(50) NOT NULL
- `status`: VARCHAR(30) DEFAULT 'active'
- UNIQUE (org_id, user_id)

#### `campaigns`
Public blood drives and awareness programs.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `title_en`: VARCHAR(255) NOT NULL
- `title_bn`: VARCHAR(255) NOT NULL
- `description_en`: TEXT
- `description_bn`: TEXT
- `organizer_org_id`: UUID REFERENCES organizations(id)
- `location_id`: UUID REFERENCES locations(id)
- `venue_address`: TEXT NOT NULL
- `start_time`: TIMESTAMPTZ NOT NULL
- `end_time`: TIMESTAMPTZ NOT NULL
- `status`: VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled'))
- `banner_image_url`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

---

### I. Security, Audit & Consent

#### `audit_logs`
Immutable administrative audit log.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `actor_id`: UUID REFERENCES profiles(id)
- `action_type`: VARCHAR(100) NOT NULL
- `target_resource`: VARCHAR(100) NOT NULL
- `target_id`: VARCHAR(100)
- `previous_state`: JSONB
- `new_state`: JSONB
- `ip_address`: VARCHAR(64)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

#### `consent_records`
Legal compliance & terms acknowledgment.
- `id`: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id`: UUID REFERENCES profiles(id) ON DELETE CASCADE
- `consent_type`: VARCHAR(100) NOT NULL
- `consent_version`: VARCHAR(20) NOT NULL
- `accepted_at`: TIMESTAMPTZ DEFAULT NOW()

---
© 2026 LalBindu Database Engineering Team.
