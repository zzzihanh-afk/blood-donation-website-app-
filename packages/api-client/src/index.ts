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
  'LA0010001': {
    card_number: 'LA0010001',
    full_name: 'Md. Rahman Hossain',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Super Administrator',
    role_title_bn: 'প্রধান প্রশাসক',
    designation_en: 'Super Administrator',
    designation_bn: 'প্রধান প্রশাসক',
    jurisdiction_en: 'LalBindu Foundation, Bangladesh',
    jurisdiction_bn: 'লালবিন্দু ফাউন্ডেশন, বাংলাদেশ',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'LA0101001': {
    card_number: 'LA0101001',
    full_name: 'Farhana Akter',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Division Administrator',
    role_title_bn: 'বিভাগীয় প্রশাসক',
    designation_en: 'Division Administrator',
    designation_bn: 'বিভাগীয় প্রশাসক',
    jurisdiction_en: 'Dhaka Division',
    jurisdiction_bn: 'ঢাকা বিভাগ',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'LA0202001': {
    card_number: 'LA0202001',
    full_name: 'Abdul Karim',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'District Administrator',
    role_title_bn: 'জেলা প্রশাসক',
    designation_en: 'District Administrator',
    designation_bn: 'জেলা সমন্বয়ক ও প্রশাসক',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'LA0303001': {
    card_number: 'LA0303001',
    full_name: 'Mst. Shilpi Begum',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Upazila Administrator',
    role_title_bn: 'উপজেলা প্রশাসক',
    designation_en: 'Upazila Administrator',
    designation_bn: 'উপজেলা সমন্বয়ক',
    jurisdiction_en: 'Savar Upazila, Dhaka',
    jurisdiction_bn: 'সাভার উপজেলা, ঢাকা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'LA0404001': {
    card_number: 'LA0404001',
    full_name: 'Tanvir Ahmed',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Metropolitan Thana Administrator',
    role_title_bn: 'মেট্রোপলিটন থানা প্রশাসক',
    designation_en: 'Thana Administrator',
    designation_bn: 'থানা সমন্বয়ক',
    jurisdiction_en: 'Gulshan Thana, Dhaka',
    jurisdiction_bn: 'গুলশান থানা, ঢাকা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'LA0505001': {
    card_number: 'LA0505001',
    full_name: 'Rumana Akter',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Union Administrator',
    role_title_bn: 'ইউনিয়ন প্রশাসক',
    designation_en: 'Union Administrator',
    designation_bn: 'ইউনিয়ন সমন্বয়ক',
    jurisdiction_en: 'Mirpur Union, Dhaka',
    jurisdiction_bn: 'মিরপুর ইউনিয়ন, ঢাকা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Statutory Notice: Authorized platform administrative credential. Not a Government ID card.',
    disclaimer_bn: 'সংবিধিবদ্ধ সতর্কবার্তা: প্ল্যাটফর্মের অভ্যন্তরীণ প্রশাসনিক পরিচয়পত্র। কোনো সরকারি আইডি কার্ড নয়।'
  },
  'DN0001234': {
    card_number: 'DN0001234',
    full_name: 'Saiful Islam',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Donor Member',
    role_title_bn: 'রক্তদাতা সদস্য',
    designation_en: 'Active Blood Donor',
    designation_bn: 'সক্রিয় রক্তদাতা',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'This card verifies platform membership and donation history. It does not replace clinical screening.',
    disclaimer_bn: 'এই কার্ডটি প্ল্যাটফর্মের নিবন্ধিত সদস্যপদ ও রক্তদানের স্বীকৃতি। এটি ক্লিনিকাল মেডিকেল ছাড়পত্র নয়।'
  },
  'VL0005678': {
    card_number: 'VL0005678',
    full_name: 'Imran Hossain',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    role_title_en: 'Volunteer',
    role_title_bn: 'স্বেচ্ছাসেবক',
    designation_en: 'Field Volunteer',
    designation_bn: 'মাঠপর্যায়ের স্বেচ্ছাসেবক',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    status: 'active',
    issued_at: '2025-01-01T00:00:00Z',
    expires_at: '2026-12-31T00:00:00Z',
    disclaimer_en: 'Verified Volunteer of LalBindu Humanitarian Platform. Not an official Government employee.',
    disclaimer_bn: 'লালবিন্দু মানবিক প্ল্যাটফর্মের যাচাইকৃত স্বেচ্ছাসেবক। কোনো সরকারি কর্মচারী নন।'
  }
};

// ---------------------------------------------------------------------------
// REFERENCE SAMPLE PROFILES (Directly matching visual design reference)
// ---------------------------------------------------------------------------
export const REFERENCE_SAMPLE_PROFILES = [
  {
    id: 'prof-super-admin',
    role_id: 'super_admin',
    full_name: 'Md. Rahman Hossain',
    full_name_bn: 'মো. রহমান হোসেন',
    designation_en: 'Super Administrator',
    designation_bn: 'প্রধান প্রশাসক',
    unique_id: 'LA0010001',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    organization_name: 'LalBindu Foundation',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0010001',
    verification_url: 'https://lalbindu.bd/verify/LA0010001'
  },
  {
    id: 'prof-div-admin',
    role_id: 'division_admin',
    full_name: 'Farhana Akter',
    full_name_bn: 'ফারহানা আক্তার',
    designation_en: 'Division Administrator',
    designation_bn: 'বিভাগীয় প্রশাসক',
    unique_id: 'LA0101001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Dhaka Division',
    jurisdiction_bn: 'ঢাকা বিভাগ',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0101001',
    verification_url: 'https://lalbindu.bd/verify/LA0101001'
  },
  {
    id: 'prof-dist-admin',
    role_id: 'district_admin',
    full_name: 'Abdul Karim',
    full_name_bn: 'আব্দুল করিম',
    designation_en: 'District Administrator',
    designation_bn: 'জেলা প্রশাসক',
    unique_id: 'LA0202001',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0202001',
    verification_url: 'https://lalbindu.bd/verify/LA0202001'
  },
  {
    id: 'prof-upazila-admin',
    role_id: 'upazila_admin',
    full_name: 'Mst. Shilpi Begum',
    full_name_bn: 'মোছা. শিল্পী বেগম',
    designation_en: 'Upazila Administrator',
    designation_bn: 'উপজেলা প্রশাসক',
    unique_id: 'LA0303001',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Savar Upazila',
    jurisdiction_bn: 'সাভার উপজেলা',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0303001',
    verification_url: 'https://lalbindu.bd/verify/LA0303001'
  },
  {
    id: 'prof-thana-admin',
    role_id: 'thana_admin',
    full_name: 'Tanvir Ahmed',
    full_name_bn: 'তানভীর আহমেদ',
    designation_en: 'Thana Administrator',
    designation_bn: 'থানা প্রশাসক',
    unique_id: 'LA0404001',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Gulshan Thana, Dhaka',
    jurisdiction_bn: 'গুলশান থানা, ঢাকা',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0404001',
    verification_url: 'https://lalbindu.bd/verify/LA0404001'
  },
  {
    id: 'prof-union-admin',
    role_id: 'union_admin',
    full_name: 'Rumana Akter',
    full_name_bn: 'রুমানা আক্তার',
    designation_en: 'Union Administrator',
    designation_bn: 'ইউনিয়ন প্রশাসক',
    unique_id: 'LA0505001',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Mirpur Union, Dhaka',
    jurisdiction_bn: 'মিরপুর ইউনিয়ন, ঢাকা',
    valid_until: '31 Dec 2026',
    verification_token: 'LA0505001',
    verification_url: 'https://lalbindu.bd/verify/LA0505001'
  },
  {
    id: 'prof-donor',
    role_id: 'donor',
    full_name: 'Saiful Islam',
    full_name_bn: 'সাইফুল ইসলাম',
    designation_en: 'Donor Member',
    designation_bn: 'রক্তদাতা সদস্য',
    unique_id: 'DN0001234',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    blood_group: 'B+',
    donation_count: 5,
    valid_until: '31 Dec 2026',
    verification_token: 'DN0001234',
    verification_url: 'https://lalbindu.bd/verify/DN0001234'
  },
  {
    id: 'prof-volunteer',
    role_id: 'volunteer',
    full_name: 'Imran Hossain',
    full_name_bn: 'ইমরান হোসেন',
    designation_en: 'Volunteer',
    designation_bn: 'স্বেচ্ছাসেবক',
    unique_id: 'VL0005678',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    jurisdiction_en: 'Dhaka District',
    jurisdiction_bn: 'ঢাকা জেলা',
    valid_until: '31 Dec 2026',
    verification_token: 'VL0005678',
    verification_url: 'https://lalbindu.bd/verify/VL0005678'
  }
];
