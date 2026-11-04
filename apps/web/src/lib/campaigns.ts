export interface CampaignItem {
  id: string;
  title_en: string;
  title_bn: string;
  organizer: string;
  organizerBn?: string;
  venue: string;
  venueBn?: string;
  division: string;
  district: string;
  date: string;
  time: string;
  slotsAvailable: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  approvedBy: string;
  approvedRole: string;
  isOfficialAdmin: boolean;
  contactPhone?: string;
  createdAt: string;
}

export interface CampaignDelegation {
  userId: string;
  name: string;
  role: string;
  roleId: string;
  jurisdiction: string;
  canCreateCampaigns: boolean;
  authorizedBy: string;
  authorizedDate: string;
}

export const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-01',
    title_en: 'Dhaka University Central Blood Donation Drive',
    title_bn: 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় রক্তদান কর্মসূচি',
    organizer: 'Badhan (DU Zone) & LalBindu',
    organizerBn: 'বাঁধন (ডিইউ জোন) ও লালবিন্দু',
    venue: 'Teacher-Student Centre (TSC), University of Dhaka',
    venueBn: 'টিএসসি প্রাঙ্গণ, ঢাকা বিশ্ববিদ্যালয়',
    division: 'Dhaka',
    district: 'Dhaka',
    date: 'November 15, 2026',
    time: '09:00 AM - 05:00 PM',
    slotsAvailable: 150,
    registeredCount: 88,
    status: 'upcoming',
    approvedBy: 'Md. Rahman Hossain (LA0010001)',
    approvedRole: 'Super Administrator',
    isOfficialAdmin: true,
    contactPhone: '+880 1711-234567',
    createdAt: '2026-11-01T08:00:00Z'
  },
  {
    id: 'camp-02',
    title_en: 'Chattogram Metropolitan Community Blood Camp',
    title_bn: 'চট্টগ্রাম মহানগরী কমিউনিটি রক্তদান ক্যাম্প',
    organizer: 'Sandhani (CMC Unit) & Red Crescent',
    organizerBn: 'সন্ধানী (সিএমসি ইউনিট) ও রেড ক্রিসেন্ট',
    venue: 'Chattogram Press Club Auditorium, Jamal Khan',
    venueBn: 'চট্টগ্রাম প্রেস ক্লাব অডিটোরিয়াম, জামাল খান',
    division: 'Chattogram',
    district: 'Chattogram',
    date: 'November 22, 2026',
    time: '10:00 AM - 04:00 PM',
    slotsAvailable: 200,
    registeredCount: 142,
    status: 'upcoming',
    approvedBy: 'Dr. Farhana Akter (LA0101001)',
    approvedRole: 'Division Administrator',
    isOfficialAdmin: true,
    contactPhone: '+880 1819-876543',
    createdAt: '2026-11-02T09:30:00Z'
  },
  {
    id: 'camp-03',
    title_en: 'Rajshahi University Humanity Blood Drive',
    title_bn: 'রাজশাহী বিশ্ববিদ্যালয় মানবিক রক্তদান উৎসব',
    organizer: 'LalBindu Youth Club Rajshahi',
    organizerBn: 'লালবিন্দু ইয়ুথ ক্লাব রাজশাহী',
    venue: 'Shabash Bangladesh Chattar, RU Campus',
    venueBn: 'সাবাশ বাংলাদেশ চত্বর, রাবি ক্যাম্পাস',
    division: 'Rajshahi',
    district: 'Rajshahi',
    date: 'November 28, 2026',
    time: '09:30 AM - 04:30 PM',
    slotsAvailable: 120,
    registeredCount: 45,
    status: 'upcoming',
    approvedBy: 'Md. Rahman Hossain (LA0010001)',
    approvedRole: 'Super Administrator',
    isOfficialAdmin: true,
    contactPhone: '+880 1722-998877',
    createdAt: '2026-11-03T11:00:00Z'
  }
];

export const INITIAL_DELEGATIONS: CampaignDelegation[] = [
  {
    userId: 'adm-01',
    name: 'Kazi Mahbubur Rahman',
    role: 'District Administrator',
    roleId: 'district_admin',
    jurisdiction: 'Dhaka District',
    canCreateCampaigns: true,
    authorizedBy: 'Super Admin (Md. Rahman Hossain)',
    authorizedDate: '01 Nov 2026'
  },
  {
    userId: 'adm-02',
    name: 'Dr. Shah Alam',
    role: 'Division Administrator',
    roleId: 'division_admin',
    jurisdiction: 'Chattogram Division',
    canCreateCampaigns: true,
    authorizedBy: 'Super Admin (Md. Rahman Hossain)',
    authorizedDate: '01 Nov 2026'
  },
  {
    userId: 'adm-03',
    name: 'Tahmina Begum',
    role: 'Thana Administrator',
    roleId: 'thana_admin',
    jurisdiction: 'Mirpur Metropolitan Thana',
    canCreateCampaigns: false,
    authorizedBy: 'Pending Super Admin Review',
    authorizedDate: '-'
  },
  {
    userId: 'mgr-01',
    name: 'Rafiqul Islam',
    role: 'Campaign Manager',
    roleId: 'campaign_manager',
    jurisdiction: 'National Campaigns Cell',
    canCreateCampaigns: true,
    authorizedBy: 'Super Admin (Md. Rahman Hossain)',
    authorizedDate: '02 Nov 2026'
  }
];

