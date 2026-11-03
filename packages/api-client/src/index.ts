import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  DonorProfile,
  LocationItem,
  BloodRequestItem,
  DigitalIdCard,
  IdCardPublicVerification
} from '@lalbindu/shared-types';

declare const process: any;

export function getSupabaseClient(supabaseUrl?: string, supabaseAnonKey?: string): SupabaseClient | null {
  const url = supabaseUrl || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL : '');
  const key = supabaseAnonKey || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY : '');

  if (!url || !key || url.includes('xyzcompany')) {
    return null;
  }
  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// BANGLADESH GEOGRAPHICAL SEED DATA (Divisions & Key Districts)
// ---------------------------------------------------------------------------
export const BANGLADESH_DIVISIONS: LocationItem[] = [
  { id: 'div-dha', code: 'BD-DHA', unit_type: 'division', name_en: 'Dhaka', name_bn: 'ঢাকা', is_active: true },
  { id: 'div-ctg', code: 'BD-CTG', unit_type: 'division', name_en: 'Chattogram', name_bn: 'চট্টগ্রাম', is_active: true },
  { id: 'div-raj', code: 'BD-RAJ', unit_type: 'division', name_en: 'Rajshahi', name_bn: 'রাজশাহী', is_active: true },
  { id: 'div-khu', code: 'BD-KHU', unit_type: 'division', name_en: 'Khulna', name_bn: 'খুলনা', is_active: true },
  { id: 'div-bar', code: 'BD-BAR', unit_type: 'division', name_en: 'Barishal', name_bn: 'বরিশাল', is_active: true },
  { id: 'div-syl', code: 'BD-SYL', unit_type: 'division', name_en: 'Sylhet', name_bn: 'সিলেট', is_active: true },
  { id: 'div-ran', code: 'BD-RAN', unit_type: 'division', name_en: 'Rangpur', name_bn: 'রংপুর', is_active: true },
  { id: 'div-mym', code: 'BD-MYM', unit_type: 'division', name_en: 'Mymensingh', name_bn: 'ময়মনসিংহ', is_active: true }
];

export const BANGLADESH_KEY_DISTRICTS: LocationItem[] = [
  // Dhaka Division
  { id: 'dist-dhaka', code: 'BD-13', unit_type: 'district', parent_id: 'div-dha', division_id: 'div-dha', name_en: 'Dhaka', name_bn: 'ঢাকা', is_active: true },
  { id: 'dist-gazipur', code: 'BD-18', unit_type: 'district', parent_id: 'div-dha', division_id: 'div-dha', name_en: 'Gazipur', name_bn: 'গাজীপুর', is_active: true },
  { id: 'dist-narayanganj', code: 'BD-40', unit_type: 'district', parent_id: 'div-dha', division_id: 'div-dha', name_en: 'Narayanganj', name_bn: 'নারায়ণগঞ্জ', is_active: true },
  { id: 'dist-tangail', code: 'BD-63', unit_type: 'district', parent_id: 'div-dha', division_id: 'div-dha', name_en: 'Tangail', name_bn: 'টাঙ্গাইল', is_active: true },
  { id: 'dist-faridpur', code: 'BD-15', unit_type: 'district', parent_id: 'div-dha', division_id: 'div-dha', name_en: 'Faridpur', name_bn: 'ফরিদপুর', is_active: true },
  
  // Chattogram Division
  { id: 'dist-chattogram', code: 'BD-10', unit_type: 'district', parent_id: 'div-ctg', division_id: 'div-ctg', name_en: 'Chattogram', name_bn: 'চট্টগ্রাম', is_active: true },
  { id: 'dist-coxsbazar', code: 'BD-11', unit_type: 'district', parent_id: 'div-ctg', division_id: 'div-ctg', name_en: "Cox's Bazar", name_bn: 'কক্সবাজার', is_active: true },
  { id: 'dist-cumilla', code: 'BD-08', unit_type: 'district', parent_id: 'div-ctg', division_id: 'div-ctg', name_en: 'Cumilla', name_bn: 'কুমিল্লা', is_active: true },

  // Rajshahi Division
  { id: 'dist-rajshahi', code: 'BD-54', unit_type: 'district', parent_id: 'div-raj', division_id: 'div-raj', name_en: 'Rajshahi', name_bn: 'রাজশাহী', is_active: true },
  { id: 'dist-bogura', code: 'BD-03', unit_type: 'district', parent_id: 'div-raj', division_id: 'div-raj', name_en: 'Bogura', name_bn: 'বগুড়া', is_active: true },

  // Khulna Division
  { id: 'dist-khulna', code: 'BD-27', unit_type: 'district', parent_id: 'div-khu', division_id: 'div-khu', name_en: 'Khulna', name_bn: 'খুলনা', is_active: true },
  { id: 'dist-jashore', code: 'BD-22', unit_type: 'district', parent_id: 'div-khu', division_id: 'div-khu', name_en: 'Jashore', name_bn: 'যশোর', is_active: true },

  // Sylhet Division
  { id: 'dist-sylhet', code: 'BD-60', unit_type: 'district', parent_id: 'div-syl', division_id: 'div-syl', name_en: 'Sylhet', name_bn: 'সিলেট', is_active: true },

  // Barishal Division
  { id: 'dist-barishal', code: 'BD-06', unit_type: 'district', parent_id: 'div-bar', division_id: 'div-bar', name_en: 'Barishal', name_bn: 'বরিশাল', is_active: true },

  // Rangpur Division
  { id: 'dist-rangpur', code: 'BD-55', unit_type: 'district', parent_id: 'div-ran', division_id: 'div-ran', name_en: 'Rangpur', name_bn: 'রংপুর', is_active: true },

  // Mymensingh Division
  { id: 'dist-mymensingh', code: 'BD-39', unit_type: 'district', parent_id: 'div-mym', division_id: 'div-mym', name_en: 'Mymensingh', name_bn: 'ময়মনসিংহ', is_active: true }
];

