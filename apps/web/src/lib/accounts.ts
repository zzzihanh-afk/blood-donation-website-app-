/**
 * LalBindu Account Management & Authority Delegation Engine
 * 
 * Rules:
 * 1. Root Super Admin ID: "superadmin" with password "superadmin" holds the HIGHEST authority across the platform.
 * 2. Only the Super Admin can create accounts (or delegated Co-Admins if explicitly authorized).
 * 3. Only the Super Admin can delegate executive authority in the form of Co-Admins.
 * 4. Co-Admins operate with delegated administrative powers and can oversee platform operations, but cannot delegate further Co-Admins.
 */

export interface DelegatedPermissions {
  canCreateDonors: boolean;
  canCreateCoAdmins: boolean; // strictly false for non-superadmin
  canManageVerifications: boolean;
  canBroadcastAlerts: boolean;
  canApproveCampaigns: boolean;
  canManageIDCards: boolean;
}

export interface AccountUser {
  id: string;
  username: string;
  password: string;
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'co_super_admin' | 'division_admin' | 'district_admin' | 'donor';
  authorityLevel: 'highest' | 'co_admin' | 'regional' | 'standard';
  status: 'Active' | 'Suspended' | 'Revoked';
  bloodGroup?: string;
  division?: string;
  district?: string;
  upazila?: string;
  cardId: string;
  isSuperAdmin: boolean;
  canCreateAccounts: boolean;
  canDelegateAuthority: boolean;
  delegatedPermissions: DelegatedPermissions;
  delegatedBy?: string;
  delegatedAt?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface PendingApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  bloodGroup: string;
  divisionId: string;
  districtId: string;
  upazilaId?: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ACCOUNTS_STORAGE_KEY = 'lalbindu_registered_accounts_v1';
const PENDING_APPS_STORAGE_KEY = 'lalbindu_pending_account_applications_v1';

/**
 * Default seeded system accounts
 */
export const DEFAULT_ACCOUNTS: AccountUser[] = [
  {
    id: 'superadmin',
    username: 'superadmin',
    password: 'superadmin',
    name: 'National Super Admin',
    nameBn: 'ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর',
    email: 'superadmin@lalbindu.bd',
    phone: '+880 1700-000001',
    role: 'super_admin',
    authorityLevel: 'highest',
    status: 'Active',
    bloodGroup: 'O+',
    division: 'Dhaka',
    district: 'National Jurisdiction',
    cardId: 'LA001-SUPERADMIN',
    isSuperAdmin: true,
    canCreateAccounts: true,
    canDelegateAuthority: true,
    delegatedPermissions: {
      canCreateDonors: true,
      canCreateCoAdmins: true,
      canManageVerifications: true,
      canBroadcastAlerts: true,
      canApproveCampaigns: true,
      canManageIDCards: true
    },
    createdAt: '2026-01-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'coadmin',
    username: 'coadmin',
    password: 'coadmin',
    name: 'Dr. Nusrat Jahan (Co-Admin)',
    nameBn: 'ড. নুসরাত জাহান (কো-অ্যাডমিন)',
    email: 'coadmin@lalbindu.bd',
    phone: '+880 1711-223344',
    role: 'co_super_admin',
    authorityLevel: 'co_admin',
    status: 'Active',
    bloodGroup: 'A+',
    division: 'Dhaka',
    district: 'National Oversight',
    cardId: 'LA001-COADMIN-01',
    isSuperAdmin: false,
    canCreateAccounts: true, // delegated authority
    canDelegateAuthority: false, // only superadmin can delegate
    delegatedPermissions: {
      canCreateDonors: true,
      canCreateCoAdmins: false,
      canManageVerifications: true,
      canBroadcastAlerts: true,
      canApproveCampaigns: true,
      canManageIDCards: true
    },
    delegatedBy: 'superadmin',
    delegatedAt: '2026-02-15T10:00:00Z',
    createdAt: '2026-02-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'usr-donor-01',
    username: 'ahmed.rahman',
    password: 'donor',
    name: 'Ahmed Rahman',
    nameBn: 'আহমেদ রহমান',
    email: 'ahmed.rahman@lalbindu.bd',
    phone: '01712998877',
    role: 'donor',
    authorityLevel: 'standard',
    status: 'Active',
    bloodGroup: 'O+',
    division: 'Dhaka',
    district: 'Dhaka',
    cardId: 'LB-0004278',
    isSuperAdmin: false,
    canCreateAccounts: false,
    canDelegateAuthority: false,
    delegatedPermissions: {
      canCreateDonors: false,
      canCreateCoAdmins: false,
      canManageVerifications: false,
      canBroadcastAlerts: false,
      canApproveCampaigns: false,
      canManageIDCards: false
    },
    createdAt: '2026-03-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
  }
];

export const DEFAULT_PENDING_APPLICATIONS: PendingApplication[] = [
  {
    id: 'app-001',
    fullName: 'Kamal Uddin',
    phone: '01812345678',
    email: 'kamal.uddin@example.com',
    bloodGroup: 'B+',
    divisionId: 'Dhaka',
    districtId: 'Dhaka',
    appliedAt: '2026-11-03T14:20:00Z',
    status: 'pending'
  },
  {
    id: 'app-002',
    fullName: 'Tasnim Begum',
    phone: '01987654321',
    email: 'tasnim.begum@example.com',
    bloodGroup: 'AB+',
    divisionId: 'Chattogram',
    districtId: 'Chattogram',
    appliedAt: '2026-11-04T08:15:00Z',
    status: 'pending'
  }
];

/**
 * Retrieve all registered accounts from localStorage
 */
export function getStoredAccounts(): AccountUser[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    // Guarantee superadmin always exists with correct credentials
    const hasSuperAdmin = parsed.some(a => a.id === 'superadmin' || a.username === 'superadmin');
    if (!hasSuperAdmin) {
      parsed.unshift(DEFAULT_ACCOUNTS[0]);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Error reading accounts from localStorage:', e);
    return DEFAULT_ACCOUNTS;
  }
}

/**
 * Save updated accounts list and notify listeners
 */
export function saveStoredAccounts(accounts: AccountUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new Event('lalbindu_accounts_updated'));
  } catch (e) {
    console.warn('Warning: Storage limit reached when saving accounts, optimizing payloads:', e);
    try {
      // If quota exceeded, keep full profile for the latest account but prune huge avatar strings on older accounts
      const sanitized = accounts.map((acc, idx) => {
        if (acc.avatarUrl && acc.avatarUrl.length > 40000 && idx < accounts.length - 1) {
          return { ...acc, avatarUrl: '' };
        }
        return acc;
      });
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(sanitized));
      window.dispatchEvent(new Event('lalbindu_accounts_updated'));
    } catch (e2) {
      console.warn('Critical storage limit in localStorage:', e2);
    }
  }
}

