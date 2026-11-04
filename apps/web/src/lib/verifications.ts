/**
 * LalBindu Clinical Blood Donation Verification System
 * 
 * Facilitates hospital/officer blood bag proof verification by Super Admin and Co-Admins.
 * Approving a verification increment's the donor's official count, initiates the 3-calendar-month
 * clinical resting interval, and updates their universal CR80 ID credential.
 */

export interface DonationVerification {
  id: string;
  donorId: string;
  donorName: string;
  donorUserId?: string;
  bloodGroup: string;
  hospitalName: string;
  donationDate: string;
  units: number;
  bagNumber: string;
  proofDocumentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface DonationHistoryRecord {
  id: string;
  donorId: string;
  donationDate: string;
  donationType: string;
  hospitalName: string;
  units: number;
  status: 'verified' | 'pending' | 'rejected';
  verifierTag: string;
  bagNumber?: string;
}

const VERIFICATIONS_STORAGE_KEY = 'lalbindu_donation_verifications_v1';
const HISTORY_STORAGE_KEY = 'lalbindu_donation_history_v1';

export const DEFAULT_VERIFICATIONS: DonationVerification[] = [
  {
    id: 'verif-001',
    donorId: 'LB-0008819',
    donorName: 'Tanvir Hossain',
    bloodGroup: 'B+',
    hospitalName: 'Rajshahi Medical College Hospital',
    donationDate: '2026-11-02',
    units: 1,
    bagNumber: 'BAG-2026-RMC-8120',
    status: 'pending',
    createdAt: '2026-11-02T10:30:00Z'
  },
  {
    id: 'verif-002',
    donorId: 'LB-0003411',
    donorName: 'Sumaiya Akter',
    bloodGroup: 'O-',
    hospitalName: 'Dhaka Medical College Hospital',
    donationDate: '2026-11-01',
    units: 1,
    bagNumber: 'BAG-2026-DMC-1049',
    status: 'pending',
    createdAt: '2026-11-01T14:15:00Z'
  }
];

export const DEFAULT_DONOR_HISTORY: DonationHistoryRecord[] = [
  {
    id: 'hist-001',
    donorId: 'LB-0004278',
    donationDate: '2026-08-10',
    donationType: 'Whole Blood (পূর্ণাঙ্গ রক্ত)',
    hospitalName: 'Dhaka Medical College Hospital',
    units: 1,
    status: 'verified',
    verifierTag: 'Verified by Hospital Authority',
    bagNumber: 'BAG-2026-DMC-0810'
  },
  {
    id: 'hist-002',
    donorId: 'LB-0004278',
    donationDate: '2026-04-15',
    donationType: 'Whole Blood (পূর্ণাঙ্গ রক্ত)',
    hospitalName: 'NICVD Heart Institute',
    units: 1,
    status: 'verified',
    verifierTag: 'Verified by Verification Officer',
    bagNumber: 'BAG-2026-NICVD-0415'
  },
  {
    id: 'hist-003',
    donorId: 'LB-0004278',
    donationDate: '2025-12-01',
    donationType: 'Whole Blood (পূর্ণাঙ্গ রক্ত)',
    hospitalName: 'Red Crescent Holy Family Hospital',
    units: 1,
    status: 'verified',
    verifierTag: 'Verified by Hospital Authority',
    bagNumber: 'BAG-2025-RCH-1201'
  }
];

/**
 * Retrieve all pending and reviewed verifications from localStorage
 */
export function getStoredVerifications(): DonationVerification[] {
  if (typeof window === 'undefined') return DEFAULT_VERIFICATIONS;
  try {
    const raw = localStorage.getItem(VERIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_VERIFICATIONS));
      return DEFAULT_VERIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_VERIFICATIONS));
      return DEFAULT_VERIFICATIONS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading verifications from localStorage:', e);
    return DEFAULT_VERIFICATIONS;
  }
}

/**
 * Save verifications and notify components
 */
export function saveStoredVerifications(list: DonationVerification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('lalbindu_verification_updated'));
  } catch (e) {
    console.error('Error saving verifications:', e);
  }
}

/**
 * Submit a new donation proof for clinical verification
 */