export const SAMPLE_DONORS: (UserProfile & DonorProfile & { division_name_en: string; district_name_en: string; upazila_name_en: string })[] = [
  {
    id: 'usr-001',
    full_name: 'Ahmed Rahman',
    phone: '+8801712345678',
    email: 'ahmed.rahman@lalbindu.bd',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    gender: 'male',
    is_phone_verified: true,
    is_email_verified: true,
    is_profile_verified: true,
    preferred_language: 'bn',
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
    donor_id_number: 'LB-0004278',
    blood_group: 'O+',
    blood_group_verified: true,
    primary_location_id: 'dist-dhaka',
    verified_donation_count: 5,
    availability_status: 'available',
    is_ready_to_donate: true,
    allow_emergency_calls: true,
    allow_sms_alerts: true,
    public_discovery_consent: true,
    hide_phone_from_public: true,
    division_name_en: 'Dhaka',
    district_name_en: 'Dhaka',
    upazila_name_en: 'Dhanmondi'
  },
  {
    id: 'usr-002',
    full_name: 'Fatima Begum',
    phone: '+8801819876543',
    email: 'fatima.begum@lalbindu.bd',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    gender: 'female',
    is_phone_verified: true,
    is_email_verified: true,
    is_profile_verified: true,
    preferred_language: 'bn',
    created_at: '2024-05-12T00:00:00Z',
    updated_at: '2026-09-20T00:00:00Z',
    donor_id_number: 'LB-0001092',
    blood_group: 'A+',
    blood_group_verified: true,
    primary_location_id: 'dist-chattogram',
    verified_donation_count: 12,
    availability_status: 'available',
    is_ready_to_donate: true,
    allow_emergency_calls: true,
    allow_sms_alerts: true,
    public_discovery_consent: true,
    hide_phone_from_public: true,
    division_name_en: 'Chattogram',
    district_name_en: 'Chattogram',
    upazila_name_en: 'Panchlaish'
  },
  {
    id: 'usr-003',
    full_name: 'Tanvir Hossain',
    phone: '+8801911223344',
    email: 'tanvir.h@lalbindu.bd',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    gender: 'male',
    is_phone_verified: true,
    is_email_verified: true,
    is_profile_verified: true,
    preferred_language: 'en',
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2026-11-01T00:00:00Z',
    donor_id_number: 'LB-0008819',
    blood_group: 'B+',
    blood_group_verified: true,
    primary_location_id: 'dist-rajshahi',
    verified_donation_count: 3,
    availability_status: 'available',
    is_ready_to_donate: true,
    allow_emergency_calls: true,
    allow_sms_alerts: true,
    public_discovery_consent: true,
    hide_phone_from_public: true,
    division_name_en: 'Rajshahi',
    district_name_en: 'Rajshahi',
    upazila_name_en: 'Boalia'
  },
  {
    id: 'usr-004',
    full_name: 'Dr. Nusrat Jahan',
    phone: '+8801552334455',
    email: 'nusrat.jahan@lalbindu.bd',
    avatar_url: 'https://images.unsplash.com/photo-1594824813593-6058fe84666d?auto=format&fit=crop&w=300&q=80',
    gender: 'female',
    is_phone_verified: true,
    is_email_verified: true,
    is_profile_verified: true,
    preferred_language: 'bn',
    created_at: '2023-11-15T00:00:00Z',
    updated_at: '2026-10-30T00:00:00Z',
    donor_id_number: 'LB-0000412',
    blood_group: 'AB-',
    blood_group_verified: true,
    primary_location_id: 'dist-dhaka',
    verified_donation_count: 26,
    availability_status: 'available',
    is_ready_to_donate: true,
    allow_emergency_calls: true,
    allow_sms_alerts: true,
    public_discovery_consent: true,
    hide_phone_from_public: true,
    division_name_en: 'Dhaka',
    district_name_en: 'Dhaka',
    upazila_name_en: 'Mirpur'
  }
];