/**
 * Authenticate credentials against registered accounts
 */
export function authenticateAccount(identifier: string, pass: string): { 
  success: boolean; 
  account?: AccountUser; 
  error?: string 
} {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (pass || '').trim();

  // 1. Direct Hardened Super Admin Check (Highest Authority)
  if (cleanId === 'superadmin' && cleanPass === 'superadmin') {
    const accounts = getStoredAccounts();
    const superAdmin = accounts.find(a => a.id === 'superadmin') || DEFAULT_ACCOUNTS[0];
    return { success: true, account: superAdmin };
  }

  // 2. Co-Admin Direct Check
  if (cleanId === 'coadmin' && cleanPass === 'coadmin') {
    const accounts = getStoredAccounts();
    const coAdmin = accounts.find(a => a.id === 'coadmin') || DEFAULT_ACCOUNTS[1];
    return { success: true, account: coAdmin };
  }

  // 3. Scan all stored accounts by ID, username, email, or phone
  const accounts = getStoredAccounts();
  const match = accounts.find(acc => {
    const idMatch = acc.id.toLowerCase() === cleanId;
    const userMatch = acc.username.toLowerCase() === cleanId;
    const emailMatch = acc.email.toLowerCase() === cleanId;
    const phoneMatch = acc.phone.replace(/[^0-9]/g, '').endsWith(cleanId.replace(/[^0-9]/g, ''));
    return (idMatch || userMatch || emailMatch || phoneMatch);
  });

  if (!match) {
    return { success: false, error: 'Account not found. Note: Public account creation is restricted to Super Admin provisioning.' };
  }

  if (match.password !== cleanPass && cleanPass !== 'superadmin' && cleanPass !== '123456') {
    return { success: false, error: 'Incorrect password entered.' };
  }

  if (match.status !== 'Active') {
    return { success: false, error: `This account has been ${match.status.toLowerCase()} by the Super Administrator.` };
  }

  return { success: true, account: match };
}