// LocalStorage Keys
const CAMPAIGNS_STORAGE_KEY = 'lalbindu_custom_campaigns';
const DELEGATIONS_STORAGE_KEY = 'lalbindu_campaign_delegations';
const ACTIVE_ROLE_STORAGE_KEY = 'lalbindu_simulated_role';

export function getStoredCampaigns(): CampaignItem[] {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGNS;
  try {
    const data = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading campaigns from localStorage:', err);
  }
  return INITIAL_CAMPAIGNS;
}

export function saveCampaigns(campaigns: CampaignItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Error saving campaigns to localStorage:', err);
  }
}

export function addCampaign(newCampaign: CampaignItem): CampaignItem[] {
  const current = getStoredCampaigns();
  const updated = [newCampaign, ...current];
  saveCampaigns(updated);
  return updated;
}

export function deleteCampaign(campaignId: string): CampaignItem[] {
  const current = getStoredCampaigns();
  const updated = current.filter(c => c.id !== campaignId);
  saveCampaigns(updated);
  return updated;
}

export function registerCampaignDonor(campaignId: string): { success: boolean; updated: CampaignItem[] } {
  const current = getStoredCampaigns();
  const updated = current.map(c => {
    if (c.id === campaignId && c.registeredCount < c.slotsAvailable) {
      return { ...c, registeredCount: c.registeredCount + 1 };
    }
    return c;
  });
  saveCampaigns(updated);
  return { success: true, updated };
}

export function getCampaignDelegations(): CampaignDelegation[] {
  if (typeof window === 'undefined') return INITIAL_DELEGATIONS;
  try {
    const data = localStorage.getItem(DELEGATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading campaign delegations:', err);
  }
  return INITIAL_DELEGATIONS;
}

export function saveCampaignDelegations(delegations: CampaignDelegation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DELEGATIONS_STORAGE_KEY, JSON.stringify(delegations));
  } catch (err) {
    console.error('Error saving campaign delegations:', err);
  }
}

export function toggleDelegationPermission(userId: string, isAllowed: boolean): CampaignDelegation[] {
  const current = getCampaignDelegations();
  const updated = current.map(d => {
    if (d.userId === userId) {
      return {
        ...d,
        canCreateCampaigns: isAllowed,
        authorizedBy: isAllowed ? 'Super Admin (Md. Rahman Hossain)' : 'Permission Revoked',
        authorizedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    }
    return d;
  });
  saveCampaignDelegations(updated);
  return updated;
}

export function getSimulatedRole(): string {
  if (typeof window === 'undefined') return 'super_admin';
  return localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY) || 'super_admin';
}

export function setSimulatedRole(role: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
}

/**
 * Check if the given role or user is allowed to create campaigns.
 * Super Admin always has full access.
 * Allowed admins (delegated by Super Admin) have access.
 * Donors, volunteers and public have no access.
 */
export function checkCanCreateCampaign(role: string, userId?: string): {
  allowed: boolean;
  reason: string;
  reasonBn: string;
} {
  // Super Admin: Full Root Authority
  if (role === 'super_admin' || role === 'national_admin') {
    return {
      allowed: true,
      reason: 'Super Administrator — Full Nationwide Authority',
      reasonBn: 'সুপার অ্যাডমিনিস্ট্রেটর — পূর্ণ দেশব্যাপী কর্মসূচি অনুমোদন ও তৈরি ক্ষমতা'
    };
  }

  // Check Delegated Permissions for Subordinate Administrators
  const delegations = getCampaignDelegations();
  const userDelegation = userId 
    ? delegations.find(d => d.userId === userId)
    : delegations.find(d => d.roleId === role);

  if (userDelegation && userDelegation.canCreateCampaigns) {
    return {
      allowed: true,
      reason: `Authorized by Super Admin (${userDelegation.role} - ${userDelegation.jurisdiction})`,
      reasonBn: `সুপার অ্যাডমিন কর্তৃক অনুমোদিত (${userDelegation.role} - ${userDelegation.jurisdiction})`
    };
  }

  // Denied
  if (role === 'donor') {
    return {
      allowed: false,
      reason: 'Donor profile does not have administrative campaign creation authority.',
      reasonBn: 'রক্তদাতা প্রোফাইলের জন্য রক্তদান কর্মসূচি তৈরির অনুমতি নেই।'
    };
  }

  return {
    allowed: false,
    reason: 'Campaign creation is strictly reserved for Super Admin and coordinators authorized by Super Admin.',
    reasonBn: 'রক্তদান কর্মসূচি তৈরি শুধুমাত্র সুপার অ্যাডমিন ও সুপার অ্যাডমিন কর্তৃক অনুমোদিত প্রশাসকদের জন্য সংরক্ষিত।'
  };
}
