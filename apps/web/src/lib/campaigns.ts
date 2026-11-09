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
    userId: 'adm-00',
    name: 'Dr. Nusrat Jahan',
    role: 'Co-Super Administrator',
    roleId: 'co_super_admin',
    jurisdiction: 'National (All Bangladesh)',
    canCreateCampaigns: true,
    authorizedBy: 'Super Admin (Md. Rahman Hossain)',
    authorizedDate: '01 Nov 2026'
  },
  {
    userId: 'adm-01',
    name: 'Kazi Mahbubur Rahman',
    role: 'District Administrator',
    roleId: 'district_admin',
    jurisdiction: 'Dhaka District',
    canCreateCampaigns: false,
    authorizedBy: 'Pending Super Admin Review',
    authorizedDate: '-'
  },
  {
    userId: 'adm-02',
    name: 'Dr. Shah Alam',
    role: 'Division Administrator',
    roleId: 'division_admin',
    jurisdiction: 'Chattogram Division',
    canCreateCampaigns: false,
    authorizedBy: 'Pending Super Admin Review',
    authorizedDate: '-'
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
    window.dispatchEvent(new Event('lalbindu_campaigns_updated'));
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

const REGISTERED_CAMPAIGNS_KEY = 'lalbindu_donor_registered_campaigns';

export function getRegisteredCampaignIds(donorId?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_CAMPAIGNS_KEY);
    const globalIds: string[] = raw ? JSON.parse(raw) : [];

    let specificId = donorId;
    if (!specificId) {
      try {
        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw);
          specificId = parsed.donor_id_number || parsed.cardId || parsed.id;
        }
      } catch {}
    }

    let donorIds: string[] = [];
    if (specificId) {
      const donorRaw = localStorage.getItem(`${REGISTERED_CAMPAIGNS_KEY}_${specificId}`);
      if (donorRaw) {
        donorIds = JSON.parse(donorRaw);
      }
    }

    return Array.from(new Set([...globalIds, ...donorIds]));
  } catch {
    return [];
  }
}

export function saveRegisteredCampaignId(campaignId: string, donorId?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRegisteredCampaignIds();
    const updated = Array.from(new Set([...current, campaignId]));
    localStorage.setItem(REGISTERED_CAMPAIGNS_KEY, JSON.stringify(updated));

    let specificId = donorId;
    if (!specificId) {
      try {
        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw);
          specificId = parsed.donor_id_number || parsed.cardId || parsed.id;
        }
      } catch {}
    }

    if (specificId) {
      const donorKey = `${REGISTERED_CAMPAIGNS_KEY}_${specificId}`;
      const donorRaw = localStorage.getItem(donorKey);
      const donorList: string[] = donorRaw ? JSON.parse(donorRaw) : [];
      if (!donorList.includes(campaignId)) {
        localStorage.setItem(donorKey, JSON.stringify([...donorList, campaignId]));
      }
    }

    return updated;
  } catch {
    return [];
  }
}

export function registerCampaignDonor(campaignId: string, donorId?: string): { success: boolean; updated: CampaignItem[] } {
  const current = getStoredCampaigns();
  const updated = current.map(c => {
    if (c.id === campaignId && c.registeredCount < c.slotsAvailable) {
      return { ...c, registeredCount: c.registeredCount + 1 };
    }
    return c;
  });
  saveCampaigns(updated);
  saveRegisteredCampaignId(campaignId, donorId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('lalbindu_campaigns_updated'));
  }
  return { success: true, updated };
}

