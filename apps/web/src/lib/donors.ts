import { SAMPLE_DONORS } from '@lalbindu/api-client';
import { getStoredAccounts } from '@/lib/accounts';

export interface DiscoverableDonor {
  id: string;
  full_name: string;
  fullNameBn?: string;
  phone: string;
  email?: string | null;
  avatar_url?: string | null;
  donor_id_number: string;
  blood_group: string;
  verified_donation_count: number;
  availability_status: string;
  is_ready_to_donate: boolean;
  division_name_en: string;
  district_name_en: string;
  upazila_name_en: string;
  created_at?: string;
}

const CUSTOM_DONORS_STORAGE_KEY = 'lalbindu_custom_donors_v1';

/**
 * Retrieve explicitly saved custom donors from localStorage
 */
export function getCustomDonors(): DiscoverableDonor[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_DONORS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save or update a donor in the custom donors store
 */
export function saveCustomDonor(donor: DiscoverableDonor) {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomDonors();
    const cleanId = (donor.donor_id_number || donor.id || '').trim().toLowerCase();
    const idx = current.findIndex(d => 
      (d.donor_id_number && d.donor_id_number.trim().toLowerCase() === cleanId) ||
      (d.id && d.id === donor.id)
    );
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...donor };
    } else {
      current.unshift(donor);
    }
    localStorage.setItem(CUSTOM_DONORS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('lalbindu_donors_updated'));
  } catch (e) {
    console.warn('Failed to save custom donor', e);
  }
}

/**
 * Consolidate all available donors across:
 * 1. Base SAMPLE_DONORS
 * 2. Registered accounts from getStoredAccounts() (role === 'donor')
 * 3. Dedicated custom donors from localStorage (lalbindu_custom_donors_v1)
 * 4. Active donor profile from localStorage (lalbindu_active_donor_profile)
 */
export function getAllDiscoverableDonors(): DiscoverableDonor[] {
  if (typeof window === 'undefined') {
    return SAMPLE_DONORS.map(d => ({
      id: d.id,
      full_name: d.full_name,
      fullNameBn: (d as any).fullNameBn || d.full_name,
      phone: d.phone,
      email: d.email ?? '',
      avatar_url: d.avatar_url ?? '',
      donor_id_number: d.donor_id_number,
      blood_group: d.blood_group,
      verified_donation_count: d.verified_donation_count,
      availability_status: d.availability_status,
      is_ready_to_donate: d.is_ready_to_donate,
      division_name_en: d.division_name_en,
      district_name_en: d.district_name_en,
      upazila_name_en: d.upazila_name_en,
      created_at: d.created_at
    }));
  }

  const donorMap = new Map<string, DiscoverableDonor>();

  // 1. Seed baseline sample donors
  SAMPLE_DONORS.forEach(donor => {
    const key = donor.donor_id_number.toLowerCase();
    donorMap.set(key, {
      id: donor.id,
      full_name: donor.full_name,
      fullNameBn: (donor as any).fullNameBn || donor.full_name,
      phone: donor.phone,
      email: donor.email ?? '',
      avatar_url: donor.avatar_url ?? '',
      donor_id_number: donor.donor_id_number,
      blood_group: donor.blood_group,
      verified_donation_count: donor.verified_donation_count,
      availability_status: donor.availability_status,
      is_ready_to_donate: donor.is_ready_to_donate,
      division_name_en: donor.division_name_en,
      district_name_en: donor.district_name_en,
      upazila_name_en: donor.upazila_name_en,
      created_at: donor.created_at
    });
  });

  // 2. Merge registered accounts with role === 'donor'
  try {
    const accounts = getStoredAccounts();
    accounts.forEach(acc => {
      if (acc.role === 'donor' && acc.status !== 'Suspended' && acc.status !== 'Revoked') {
        const cardId = acc.cardId || `LB-${acc.id.slice(-7)}`;
        const key = cardId.toLowerCase();
        donorMap.set(key, {
          id: acc.id,
          full_name: acc.name,
          fullNameBn: acc.nameBn || acc.name,
          phone: acc.phone,
          email: acc.email || '',
          avatar_url: acc.avatarUrl || '',
          donor_id_number: cardId,
          blood_group: acc.bloodGroup || 'O+',
          verified_donation_count: (acc as any).verified_donation_count || 0,
          availability_status: (acc as any).availability_status || 'available',
          is_ready_to_donate: true,
          division_name_en: acc.division || 'Dhaka',
          district_name_en: acc.district || 'Dhaka',
          upazila_name_en: acc.upazila || 'Sadar',
          created_at: acc.createdAt
        });
      }
    });
  } catch (e) {
    console.warn('Error reading stored accounts for donors:', e);
  }

  // 3. Merge custom donors
  try {
    const customDonors = getCustomDonors();
    customDonors.forEach(donor => {
      if (donor.donor_id_number) {
        donorMap.set(donor.donor_id_number.toLowerCase(), donor);
      }
    });
  } catch (e) {}

  // 4. Hydrate active donor profile (current user session)
  try {
    const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
    if (activeRaw) {
      const active = JSON.parse(activeRaw);
      if (active && (active.donor_id_number || active.cardId) && (active.full_name || active.name)) {
        const cardId = active.donor_id_number || active.cardId;
        const key = cardId.toLowerCase();
        const existing = donorMap.get(key);
        donorMap.set(key, {
          id: active.id || existing?.id || `usr-${Date.now()}`,
          full_name: active.full_name || active.name || existing?.full_name || 'Donor',
          fullNameBn: active.fullNameBn || active.nameBn || existing?.fullNameBn || active.full_name || active.name,
          phone: active.phone || existing?.phone || '+8801700000000',
          email: active.email || existing?.email || '',
          avatar_url: active.avatar_url || existing?.avatar_url || '',
          donor_id_number: cardId,
          blood_group: active.blood_group || active.bloodGroup || existing?.blood_group || 'O+',
          verified_donation_count: typeof active.verified_donation_count === 'number'
            ? active.verified_donation_count 
            : (existing?.verified_donation_count || 0),
          availability_status: active.availability_status || existing?.availability_status || 'available',
          is_ready_to_donate: true,
          division_name_en: active.division_name_en || active.division || existing?.division_name_en || 'Dhaka',
          district_name_en: active.district_name_en || active.district || existing?.district_name_en || 'Dhaka',
          upazila_name_en: active.upazila_name_en || active.upazila || existing?.upazila_name_en || 'Sadar',
          created_at: active.created_at || existing?.created_at || new Date().toISOString()
        });
      }
    }
  } catch (e) {}

  // Return donors with newly registered / updated accounts appearing first
  const all = Array.from(donorMap.values());
  return all.sort((a, b) => {
    // Keep custom registered donors near top, then sample donors
    const isSampleA = a.donor_id_number.startsWith('LB-000');
    const isSampleB = b.donor_id_number.startsWith('LB-000');
    if (!isSampleA && isSampleB) return -1;
    if (isSampleA && !isSampleB) return 1;
    return 0;
  });
}
