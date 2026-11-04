'use client';

import React, { useState, useEffect } from 'react';
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
  Crown
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
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'admins' | 'id-cards' | 'campaigns'>('overview');

  // Campaigns & Super Admin Delegations state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [delegations, setDelegations] = useState<CampaignDelegation[]>([]);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
    setDelegations(getCampaignDelegations());
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
                    ? 'প্রত্যেক অনুমোদিত প্রতিনিধি একটি স্বতন্ত্র লালবিন্দু প্রশাসনিক ডিজিটাল আইডি কার্ড ধারণ করেন।'
                    : 'Every appointed representative holds an individual LalBindu Administrative Digital ID Card.'}
                </p>
              </div>

              {selectedJurisdiction === 'national' ? (
                <button
                  onClick={() => setIsAppointModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'bn' ? '+ নতুন সমন্বয়ক / কো-সুপার অ্যাডমিন নিয়োগ' : '+ Appoint Coordinator / Co-Super Admin'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert(lang === 'bn' 
                      ? 'প্রবেশাধিকার সীমাবদ্ধ: শুধুমাত্র ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর পোর্টাল থেকে নতুন সমন্বয়ক বা প্রশাসনিক অ্যাকাউন্ট তৈরি করা সম্ভব।' 
                      : 'Access Restricted: Only National Super Administrators possess the executive authority to appoint coordinators or create administrative accounts.');
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-xs rounded-xl border border-gray-300 transition-all flex items-center space-x-1.5 cursor-not-allowed self-start sm:self-auto"
                  title="Super Admin Only"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lang === 'bn' ? 'সমন্বয়ক নিয়োগ (সুপার অ্যাডমিন নিয়ন্ত্রিত)' : 'Appoint Coordinator (Super Admin Only)'}</span>
                </button>
              )}
            </div>

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

      </div>

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

      </div>
    </AdminAccessGate>
  );
}
