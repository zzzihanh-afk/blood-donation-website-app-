export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'super_admin' | 'co_super_admin' | 'division_admin' | 'district_admin' | 'upazila_admin' | 'hospital_admin' | 'public';
  roleLabelEn: string;
  roleLabelBn: string;
  avatarUrl: string;
  donorId?: string;
  adminId?: string;
  division?: string;
  district?: string;
  upazila?: string;
  bloodGroup?: string;
  authorityLevel?: 'highest' | 'co_admin' | 'regional' | 'standard';
  canCreateAccounts?: boolean;
  canDelegateAuthority?: boolean;
  isSuperAdmin?: boolean;
  delegatedBy?: string;
}

export const KNOWN_SESSIONS: Record<string, UserSession> = {
  superadmin: {
    id: 'superadmin',
    name: 'National Super Admin',
    email: 'superadmin@lalbindu.bd',
    role: 'super_admin',
    roleLabelEn: 'National Super Admin (Highest Authority)',
    roleLabelBn: 'ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর (সর্বোচ্চ ক্ষমতা)',
    adminId: 'superadmin',
    authorityLevel: 'highest',
    isSuperAdmin: true,
    canCreateAccounts: true,
    canDelegateAuthority: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  super_admin: {
    id: 'superadmin',
    name: 'National Super Admin',
    email: 'superadmin@lalbindu.bd',
    role: 'super_admin',
    roleLabelEn: 'National Super Admin (Highest Authority)',
    roleLabelBn: 'ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর (সর্বোচ্চ ক্ষমতা)',
    adminId: 'superadmin',
    authorityLevel: 'highest',
    isSuperAdmin: true,
    canCreateAccounts: true,
    canDelegateAuthority: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  co_admin: {
    id: 'coadmin',
    name: 'Dr. Nusrat Jahan (Co-Admin)',
    email: 'coadmin@lalbindu.bd',
    role: 'co_super_admin',
    roleLabelEn: 'Co-Administrator (Delegated)',
    roleLabelBn: 'কো-অ্যাডমিনিস্ট্রেটর (অর্পিত ক্ষমতা)',
    adminId: 'coadmin',
    authorityLevel: 'co_admin',
    isSuperAdmin: false,
    canCreateAccounts: true,
    canDelegateAuthority: false,
    delegatedBy: 'superadmin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'
  },
  co_super_admin: {
    id: 'coadmin',
    name: 'Dr. Nusrat Jahan (Co-Admin)',
    email: 'coadmin@lalbindu.bd',
    role: 'co_super_admin',
    roleLabelEn: 'Co-Administrator (Delegated)',
    roleLabelBn: 'কো-অ্যাডমিনিস্ট্রেটর (অর্পিত ক্ষমতা)',
    adminId: 'coadmin',
    authorityLevel: 'co_admin',
    isSuperAdmin: false,
    canCreateAccounts: true,
    canDelegateAuthority: false,
    delegatedBy: 'superadmin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'
  },
  donor: {
    id: 'usr-donor-01',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@lalbindu.bd',
    role: 'donor',
    roleLabelEn: 'O+ Donor',
    roleLabelBn: 'O+ রক্তদাতা',
    donorId: 'LB-0004278',
    bloodGroup: 'O+',
    authorityLevel: 'standard',
    isSuperAdmin: false,
    canCreateAccounts: false,
    canDelegateAuthority: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  },
  public: {
    id: 'usr-guest',
    name: 'Website Viewer',
    email: '',
    role: 'public',
    roleLabelEn: 'Public Visitor',
    roleLabelBn: 'সাধারণ পরিদর্শক',
    authorityLevel: 'standard',
    isSuperAdmin: false,
    canCreateAccounts: false,
    canDelegateAuthority: false,
    avatarUrl: ''
  }
};

const SESSION_STORAGE_KEY = 'lalbindu_active_session_role';

/**
 * Get current user session.
 * Defaults to 'donor' for regular public website experience,
 * unless previously switched or authorized.
 */
export function getCurrentSession(): UserSession {
  if (typeof window === 'undefined') return KNOWN_SESSIONS.donor;
  try {
    const savedRole = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedRole) {
      if (KNOWN_SESSIONS[savedRole]) {
        return KNOWN_SESSIONS[savedRole];
      }
      // Check custom accounts in accounts storage
      const rawAccounts = localStorage.getItem('lalbindu_registered_accounts_v1');
      if (rawAccounts) {
        const accounts = JSON.parse(rawAccounts);
        const match = accounts.find((a: any) => a.id === savedRole || a.username === savedRole);
        if (match) {
          const isSuper = match.role === 'super_admin' || match.id === 'superadmin' || match.isSuperAdmin === true;
          const isCoSuper = match.role === 'co_super_admin' || match.authorityLevel === 'co_admin' || match.id === 'coadmin';
          const isDistrict = match.role === 'district_admin';
          const isDivision = match.role === 'division_admin';
          const isUpazila = match.role === 'upazila_admin';
          const isHospital = match.role === 'hospital_admin';

          let roleLabelEn = 'Verified Donor';
          let roleLabelBn = 'যাচাইকৃত রক্তদাতা';
          if (isSuper) {
            roleLabelEn = 'National Super Admin (Highest Authority)';
            roleLabelBn = 'ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর';
          } else if (isCoSuper) {
            roleLabelEn = 'Co-Administrator (Delegated)';
            roleLabelBn = 'কো-অ্যাডমিনিস্ট্রেটর';
          } else if (isDistrict) {
            roleLabelEn = match.district ? `District Administrator (${match.district})` : 'District Administrator';
            roleLabelBn = match.district ? `জেলা প্রশাসক (${match.district})` : 'জেলা প্রশাসক ও সমন্বয়ক';
          } else if (isDivision) {
            roleLabelEn = match.division ? `Division Administrator (${match.division})` : 'Division Administrator';
            roleLabelBn = match.division ? `বিভাগীয় প্রশাসক (${match.division})` : 'বিভাগীয় প্রশাসক';
          } else if (isUpazila) {
            roleLabelEn = match.upazila ? `Upazila Administrator (${match.upazila})` : 'Upazila Administrator';
            roleLabelBn = match.upazila ? `উপজেলা প্রশাসক (${match.upazila})` : 'উপজেলা প্রশাসক';
          } else if (isHospital) {
            roleLabelEn = 'Hospital Administrator';
            roleLabelBn = 'হাসপাতাল অ্যাডমিনিস্ট্রেটর';
          }

          const isDonor = match.role === 'donor';

          return {
            id: match.id,
            name: match.name,
            email: match.email,
            role: match.role,
            roleLabelEn,
            roleLabelBn,
            adminId: !isDonor ? (match.cardId || match.id) : undefined,
            donorId: isDonor ? match.cardId : undefined,
            division: match.division,
            district: match.district,
            upazila: match.upazila,
            bloodGroup: match.bloodGroup,
            authorityLevel: isSuper ? 'highest' : (isCoSuper ? 'co_admin' : (!isDonor ? 'regional' : 'standard')),
            isSuperAdmin: isSuper,
            canCreateAccounts: isSuper || isCoSuper,
            canDelegateAuthority: isSuper,
            delegatedBy: match.delegatedBy,
            avatarUrl: match.avatarUrl && !match.avatarUrl.includes('images.unsplash.com/photo-1507003211169') 
              ? match.avatarUrl 
              : ''
          };
        }
      }
    }
  } catch (e) {
    console.error('Error reading session from localStorage:', e);
  }
  return KNOWN_SESSIONS.donor;
}

/**
 * Switch active session (e.g. to Super Admin 'superadmin', Co-Admin 'co_admin', or Donor).
 * Dispatches a window event so all components update reactively.
 */
export function setCurrentSession(roleKey: 'donor' | 'super_admin' | 'superadmin' | 'co_admin' | 'co_super_admin' | 'public' | string): UserSession {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, roleKey);
      // Also sync with lalbindu_simulated_role for campaign creator checks
      const mappedRole = (roleKey === 'superadmin' || roleKey === 'super_admin') 
        ? 'super_admin' 
        : (roleKey === 'co_admin' || roleKey === 'co_super_admin') 
        ? 'co_super_admin' 
        : roleKey;
      localStorage.setItem('lalbindu_simulated_role', mappedRole);
      window.dispatchEvent(new Event('lalbindu_session_changed'));
    } catch (e) {
      console.warn('Notice saving session to localStorage:', e);
    }
  }
  return getCurrentSession();
}

/**
 * Check if the active role has administrator privileges.
 */
export function isAuthorizedAdmin(session: UserSession): boolean {
  return session.role === 'super_admin' || 
         session.role === 'co_super_admin' || 
         session.role === 'division_admin' || 
         session.role === 'district_admin' || 
         session.role === 'upazila_admin' || 
         session.role === 'hospital_admin' ||
         session.authorityLevel === 'highest' ||
         session.authorityLevel === 'co_admin' ||
         session.authorityLevel === 'regional';
}

/**
 * Check if the active session holds the HIGHEST authority (Supreme Super Admin).
 */
export function isHighestAuthority(session?: UserSession | null): boolean {
  if (!session) return false;
  return session.role === 'super_admin' || session.id === 'superadmin' || session.authorityLevel === 'highest' || session.isSuperAdmin === true;
}

/**
 * Check if the active session is Super Admin or Co-Super Admin (Highest Authority or Delegated Co-Admin).
 */
export function isSuperOrCoAdmin(session?: UserSession | null): boolean {
  if (!session) return false;
  return isHighestAuthority(session) || session.role === 'co_super_admin' || session.authorityLevel === 'co_admin' || session.id === 'coadmin';
}