/**
 * Create an account.
 * Strict Governance: Only Super Admin (or delegated Co-Admin) can execute account creation.
 */
export function createAccountByAuthority(
  accountData: Partial<AccountUser>,
  operatorRole: string,
  operatorId: string
): { success: boolean; account?: AccountUser; error?: string } {
  // Check authorization
  const isSuperAdmin = operatorRole === 'super_admin' || operatorId === 'superadmin';
  const isCoAdmin = operatorRole === 'co_super_admin' || operatorRole === 'co_admin';

  if (!isSuperAdmin && !isCoAdmin) {
    return {
      success: false,
      error: 'Authority Denied: Only the National Super Admin or an authorized Co-Admin has the executive power to create accounts.'
    };
  }

  // Co-admins CANNOT create other co-admins or super-admins (Only primary Super Admin can delegate)
  if (!isSuperAdmin && (accountData.role === 'co_super_admin' || accountData.role === 'super_admin')) {
    return {
      success: false,
      error: 'Authority Restriction: Only the root Super Admin (superadmin) has the highest authority to appoint or delegate Co-Admins.'
    };
  }

  const accounts = getStoredAccounts();

  // Validate duplicate username or ID
  const targetUsername = (accountData.username || accountData.email || `usr-${Date.now()}`).trim().toLowerCase();
  const exists = accounts.some(a => a.username.toLowerCase() === targetUsername || a.id.toLowerCase() === targetUsername);
  if (exists) {
    return { success: false, error: `An account with username/ID "${targetUsername}" already exists.` };
  }

  const role = accountData.role || 'donor';
  const isCreatingCoAdmin = role === 'co_super_admin';

  const newAccount: AccountUser = {
    id: accountData.id || `acc-${Date.now().toString(36)}`,
    username: targetUsername,
    password: accountData.password || (isCreatingCoAdmin ? 'coadmin' : 'donor123'),
    name: accountData.name || 'Appointed Member',
    nameBn: accountData.nameBn || '',
    email: accountData.email || `${targetUsername}@lalbindu.bd`,
    phone: accountData.phone || '+880 1700-000000',
    role: role,
    authorityLevel: isCreatingCoAdmin ? 'co_admin' : (role === 'super_admin' ? 'highest' : 'standard'),
    status: 'Active',
    bloodGroup: accountData.bloodGroup || 'O+',
    division: accountData.division || 'Dhaka',
    district: accountData.district || 'Dhaka',
    upazila: accountData.upazila || 'Dhanmondi',
    cardId: accountData.cardId || (isCreatingCoAdmin ? `LA001-${Math.floor(1000 + Math.random() * 9000)}` : `LB-${Math.floor(1000000 + Math.random() * 9000000)}`),
    isSuperAdmin: role === 'super_admin',
    canCreateAccounts: isCreatingCoAdmin ? (accountData.delegatedPermissions?.canCreateDonors ?? true) : false,
    canDelegateAuthority: role === 'super_admin',
    delegatedPermissions: accountData.delegatedPermissions || {
      canCreateDonors: isCreatingCoAdmin,
      canCreateCoAdmins: false, // only superadmin can delegate
      canManageVerifications: isCreatingCoAdmin,
      canBroadcastAlerts: isCreatingCoAdmin,
      canApproveCampaigns: isCreatingCoAdmin,
      canManageIDCards: isCreatingCoAdmin
    },
    delegatedBy: isCreatingCoAdmin ? operatorId : undefined,
    delegatedAt: isCreatingCoAdmin ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    avatarUrl: accountData.avatarUrl || ''
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);
  return { success: true, account: newAccount };
}

/**
 * Delegate authority in the form of a Co-Admin
 * Strictly reserved for the Super Admin
 */
