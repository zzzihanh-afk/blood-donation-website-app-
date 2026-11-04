'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { 
  BANGLADESH_DIVISIONS, 
  BANGLADESH_KEY_DISTRICTS 
} from '@lalbindu/api-client';
import { roleCardThemes } from '@lalbindu/design-tokens';
import { 
  ShieldCheck, 
  Users, 
  Droplet, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  CreditCard, 
  MapPin, 
  UserCheck, 
  AlertTriangle,
  Award,
  ChevronRight,
  UserPlus,
  Plus,
  X,
  Phone,
  Mail,
  FileText,
  Lock,
  Edit,
  Sparkles,
  CheckCircle,
  Download,
  Share2,
  Trash2,
  Calendar,
  ExternalLink,
  Crown,
  Bell,
  Megaphone,
  Camera,
  Upload
} from 'lucide-react';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { AdminAccessGate } from '@/components/admin/AdminAccessGate';
import { 
  CampaignItem, 
  CampaignDelegation, 
  getStoredCampaigns, 
  addCampaign, 
  deleteCampaign, 
  getCampaignDelegations, 
  toggleDelegationPermission 
} from '@/lib/campaigns';
import { 
  NotificationItem, 
  getStoredNotifications, 
  deleteNotification,
  syncNotificationsFromDatabase
} from '@/lib/notifications';
import { CreateNotificationModal } from '@/components/notifications/CreateNotificationModal';
import { 
  getCurrentSession, 
  isHighestAuthority, 
  UserSession 
} from '@/lib/session';
import { 
  AccountUser, 
  getStoredAccounts, 
  createAccountByAuthority, 
  delegateCoAdminAuthority, 
  updateAccountAuthorityStatus, 
  getPendingApplications, 
  approvePendingApplication, 
  PendingApplication 
} from '@/lib/accounts';

export interface SubordinateAppointment {
  id: string;
  name: string;
  nameBn?: string;
  roleId: string;
  role: string;
  roleBn: string;
  jurisdiction: string;
  jurisdictionBn: string;
  division: string;
  district?: string;
  phone?: string;
  email?: string;
  cardId: string;
  color: string;
  status: 'Active' | 'Suspended' | 'Revoked';
  appointedDate: string;
  validUntil: string;
  avatarUrl: string;
  isEqualSuperAdmin?: boolean;
}

const INITIAL_SUBORDINATE_APPOINTMENTS: SubordinateAppointment[] = [
  {
    id: 'adm-00',
    name: 'Dr. Nusrat Jahan',
    nameBn: 'ড. নুসরাত জাহান',
    roleId: 'co_super_admin',
    role: 'Co-Super Administrator (Equal Power)',
    roleBn: 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)',
    jurisdiction: 'National (All Bangladesh)',
    jurisdictionBn: 'জাতীয় (সমগ্র বাংলাদেশ)',
    division: 'Dhaka',
    district: 'National',
    cardId: 'LA0010002',
    color: '#580F1A',
    status: 'Active',
    appointedDate: '01 Jan 2025',
    validUntil: '31 Dec 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+880 1712-334455',
    email: 'nusrat.superadmin@lalbindu.bd',
    isEqualSuperAdmin: true
  },
  {
    id: 'adm-01',
    name: 'Kazi Mahbubur Rahman',
    nameBn: 'কাজী মাহবুবুর রহমান',
    roleId: 'district_admin',
    role: 'District Administrator',
    roleBn: 'জেলা প্রশাসক ও সমন্বয়ক',
    jurisdiction: 'Dhaka District',
    jurisdictionBn: 'ঢাকা জেলা',
    division: 'Dhaka',
    district: 'Dhaka',
    cardId: 'LB-CARD-ADM-DHAKA-01',
    color: '#006A4E',
    status: 'Active',
    appointedDate: '01 Jan 2025',
    validUntil: '31 Dec 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+880 1711-234567',
    email: 'mahbubur.dhaka@lalbindu.bd'
  },
  {
    id: 'adm-02',
    name: 'Dr. Shah Alam',
    nameBn: 'ড. শাহ আলম',
    roleId: 'division_admin',
    role: 'Division Administrator',
    roleBn: 'বিভাগীয় প্রশাসক',
    jurisdiction: 'Chattogram Division',
    jurisdictionBn: 'চট্টগ্রাম বিভাগ',
    division: 'Chattogram',
    cardId: 'LB-CARD-ADM-CTG-01',
    color: '#0D3B66',
    status: 'Active',
    appointedDate: '15 Feb 2025',
    validUntil: '31 Dec 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+880 1819-876543',
    email: 'shah.alam.ctg@lalbindu.bd'
  },
  {
    id: 'adm-03',
    name: 'Tahmina Begum',
    nameBn: 'তাহমিনা বেগম',
    roleId: 'thana_admin',
    role: 'Thana Administrator',
    roleBn: 'মেট্রোপলিটন থানা প্রশাসক',
    jurisdiction: 'Mirpur Metropolitan Thana',
    jurisdictionBn: 'মিরপুর মেট্রোপলিটন থানা',
    division: 'Dhaka',
    district: 'Dhaka',
    cardId: 'LB-CARD-ADM-MIRPUR-02',
    color: '#008080',
    status: 'Active',
    appointedDate: '01 Mar 2025',
    validUntil: '31 Dec 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+880 1912-349876',
    email: 'tahmina.mirpur@lalbindu.bd'
  }
];

