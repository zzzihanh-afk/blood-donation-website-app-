# LALBINDU — SECURITY AND RLS POLICY ARCHITECTURE

## 1. Zero-Trust Security Tenets

1. **PostgreSQL RLS on Every Table**: All tables have Row Level Security enabled. By default, anonymous clients have ZERO access unless explicit `SELECT` policies are defined.
2. **No Service-Role Key on Clients**: Web clients only receive `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Mobile apps only receive `EXPO_PUBLIC_SUPABASE_ANON_KEY`. The `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to trusted server environments (Edge Functions / Server Actions).
3. **Immutable Verification Logic**: A user cannot update `verified_donation_count`, `availability_status`, `blood_group_verified`, or `status` of an ID card directly. These transitions are executed strictly through trusted PostgreSQL functions and Edge Functions.
4. **Phone Privacy Guard**: In public donor searches, `profiles.phone` is never exposed. Requesters only receive the donor's contact details when the donor explicitly chooses "Accept Contact Request".
5. **Secure Verification Tokens**: ID verification tokens are generated using cryptographically strong randomness (`crypto.randomBytes(32)`), and looked up via SHA-256 token hashes.

---

## 2. Row Level Security (RLS) Policy Specifications

### `profiles`
- `SELECT`: Public can view `full_name`, `avatar_url`, and non-sensitive fields. Private contact details (`phone`, `email`, `nid_number`) only readable by `auth.uid() = id` OR users with `admin` permissions.
- `UPDATE`: Only `auth.uid() = id`. Cannot modify verification flags.

### `donor_profiles`
- `SELECT`: Available donors with `public_discovery_consent = true` are searchable. Contact info remains hidden.
- `UPDATE`: Only `auth.uid() = id`. Columns `verified_donation_count`, `availability_status`, `next_eligible_date` are restricted from direct user mutation via trigger guards.

### `donation_records`
- `SELECT`: Donors can read their own records. Authorized hospital staff can read records for their own hospital. Admins can view jurisdiction-scoped records.
- `INSERT`: Donors can submit self-reports with status `pending`. Hospital staff can submit clinical donations.
- `UPDATE`: Only verification officers and admins can update `verification_status`.

### `id_cards`
- `SELECT`: Cardholders can read their own cards. Public verification endpoint reads through a dedicated security-definer function `get_verified_id_card_summary(p_token)` which projects only safe public fields.
- `INSERT` / `UPDATE`: Restricted to system triggers and administrative authorization functions.

### `blood_requests`
- `SELECT`: Open and verified blood requests are visible to all authenticated users.
- `INSERT`: Authenticated users can create blood requests.
- `UPDATE`: Requesters can update their own open requests. Admins and hospital staff can verify or mark fulfilled.

---

## 3. Database Security Definer Functions

```sql
-- Function to get sanitized public ID card verification
CREATE OR REPLACE FUNCTION get_verified_id_card_summary(p_token TEXT)
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
    FROM id_cards c
    JOIN profiles p ON p.id = c.user_id
    JOIN role_definitions r ON r.id = c.role_id
    WHERE c.secure_verification_token = p_token;
END;
$$;
```

---
© 2026 LalBindu Cybersecurity & Governance.
