# LALBINDU — ROLE AND PERMISSION MATRIX

## 1. Role Definitions

| Role ID | Role Title (EN) | Role Title (BN) | Rank | Category |
|---|---|---|---|---|
| `super_admin` | Super Administrator | প্রধান প্রশাসক | 100 | National Administration |
| `division_admin` | Division Administrator | বিভাগীয় প্রশাসক | 80 | Regional Administration |
| `district_admin` | District Administrator | জেলা সমন্বয়ক ও প্রশাসক | 70 | District Administration |
| `upazila_admin` | Upazila Administrator | উপজেলা প্রশাসক | 60 | Local Administration |
| `thana_admin` | Metropolitan Thana Admin | মেট্রোপলিটন থানা প্রশাসক | 60 | Metropolitan Administration |
| `city_corp_admin` | City Corporation Admin | সিটি কর্পোরেশন প্রশাসক | 60 | Urban Administration |
| `municipality_admin`| Municipality Administrator | পৌরসভা প্রশাসক | 50 | Urban Administration |
| `union_admin` | Union Administrator | ইউনিয়ন সমন্বয়ক | 40 | Grassroots Administration |
| `ward_admin` | Ward Administrator | ওয়ার্ড প্রতিনিধি | 30 | Grassroots Administration |
| `hospital_admin` | Hospital Administrator | হাসপাতাল প্রশাসক | 50 | Healthcare Organization |
| `hospital_staff` | Hospital Clinical Staff | হাসপাতাল প্রতিনিধি | 35 | Healthcare Organization |
| `verification_officer` | Donation Verification Officer| রক্তদান যাচাইকরণ কর্মকর্তা| 55 | Clinical Verification |
| `moderator` | Community Moderator | প্ল্যাটফর্ম মডারেটর | 45 | Trust & Safety |
| `campaign_manager` | Campaign Organizer | ক্যাম্পেইন সমন্বয়ক | 35 | Operations |
| `volunteer` | Registered Volunteer | স্বেচ্ছাসেবক | 20 | Community |
| `donor` | Voluntary Blood Donor | রক্তদাতা | 10 | Public Core |
| `requester` | Blood Requester | রক্ত গ্রহীতা / আবেদনকারী | 10 | Public Core |

---

## 2. Granular Permissions Matrix

| Permission Code | Super Admin | Div Admin | Dist Admin | Upazila/Thana Admin | Hospital Staff | Verification Officer | Moderator | Donor / Volunteer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `system.manage_settings` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admins.appoint_division` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admins.appoint_district` | ✅ | ✅ (Own) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admins.appoint_local` | ✅ | ✅ (Own) | ✅ (Own) | ❌ | ❌ | ❌ | ❌ | ❌ |
| `donors.view_jurisdiction`| ✅ | ✅ (Div) | ✅ (Dist) | ✅ (Upazila) | ❌ | ❌ | ❌ | ❌ |
| `donors.view_public` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `donations.submit` | ✅ | ❌ | ❌ | ❌ | ✅ (Own Org) | ❌ | ❌ | ✅ (Self) |
| `donations.verify` | ✅ | ❌ | ❌ | ❌ | ✅ (Authorized)| ✅ | ❌ | ❌ |
| `requests.create` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `requests.verify` | ✅ | ✅ (Div) | ✅ (Dist) | ✅ (Upazila) | ✅ (Own Hosp)| ✅ | ❌ | ❌ |
| `cards.issue` | ✅ | ✅ (Auto) | ✅ (Auto) | ✅ (Auto) | ❌ | ❌ | ❌ | ✅ (Auto) |
| `cards.revoke` | ✅ | ✅ (Sub) | ✅ (Sub) | ❌ | ❌ | ❌ | ❌ | ❌ |
| `achievements.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `moderation.review` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `audit.view_logs` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Privilege Escalation Prevention Rules

1. **Self-Promotion Prohibition**: No user can grant themselves a role or approve an appointment.
2. **Rank Boundary Enforcement**: An administrator can only appoint or approve subordinate administrators whose `rank_level` is strictly lower than their own.
3. **Jurisdiction Boundary Enforcement**: An administrator can only assign appointments to geographical locations situated within their own assigned jurisdiction boundary.
4. **Super Admin Guard**: The `super_admin` role can never be created via standard web forms; it requires direct database-level bootstrap seeding or explicit cryptographic Super Admin invitation.

---
© 2026 LalBindu Security Engineering.