export default function AdminDashboardPage() {
  const { t, lang } = useLanguage();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'national' | 'division' | 'district' | 'upazila'>('national');
  const [selectedDivision, setSelectedDivision] = useState('div-dha');
  const [selectedDistrict, setSelectedDistrict] = useState('dist-dhaka');
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'admins' | 'id-cards' | 'campaigns' | 'notifications'>('overview');

  // Campaigns & Super Admin Delegations state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [delegations, setDelegations] = useState<CampaignDelegation[]>([]);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

  // Broadcast & Notifications state
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [isCreateNotifModalOpen, setIsCreateNotifModalOpen] = useState(false);

  // Active session & registered accounts state
  const [session, setSession] = useState<UserSession>(() => getCurrentSession());
  const [accountsList, setAccountsList] = useState<AccountUser[]>(() => getStoredAccounts());
  const [pendingApps, setPendingApps] = useState<PendingApplication[]>(() => getPendingApplications());
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [accountSubTab, setAccountSubTab] = useState<'appointments' | 'roster' | 'pending'>('appointments');

  const accountPhotoRef = useRef<HTMLInputElement>(null);

  // Account creation form state
  const [newAccountForm, setNewAccountForm] = useState({
    name: '',
    nameBn: '',
    username: '',
    password: '',
    role: 'donor' as 'donor' | 'co_super_admin' | 'division_admin',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    division: 'Dhaka',
    district: 'Dhaka',
    avatarUrl: ''
  });

  const handleAccountPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewAccountForm(prev => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const isSuperAdmin = isHighestAuthority(session);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
    setDelegations(getCampaignDelegations());
    setNotificationsList(getStoredNotifications());
    setSession(getCurrentSession());
    setAccountsList(getStoredAccounts());
    setPendingApps(getPendingApplications());
    syncNotificationsFromDatabase();

    const handleNotifsUpdate = () => {
      setNotificationsList(getStoredNotifications());
    };
    const handleSessionChange = () => setSession(getCurrentSession());
    const handleAccountsUpdate = () => setAccountsList(getStoredAccounts());
    const handleAppsUpdate = () => setPendingApps(getPendingApplications());

    window.addEventListener('lalbindu_notifications_updated', handleNotifsUpdate);
    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    window.addEventListener('lalbindu_accounts_updated', handleAccountsUpdate);
    window.addEventListener('lalbindu_pending_apps_updated', handleAppsUpdate);

    return () => {
      window.removeEventListener('lalbindu_notifications_updated', handleNotifsUpdate);
      window.removeEventListener('lalbindu_session_changed', handleSessionChange);
      window.removeEventListener('lalbindu_accounts_updated', handleAccountsUpdate);
      window.removeEventListener('lalbindu_pending_apps_updated', handleAppsUpdate);
    };
  }, []);

  // Subordinate appointments state with localStorage persistence
  const [appointments, setAppointments] = useState<SubordinateAppointment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lalbindu_subordinate_appointments');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (!parsed.some((p: any) => p.id === 'adm-00')) {
              return [INITIAL_SUBORDINATE_APPOINTMENTS[0], ...parsed];
            }
            return parsed;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_SUBORDINATE_APPOINTMENTS;
  });

  // Modal & Toast States
  const [isAppointModalOpen, setIsAppointModalOpen] = useState(false);
  const [viewCardModalData, setViewCardModalData] = useState<SubordinateAppointment | null>(null);
  const [manageAccessModalData, setManageAccessModalData] = useState<SubordinateAppointment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Appointment Form State
  const [newAppointForm, setNewAppointForm] = useState({
    name: '',
    nameBn: '',
    roleId: 'district_admin',
    division: 'Dhaka',
    district: 'Dhaka',
    specificArea: '',
    phone: '',
    email: '',
    nid: '',
    charterAgreed: true
  });

  // Sample donation verification requests
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'don-rec-01',
      donorName: 'Tanvir Hossain',
      donorId: 'LB-0008819',
      bloodGroup: 'B+',
      hospitalName: lang === 'bn' ? 'রাজশাহী মেডিকেল কলেজ হাসপাতাল' : 'Rajshahi Medical College Hospital',
      donationDate: '2026-11-02',
      units: 1,
      bagNumber: 'BAG-2026-RMC-8120',
      status: 'pending'
    },
    {
      id: 'don-rec-02',
      donorName: 'Sumaiya Akter',
      donorId: 'LB-0003411',
      bloodGroup: 'O-',
      hospitalName: lang === 'bn' ? 'ঢাকা মেডিকেল কলেজ হাসপাতাল' : 'Dhaka Medical College Hospital',
      donationDate: '2026-11-01',
      units: 1,
      bagNumber: 'BAG-2026-DMC-1049',
      status: 'pending'
    }
  ]);

  const handleApprove = (id: string) => {
    setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
    setToastMessage(lang === 'bn' 
      ? 'রক্তদান যাচাই সফল! দাতার মোট সংখ্যা হালনাগাদ হয়েছে এবং ৩ মাসের বিশ্রাম পর্ব শুরু হয়েছে।' 
      : 'Donation verified! Donor count updated and 3-calendar-month resting interval initiated.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReject = (id: string) => {
    setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
    setToastMessage(lang === 'bn' 
      ? 'রেকর্ডটি বাতিল করা হয়েছে।' 
      : 'Donation record rejected with reviewer remarks.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Submit new appointment (Restricted to Super Admin Only)
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Access Control Check
    if (selectedJurisdiction !== 'national') {
      alert(lang === 'bn' 
        ? 'প্রবেশাধিকার সীমাবদ্ধ: শুধুমাত্র ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর পোর্টাল থেকে নতুন সমন্বয়ক বা প্রশাসনিক অ্যাকাউন্ট তৈরি করা সম্ভব।' 
        : 'Access Restricted: Only National Super Administrators can appoint coordinators or create administrative accounts.');
      return;
    }

    if (!newAppointForm.name.trim() || !newAppointForm.phone.trim()) {
      alert(lang === 'bn' ? 'দয়া করে নাম এবং মোবাইল নম্বর প্রদান করুন।' : 'Please provide full name and phone number.');
      return;
    }

    const roleMap: Record<string, { role: string; roleBn: string; color: string; isSuper?: boolean }> = {
      co_super_admin: { 
        role: 'Co-Super Administrator (Equal Power)', 
        roleBn: 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)', 
        color: '#580F1A',
        isSuper: true
      },
      division_admin: { role: 'Division Administrator', roleBn: 'বিভাগীয় প্রশাসক', color: '#0D3B66' },
      district_admin: { role: 'District Administrator', roleBn: 'জেলা প্রশাসক ও সমন্বয়ক', color: '#006A4E' },
      upazila_admin: { role: 'Upazila Administrator', roleBn: 'উপজেলা প্রশাসক', color: '#D84A1B' },
      thana_admin: { role: 'Thana Administrator', roleBn: 'মেট্রোপলিটন থানা প্রশাসক', color: '#008080' },
      union_admin: { role: 'Union Administrator', roleBn: 'ইউনিয়ন প্রশাসক', color: '#4A154B' },
      hospital_admin: { role: 'Hospital Administrator', roleBn: 'হাসপাতাল অ্যাডমিনিস্ট্রেটর', color: '#0077B6' },
      campaign_manager: { role: 'Campaign Manager', roleBn: 'জাতীয় ক্যাম্পেইন ম্যানেজার', color: '#8A1538' }
    };

    const isCoSuper = newAppointForm.roleId === 'co_super_admin';
    const roleInfo = roleMap[newAppointForm.roleId] || roleMap['district_admin'];

    const jurisdictionLabel = isCoSuper
      ? 'National (All Bangladesh)'
      : newAppointForm.specificArea 
        ? `${newAppointForm.specificArea}, ${newAppointForm.district || newAppointForm.division}`
        : `${newAppointForm.district || newAppointForm.division} District`;

    const jurisdictionLabelBn = isCoSuper
      ? 'জাতীয় (সমগ্র বাংলাদেশ)'
      : newAppointForm.specificArea
        ? `${newAppointForm.specificArea}, ${newAppointForm.district || newAppointForm.division}`
        : `${newAppointForm.district || newAppointForm.division} জেলা`;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const cardId = isCoSuper
      ? `LA00100${Math.floor(10 + Math.random() * 90)}`
      : `LB-CARD-ADM-${(newAppointForm.district || newAppointForm.division).substring(0, 3).toUpperCase()}-${randomSuffix}`;

    const newAppointment: SubordinateAppointment = {
      id: `adm-${Date.now()}`,
      name: newAppointForm.name.trim(),
      nameBn: newAppointForm.nameBn.trim() || newAppointForm.name.trim(),
      roleId: newAppointForm.roleId,
      role: roleInfo.role,
      roleBn: roleInfo.roleBn,
      jurisdiction: jurisdictionLabel,
      jurisdictionBn: jurisdictionLabelBn,
      division: isCoSuper ? 'Dhaka' : newAppointForm.division,
      district: isCoSuper ? 'National' : newAppointForm.district,
      phone: newAppointForm.phone.trim(),
      email: newAppointForm.email.trim() || `${newAppointForm.name.toLowerCase().replace(/\s+/g, '.')}${randomSuffix}@lalbindu.bd`,
      cardId,
      color: roleInfo.color,
      status: 'Active',
      appointedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: '31 Dec 2026',
      avatarUrl: isCoSuper 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      isEqualSuperAdmin: isCoSuper
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lalbindu_subordinate_appointments', JSON.stringify(updated));
    }

    // If Co-Super Admin, automatically delegate full campaign authorization
    if (isCoSuper) {
      toggleDelegationPermission(newAppointment.id, true);
    }

    // Register official system account with credentials for login
    createAccountByAuthority(
      {
        id: cardId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        username: newAppointForm.email ? newAppointForm.email.split('@')[0] : `admin-${randomSuffix}`,
        password: isCoSuper ? 'coadmin' : 'admin123',
        name: newAppointment.name,
        nameBn: newAppointment.nameBn,
        email: newAppointment.email,
        phone: newAppointment.phone,
        role: newAppointment.roleId as any,
        division: newAppointment.division,
        district: newAppointment.district,
        cardId: newAppointment.cardId
      },
      session.role,
      session.id
    );

    setIsAppointModalOpen(false);
    setToastMessage(lang === 'bn' 
      ? isCoSuper
        ? `সুপার অ্যাডমিনের সমান নির্বাহী ক্ষমতাসম্পন্ন কো-সুপার অ্যাডমিন "${newAppointment.name}" (আইডি: ${newAppointment.cardId}) সফলভাবে নিযুক্ত করা হয়েছে!`
        : `"${newAppointment.name}" এর জন্য নতুন ${newAppointment.roleBn} পদে নিয়োগ ও আইডি কার্ড (${newAppointment.cardId}) সফলভাবে ইস্যু করা হয়েছে!`
      : isCoSuper
        ? `Equal-Power Co-Super Administrator "${newAppointment.name}" (${newAppointment.cardId}) appointed with nationwide executive authority!`
        : `New appointment successfully issued for "${newAppointment.name}" (${newAppointment.role}) with Card ID ${newAppointment.cardId}!`);
    setTimeout(() => setToastMessage(null), 5500);

    // Reset Form
    setNewAppointForm({
      name: '',
      nameBn: '',
      roleId: 'district_admin',
      division: 'Dhaka',
      district: 'Dhaka',
      specificArea: '',
      phone: '',
      email: '',
      nid: '',
      charterAgreed: true
    });
  };

  // Update Access status (Active / Suspended / Revoked)
  const handleUpdateAccessStatus = (status: 'Active' | 'Suspended' | 'Revoked') => {
    if (!manageAccessModalData) return;
    const updated = appointments.map(adm => 
      adm.id === manageAccessModalData.id ? { ...adm, status } : adm
    );
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lalbindu_subordinate_appointments', JSON.stringify(updated));
    }
    setManageAccessModalData({ ...manageAccessModalData, status });
    setToastMessage(lang === 'bn' 
      ? `প্রশাসক "${manageAccessModalData.name}" এর স্ট্যাটাস "${status === 'Active' ? 'সক্রিয়' : status === 'Suspended' ? 'স্থগিত' : 'প্রত্যাহারকৃত'}" এ পরিবর্তন করা হয়েছে।`
      : `Access status for "${manageAccessModalData.name}" updated to "${status}".`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete / Revoke Appointment completely
  const handleDeleteAppointment = (id: string) => {
    if (!confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এই নিয়োগটি পুরোপুরি প্রত্যাহার করতে চান?' : 'Are you sure you want to revoke this appointment permanently?')) return;
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lalbindu_subordinate_appointments', JSON.stringify(updated));
    }
    setManageAccessModalData(null);
    setToastMessage(lang === 'bn' ? 'নিয়োগ সফলভাবে বাতিল ও কার্ড প্রত্যাহার করা হয়েছে।' : 'Appointment revoked and card record deleted.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Approve pending public registration request (Super Admin Exclusive)
  const handleApproveApplication = (appId: string) => {
    const res = approvePendingApplication(appId, session.role, session.id);
    if (res.success && res.account) {
      setToastMessage(lang === 'bn' 
        ? `আবেদনকারী "${res.account.name}" এর অ্যাকাউন্ট অনুমোদিত হয়েছে! আইডি: ${res.account.cardId}` 
        : `Applicant "${res.account.name}" approved and account created! ID: ${res.account.cardId}`);
      setTimeout(() => setToastMessage(null), 4500);
    } else {
      alert(res.error || 'Failed to approve application.');
    }
  };

  // Create account directly with Super Admin authority
  const handleCreateCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountForm.name.trim() || !newAccountForm.phone.trim()) {
      alert('Please provide full name and mobile number.');
      return;
    }

    const username = newAccountForm.username.trim() || newAccountForm.email.split('@')[0] || `usr-${Date.now().toString(36)}`;
    const pass = newAccountForm.password.trim() || (newAccountForm.role === 'co_super_admin' ? 'coadmin' : 'donor123');

    const res = createAccountByAuthority(
      {
        name: newAccountForm.name,
        nameBn: newAccountForm.nameBn,
        username: username,
        password: pass,
        phone: newAccountForm.phone,
        email: newAccountForm.email || `${username}@lalbindu.bd`,
        role: newAccountForm.role,
        bloodGroup: newAccountForm.bloodGroup,
        division: newAccountForm.division,
        district: newAccountForm.district,
        avatarUrl: newAccountForm.avatarUrl || ''
      },
      session.role,
      session.id
    );

    if (!res.success || !res.account) {
      alert(res.error || 'Failed to create account.');
      return;
    }

    // If administrative, also add to subordinate appointments
    if (newAccountForm.role !== 'donor') {
      const isCoSuper = newAccountForm.role === 'co_super_admin';
      const newAppointment: SubordinateAppointment = {
        id: res.account.id,
        name: res.account.name,
        nameBn: res.account.nameBn,
        roleId: res.account.role,
        role: isCoSuper ? 'Co-Super Administrator (Equal Power)' : 'Division Administrator',
        roleBn: isCoSuper ? 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)' : 'বিভাগীয় প্রশাসক',
        jurisdiction: isCoSuper ? 'National (All Bangladesh)' : `${newAccountForm.division} Division`,
        jurisdictionBn: isCoSuper ? 'জাতীয় (সমগ্র বাংলাদেশ)' : `${newAccountForm.division} বিভাগ`,
        division: newAccountForm.division,
        district: newAccountForm.district,
        phone: res.account.phone,
        email: res.account.email,
        cardId: res.account.cardId,
        color: isCoSuper ? '#580F1A' : '#0D3B66',
        status: 'Active',
        appointedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        validUntil: '31 Dec 2026',
        avatarUrl: res.account.avatarUrl || newAccountForm.avatarUrl || '',
        isEqualSuperAdmin: isCoSuper
      };
      const updated = [newAppointment, ...appointments];
      setAppointments(updated);
      localStorage.setItem('lalbindu_subordinate_appointments', JSON.stringify(updated));
    }

    setIsCreateAccountModalOpen(false);
    setToastMessage(lang === 'bn' 
      ? `অ্যাকাউন্ট "${res.account.name}" (${res.account.role.toUpperCase()}) সফলভাবে তৈরি হয়েছে! আইডি: ${res.account.cardId} | পাসওয়ার্ড: ${pass}` 
      : `Account "${res.account.name}" created! ID: ${res.account.cardId} | Password: ${pass}`);
    setTimeout(() => setToastMessage(null), 5000);

    setNewAccountForm({
      name: '',
      nameBn: '',
      username: '',
      password: '',
      role: 'donor',
      phone: '',
      email: '',
      bloodGroup: 'O+',
      division: 'Dhaka',
      district: 'Dhaka',
      avatarUrl: ''
    });
  };

  // Admin Campaign Handlers
  const handleAdminCreateCampaign = (newCamp: CampaignItem) => {
    const updated = addCampaign(newCamp);
    setCampaigns(updated);
    setToastMessage(lang === 'bn' 
      ? `সুপার অ্যাডমিন অনুমোদিত রক্তদান কর্মসূচি "${newCamp.title_bn || newCamp.title_en}" সফলভাবে প্রকাশিত হয়েছে!` 
      : `Super Admin authorized campaign "${newCamp.title_en}" published successfully!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleAdminDeleteCampaign = (id: string, title: string) => {
    if (!confirm(lang === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" কর্মসূচিটি প্রত্যাহার করতে চান?` : `Are you sure you want to cancel and remove "${title}"?`)) return;
    const updated = deleteCampaign(id);
    setCampaigns(updated);
    setToastMessage(lang === 'bn' ? 'কর্মসূচিটি সফলভাবে প্রত্যাহার করা হয়েছে।' : 'Campaign revoked and removed from portal.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleCampaignPermission = (userId: string, currentAllowed: boolean) => {
    const nextState = !currentAllowed;
    const updated = toggleDelegationPermission(userId, nextState);
    setDelegations(updated);
    const target = updated.find(d => d.userId === userId);
    setToastMessage(lang === 'bn'
      ? `সুপার অ্যাডমিন কর্তৃক "${target?.name}" এর জন্য রক্তদান কর্মসূচি তৈরির অনুমতি ${nextState ? 'অনুমোদন (Granted)' : 'স্থগিত (Revoked)'} করা হয়েছে।`
      : `Super Admin ${nextState ? 'granted' : 'revoked'} campaign creation rights for "${target?.name}".`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AdminAccessGate>
      <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Global Action Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-green font-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Supreme Executive Authority Status Bar */}
        <div className={`p-5 rounded-3xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isSuperAdmin 
            ? 'bg-gradient-to-r from-brand-burgundy via-[#400B13] to-[#200408] text-white border-amber-500/40'
            : 'bg-gradient-to-r from-amber-50 to-emerald-50 text-gray-900 border-amber-300'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
              isSuperAdmin 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              {isSuperAdmin ? <Crown className="w-6 h-6 text-amber-300 animate-pulse" /> : <ShieldCheck className="w-6 h-6 text-emerald-700" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isSuperAdmin ? 'bg-amber-400 text-gray-950 shadow-xs' : 'bg-emerald-200 text-emerald-950'
                }`}>
                  {isSuperAdmin ? 'Highest Platform Authority' : 'Delegated Co-Admin Clearance'}
                </span>
                <span className={`text-[11px] font-mono ${isSuperAdmin ? 'text-amber-200' : 'text-gray-600'}`}>
                  Signed in as: <strong>{session.id || 'superadmin'}</strong>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black mt-1">
                {isSuperAdmin 
                  ? 'National Super Administrator (Master Root Authority)' 
                  : `Co-Administrator (${session.name}) • Delegated Authority`}
              </h2>
              <p className={`text-xs mt-0.5 ${isSuperAdmin ? 'text-amber-100/80' : 'text-gray-600'}`}>
                {isSuperAdmin 
                  ? 'Exclusive Authority: Only Super Admin can create accounts and delegate Co-Admins across Bangladesh.' 
                  : 'Operating under executive delegation from Super Admin (superadmin). Authorized for donor onboarding & clinical verification.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Create Account Button (Super Admin or Delegated Co-Admin) */}
            <button
              onClick={() => setIsCreateAccountModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-brand-burgundy hover:bg-gray-100 text-xs font-black shadow-sm transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4 text-brand-burgundy" />
              <span>{lang === 'bn' ? '+ নতুন অ্যাকাউন্ট তৈরি' : '+ Create Account'}</span>
            </button>

            {/* Delegate Co-Admin Button (SUPER ADMIN EXCLUSIVE) */}
            {isSuperAdmin ? (
              <button
                onClick={() => {
                  setNewAppointForm({
                    ...newAppointForm,
                    roleId: 'co_super_admin'
                  });
                  setIsAppointModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 text-xs font-black shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Crown className="w-4 h-4 text-gray-950" />
                <span>{lang === 'bn' ? '👑 কো-অ্যাডমিন ক্ষমতা অর্পণ' : '👑 Delegate Co-Admin'}</span>
              </button>
            ) : (
              <span
                className="px-3 py-2 rounded-xl bg-gray-200/80 text-gray-400 text-xs font-bold flex items-center space-x-1 cursor-not-allowed"
                title="Only the supreme Super Admin (superadmin) can delegate Co-Admin authority."
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Delegate Co-Admin (Locked)</span>
              </span>
            )}
          </div>
        </div>

        {/* Header with Jurisdiction Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-burgundy mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-burgundy" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.adminDashboard.suiteTag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t.adminDashboard.heading}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {t.adminDashboard.subheading}
            </p>
          </div>

          {/* Jurisdiction Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.adminDashboard.governanceLevel}</label>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value as any)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              >
                <option value="national">{t.adminDashboard.nationalAdmin}</option>
                <option value="division">{t.adminDashboard.divisionAdmin}</option>
                <option value="district">{t.adminDashboard.districtCoordinator}</option>
                <option value="upazila">{t.adminDashboard.upazilaCoordinator}</option>
              </select>
            </div>

            {selectedJurisdiction !== 'national' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.adminDashboard.division}</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.id}>
                      {lang === 'bn' ? d.name_bn : d.name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedJurisdiction === 'district' || selectedJurisdiction === 'upazila') && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{lang === 'bn' ? 'জেলা' : 'District'}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
                >
                  {BANGLADESH_KEY_DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>
                      {lang === 'bn' ? d.name_bn : d.name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: t.adminDashboard.tabOverview },
            { id: 'verifications', label: `${t.adminDashboard.tabVerifications} (${pendingVerifications.length})` },
            { id: 'admins', label: t.adminDashboard.tabAdmins },
            { id: 'campaigns', label: lang === 'bn' ? `রক্তদান কর্মসূচি (${campaigns.length})` : `Campaigns (${campaigns.length})` },
            { id: 'notifications', label: lang === 'bn' ? `বিজ্ঞপ্তি ও অ্যালার্ট (${notificationsList.length})` : `Alerts & Broadcasts (${notificationsList.length})` },
            { id: 'id-cards', label: lang === 'bn' ? 'প্রশাসনিক আইডি কার্ড টেমপ্লেট' : 'Administrative ID Card Templates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-burgundy text-brand-burgundy font-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: JURISDICTION OVERVIEW
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: t.adminDashboard.registeredDonors, value: '1,420', change: '+12% this week', icon: Users, color: 'text-brand-green' },
                { label: t.adminDashboard.casesPending, value: pendingVerifications.length.toString(), change: 'Requires Hospital Signoff', icon: Clock, color: 'text-brand-orange' },
                { label: t.adminDashboard.activeEmergencies, value: '412', change: 'Across 64 Districts', icon: Droplet, color: 'text-brand-red' },
                { label: lang === 'bn' ? 'নিবন্ধিত ব্লাড ব্যাংক' : 'Registered Blood Banks', value: '68', change: 'Verified Facilities', icon: Building2, color: 'text-brand-burgundy' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">{stat.label}</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nationwide Regional Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {lang === 'bn' ? 'বাংলাদেশ ৮ বিভাগীয় রক্তদান ও প্রশাসনিক অবস্থা' : 'Bangladesh 8 Divisions Operational Status'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' ? 'সকল বিভাগ এবং ৬৪ জেলায় সমন্বয়ক নিয়োগ এবং রক্তের চাহিদা কভারেজ' : 'Coordinator appointments and blood demand coverage across divisions.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Dhaka (ঢাকা)', donors: 540, admins: 12, hospitals: 28, status: 'Optimal' },
                  { name: 'Chattogram (চট্টগ্রাম)', donors: 310, admins: 8, hospitals: 14, status: 'Optimal' },
                  { name: 'Rajshahi (রাজশাহী)', donors: 185, admins: 6, hospitals: 8, status: 'Active' },
                  { name: 'Khulna (খুলনা)', donors: 140, admins: 5, hospitals: 7, status: 'Active' },
                  { name: 'Barishal (বরিশাল)', donors: 90, admins: 4, hospitals: 4, status: 'Review Needed' },
                  { name: 'Sylhet (সিলেট)', donors: 110, admins: 4, hospitals: 5, status: 'Active' },
                  { name: 'Rangpur (রংপুর)', donors: 95, admins: 3, hospitals: 4, status: 'Active' },
                  { name: 'Mymensingh (ময়মনসিংহ)', donors: 80, admins: 3, hospitals: 3, status: 'Active' }
                ].map((div, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-[#FCFDFE] hover:border-brand-red/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-black text-gray-900">{div.name}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        div.status === 'Optimal' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {div.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-gray-600">
                      <div className="flex justify-between">
                        <span>Active Donors:</span>
                        <span className="font-bold text-gray-900">{div.donors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinators:</span>
                        <span className="font-bold text-gray-900">{div.admins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verified Hospitals:</span>
                        <span className="font-bold text-gray-900">{div.hospitals}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: DONATION VERIFICATION QUEUE
           ========================================================================= */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">{t.adminDashboard.tabVerifications}</h2>
              <p className="text-xs text-gray-500">
                {lang === 'bn' 
                  ? 'হাসপাতাল বা ভেরিফিকেশন অফিসারের স্বাক্ষরযুক্ত রক্তদানের প্রমাণাদি যাচাই করুন।' 
                  : 'Verify hospital-authorized blood donation proof logs to unlock milestones and donor availability cooldowns.'}
              </p>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">
                  {lang === 'bn' ? 'সব রক্তদান যাচাই সম্পন্ন হয়েছে!' : 'All pending verifications processed!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">{t.adminDashboard.colDonor}</th>
                      <th className="p-3">{t.adminDashboard.colBloodGroup}</th>
                      <th className="p-3">{t.adminDashboard.colHospital}</th>
                      <th className="p-3">{t.adminDashboard.colDate}</th>
                      <th className="p-3">{t.adminDashboard.colBag}</th>
                      <th className="p-3 text-right">{t.adminDashboard.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingVerifications.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{item.donorName}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{item.donorId}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-bold px-2 py-0.5 rounded bg-brand-light text-brand-red">
                            {item.bloodGroup}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-gray-700">{item.hospitalName}</td>
                        <td className="p-3 text-gray-600">{item.donationDate}</td>
                        <td className="p-3 font-mono text-gray-500">{item.bagNumber}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1.5 bg-brand-green text-white font-bold rounded-lg hover:bg-emerald-700 transition-all inline-flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.adminDashboard.approveBtn}</span>
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all inline-flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t.adminDashboard.rejectBtn}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SUBORDINATE ADMINISTRATOR APPOINTMENTS
           ========================================================================= */}
        {activeTab === 'admins' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
            
            {/* If NOT National Super Admin, display Executive Restriction Warning */}
            {selectedJurisdiction !== 'national' && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
                <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="font-black uppercase tracking-wider text-[10px] bg-amber-200 px-2 py-0.5 rounded-full text-amber-900 mr-2">
                    {lang === 'bn' ? 'আঞ্চলিক সীমাবদ্ধতা' : 'Executive Restriction'}
                  </span>
                  <span className="font-semibold">
                    {lang === 'bn' 
                      ? 'সমন্বয়ক ও প্রশাসক নিয়োগ শুধুমাত্র ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটরের জন্য উন্মুক্ত। আঞ্চলিক প্রশাসকদের (Division/District/Thana) নতুন অ্যাকাউন্ট তৈরি বা ক্ষমতা অর্পণের অনুমতি নেই।' 
                      : 'Coordinator and administrator appointments are strictly reserved for National Super Administrators. Regional administrative levels hold operational oversight only.'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">{t.adminDashboard.tabAdmins}</h2>
                <p className="text-xs text-gray-500">
                  {lang === 'bn' 
                    ? 'সুপার অ্যাডমিনের অধীনে অর্পিত কো-অ্যাডমিন, আঞ্চলিক সমন্বয়ক ও নিবন্ধিত অ্যাকাউন্ট পরিচালনা।'
                    : 'Manage delegated Co-Admins, regional officers, and system accounts provisioned by the Super Admin.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* Create Account Button */}
                <button
                  onClick={() => setIsCreateAccountModalOpen(true)}
                  className="px-3.5 py-2 bg-white border border-brand-burgundy/30 hover:bg-brand-light text-brand-burgundy font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '+ অ্যাকাউন্ট তৈরি' : '+ Create Account'}</span>
                </button>

                {selectedJurisdiction === 'national' ? (
                  <button
                    onClick={() => {
                      setNewAppointForm({
                        ...newAppointForm,
                        roleId: 'co_super_admin'
                      });
                      setIsAppointModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>{lang === 'bn' ? '👑 কো-অ্যাডমিন অর্পণ' : '👑 Delegate Co-Admin'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(lang === 'bn' 
                        ? 'প্রবেশাধিকার সীমাবদ্ধ: শুধুমাত্র ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর পোর্টাল থেকে নতুন সমন্বয়ক বা প্রশাসনিক অ্যাকাউন্ট তৈরি করা সম্ভব।' 
                        : 'Access Restricted: Only National Super Administrators possess the executive authority to appoint coordinators or create administrative accounts.');
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-xs rounded-xl border border-gray-300 transition-all flex items-center space-x-1.5 cursor-not-allowed"
                    title="Super Admin Only"
                  >
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lang === 'bn' ? 'ক্ষমতা অর্পণ (লকড)' : 'Delegate (Locked)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex border-b border-gray-100 space-x-3 text-xs font-bold pt-1">
              <button
                onClick={() => setAccountSubTab('appointments')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  accountSubTab === 'appointments'
                    ? 'border-brand-burgundy text-brand-burgundy font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অর্পিত কো-অ্যাডমিন ও প্রতিনিধি' : 'Delegated Co-Admins & Officers'} ({appointments.length})</span>
              </button>

              <button
                onClick={() => setAccountSubTab('roster')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  accountSubTab === 'roster'
                    ? 'border-brand-burgundy text-brand-burgundy font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'নিবন্ধিত অ্যাকাউন্ট তালিকা' : 'Registered Accounts Roster'} ({accountsList.length})</span>
              </button>

              <button
                onClick={() => setAccountSubTab('pending')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  accountSubTab === 'pending'
                    ? 'border-brand-burgundy text-brand-burgundy font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'পাবলিক আবেদন কিউ' : 'Public Applications Queue'}</span>
                {pendingApps.filter(p => p.status === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-red text-white text-[10px] font-bold">
                    {pendingApps.filter(p => p.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {/* Sub-view 1: Delegated Co-Admins & Appointments Grid */}
            {accountSubTab === 'appointments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((adm) => (
                <div key={adm.id} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50 hover:bg-white hover:border-brand-burgundy/30 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    {/* Equal Super Admin Badge */}
                    {(adm.isEqualSuperAdmin || adm.roleId === 'co_super_admin') && (
                      <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider mb-2.5">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lang === 'bn' ? 'সমান ক্ষমতা (Equal Super Admin)' : 'Equal Super Admin Authority'}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white shadow-xs" style={{ backgroundColor: adm.color }}>
                        {lang === 'bn' ? adm.roleBn : adm.role}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adm.status === 'Active' 
                          ? 'bg-green-100 text-brand-green' 
                          : adm.status === 'Suspended' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {adm.status === 'Active' ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : adm.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-gray-900">{adm.name}</h4>
                    <p className="text-xs text-gray-700 mt-1">
                      {lang === 'bn' ? 'অধিক্ষেত্র:' : 'Jurisdiction:'} <strong>{lang === 'bn' ? adm.jurisdictionBn : adm.jurisdiction}</strong>
                    </p>
                    <p className="text-[10px] font-mono text-gray-400 mt-1 flex items-center space-x-1">
                      <CreditCard className="w-3 h-3 inline mr-1 text-gray-400" />
                      <span>{adm.cardId}</span>
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setViewCardModalData(adm)}
                      className="text-xs font-bold text-brand-burgundy hover:underline flex items-center space-x-1"
                    >
                      <span>{t.adminDashboard.viewIdCard}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {selectedJurisdiction === 'national' ? (
                      <button
                        onClick={() => setManageAccessModalData(adm)}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-all"
                      >
                        {t.adminDashboard.manageAccess}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-gray-400 italic">
                        {lang === 'bn' ? 'কেবল পরিদর্শন' : 'View Only'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Sub-view 2: Registered Accounts Roster */}
            {accountSubTab === 'roster' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {lang === 'bn' 
                        ? 'সুপার অ্যাডমিনের সর্বোচ্চ কর্তৃত্বাধীন অ্যাকাউন্ট ডেটাবেস। শুধুমাত্র অনুমোদিত ব্যবহারকারীরা লগইন করতে পারেন।' 
                        : 'Official account roster governed under Super Admin authority. Only verified credentials can authenticate.'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCreateAccountModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-brand-burgundy text-white font-bold text-xs shadow-xs hover:bg-[#400B13] shrink-0"
                  >
                    + {lang === 'bn' ? 'অ্যাকাউন্ট তৈরি' : 'Create Account'}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3">{lang === 'bn' ? 'নাম ও প্রোফাইল' : 'Account & Name'}</th>
                        <th className="p-3">{lang === 'bn' ? 'পদমর্যাদা ও ক্ষমতা' : 'Role & Authority'}</th>
                        <th className="p-3">{lang === 'bn' ? 'লগইন আইডি / ব্যবহারকারী' : 'Login ID / Username'}</th>
                        <th className="p-3">{lang === 'bn' ? 'পাসওয়ার্ড' : 'Credentials'}</th>
                        <th className="p-3">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="p-3 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {accountsList.map((acc) => (
                        <tr key={acc.id} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-brand-light text-brand-burgundy font-black flex items-center justify-center text-xs shrink-0">
                                {acc.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 flex items-center">
                                  {acc.name}
                                  {acc.isSuperAdmin && (
                                    <Crown className="w-3.5 h-3.5 text-amber-500 ml-1 inline" />
                                  )}
                                </p>
                                <p className="text-[10px] text-gray-400">{acc.phone} • {acc.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              acc.authorityLevel === 'highest'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : acc.authorityLevel === 'co_admin'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {acc.authorityLevel === 'highest' ? '👑 Highest Authority' : acc.authorityLevel === 'co_admin' ? '🛡️ Delegated Co-Admin' : '🩸 Verified Donor'}
                            </span>
                            {acc.delegatedBy && (
                              <p className="text-[9px] text-gray-400 mt-0.5">By {acc.delegatedBy}</p>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-gray-800">
                            {acc.username || acc.id}
                          </td>
                          <td className="p-3 font-mono text-gray-600 bg-gray-50/60 rounded px-2">
                            {acc.password}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              acc.status === 'Active' ? 'bg-green-100 text-brand-green' : 'bg-red-100 text-red-700'
                            }`}>
                              {acc.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {acc.id !== 'superadmin' ? (
                              <button
                                onClick={() => {
                                  const nextStatus = acc.status === 'Active' ? 'Suspended' : 'Active';
                                  updateAccountAuthorityStatus(acc.id, nextStatus, session.role, session.id);
                                  setToastMessage(`Account status changed to ${nextStatus}.`);
                                  setTimeout(() => setToastMessage(null), 3000);
                                }}
                                className="text-[11px] font-semibold text-gray-600 hover:text-brand-burgundy underline"
                              >
                                {acc.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-bold">Master Root</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view 3: Pending Public Applications Queue */}
            {accountSubTab === 'pending' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {lang === 'bn' 
                        ? 'পাবলিক রেজিস্ট্রেশন আবেদন কিউ — লালবিন্দু চার্টার অনুযায়ী কেবল সুপার অ্যাডমিন কর্তৃক অনুমোদিত হলেই অ্যাকাউন্ট সক্রিয় হবে।' 
                        : 'Public Registration Clearance Queue — Under the LalBindu Charter, accounts activate only upon Super Admin approval.'}
                    </span>
                  </div>
                </div>

                {pendingApps.filter(p => p.status === 'pending').length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
                    <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm">
                      {lang === 'bn' ? 'কোনো অনিষ্পন্ন পাবলিক আবেদন নেই।' : 'No pending public registration applications.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-3">{lang === 'bn' ? 'আবেদনকারী' : 'Applicant'}</th>
                          <th className="p-3">{lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}</th>
                          <th className="p-3">{lang === 'bn' ? 'অবস্থান' : 'Location'}</th>
                          <th className="p-3">{lang === 'bn' ? 'আবেদনের সময়' : 'Applied At'}</th>
                          <th className="p-3 text-right">{lang === 'bn' ? 'সুপার অ্যাডমিন অ্যাকশন' : 'Super Admin Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {pendingApps.filter(p => p.status === 'pending').map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50/50">
                            <td className="p-3">
                              <p className="font-bold text-gray-900">{app.fullName}</p>
                              <p className="text-[10px] text-gray-400">{app.phone} • {app.email || 'No email'}</p>
                            </td>
                            <td className="p-3">
                              <span className="font-black px-2 py-0.5 rounded bg-brand-light text-brand-red">
                                {app.bloodGroup}
                              </span>
                            </td>
                            <td className="p-3 text-gray-700 font-medium">
                              {app.districtId}, {app.divisionId}
                            </td>
                            <td className="p-3 text-gray-500 font-mono text-[11px]">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleApproveApplication(app.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-brand-burgundy hover:bg-[#400B13] text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 ml-auto"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{lang === 'bn' ? 'অনুমোদন ও অ্যাকাউন্ট তৈরি' : 'Approve & Create Account'}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: ADMINISTRATIVE ID CARD TEMPLATES & TEMPLATE DESIGNER STUDIO
           ========================================================================= */}
        {activeTab === 'id-cards' && (
          <div className="space-y-6">
            
            {/* Template Studio Launcher Banner */}
            <div className="bg-gradient-to-r from-[#580F1A] via-brand-red to-brand-crimson text-white rounded-3xl p-6 sm:p-8 card-shadow relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                  Super Admin Exclusive System
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {lang === 'bn' ? 'আইডি কার্ড টেমপ্লেট ডিজাইনার স্টুডিও' : 'ID Card Template Designer Studio'}
                </h2>
                <p className="text-xs text-white/90 leading-relaxed">
                  {lang === 'bn'
                    ? 'প্রতিটি প্রশাসনিক পদ এবং রক্তদাতা ভূমিকার জন্য রিয়েল-টাইমে অনুভূমিক সিআর৮০ পরিচয়পত্র (CR80 ID Card) কাস্টমাইজ করুন, প্রিভিউ দেখুন এবং কোড পরিবর্তন ছাড়াই সংস্করণ প্রকাশ করুন।'
                    : 'Design, customize, preview in dual side-by-side view, and publish live CR80 identity cards across all roles with dynamic vector landmarks.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/admin/id-cards"
                    className="px-5 py-2.5 rounded-xl bg-white text-brand-burgundy font-black text-xs shadow-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'টেমপ্লেট ডিজাইনার খুলুন' : 'Open Template Designer Studio'}</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/id-cards"
                    className="px-4 py-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? '৮-রোল মাস্টার বোর্ড' : 'All 8 Roles Master Board'}</span>
                  </Link>
                </div>
              </div>

              {/* Live Rendered CR80 Card with Flip Toggle */}
              <div className="shrink-0 flex justify-center z-10">
                <CR80IDCard
                  roleId="super_admin"
                  fullName="Md. Rahman Hossain"
                  fullNameBn="মো. রহমান হোসেন"
                  designation="Super Administrator"
                  designationBn="প্রধান প্রশাসক"
                  uniqueId="LA0010001"
                  avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  organizationName="LalBindu Foundation"
                  validUntil="31 Dec 2026"
                  verificationToken="LA0010001"
                  verificationUrl="https://lalbindu.bd/verify/LA0010001"
                  layoutMode="single"
                  interactiveFlip={true}
                  showActions={true}
                  isDemo={true}
                />
              </div>
            </div>

            {/* All Roles Color Theme Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {t.adminDashboard.templatesTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t.adminDashboard.templatesSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(roleCardThemes).map(([roleKey, theme]) => (
                  <div
                    key={roleKey}
                    className="rounded-2xl p-5 border text-white shadow-md flex flex-col justify-between"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                          {roleKey.replace('_', ' ')}
                        </span>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                      </div>

                      <h4 className="text-base font-black">
                        {lang === 'bn' ? theme.labelBn : theme.labelEn}
                      </h4>
                      <p className="text-xs font-bold text-white/80">
                        {lang === 'bn' ? theme.labelEn : theme.labelBn}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/70">
                      <span>Hex: {theme.primaryColor}</span>
                      <Link
                        href={`/dashboard/admin/id-cards`}
                        className="font-bold text-white hover:underline flex items-center space-x-0.5"
                      >
                        <span>{lang === 'bn' ? 'ডিজাইন কাস্টমাইজ' : 'Customize'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: NATIONWIDE COMMUNITY BLOOD DONATION CAMPAIGNS
           ========================================================================= */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            
            {/* Header & Quick Action Banner */}
            <div className="bg-gradient-to-r from-brand-burgundy via-brand-red to-brand-crimson text-white rounded-3xl p-6 sm:p-8 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
                  Super Admin Exclusive • Portal Authority
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {lang === 'bn' ? 'দেশব্যাপী রক্তদান কর্মসূচি ও প্রশাসনিক নিয়ন্ত্রণ' : 'Nationwide Blood Campaigns & Authorizations'}
                </h2>
                <p className="text-xs text-white/90 leading-relaxed">
                  {lang === 'bn'
                    ? 'সুপার অ্যাডমিনের প্রত্যক্ষ অনুমোদনে নতুন রক্তদান ক্যাম্প প্রকাশ করুন এবং নির্বাচিত আঞ্চলিক সমন্বয়কদের ক্যাম্পেইন তৈরির অনুমতি প্রদান বা প্রত্যাহার করুন।'
                    : 'Authorize and deploy public blood donation campaigns across Bangladesh, and delegate campaign creation permissions to subordinate coordinators.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsCreateCampaignModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-white text-brand-burgundy font-black text-xs shadow-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{lang === 'bn' ? 'নতুন কর্মসূচি তৈরি করুন' : 'Create Blood Donation Campaign'}</span>
                  </button>
                  <Link
                    href="/campaigns"
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all flex items-center space-x-2"
                  >
                    <span>{lang === 'bn' ? 'পাবলিক বোর্ড দেখুন' : 'View Public Campaigns Board'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: lang === 'bn' ? 'সক্রিয় কর্মসূচি' : 'Active Campaigns', value: campaigns.length.toString(), icon: Calendar, color: 'text-brand-burgundy' },
                { label: lang === 'bn' ? 'মোট লক্ষ্যমাত্রা স্লট' : 'Total Slot Capacity', value: campaigns.reduce((acc, c) => acc + c.slotsAvailable, 0).toLocaleString(), icon: Users, color: 'text-brand-green' },
                { label: lang === 'bn' ? 'নিবন্ধিত দাতা সংখ্যা' : 'Registered Donors', value: campaigns.reduce((acc, c) => acc + c.registeredCount, 0).toLocaleString(), icon: Droplet, color: 'text-brand-red' },
                { label: lang === 'bn' ? 'অনুমোদিত সমন্বয়ক' : 'Super Admin Delegated Admins', value: delegations.filter(d => d.canCreateCampaigns).length.toString(), icon: ShieldCheck, color: 'text-amber-600' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-3xl p-5 card-shadow border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <h4 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h4>
                    </div>
                    <div className={`p-3.5 rounded-2xl bg-gray-50 ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Super Admin Delegation Console ("and those that he allow") */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-amber-200/80 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold uppercase mb-1 border border-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Super Admin Access Delegation Engine</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900">
                    {lang === 'bn' ? 'সমন্বয়ক পর্যায়ে কর্মসূচি তৈরির অনুমতি অর্পণ' : 'Coordinator Campaign Creation Delegation Console'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' 
                      ? 'সুপার অ্যাডমিন হিসেবে আপনি নির্দিষ্ট বিভাগীয় বা জেলা সমন্বয়ককে কর্মসূচি তৈরির অনুমতি প্রদান বা প্রত্যাহার করতে পারবেন।' 
                      : 'As Super Administrator, grant or revoke campaign publishing clearance to regional coordinators and staff.'}
                  </p>
                </div>
              </div>

              {/* Delegations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {delegations.map((d) => (
                  <div 
                    key={d.userId}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{d.name}</h4>
                        <p className="text-xs text-brand-burgundy font-semibold">{d.role}</p>
                        <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {d.jurisdiction}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        d.canCreateCampaigns 
                          ? 'bg-emerald-100 text-brand-green border border-emerald-200' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {d.canCreateCampaigns 
                          ? (lang === 'bn' ? 'অনুমোদিত' : 'Authorized') 
                          : (lang === 'bn' ? 'অনুমতিহীন' : 'Restricted')}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {d.authorizedBy}
                      </span>
                      <button
                        onClick={() => handleToggleCampaignPermission(d.userId, d.canCreateCampaigns)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                          d.canCreateCampaigns
                            ? 'bg-red-50 hover:bg-red-100 text-brand-red border border-red-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {d.canCreateCampaigns ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'অনুমতি প্রত্যাহার' : 'Revoke Rights'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'অনুমতি প্রদান করুন' : 'Grant Rights'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nationwide Campaigns List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {lang === 'bn' ? 'প্রকাশিত ও সক্রিয় কর্মসূচি তালিকা' : 'Active Public Blood Drives Registry'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' ? 'সমগ্র বাংলাদেশে চলমান ও আসন্ন অনুমোদিত কর্মসূচি তালিকা' : 'Nationwide ongoing and upcoming approved donation drives'}
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateCampaignModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-burgundy text-white text-xs font-bold shadow-md hover:bg-[#400B13] flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নতুন কর্মসূচি যোগ করুন' : 'Add Campaign'}</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-brand-red">
                          {camp.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-gray-500 flex items-center">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {camp.division} • {camp.district}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900">
                        {lang === 'bn' ? camp.title_bn : camp.title_en}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {camp.organizer} • <span className="text-gray-500">{camp.venue}</span>
                      </p>
                      <div className="flex items-center space-x-4 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {camp.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {camp.time}
                        </span>
                        <span className="text-brand-burgundy font-semibold">
                          By: {camp.approvedBy}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Slots meter */}
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">
                          {camp.registeredCount} / {camp.slotsAvailable}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {lang === 'bn' ? 'নিবন্ধিত দাতা' : 'Donors Registered'}
                        </p>
                        <div className="w-24 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-brand-green h-full rounded-full" 
                            style={{ width: `${Math.min(100, (camp.registeredCount / camp.slotsAvailable) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleAdminDeleteCampaign(camp.id, camp.title_en)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: NATIONWIDE ALERTS & BROADCAST CONSOLE (ADMIN ONLY)
           ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Control Bar */}
            <div className="bg-gradient-to-r from-red-900 via-brand-burgundy to-[#400B13] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span>{lang === 'bn' ? 'প্রশাসনিক কেন্দ্রীয় ব্রডকাস্ট ইঞ্জিন' : 'Central Administrative Broadcast Engine'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {lang === 'bn' ? 'জরুরি রক্তের চাহিদা ও জাতীয় বিজ্ঞপ্তি সম্প্রচার কনসোল' : 'Nationwide Emergency Alert & Notification Broadcast Console'}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
                    {lang === 'bn' 
                      ? 'শুধুমাত্র সুপার অ্যাডমিন ও অনুমোদিত সমন্বয়কদের মাধ্যমে সমগ্র বাংলাদেশে বা নির্দিষ্ট রক্তের গ্রুপ ও বিভাগে সরাসরি লাইভ নোটিফিকেশন অ্যালার্ট প্রেরণ করুন।' 
                      : 'Dispatch live, real-time emergency blood alerts, campaign announcements, and administrative broadcasts directly to donors across all 8 divisions of Bangladesh.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateNotifModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white text-brand-burgundy hover:bg-gray-100 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{lang === 'bn' ? '+ নতুন বিজ্ঞপ্তি সম্প্রচার করুন' : '+ Dispatch New Alert / Notification'}</span>
                </button>
              </div>

              {/* Background ambient pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 card-shadow flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{lang === 'bn' ? 'মোট সম্প্রচার' : 'Total Broadcasts'}</p>
                  <h4 className="text-2xl font-black text-gray-900 mt-1">{notificationsList.length}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{lang === 'bn' ? 'সিস্টেম স্টোরেজে সংরক্ষিত' : 'Persisted in Live Registry'}</p>
                </div>
                <div className="p-3 bg-red-50 text-brand-red rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 card-shadow flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{lang === 'bn' ? 'সংকটাপন্ন জরুরি আবেদন' : 'Critical Emergencies'}</p>
                  <h4 className="text-2xl font-black text-red-600 mt-1">
                    {notificationsList.filter(n => n.type === 'emergency' || n.priority === 'urgent').length}
                  </h4>
                  <p className="text-[10px] text-red-400 mt-0.5">{lang === 'bn' ? 'উচ্চ অগ্রাধিকার অ্যালার্ট' : 'High Urgency Level'}</p>
                </div>
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <Droplet className="w-5 h-5 fill-red-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 card-shadow flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{lang === 'bn' ? 'ক্যাম্পেইন ও কর্মসূচি' : 'Campaign Alerts'}</p>
                  <h4 className="text-2xl font-black text-purple-600 mt-1">
                    {notificationsList.filter(n => n.type === 'campaign').length}
                  </h4>
                  <p className="text-[10px] text-purple-400 mt-0.5">{lang === 'bn' ? 'রক্তদান ইভেন্ট প্রচার' : 'Donation Drives'}</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 card-shadow flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{lang === 'bn' ? 'টার্গেটেড ব্রডকাস্ট' : 'Targeted Broadcasts'}</p>
                  <h4 className="text-2xl font-black text-brand-green mt-1">
                    {notificationsList.filter(n => n.targetGroup && n.targetGroup !== 'all').length}
                  </h4>
                  <p className="text-[10px] text-emerald-500 mt-0.5">{lang === 'bn' ? 'নির্দিষ্ট গ্রুপ / অঞ্চলভিত্তিক' : 'Specific Group / Division'}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-brand-green rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Broadcast History Table / List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {lang === 'bn' ? 'সম্প্রচারিত বিজ্ঞপ্তির তালিকা ও ব্যবস্থাপনা' : 'Dispatched Notifications & Broadcast Registry'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' 
                      ? 'এখান থেকে সকল সম্প্রচারিত বিজ্ঞপ্তির বিবরণ দেখুন, অবস্থা ট্র্যাক করুন অথবা প্রয়োজনে অপসারন করুন।' 
                      : 'Monitor all live alerts currently visible to donors, inspect targeting rules, and delete inactive broadcasts.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-500">
                    {lang === 'bn' ? `মোট ${notificationsList.length}টি সক্রিয়` : `${notificationsList.length} Active`}
                  </span>
                </div>
              </div>

              {notificationsList.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-700">
                    {lang === 'bn' ? 'কোনো সক্রিয় বিজ্ঞপ্তি পাওয়া যায়নি' : 'No active notifications found'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {lang === 'bn' 
                      ? 'নতুন বিজ্ঞপ্তি সম্প্রচার করতে উপরের "+ নতুন বিজ্ঞপ্তি সম্প্রচার করুন" বাটনে ক্লিক করুন।' 
                      : 'Click "+ Dispatch New Alert / Notification" above to send an emergency alert.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notificationsList.map((item) => (
                    <div 
                      key={item.id} 
                      className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-gray-50/50 p-3 rounded-2xl transition-colors"
                    >
                      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'emergency' 
                            ? 'bg-red-100 text-brand-red' 
                            : item.type === 'achievement'
                            ? 'bg-amber-100 text-amber-600'
                            : item.type === 'verification'
                            ? 'bg-green-100 text-brand-green'
                            : item.type === 'campaign'
                            ? 'bg-purple-100 text-purple-600'
                            : item.type === 'system'
                            ? 'bg-rose-100 text-brand-burgundy'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'emergency' && <Droplet className="w-5 h-5 fill-brand-red" />}
                          {item.type === 'achievement' && <Award className="w-5 h-5" />}
                          {item.type === 'verification' && <ShieldCheck className="w-5 h-5" />}
                          {item.type === 'id_card' && <CreditCard className="w-5 h-5" />}
                          {item.type === 'campaign' && <Calendar className="w-5 h-5 text-purple-600" />}
                          {item.type === 'system' && <Megaphone className="w-5 h-5 text-brand-burgundy" />}
                        </div>

                        {/* Content */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.priority === 'urgent'
                                ? 'bg-red-100 text-brand-red border border-red-200'
                                : item.priority === 'high'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.priority === 'urgent' 
                                ? (lang === 'bn' ? 'সংকটাপন্ন জরুরি' : 'Critical / Urgent')
                                : item.priority === 'high'
                                ? (lang === 'bn' ? 'উচ্চ অগ্রাধিকার' : 'High Priority')
                                : (lang === 'bn' ? 'সাধারণ' : 'Normal')}
                            </span>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {lang === 'bn' ? 'টার্গেট: ' : 'Target: '}
                              {item.targetGroup === 'specific_blood_group'
                                ? `${item.targetValue} Donors`
                                : item.targetGroup === 'division'
                                ? `${item.targetValue} Division`
                                : item.targetGroup === 'admins_only'
                                ? 'Admins Only'
                                : (lang === 'bn' ? 'সকল দাতা ও ভিজিটর' : 'All Donors & Viewers')}
                            </span>

                            <span className="text-[10px] text-gray-400">
                              {lang === 'bn' ? item.timeBn : item.timeEn}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-gray-900 leading-tight">
                            {lang === 'bn' ? item.titleBn : item.titleEn}
                          </h4>

                          <p className="text-xs text-gray-600 leading-relaxed">
                            {lang === 'bn' ? item.messageBn : item.messageEn}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-400">
                            {item.sender && (
                              <span className="font-semibold text-brand-burgundy">
                                {lang === 'bn' ? 'প্রেরক: ' : 'Sender: '}{item.sender}
                              </span>
                            )}
                            {item.link && (
                              <Link 
                                href={item.link} 
                                className="text-brand-red hover:underline inline-flex items-center space-x-1"
                              >
                                <span>{lang === 'bn' ? 'অ্যাকশন লিংক' : 'Action Link'}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => {
                            const updated = deleteNotification(item.id);
                            setNotificationsList(updated);
                            setToastMessage(lang === 'bn' ? 'বিজ্ঞপ্তি অপসারণ করা হয়েছে।' : 'Notification deleted.');
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title={lang === 'bn' ? 'বিজ্ঞপ্তি মুছুন' : 'Delete Notification'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL 0: CREATE ACCOUNT / PROVISION USER (SUPER ADMIN AUTHORITY)
         ========================================================================= */}
      {isCreateAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 card-shadow border border-gray-100 relative my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-brand-burgundy font-black">
                  <UserPlus className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-burgundy text-white">
                      Super Admin Authority
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mt-0.5">
                    {lang === 'bn' ? 'নতুন অ্যাকাউন্ট অনুমোদন ও তৈরি' : 'Create & Provision Account'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' 
                      ? 'সুপার অ্যাডমিনের সর্বোচ্চ কর্তৃত্ববলে নতুন রক্তদাতা বা কো-অ্যাডমিন অ্যাকাউন্ট তৈরি করুন।' 
                      : 'Provision verified donor or administrative accounts with official credentials under Super Admin authority.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateAccountModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAccount} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'অ্যাকাউন্টের ধরন ও ক্ষমতা' : 'Account Type & Authority Level'} *
                </label>
                <select
                  value={newAccountForm.role}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, role: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-bold text-brand-burgundy"
                >
                  <option value="donor">🩸 Voluntary Blood Donor (যাচাইকৃত রক্তদাতা)</option>
                  {isSuperAdmin && (
                    <option value="co_super_admin">👑 Co-Super Administrator (কো-সুপার অ্যাডমিন — অর্পিত ক্ষমতা)</option>
                  )}
                  <option value="division_admin">🛡️ Division Administrator (বিভাগীয় প্রশাসক)</option>
                </select>
                {newAccountForm.role === 'co_super_admin' && (
                  <p className="text-[11px] text-amber-800 mt-1 font-medium">
                    This delegates executive authority as a Co-Admin to verify donors, dispatch alerts, and oversee platform tasks.
                  </p>
                )}
              </div>

              {/* ID Card Photograph Upload */}
              <div className="bg-amber-50/40 border border-dashed border-amber-300 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-800 text-xs">
                    {lang === 'bn' ? 'আইডি কার্ডের ছবি (ছবি নির্বাচন করুন)' : 'ID Card Photograph (Add Image for ID)'}
                  </label>
                  {newAccountForm.avatarUrl ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-300">
                      ✓ Photo Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-gray-500">
                      Optional
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {newAccountForm.avatarUrl ? (
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden border-2 border-brand-burgundy shadow-sm shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={newAccountForm.avatarUrl} 
                        alt="ID Photo Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-16 rounded-xl bg-gray-100 border border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                      <Camera className="w-5 h-5 text-gray-400" />
                      <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase">No Photo</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => accountPhotoRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-brand-burgundy border border-brand-burgundy/40 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newAccountForm.avatarUrl ? (lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change ID Photo') : (lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload ID Photo')}</span>
                    </button>

                    {newAccountForm.avatarUrl ? (
                      <button
                        type="button"
                        onClick={() => setNewAccountForm(prev => ({ ...prev, avatarUrl: '' }))}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'ছবি মুছুন' : 'Remove Photo'}</span>
                      </button>
                    ) : (
                      <p className="text-[10px] text-gray-500 leading-tight">
                        {lang === 'bn' 
                          ? 'পাসপোর্ট সাইজ বা স্পষ্ট পোট্রেট ছবি আপলোড করুন। ছবি না দিলে কোনো অচেনা ছবি যোগ হবে না।' 
                          : 'Upload an authentic portrait photo. If omitted, no random picture is assigned.'}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  ref={accountPhotoRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAccountPhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanzim Ahmed"
                    value={newAccountForm.name}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name (Bangla)</label>
                  <input
                    type="text"
                    placeholder="উদাঃ তানজিম আহমেদ"
                    value={newAccountForm.nameBn}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, nameBn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Login Username / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tanzim.donor"
                    value={newAccountForm.username}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, username: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    placeholder={newAccountForm.role === 'co_super_admin' ? 'coadmin' : 'donor123'}
                    value={newAccountForm.password}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, password: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile (+880) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={newAccountForm.phone}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Group *</label>
                  <select
                    value={newAccountForm.bloodGroup}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-bold text-brand-red"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Division *</label>
                  <select
                    value={newAccountForm.division}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, division: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                  >
                    {BANGLADESH_DIVISIONS.map(d => (
                      <option key={d.id} value={d.name_en}>{d.name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Bogura"
                    value={newAccountForm.district}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17] text-white text-xs font-black shadow-md flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create & Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: APPOINT NEW COORDINATOR / NOMINATION WORKFLOW
         ========================================================================= */}
      {isAppointModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 card-shadow border border-gray-100 relative my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-brand-burgundy font-black">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-burgundy text-white">
                      Super Admin Authority Only
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mt-0.5">
                    {lang === 'bn' ? 'সমন্বয়ক ও কো-সুপার অ্যাডমিন নিয়োগ পোর্টাল' : 'Nominate Coordinator / Equal Co-Super Admin'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {lang === 'bn' ? 'শুধুমাত্র জাতীয় সুপার অ্যাডমিনের ক্ষমতায় নতুন সমন্বয়ক নিয়োগ বা সমপর্যায়ের কো-সুপার অ্যাডমিন তৈরি করুন।' : 'Executive authority to appoint regional coordinators or create equal-power Super Admin accounts.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAppointModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              
              {/* Role Selection & Equal Power Highlighting */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'প্রশাসনিক পদবি ও ক্ষমতার স্তর (Administrative Level)' : 'Administrative Role & Power Level'} <span className="text-brand-red">*</span>
                </label>
                <select
                  value={newAppointForm.roleId}
                  onChange={(e) => setNewAppointForm({ ...newAppointForm, roleId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-bold"
                >
                  <option value="co_super_admin">
                    👑 কো-সুপার অ্যাডমিনিস্ট্রেটর (Co-Super Administrator — সমান নির্বাহী ক্ষমতাসম্পন্ন / Equal Super Admin Power)
                  </option>
                  <option value="division_admin">বিভাগীয় প্রশাসক (Division Administrator)</option>
                  <option value="district_admin">জেলা প্রশাসক ও সমন্বয়ক (District Administrator)</option>
                  <option value="upazila_admin">উপজেলা প্রশাসক (Upazila Administrator)</option>
                  <option value="thana_admin">মেট্রোপলিটন থানা প্রশাসক (Thana Administrator)</option>
                  <option value="union_admin">ইউনিয়ন প্রশাসক (Union Administrator)</option>
                  <option value="hospital_admin">হাসপাতাল অ্যাডমিনিস্ট্রেটর (Hospital Administrator)</option>
                  <option value="campaign_manager">জাতীয় ক্যাম্পেইন ম্যানেজার (Campaign Manager)</option>
                </select>
              </div>

              {/* Special Banner for Equal Super Admin Creation */}
              {newAppointForm.roleId === 'co_super_admin' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-red-50 border border-amber-300 text-xs text-amber-950 flex items-start space-x-2.5 animate-in fade-in duration-150">
                  <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-amber-900">
                      {lang === 'bn' ? 'সমান নির্বাহী ক্ষমতা অর্পণ (Equal Super Admin Authority)' : 'Delegating Equal Super Admin Authority for Efficiency'}
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      {lang === 'bn' 
                        ? 'এই অ্যাকাউন্টের মাধ্যমে আপনি আপনার সমান নির্বাহী ক্ষমতাসম্পন্ন একজন জাতীয় কো-সুপার অ্যাডমিন তৈরি করছেন। তিনি সমগ্র বাংলাদেশের সমন্বয়ক নিয়োগ, রক্তদান কর্মসূচি পরিচালনা, আইডি কার্ড অনুমোদন ও সিস্টেম নিয়ন্ত্রণ পরিচালনা করতে পারবেন।' 
                        : 'This creates a Co-Super Administrator with identical executive powers as your primary Super Admin account — enabling them to appoint coordinators, manage nationwide campaigns, customize card templates, and oversee system governance for maximum efficiency.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Full Name (EN & BN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম (ইংরেজি)' : 'Full Name (English)'} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Nusrat Jahan"
                    value={newAppointForm.name}
                    onChange={(e) => setNewAppointForm({ ...newAppointForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম (বাংলা)' : 'Full Name (Bangla)'}
                  </label>
                  <input
                    type="text"
                    placeholder="উদাঃ ড. নুসরাত জাহান"
                    value={newAppointForm.nameBn}
                    onChange={(e) => setNewAppointForm({ ...newAppointForm, nameBn: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-burgundy/20 font-medium"
                  />
                </div>
              </div>

              {/* Jurisdiction Division & District */}
              {newAppointForm.roleId === 'co_super_admin' ? (
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                  <p className="font-bold text-gray-900">
                    {lang === 'bn' ? 'দায়িত্বপ্রাপ্ত অধিক্ষেত্র: জাতীয় (সমগ্র বাংলাদেশ)' : 'Assigned Jurisdiction: National (All Bangladesh)'}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {lang === 'bn' 
                      ? 'কো-সুপার অ্যাডমিনিস্ট্রেটর কার্ড স্বয়ংক্রিয়ভাবে LA001 সিরিজের জাতীয় পরিচয়পত্র ও স্মৃতিসৌধ ওয়াটারমার্ক ধারণ করবে।' 
                      : 'Co-Super Administrator ID cards are automatically issued under the LA001 National Series with the National Smriti Soudho insignia.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'দায়িত্বপ্রাপ্ত বিভাগ' : 'Assigned Division'} <span className="text-brand-red">*</span>
                      </label>
                      <select
                        value={newAppointForm.division}
                        onChange={(e) => setNewAppointForm({ ...newAppointForm, division: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-medium"
                      >
                        <option value="Dhaka">Dhaka (ঢাকা)</option>
                        <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                        <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                        <option value="Khulna">Khulna (খুলনা)</option>
                        <option value="Barishal">Barishal (বরিশাল)</option>
                        <option value="Sylhet">Sylhet (সিলেট)</option>
                        <option value="Rangpur">Rangpur (রংপুর)</option>
                        <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'bn' ? 'দায়িত্বপ্রাপ্ত জেলা / জিলা' : 'Assigned District'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dhaka, Gazipur, Chattogram"
                        value={newAppointForm.district}
                        onChange={(e) => setNewAppointForm({ ...newAppointForm, district: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'bn' ? 'নির্দিষ্ট এলাকা / থানা / উপজেলা' : 'Specific Area / Thana / Upazila'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan Thana, Savar Upazila"
                      value={newAppointForm.specificArea}
                      onChange={(e) => setNewAppointForm({ ...newAppointForm, specificArea: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-medium"
                    />
                  </div>
                </>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Official Phone Number'} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17XX-XXXXXX"
                    value={newAppointForm.phone}
                    onChange={(e) => setNewAppointForm({ ...newAppointForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'bn' ? 'অফিশিয়াল ইমেইল' : 'Official Email Address'}
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. coordinator@lalbindu.bd"
                    value={newAppointForm.email}
                    onChange={(e) => setNewAppointForm({ ...newAppointForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  id="charterAgreed"
                  checked={newAppointForm.charterAgreed}
                  onChange={(e) => setNewAppointForm({ ...newAppointForm, charterAgreed: e.target.checked })}
                  className="rounded text-brand-burgundy mt-0.5"
                />
                <label htmlFor="charterAgreed" className="text-[11px] text-gray-600 cursor-pointer">
                  {lang === 'bn' 
                    ? 'আমি নিশ্চিত করছি যে এই মনোনয়ন লালবিন্দু জাতীয় সংবিধান এবং স্বাস্থ্যসেবা সমন্বয় নীতিমালা অনুযায়ী যাচাইপূর্বক অনুমোদন করা হলো।' 
                    : 'I certify that this administrative nomination is authorized under the LalBindu National Healthcare Charter.'}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAppointModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-burgundy hover:bg-[#400B13] text-white text-xs font-black shadow-md flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'নিয়োগ নিশ্চিত করুন ও কার্ড ইস্যু করুন' : 'Confirm & Issue ID Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: VIEW APPOINTED COORDINATOR ID CARD (Dual CR80 Presentation)
         ========================================================================= */}
      {viewCardModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFF8F8] rounded-3xl max-w-4xl w-full p-6 sm:p-8 card-shadow border border-gray-200 relative my-auto max-h-[95vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-brand-light text-brand-burgundy text-[11px] font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-burgundy" />
                  <span>{lang === 'bn' ? 'অনুমোদিত প্রশাসনিক পরিচয়পত্র' : 'Authorized Administrative Digital ID Card'}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  {viewCardModalData.name} ({viewCardModalData.role})
                </h3>
                <p className="text-xs text-gray-500">
                  {viewCardModalData.jurisdiction} • {viewCardModalData.cardId}
                </p>
              </div>

              <button
                onClick={() => setViewCardModalData(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Dual Side-by-Side CR80 Card */}
            <div className="py-4 flex justify-center">
              <CR80IDCard
                roleId={viewCardModalData.roleId}
                fullName={viewCardModalData.name}
                fullNameBn={viewCardModalData.nameBn}
                designation={lang === 'bn' ? viewCardModalData.roleBn : viewCardModalData.role}
                uniqueId={viewCardModalData.cardId}
                avatarUrl={viewCardModalData.avatarUrl}
                jurisdictionName={lang === 'bn' ? viewCardModalData.jurisdictionBn : viewCardModalData.jurisdiction}
                validUntil={viewCardModalData.validUntil}
                verificationToken={viewCardModalData.cardId}
                layoutMode="side-by-side"
                showActions={true}
                isDemo={false}
              />
            </div>

            {/* Appointment Record Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Appointed: <strong>{viewCardModalData.appointedDate}</strong></span>
                <span>Status: <strong className="text-brand-green">{viewCardModalData.status}</strong></span>
                <span>Phone: <strong>{viewCardModalData.phone}</strong></span>
              </div>

              <button
                onClick={() => setViewCardModalData(null)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: MANAGE ACCESS & STATUS WORKFLOW
         ========================================================================= */}
      {manageAccessModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 card-shadow border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-brand-burgundy" />
                <h3 className="text-base font-black text-gray-900">
                  {lang === 'bn' ? 'প্রশাসনিক প্রবেশাধিকার ও অনুমোদন' : 'Manage Access & Permissions'}
                </h3>
              </div>
              <button
                onClick={() => setManageAccessModalData(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-900">{manageAccessModalData.name}</p>
                <p className="text-[11px] text-gray-500">{manageAccessModalData.role} • {manageAccessModalData.jurisdiction}</p>
                <p className="text-[10px] font-mono text-gray-400 mt-1">{manageAccessModalData.cardId}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  {lang === 'bn' ? 'অনুমোদনের বর্তমান অবস্থা' : 'Authorization Status'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateAccessStatus('Active')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      manageAccessModalData.status === 'Active'
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white hover:bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    Active (সক্রিয়)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateAccessStatus('Suspended')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      manageAccessModalData.status === 'Suspended'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    Suspend (স্থগিত)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateAccessStatus('Revoked')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      manageAccessModalData.status === 'Revoked'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white hover:bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    Revoke (বাতিল)
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewCardModalData(manageAccessModalData);
                    setManageAccessModalData(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-light hover:bg-red-100 text-brand-burgundy text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ডিজিটাল আইডি কার্ড পর্যালোচনা' : 'Inspect Digital ID Card'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteAppointment(manageAccessModalData.id)}
                  className="w-full py-2 px-4 rounded-xl bg-white hover:bg-red-50 text-red-600 text-xs font-bold border border-red-200 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নিয়োগ সম্পূর্ণ প্রত্যাহার করুন' : 'Permanently Revoke Appointment'}</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 text-right">
              <button
                onClick={() => setManageAccessModalData(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: SUPER ADMIN CREATE CAMPAIGN MODAL
         ========================================================================= */}
      <CreateCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setIsCreateCampaignModalOpen(false)}
        onCreated={handleAdminCreateCampaign}
        approverName="Md. Rahman Hossain (LA0010001)"
        approverRole="Super Administrator"
      />

      {/* =========================================================================
          MODAL 5: DISPATCH NOTIFICATION & ALERT MODAL (ADMIN ONLY)
         ========================================================================= */}
      <CreateNotificationModal
        isOpen={isCreateNotifModalOpen}
        onClose={() => setIsCreateNotifModalOpen(false)}
        onDispatched={() => {
          setNotificationsList(getStoredNotifications());
          setToastMessage(lang === 'bn' 
            ? 'বিজ্ঞপ্তি সফলভাবে সমগ্র নেটওয়ার্কে সম্প্রচারিত হয়েছে!' 
            : 'Alert successfully broadcasted across the nationwide network!');
          setTimeout(() => setToastMessage(null), 3000);
        }}
        adminName="Md. Rahman Hossain (LA0010001)"
        adminRole="Super Administrator"
      />

      </div>
    </AdminAccessGate>
  );
}