export const SAMPLE_BLOOD_REQUESTS: BloodRequestItem[] = [
  {
    id: 'req-001',
    request_code: 'REQ-2026-00912',
    requester_id: 'usr-req-01',
    patient_name_initials: 'M. S. (Cardiology ICU)',
    blood_group: 'O+',
    component: 'Whole Blood',
    units_needed: 2,
    units_fulfilled: 1,
    urgency: 'critical_emergency',
    hospital_name: 'National Institute of Cardiovascular Diseases (NICVD)',
    hospital_district_en: 'Dhaka',
    hospital_district_bn: 'ঢাকা',
    hospital_address: 'Sher-e-Bangla Nagar, Dhaka',
    required_datetime: '2026-11-03T18:00:00+06:00',
    requester_contact_phone: '+8801712998877',
    description: 'Urgent open-heart surgery scheduled tonight. Immediate 1 unit O+ donor required.',
    verification_status: 'verified',
    request_status: 'open',
    created_at: '2026-11-03T09:15:00+06:00'
  },
  {
    id: 'req-002',
    request_code: 'REQ-2026-00911',
    requester_id: 'usr-req-02',
    patient_name_initials: 'R. K. (Thalassemia Patient)',
    blood_group: 'B+',
    component: 'PRBC (Packed Red Cells)',
    units_needed: 1,
    units_fulfilled: 0,
    urgency: 'urgent',
    hospital_name: 'Chattogram Medical College Hospital (CMCH)',
    hospital_district_en: 'Chattogram',
    hospital_district_bn: 'চট্টগ্রাম',
    hospital_address: '57 K.B. Fazlul Kader Rd, Chattogram',
    required_datetime: '2026-11-04T10:00:00+06:00',
    requester_contact_phone: '+8801815667788',
    description: 'Monthly transfusion for 8-year-old child. Hemoglobin below 7.0 g/dL.',
    verification_status: 'verified',
    request_status: 'open',
    created_at: '2026-11-03T08:30:00+06:00'
  },
  {
    id: 'req-003',
    request_code: 'REQ-2026-00908',
    requester_id: 'usr-req-03',
    patient_name_initials: 'S. A. (Maternity Care)',
    blood_group: 'A+',
    component: 'Whole Blood',
    units_needed: 2,
    units_fulfilled: 0,
    urgency: 'critical_emergency',
    hospital_name: 'Dhaka Medical College Hospital (DMCH)',
    hospital_district_en: 'Dhaka',
    hospital_district_bn: 'ঢাকা',
    hospital_address: 'Secretariat Road, Dhaka',
    required_datetime: '2026-11-03T16:00:00+06:00',
    requester_contact_phone: '+8801918223344',
    description: 'Emergency C-section delivery complicated by severe post-partum hemorrhage.',
    verification_status: 'verified',
    request_status: 'open',
    created_at: '2026-11-03T11:00:00+06:00'
  }
];

export const SAMPLE_ID_CARDS: Record<string, IdCardPublicVerification> = {
  'LB-TOKEN-DNR-0004278': {
    card_number: 'LB-CARD-DNR-0004278',
    full_name: 'Ahmed Rahman',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Voluntary Blood Donor',
    role_title_bn: 'স্বেচ্ছাসেবী রক্তদাতা',
    designation_en: 'Life Saver (5 Verified Donations)',
    designation_bn: 'জীবন রক্ষক (৫টি যাচাইকৃত রক্তদান)',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    status: 'active',
    issued_at: '2025-01-10T00:00:00Z',
    expires_at: '2027-01-10T00:00:00Z',
    disclaimer_en: 'This card verifies platform membership and donation history. It does not replace clinical screening.',
    disclaimer_bn: 'এই কার্ডটি প্ল্যাটফর্মের নিবন্ধিত সদস্যপদ ও রক্তদানের স্বীকৃতি। এটি ক্লিনিকাল মেডিকেল ছাড়পত্র নয়।'
  },
  'LB-TOKEN-ADM-DHAKA': {
    card_number: 'LB-CARD-ADM-DHAKA-01',
    full_name: 'Kazi Mahbubur Rahman',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'District Administrator',
    role_title_bn: 'জেলা সমন্বয়ক ও প্রশাসক',
    designation_en: 'District Coordination Lead',
    designation_bn: 'জেলা সমন্বয় প্রধান',
    jurisdiction_en: 'Dhaka District, Dhaka Division',
    jurisdiction_bn: 'ঢাকা জেলা, ঢাকা বিভাগ',
    status: 'active',
    issued_at: '2025-06-01T00:00:00Z',
    expires_at: '2027-05-31T00:00:00Z',
    disclaimer_en: 'Appointed representative of LalBindu Humanitarian Platform. Not a Government civil official.',
    disclaimer_bn: 'লালবিন্দু মানবিক প্ল্যাটফর্মের নিযুক্ত সমন্বয়ক। কোনো সরকারি কর্মকর্তা নন।'
  }
};
