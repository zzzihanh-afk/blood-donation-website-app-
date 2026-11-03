export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export type AvailabilityStatus =
  | 'available'
  | 'temporarily_unavailable'
  | 'needs_confirmation'
  | 'paused_by_donor'
  | 'hidden_from_search'
  | 'under_review'
  | 'suspended';

export type UserRole =
  | 'super_admin'
  | 'division_admin'
  | 'district_admin'
  | 'upazila_admin'
  | 'thana_admin'
  | 'city_corp_admin'
  | 'municipality_admin'
  | 'union_admin'
  | 'ward_admin'
  | 'hospital_admin'
  | 'hospital_staff'
  | 'verification_officer'
  | 'moderator'
  | 'campaign_manager'
  | 'volunteer'
  | 'donor'
  | 'requester';

export type AdministrativeUnitType =
  | 'division'
  | 'district'
  | 'upazila'
  | 'metropolitan_thana'
  | 'city_corporation'
  | 'municipality'
  | 'union'
  | 'ward';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_profile_verified: boolean;
  preferred_language: 'bn' | 'en';
  created_at: string;
  updated_at: string;
}

export interface LocationItem {
  id: string;
  code: string;
  unit_type: AdministrativeUnitType;
  parent_id?: string | null;
  name_en: string;
  name_bn: string;
  division_id?: string | null;
  district_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active: boolean;
}

export interface DonorProfile {
  id: string; // references UserProfile.id
  donor_id_number: string;
  blood_group: BloodGroup;
  blood_group_verified: boolean;
  blood_group_verified_by?: string | null;
  primary_location_id?: string | null;
  weight_kg?: number | null;
  last_donation_date?: string | null;
  verified_donation_count: number;
  availability_status: AvailabilityStatus;
  next_eligible_date?: string | null;
  is_ready_to_donate: boolean;
  allow_emergency_calls: boolean;
  allow_sms_alerts: boolean;
  public_discovery_consent: boolean;
  hide_phone_from_public: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalIdCard {
  id: string;
  user_id: string;
  role_id: UserRole;
  card_template_id: string;
  card_number: string;
  secure_verification_token: string;
  jurisdiction_name_en?: string | null;
  jurisdiction_name_bn?: string | null;
  designation_en?: string | null;
  designation_bn?: string | null;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  issued_at: string;
  expires_at?: string | null;
  qr_code_payload: string;
  shareable_card_image_url?: string | null;
}

export interface IdCardPublicVerification {
  card_number: string;
  full_name: string;
  avatar_url?: string | null;
  role_title_en: string;
  role_title_bn: string;
  designation_en?: string | null;
  designation_bn?: string | null;
  jurisdiction_en?: string | null;
  jurisdiction_bn?: string | null;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  issued_at: string;
  expires_at?: string | null;
  disclaimer_en: string;
  disclaimer_bn: string;
}

export interface AchievementItem {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  category: 'blood_donation' | 'volunteering' | 'campaign_organizing' | 'community_service';
  required_count: number;
  badge_color: string;
  unlocked: boolean;
  unlocked_at?: string | null;
  current_progress: number;
}

export interface BloodRequestItem {
  id: string;
  request_code: string;
  requester_id?: string | null;
  patient_name_initials: string;
  blood_group: BloodGroup;
  component: string;
  units_needed: number;
  units_fulfilled: number;
  urgency: 'routine' | 'urgent' | 'critical_emergency';
  hospital_name: string;
  hospital_district_en: string;
  hospital_district_bn: string;
  hospital_address?: string | null;
  required_datetime: string;
  requester_contact_phone: string;
  description?: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  request_status: 'open' | 'partially_fulfilled' | 'fulfilled' | 'cancelled' | 'expired';
  created_at: string;
}

export interface DonationRecord {
  id: string;
  donor_id: string;
  donation_type_id: string;
  hospital_id?: string | null;
  donation_date: string;
  units: number;
  bag_number?: string | null;
  verification_status: 'pending' | 'verified' | 'rejected' | 'disputed';
  verified_by?: string | null;
  verified_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
}

export interface AdministrativeAssignment {
  id: string;
  user_id: string;
  role_id: UserRole;
  location_id: string;
  status: 'pending_approval' | 'active' | 'suspended' | 'revoked' | 'expired';
  started_at: string;
  ended_at?: string | null;
}
