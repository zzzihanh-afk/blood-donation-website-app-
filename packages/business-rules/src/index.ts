import { AvailabilityStatus, BloodGroup } from '@lalbindu/shared-types';

/**
 * Calculates the next platform review date using strict calendar-month arithmetic
 * in Bangladesh Timezone (Asia/Dhaka).
 *
 * Rule: Whole blood requires 3 calendar months waiting interval.
 * Example 1: Donation on Jan 31 -> Review on Apr 30 (since April has 30 days).
 * Example 2: Donation on Nov 30 (2023) -> Review on Feb 29 (2024 leap year).
 * Example 3: Donation on Nov 30 (2024) -> Review on Feb 28 (2025 non-leap).
 */
export function calculateNextEligibleDate(donationDateStr: string, intervalMonths: number = 3): string {
  const [yearStr, monthStr, dayStr] = donationDateStr.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10); // 1-12
  const day = parseInt(dayStr, 10);

  // Target month
  month += intervalMonths;
  while (month > 12) {
    month -= 12;
    year += 1;
  }

  // Determine max days in target month
  const daysInTargetMonth = new Date(year, month, 0).getDate();
  const targetDay = Math.min(day, daysInTargetMonth);

  const mm = String(month).padStart(2, '0');
  const dd = String(targetDay).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Evaluates current availability status based on last verified donation and next eligible date.
 */
export function evaluateAvailabilityStatus(
  currentStatus: AvailabilityStatus,
  nextEligibleDateStr?: string | null,
  todayStr?: string
): AvailabilityStatus {
  // If explicitly paused or suspended, do not override automatically
  if (['paused_by_donor', 'hidden_from_search', 'suspended', 'under_review'].includes(currentStatus)) {
    return currentStatus;
  }

  if (!nextEligibleDateStr) {
    return 'available';
  }

  const now = todayStr || new Date().toISOString().split('T')[0];

  if (now < nextEligibleDateStr) {
    return 'temporarily_unavailable';
  }

  // Waiting period has elapsed, but platform requires donor confirmation before going live
  if (currentStatus === 'temporarily_unavailable') {
    return 'needs_confirmation';
  }

  return currentStatus;
}

/**
 * Milestones for blood donation achievements.
 */
export const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first_drop',
    title_en: 'First Drop',
    title_bn: 'প্রথম বিন্দু',
    description_en: 'Completed your first verified whole blood donation.',
    description_bn: 'আপনার প্রথম সফল ও যাচাইকৃত রক্তদান সম্পন্ন করেছেন।',
    required_count: 1,
    badge_color: '#C8102E'
  },
  {
    id: 'life_saver',
    title_en: 'Life Saver',
    title_bn: 'জীবন রক্ষক',
    description_en: 'Completed 5 verified blood donations.',
    description_bn: '৫ বার রক্তদান করে জীবন রক্ষায় গৌরবময় অবদান রেখেছেন।',
    required_count: 5,
    badge_color: '#1565C0'
  },
  {
    id: 'hero_donor',
    title_en: 'Hero Donor',
    title_bn: 'বীর রক্তদাতা',
    description_en: 'Completed 10 verified blood donations.',
    description_bn: '১০ বার রক্তদান করে মানবতার বিরল দৃষ্টান্ত স্থাপন করেছেন।',
    required_count: 10,
    badge_color: '#D4AF37'
  },
  {
    id: 'guardian_of_life',
    title_en: 'Guardian of Life',
    title_bn: 'জীবনের অভিভাবক',
    description_en: 'Completed 25 verified blood donations.',
    description_bn: '২৫ বার রক্তদান করে দেশের অন্যতম শ্রেষ্ঠ জীবন রক্ষক হিসেবে স্বীকৃতি।',
    required_count: 25,
    badge_color: '#580F1A'
  }
];

export function getEligibleAchievements(verifiedDonationCount: number) {
  return DEFAULT_ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: verifiedDonationCount >= ach.required_count,
    current_progress: Math.min(verifiedDonationCount, ach.required_count)
  }));
}

/**
 * Compatibility matrix for whole blood matching.
 */
export const BLOOD_COMPATIBILITY_TABLE: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
  'Unknown': []
};

export function isCompatibleDonor(donorGroup: BloodGroup, patientGroup: BloodGroup): boolean {
  if (patientGroup === 'Unknown' || donorGroup === 'Unknown') return false;
  const compatibleDonors = BLOOD_COMPATIBILITY_TABLE[patientGroup] || [];
  return compatibleDonors.includes(donorGroup);
}
