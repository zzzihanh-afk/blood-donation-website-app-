# LalBindu — Every Drop Connects a Life
### বাংলাদেশ রক্তদান ও দাতা ব্যবস্থাপনা প্ল্যাটফর্ম (LalBindu: Bangladesh's Nationwide Blood Donation & Donor Management Ecosystem)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)](https://nextjs.org/)
[![React Native Expo](https://img.shields.io/badge/Expo-52.x-000020.svg)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 🌟 Executive Overview

**LalBindu** ("লালবিন্দু") is an enterprise-grade, nationwide digital blood donation and donor management ecosystem built exclusively for Bangladesh. Designed around the core ethos **"Every Drop Connects a Life"**, LalBindu unites all 8 administrative divisions, 64 districts, 495+ upazilas, city corporations, municipalities, and wards into a single, cohesive, mission-critical healthcare network.

Connecting:
1. **Voluntary Blood Donors** across all blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-).
2. **Emergency Blood Requesters & Patient Families** in critical clinical need.
3. **Hospitals, Clinics, & Blood Banks** coordinating donation drives and cross-matching.
4. **Volunteers & Field Coordinators** organizing grassroots drives.
5. **Blood Donation Organizations** (e.g., Red Crescent, Sandhani, Badhan, Quantum).
6. **Campaign & Drive Organizers** managing regional camps.
7. **Clinical Verification Officers** verifying genuine donation events.
8. **Multi-Tier Administrative Hierarchy** (National Super Admin, Division Admins, District Admins, Upazila Admins, Metropolitan Thana Admins, Municipality Admins, City Corporation Admins, and Ward Coordinators).

---

## 🎨 Visual Identity & Brand System

- **Primary Red**: `#C8102E` (Action, Vitality, Urgency)
- **Secondary Crimson**: `#E31E36` (Hover, Highlights, Gradients)
- **Bangladesh Heritage Green**: `#006A4E` (Verification, Safety, Trust)
- **Neutral Dark**: `#171717` (High-contrast typography)
- **Background Light**: `#FFFFFF` / Soft Tint: `#FFF5F6`
- **Success / Warning**: `#16834A` / `#E69A17`
- **Bilingual Core**: Native support for **Bangla (বাংলা)** and **English** across all web and mobile touchpoints.

---

## 🏛️ Ecosystem Deliverables

| Deliverable | Tech Stack | Status |
|---|---|---|
| **Public Responsive Portal** | Next.js 15 (App Router), Tailwind CSS, Lucide Icons, Framer Motion | ✅ Active Dev |
| **Donor & Requester Web App** | Next.js 15, SSR Auth, React Hook Form, Zod, TanStack | ✅ Active Dev |
| **Cross-Platform Mobile App (Android & iOS)** | React Native, Expo 52, Expo Router, SecureStore, Camera/QR | ✅ Active Dev |
| **Universal Role Digital ID System** | SVG / Canvas Renderer, PDF/PNG generator, Cryptographic QR | ✅ Active Dev |
| **Public QR Verification Gateway** | Next.js edge route `/verify/:token` (Zero PII leakage) | ✅ Active Dev |
| **Bangladesh Administrative Suite** | Multi-level hierarchy dashboard with jurisdiction-scoped RBAC | ✅ Active Dev |
| **Hospital & Blood Bank Portal** | Organization roster, authorized donation log, verification workflow | ✅ Active Dev |
| **Volunteer & Campaign Module** | Event registration, badge award engine, field coordination | ✅ Active Dev |
| **Emergency Match & Dispatch Engine** | Calendar-month availability logic, quiet hours, location filters | ✅ Active Dev |
| **Supabase PostgreSQL & Security** | PostgreSQL 15+, Row Level Security (RLS), Edge Functions, Cron | ✅ Active Dev |

---

## 📂 Monorepo Architecture

```text
├── apps/
│   ├── web/                    # Next.js 15 App Router website & authenticated portals
│   └── mobile/                 # React Native / Expo shared iOS & Android application
├── packages/
│   ├── shared-types/           # Common TypeScript interfaces, database schemas, enums
│   ├── validation/             # Zod validation schemas for forms and API payloads
│   ├── business-rules/         # Calendar-month availability engine, achievement calculations
│   ├── api-client/             # Universal Supabase client, queries, and mutations
│   └── design-tokens/          # Colors, typography, spacing, badge tokens, ID card templates
├── supabase/
│   ├── migrations/             # Timestamped SQL migrations with RLS policies
│   ├── functions/              # Deno Edge Functions (ID generation, SMS OTP, push)
│   ├── seed.sql                # Complete BD geo-dataset, default roles, milestone rules
│   └── tests/                  # Security tests, RLS policy verification, role escalation tests
├── assets/
│   └── branding/               # Official LalBindu logo, vectors, and UI references
└── docs/                       # Complete engineering, architectural, and security guides
```

---

## 🔒 Security, Integrity & Medical Safety

1. **Strict Medical Boundary**: LalBindu is a nationwide logistics and communication coordination platform. It never replaces clinical cross-matching, doctor-directed donor fitness screenings, or accredited blood bank testing.
2. **Three-Calendar-Month Waiting Period**: Platform-enforced temporary waiting periods after whole-blood donation are calculated strictly using Bangladesh local time (`Asia/Dhaka`) and calendar-month arithmetic (handling leap years and varying month lengths), never a crude 90-day approximation.
3. **Zero PII Leakage on QR Verification**: The public `/verify/:token` route displays only approved identity, role, and card validity status. Sensitive phone numbers, emails, addresses, and internal UUIDs are strictly redacted.
4. **Row Level Security (RLS)**: Every database table has PostgreSQL RLS enabled. Users can never edit verified donation counts or assign themselves elevated administrative privileges.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 20.18.0
- pnpm >= 9.x (`npm install -g pnpm`)

### Setup Instructions
```bash
# 1. Install dependencies across all workspaces
pnpm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start development servers
pnpm dev:web    # Launches Next.js Web on http://localhost:3000
pnpm dev:mobile # Launches Expo Metro bundler
```

---
© 2026 LalBindu Ecosystem. All rights reserved. Together for a Blood-Safe Bangladesh. ❤️
