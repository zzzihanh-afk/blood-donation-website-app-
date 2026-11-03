# CHANGELOG — LALBINDU

## [1.0.0] - 2026-11-03
### Completed Phase 1 & Foundation Architecture
- Established production-grade pnpm monorepo layout:
  - `apps/web`: Next.js 15 App Router website & role portals.
  - `apps/mobile`: Expo 52 / React Native iOS & Android shared application.
  - `packages/shared-types`: Universal TypeScript models.
  - `packages/validation`: Zod schemas for +880 Bangladesh phones, requests, and profiles.
  - `packages/business-rules`: Strict calendar-month availability engine & achievements.
  - `packages/design-tokens`: Official LalBindu brand system & 12+ administrative card themes.
  - `packages/api-client`: Universal Supabase client & offline development seeds.
- Designed and authored complete database schema migration `20261103000001_initial_core_schema.sql` with 23 normalized tables and strict RLS policies.
- Authored `supabase/seed.sql` with all 8 Bangladesh administrative divisions, sample districts, role definitions, ID card templates, and default achievements.
- Implemented public verification route `/verify/[token]` with zero PII leakage and statutory non-governmental platform disclaimer.
- Built public responsive portal matching user reference mockups with live statistics, quick action cards, and emergency requests stream.
- Built authenticated donor dashboard with 3-calendar-month rule status, availability toggle, and dynamic QR code generation.
- Built administrative hierarchy dashboard with jurisdiction filter, pending clinical verifications queue, and ID card templates preview.
- Built complete mobile Expo app with 5 bottom navigation tabs (Home, Find Donor, Requests, My ID, Profile).
- Executed automated unit tests for business rules (7/7 passed), database schema & RLS (4/4 passed), Next.js production build (12/12 routes compiled), and mobile TypeScript check.