export function submitDonationVerification(data: {
  donorId: string;
  donorName: string;
  donorUserId?: string;
  bloodGroup: string;
  hospitalName: string;
  donationDate: string;
  units?: number;
  bagNumber: string;
  proofDocumentUrl?: string;
}): DonationVerification {
  const verifications = getStoredVerifications();
  const newVerif: DonationVerification = {
    id: `verif-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`,
    donorId: data.donorId,
    donorName: data.donorName,
    donorUserId: data.donorUserId,
    bloodGroup: data.bloodGroup || 'O+',
    hospitalName: data.hospitalName,
    donationDate: data.donationDate,
    units: data.units || 1,
    bagNumber: data.bagNumber,
    proofDocumentUrl: data.proofDocumentUrl,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  verifications.unshift(newVerif);
  saveStoredVerifications(verifications);
  return newVerif;
}

/**
 * Approve a donation verification:
 * 1. Mark verification as approved
 * 2. Update donor's verified_donation_count (+1)
 * 3. Update donor's last_donation_date to the donation date (initiating 3-month cooldown)
 * 4. Add to verified donation history log
 */
export function approveDonationVerification(
  verificationId: string,
  reviewerName: string = 'Super Administrator'
): { success: boolean; verification?: DonationVerification; error?: string } {
  const verifications = getStoredVerifications();
  const idx = verifications.findIndex(v => v.id === verificationId);
  if (idx === -1) {
    return { success: false, error: 'Verification item not found.' };
  }

  const item = verifications[idx];
  item.status = 'approved';
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = reviewerName;
  saveStoredVerifications(verifications);

  // Synchronize donor profile in localStorage if active
  if (typeof window !== 'undefined') {
    try {
      // 1. Update active donor profile if matching
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const activeProfile = JSON.parse(activeRaw);
        const matchesActive = 
          activeProfile.donor_id_number === item.donorId ||
          activeProfile.full_name?.toLowerCase() === item.donorName.toLowerCase() ||
          activeProfile.name?.toLowerCase() === item.donorName.toLowerCase();

        if (matchesActive) {
          activeProfile.verified_donation_count = (activeProfile.verified_donation_count || 0) + item.units;
          activeProfile.last_donation_date = item.donationDate;
          localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(activeProfile));
        }
      }

      // 2. Update registered accounts roster
      const accountsRaw = localStorage.getItem('lalbindu_registered_accounts_v1');
      if (accountsRaw) {
        const accounts = JSON.parse(accountsRaw);
        const accIdx = accounts.findIndex((a: any) => 
          a.cardId === item.donorId || 
          a.name?.toLowerCase() === item.donorName.toLowerCase()
        );
        if (accIdx >= 0) {
          accounts[accIdx].verified_donation_count = (accounts[accIdx].verified_donation_count || 0) + item.units;
          accounts[accIdx].last_donation_date = item.donationDate;
          localStorage.setItem('lalbindu_registered_accounts_v1', JSON.stringify(accounts));
        }
      }

      // 3. Append to donation history log
      const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
      const history: DonationHistoryRecord[] = historyRaw ? JSON.parse(historyRaw) : DEFAULT_DONOR_HISTORY;
      const historyRecord: DonationHistoryRecord = {
        id: `hist-${Date.now().toString(36)}`,
        donorId: item.donorId,
        donationDate: item.donationDate,
        donationType: 'Whole Blood (পূর্ণাঙ্গ রক্ত)',
        hospitalName: item.hospitalName,
        units: item.units,
        status: 'verified',
        verifierTag: 'Verified by Health Authority',
        bagNumber: item.bagNumber
      };
      history.unshift(historyRecord);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

      // Notify system of updates
      window.dispatchEvent(new Event('lalbindu_session_changed'));
      window.dispatchEvent(new Event('lalbindu_donation_history_updated'));
    } catch (e) {
      console.error('Error synchronizing donor count upon approval:', e);
    }
  }

  return { success: true, verification: item };
}

/**
 * Reject a donation verification record
 */
export function rejectDonationVerification(
  verificationId: string,
  reason: string = 'Hospital bag reference unconfirmed'
): { success: boolean; error?: string } {
  const verifications = getStoredVerifications();
  const idx = verifications.findIndex(v => v.id === verificationId);
  if (idx === -1) {
    return { success: false, error: 'Verification item not found.' };
  }

  verifications[idx].status = 'rejected';
  verifications[idx].rejectionReason = reason;
  verifications[idx].reviewedAt = new Date().toISOString();
  saveStoredVerifications(verifications);
  return { success: true };
}

/**
 * Retrieve verified donation history for a specific donor
 */
export function getDonorHistory(donorId: string, donorName?: string): DonationHistoryRecord[] {
  if (typeof window === 'undefined') return DEFAULT_DONOR_HISTORY;
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const history: DonationHistoryRecord[] = raw ? JSON.parse(raw) : DEFAULT_DONOR_HISTORY;
    
    // Also merge any approved verifications that match this donor
    const verifications = getStoredVerifications();
    const approvedMatches = verifications.filter(v => 
      v.status === 'approved' && 
      (v.donorId === donorId || (donorName && v.donorName.toLowerCase() === donorName.toLowerCase()))
    );

    const merged = [...history];
    approvedMatches.forEach(app => {
      const exists = merged.some(h => h.bagNumber === app.bagNumber && h.donationDate === app.donationDate);
      if (!exists) {
        merged.unshift({
          id: `hist-${app.id}`,
          donorId: app.donorId,
          donationDate: app.donationDate,
          donationType: 'Whole Blood (পূর্ণাঙ্গ রক্ত)',
          hospitalName: app.hospitalName,
          units: app.units,
          status: 'verified',
          verifierTag: 'Verified by Super Admin Authority',
          bagNumber: app.bagNumber
        });
      }
    });

    return merged;
  } catch (e) {
    return DEFAULT_DONOR_HISTORY;
  }
}
