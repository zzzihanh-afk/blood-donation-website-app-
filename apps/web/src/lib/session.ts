export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'super_admin' | 'co_super_admin' | 'division_admin' | 'public';
  roleLabelEn: string;
  roleLabelBn: string;
  avatarUrl: string;
  donorId?: string;
  adminId?: string;
  bloodGroup?: string;
}

export const KNOWN_SESSIONS: Record<string, UserSession> = {
  donor: {
    id: 'usr-donor-01',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@lalbindu.bd',
    role: 'donor',
    roleLabelEn: 'O+ Donor',
    roleLabelBn: 'O+ রক্তদাতা',
    donorId: 'LB-0004278',
    bloodGroup: 'O+',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  },
  super_admin: {
    id: 'usr-admin-01',
    name: 'Md. Rahman Hossain',
    email: 'rahman.hossain@lalbindu.bd',
    role: 'super_admin',
    roleLabelEn: 'Super Administrator',
    roleLabelBn: 'সুপার অ্যাডমিনিস্ট্রেটর',
    adminId: 'LA0010001',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  public: {
    id: 'usr-guest',
    name: 'Website Viewer',
    email: '',
    role: 'public',
    roleLabelEn: 'Public Visitor',
    roleLabelBn: 'সাধারণ পরিদর্শক',
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
    if (savedRole && KNOWN_SESSIONS[savedRole]) {
      return KNOWN_SESSIONS[savedRole];
    }
  } catch (e) {
    console.error('Error reading session from localStorage:', e);
  }
  return KNOWN_SESSIONS.donor;
}

/**
 * Switch active session (e.g. from Donor to Super Admin or Public Visitor).
 * Dispatches a window event so all components update reactively.
 */
export function setCurrentSession(roleKey: 'donor' | 'super_admin' | 'public'): UserSession {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, roleKey);
      // Also sync with lalbindu_simulated_role for campaign creator checks
      localStorage.setItem('lalbindu_simulated_role', roleKey);
      window.dispatchEvent(new Event('lalbindu_session_changed'));
    } catch (e) {
      console.error('Error saving session to localStorage:', e);
    }
  }
  return KNOWN_SESSIONS[roleKey] || KNOWN_SESSIONS.donor;
}

/**
 * Check if the active role has administrator privileges.
 */
export function isAuthorizedAdmin(session: UserSession): boolean {
  return session.role === 'super_admin' || session.role === 'co_super_admin' || session.role === 'division_admin';
}
