# LALBINDU — API AND EDGE FUNCTION SPECIFICATION

## 1. REST & Edge Function Endpoints

All Edge Functions require Supabase JWT bearer authentication unless marked `[Public]`.

### Authentication & Profile
- `POST /functions/v1/auth-send-phone-otp` [Public]
  - Dispatches SMS OTP to Bangladesh numbers (+880...) via external SMS Gateway adapter.
- `POST /functions/v1/auth-verify-phone-otp` [Public]
  - Validates OTP code, signs or creates user in `auth.users`, provisions baseline `profiles` and `donor_profiles` row.
- `POST /functions/v1/user-switch-active-role`
  - Switches current active session context when a user holds multiple authorized roles.

### Universal Digital ID & QR
- `GET /verify/:token` [Public Next.js Route]
  - Invokes `get_verified_id_card_summary(:token)`. Returns redacted public identity card details.
- `POST /functions/v1/generate-role-id-card` [Admin / Internal]
  - Issues a cryptographically unique digital ID card for an authorized role assignment.
- `POST /functions/v1/revoke-id-card` [Admin]
  - Revokes an active ID card with an audit reason.

### Availability & Donation Engine
- `POST /functions/v1/submit-donation-record`
  - Submits a donation record (from donor or hospital staff).
- `POST /functions/v1/verify-donation-record` [Verification Officer / Hospital Staff / Admin]
  - Verifies donation record. Atomically executes calendar-month calculation, sets donor to `temporarily_unavailable`, updates review date, increments donation count, and triggers achievement evaluation.
- `POST /functions/v1/confirm-donor-availability`
  - Allows donor whose review date has passed (`needs_confirmation`) to re-confirm willingness to accept requests.

### Emergency Blood Requests & Smart Matching
- `POST /functions/v1/create-blood-request`
  - Validates emergency request payload, generates `request_code`, queries compatible donors in jurisdiction, dispatches push/SMS alerts.
- `POST /functions/v1/respond-blood-request`
  - Records donor's response: `interested`, `accept_contact`, `decline`, `not_available`.

---
© 2026 LalBindu API Infrastructure.