export function unregisterCampaignDonor(campaignId: string, donorId?: string): { success: boolean; updated: CampaignItem[] } {
  const current = getStoredCampaigns();
  const updated = current.map(c => {
    if (c.id === campaignId && c.registeredCount > 0) {
      return { ...c, registeredCount: c.registeredCount - 1 };
    }
    return c;
  });
  saveCampaigns(updated);

  if (typeof window !== 'undefined') {
    try {
      const currentIds = getRegisteredCampaignIds();
      const updatedIds = currentIds.filter(id => id !== campaignId);
      localStorage.setItem(REGISTERED_CAMPAIGNS_KEY, JSON.stringify(updatedIds));

      let specificId = donorId;
      if (!specificId) {
        try {
          const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
          if (activeRaw) {
            const parsed = JSON.parse(activeRaw);
            specificId = parsed.donor_id_number || parsed.cardId || parsed.id;
          }
        } catch {}
      }

      if (specificId) {
        const donorKey = `${REGISTERED_CAMPAIGNS_KEY}_${specificId}`;
        const donorRaw = localStorage.getItem(donorKey);
        if (donorRaw) {
          const donorList: string[] = JSON.parse(donorRaw);
          localStorage.setItem(donorKey, JSON.stringify(donorList.filter(id => id !== campaignId)));
        }
      }

      window.dispatchEvent(new Event('lalbindu_campaigns_updated'));
    } catch (e) {
      console.error('Error unregistering campaign:', e);
    }
  }

  return { success: true, updated };
}

export function getCampaignDelegations(): CampaignDelegation[] {
  if (typeof window === 'undefined') return INITIAL_DELEGATIONS;
  try {
    const data = localStorage.getItem(DELEGATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce strict governance: Only super_admin and co_super_admin can hold canCreateCampaigns
        let modified = false;
        parsed.forEach((d: any) => {
          const isExec = d.roleId === 'co_super_admin' || d.roleId === 'super_admin' || d.userId === 'adm-00';
          if (!isExec && d.canCreateCampaigns === true) {
            d.canCreateCampaigns = false;
            d.authorizedBy = 'Restricted: Executive Admin Only';
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(DELEGATIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
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
 * Strictly reserved for Super Admin and Co-Admin.
 * Regional and subordinate accounts have read-only access.
 */
export function checkCanCreateCampaign(role: string, userId?: string): {
  allowed: boolean;
  reason: string;
  reasonBn: string;
} {
  const isSuper = role === 'super_admin' || role === 'national_admin' || userId === 'superadmin';
  const isCoSuper = role === 'co_super_admin' || role === 'co_admin' || userId === 'coadmin' || userId === 'adm-00';

  // Super Admin: Full Root Authority
  if (isSuper) {
    return {
      allowed: true,
      reason: 'Super Administrator — Full Nationwide Authority',
      reasonBn: 'সুপার অ্যাডমিনিস্ট্রেটর — পূর্ণ দেশব্যাপী কর্মসূচি অনুমোদন ও তৈরি ক্ষমতা'
    };
  }

  // Co-Admin: Delegated Executive Authority
  if (isCoSuper) {
    return {
      allowed: true,
      reason: 'Co-Administrator — Delegated Executive Authority',
      reasonBn: 'কো-অ্যাডমিনিস্ট্রেটর — অর্পিত পূর্ণ নির্বাহী ক্ষমতা'
    };
  }

  // Explicit regional denial
  if (role === 'division_admin' || role === 'district_admin' || role === 'upazila_admin' || role === 'hospital_admin' || role === 'thana_admin') {
    return {
      allowed: false,
      reason: 'Regional and hospital administrators do not hold clearance to launch campaigns. Reserved strictly for Super Admin and Co-Admin.',
      reasonBn: 'আঞ্চলিক ও হাসপাতাল প্রশাসকদের ক্যাম্পেইন তৈরির অনুমতি নেই। এটি শুধুমাত্র সুপার অ্যাডমিন ও কো-অ্যাডমিনের জন্য সংরক্ষিত।'
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
    reason: 'Campaign creation is strictly reserved for Super Admin and Co-Admin.',
    reasonBn: 'রক্তদান কর্মসূচি তৈরি শুধুমাত্র সুপার অ্যাডমিন এবং কো-অ্যাডমিনের জন্য সংরক্ষিত।'
  };
}