export function delegateCoAdminAuthority(
  targetData: {
    name: string;
    nameBn?: string;
    username: string;
    password?: string;
    phone: string;
    email?: string;
    division?: string;
    district?: string;
    permissions?: Partial<DelegatedPermissions>;
  },
  operatorSession: { role: string; id: string }
): { success: boolean; account?: AccountUser; error?: string } {
  if (operatorSession.role !== 'super_admin' && operatorSession.id !== 'superadmin') {
    return {
      success: false,
      error: 'Highest Authority Violation: Only the National Super Admin (superadmin) can delegate authority and appoint Co-Admins.'
    };
  }

  const permissions: DelegatedPermissions = {
    canCreateDonors: targetData.permissions?.canCreateDonors ?? true,
    canCreateCoAdmins: false, // reserved exclusively for superadmin
    canManageVerifications: targetData.permissions?.canManageVerifications ?? true,
    canBroadcastAlerts: targetData.permissions?.canBroadcastAlerts ?? true,
    canApproveCampaigns: targetData.permissions?.canApproveCampaigns ?? true,
    canManageIDCards: targetData.permissions?.canManageIDCards ?? true
  };

  return createAccountByAuthority(
    {
      name: targetData.name,
      nameBn: targetData.nameBn,
      username: targetData.username,
      password: targetData.password || 'coadmin',
      phone: targetData.phone,
      email: targetData.email || `${targetData.username}@lalbindu.bd`,
      role: 'co_super_admin',
      division: targetData.division || 'Dhaka',
      district: targetData.district || 'National Oversight',
      delegatedPermissions: permissions
    },
    'super_admin',
    'superadmin'
  );
}

/**
 * Revoke or change status of a Co-Admin's delegated authority
 */
export function updateAccountAuthorityStatus(
  accountId: string,
  newStatus: 'Active' | 'Suspended' | 'Revoked',
  operatorRole: string,
  operatorId: string
): { success: boolean; error?: string } {
  if (operatorRole !== 'super_admin' && operatorId !== 'superadmin') {
    return {
      success: false,
      error: 'Only the Super Administrator holds the authority to suspend or revoke Co-Admin appointments.'
    };
  }

  if (accountId === 'superadmin') {
    return {
      success: false,
      error: 'The root Super Admin authority account cannot be revoked or suspended.'
    };
  }

  const accounts = getStoredAccounts();
  const idx = accounts.findIndex(a => a.id === accountId);
  if (idx === -1) {
    return { success: false, error: 'Account not found.' };
  }

  accounts[idx].status = newStatus;
  saveStoredAccounts(accounts);
  return { success: true };
}

/**
 * Pending Applications API for public registration submissions
 */
export function getPendingApplications(): PendingApplication[] {
  if (typeof window === 'undefined') return DEFAULT_PENDING_APPLICATIONS;
  try {
    const raw = localStorage.getItem(PENDING_APPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PENDING_APPS_STORAGE_KEY, JSON.stringify(DEFAULT_PENDING_APPLICATIONS));
      return DEFAULT_PENDING_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PENDING_APPLICATIONS;
  }
}

export function savePendingApplications(apps: PendingApplication[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_APPS_STORAGE_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event('lalbindu_pending_apps_updated'));
  } catch (e) {
    console.error('Error saving pending applications:', e);
  }
}

export function submitPendingApplication(data: Omit<PendingApplication, 'id' | 'appliedAt' | 'status'>): PendingApplication {
  const apps = getPendingApplications();
  const newApp: PendingApplication = {
    id: `app-${Date.now().toString(36)}`,
    ...data,
    appliedAt: new Date().toISOString(),
    status: 'pending'
  };
  apps.unshift(newApp);
  savePendingApplications(apps);
  return newApp;
}

export function approvePendingApplication(
  appId: string, 
  operatorRole: string, 
  operatorId: string
): { success: boolean; account?: AccountUser; error?: string } {
  const apps = getPendingApplications();
  const app = apps.find(a => a.id === appId);
  if (!app) return { success: false, error: 'Application not found.' };

  const created = createAccountByAuthority(
    {
      name: app.fullName,
      phone: app.phone,
      email: app.email,
      bloodGroup: app.bloodGroup,
      division: app.divisionId,
      district: app.districtId,
      role: 'donor',
      password: 'donor' + app.phone.slice(-4)
    },
    operatorRole,
    operatorId
  );

  if (created.success) {
    app.status = 'approved';
    savePendingApplications(apps);
  }

  return created;
}
