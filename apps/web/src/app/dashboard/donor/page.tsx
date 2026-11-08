'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { 
  SAMPLE_DONORS, 
  SAMPLE_BLOOD_REQUESTS 
} from '@lalbindu/api-client';
import { 
  DEFAULT_ACHIEVEMENTS, 
  calculateNextEligibleDate, 
  evaluateAvailabilityStatus 
} from '@lalbindu/business-rules';
import { AvailabilityStatus } from '@lalbindu/shared-types';
import { getCurrentSession } from '@/lib/session';
import { 
  Droplet, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Download, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Heart,
  Settings,
  UserCheck,
  Phone,
  MessageCircle,
  XCircle,
  Trash2,
  Camera,
  Upload,
  User,
  Plus,
  X,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { 
  getDonorHistory, 
  submitDonationVerification, 
  DonationHistoryRecord 
} from '@/lib/verifications';
import { compressImageFile } from '@/lib/imageUtils';
import {
  getStoredCampaigns,
  getRegisteredCampaignIds,
  registerCampaignDonor,
  unregisterCampaignDonor,
  CampaignItem
} from '@/lib/campaigns';

interface IncomingContactRequest {
  id: string;
  donorId?: string;
  donorIdNumber?: string;
  donorName?: string;
  donorBloodGroup?: string;
  hospitalName: string;
  requesterMobile: string;
  urgencyNote: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const INITIAL_DONOR_CONTACT_REQUESTS: IncomingContactRequest[] = [
  {
    id: 'cnt-init-01',
    donorId: 'usr-001',
    donorIdNumber: 'LB-0004278',
    donorName: 'Ahmed Rahman',
    donorBloodGroup: 'O+',
    hospitalName: 'National Institute of Cardiovascular Diseases (NICVD)',
    requesterMobile: '+8801712998877',
    urgencyNote: 'Urgent open-heart coronary bypass surgery at ICU-3. Immediate 1 unit O+ donor required tonight.',
    status: 'pending',
    createdAt: '2026-11-03T11:45:00+06:00'
  }
];

function toBengaliNumber(val: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

function getDonorTierInfo(count: number) {
  if (count >= 10) {
    return {
      rankEn: 'Rank 4',
      rankBn: 'র‌্যাঙ্ক ৪',
      titleEn: 'Platinum Lifesaver',
      titleBn: 'প্লাটিনাম লাইফসেভার',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    };
  }
  if (count >= 5) {
    return {
      rankEn: 'Rank 3',
      rankBn: 'র‌্যাঙ্ক ৩',
      titleEn: 'Gold Lifesaver',
      titleBn: 'গোল্ড লাইফসেভার',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    };
  }
  if (count >= 3) {
    return {
      rankEn: 'Rank 2',
      rankBn: 'র‌্যাঙ্ক ২',
      titleEn: 'Silver Lifesaver',
      titleBn: 'সিলভার লাইফসেভার',
      color: 'text-brand-green',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    };
  }
  if (count >= 1) {
    return {
      rankEn: 'Rank 1',
      rankBn: 'র‌্যাঙ্ক ১',
      titleEn: 'Bronze Lifesaver',
      titleBn: 'ব্রোঞ্জ লাইফসেভার',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    };
  }
  return {
    rankEn: 'New Donor',
    rankBn: 'নতুন রক্তদাতা',
    titleEn: 'Registered Member',
    titleBn: 'নিবন্ধিত সদস্য',
    color: 'text-brand-red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  };
}

export default function DonorDashboardPage() {
  const { t, lang } = useLanguage();
  const [donor, setDonor] = useState({
    ...SAMPLE_DONORS[0],
    fullNameBn: 'আহমেদ রহমান',
    avatar_url: ''
  });
  const [originUrl, setOriginUrl] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [incomingRequests, setIncomingRequests] = useState<IncomingContactRequest[]>([]);
  const donorPhotoInputRef = useRef<HTMLInputElement>(null);

  // Registered campaigns state
  const [registeredCampaigns, setRegisteredCampaigns] = useState<CampaignItem[]>([]);
  const [allUpcomingCampaigns, setAllUpcomingCampaigns] = useState<CampaignItem[]>([]);
  const [campaignToast, setCampaignToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const loadDonorCampaigns = () => {
    try {
      let donorId = donor.donor_id_number;
      try {
        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw);
          donorId = parsed.donor_id_number || parsed.cardId || donor.donor_id_number;
        }
      } catch {}

      const allCamp = getStoredCampaigns();
      setAllUpcomingCampaigns(allCamp);

      const regIds = getRegisteredCampaignIds(donorId);
      if (regIds.length > 0) {
        const matched = allCamp.filter(c => regIds.includes(c.id));
        setRegisteredCampaigns(matched);
      } else {
        setRegisteredCampaigns([]);
      }
    } catch {
      setRegisteredCampaigns([]);
    }
  };

  const handleJoinCampaign = (campaignId: string, campaignTitle: string) => {
    let donorId = donor.donor_id_number;
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        donorId = parsed.donor_id_number || parsed.cardId || donor.donor_id_number;
      }
    } catch {}

    registerCampaignDonor(campaignId, donorId);
    loadDonorCampaigns();
    setCampaignToast({
      message: lang === 'bn' 
        ? `"${campaignTitle}" রক্তদান কর্মসূচিতে আপনার নিবন্ধন নিশ্চিত হয়েছে! ক্যাম্পের ২৪ ঘণ্টা পূর্বে এসএমএস পাঠানো হবে।`
        : `You have successfully registered for "${campaignTitle}"! An SMS alert will arrive 24 hours prior.`,
      type: 'success'
    });
    setTimeout(() => setCampaignToast(null), 5000);
  };

  const handleCancelCampaign = (campaignId: string, campaignTitle: string) => {
    if (!confirm(lang === 'bn' 
      ? `আপনি কি নিশ্চিত যে "${campaignTitle}" রক্তদান কর্মসূচির নিবন্ধন বাতিল করতে চান?` 
      : `Are you sure you want to cancel your registration for "${campaignTitle}"?`)) {
      return;
    }

    let donorId = donor.donor_id_number;
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        donorId = parsed.donor_id_number || parsed.cardId || donor.donor_id_number;
      }
    } catch {}

    unregisterCampaignDonor(campaignId, donorId);
    loadDonorCampaigns();
    setCampaignToast({
      message: lang === 'bn' 
        ? `"${campaignTitle}" কর্মসূচির নিবন্ধন প্রত্যাহার করা হয়েছে।`
        : `Registration for "${campaignTitle}" has been cancelled.`,
      type: 'info'
    });
    setTimeout(() => setCampaignToast(null), 4000);
  };

  const handleUploadDonorPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল (.jpg, .png, .webp) নির্বাচন করুন।' : 'Please select a valid image file (.jpg, .png, .webp).');
      return;
    }
    try {
      const dataUrl = await compressImageFile(file, 400, 500, 0.8);
      setDonor(prev => ({ ...prev, avatar_url: dataUrl }));

      try {
        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
        const activeProfile = activeRaw ? JSON.parse(activeRaw) : {};
        activeProfile.avatar_url = dataUrl;
        localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(activeProfile));

        const accountsRaw = localStorage.getItem('lalbindu_registered_accounts_v1');
        if (accountsRaw) {
          const accounts = JSON.parse(accountsRaw);
          const idx = accounts.findIndex((a: any) => a.id === donor.id || a.cardId === donor.donor_id_number);
          if (idx >= 0) {
            accounts[idx].avatarUrl = dataUrl;
            localStorage.setItem('lalbindu_registered_accounts_v1', JSON.stringify(accounts));
          }
        }

        window.dispatchEvent(new Event('lalbindu_session_changed'));
        alert(lang === 'bn' ? 'আইডি কার্ডের ছবি সফলভাবে যুক্ত হয়েছে!' : 'ID Card Photograph updated successfully!');
      } catch (err) {
        console.warn('Storage warning during photo upload:', err);
      }
    } catch (err) {
      console.warn('Photo processing warning:', err);
    }
  };

  // Donation proof submission & history state
  const [historyRecords, setHistoryRecords] = useState<DonationHistoryRecord[]>([]);
  const [isSubmitRecordModalOpen, setIsSubmitRecordModalOpen] = useState(false);
  const [submitRecordForm, setSubmitRecordForm] = useState({
    hospitalName: '',
    donationDate: new Date().toISOString().split('T')[0],
    units: 1,
    bagNumber: '',
    notes: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate custom donor profile from registration / login session
  const loadDonorProfile = () => {
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed && (parsed.full_name || parsed.name)) {
          const donorIdNum = parsed.donor_id_number || parsed.cardId || 'LB-0004278';
          const verifiedCount = typeof parsed.verified_donation_count === 'number' 
            ? parsed.verified_donation_count 
            : (donorIdNum === 'LB-0004278' ? 5 : 0);
          const lastDate = verifiedCount > 0 
            ? (parsed.last_donation_date || (donorIdNum === 'LB-0004278' ? '2026-08-10' : null)) 
            : null;

          setDonor(prev => ({
            ...prev,
            ...parsed,
            full_name: parsed.full_name || parsed.name,
            fullNameBn: parsed.fullNameBn || parsed.nameBn || parsed.full_name || parsed.name,
            donor_id_number: donorIdNum,
            blood_group: parsed.blood_group || parsed.bloodGroup || prev.blood_group,
            district_name_en: parsed.district_name_en || parsed.district || prev.district_name_en,
            division_name_en: parsed.division_name_en || parsed.division || prev.division_name_en,
            avatar_url: (() => {
              let uAvatar = typeof parsed.avatar_url === 'string' ? parsed.avatar_url : (typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : '');
              if (donorIdNum !== 'LB-0004278' && uAvatar && (uAvatar.includes('photo-1507003211169') || uAvatar.includes('photo-1535713875002'))) {
                return '';
              }
              return uAvatar;
            })(),
            verified_donation_count: verifiedCount,
            last_donation_date: lastDate
          }));
          if (parsed.availability_status) {
            setAvailabilityStatus(parsed.availability_status);
          }
          return;
        }
      }

      const session = getCurrentSession();
      if (session && session.role === 'donor' && session.name) {
        const donorIdNum = session.donorId || (session as any).cardId || 'LB-0004278';
        const verifiedCount = typeof (session as any).verified_donation_count === 'number' 
          ? (session as any).verified_donation_count 
          : (donorIdNum === 'LB-0004278' ? 5 : 0);
        const lastDate = verifiedCount > 0 
          ? ((session as any).last_donation_date || (donorIdNum === 'LB-0004278' ? '2026-08-10' : null)) 
          : null;

        setDonor(prev => ({
          ...prev,
          full_name: session.name,
          fullNameBn: session.name,
          donor_id_number: donorIdNum,
          blood_group: (session.bloodGroup as any) || prev.blood_group,
          avatar_url: (() => {
          let sAvatar = session.avatarUrl || '';
          if (donorIdNum !== 'LB-0004278' && sAvatar && (sAvatar.includes('photo-1507003211169') || sAvatar.includes('photo-1535713875002'))) {
            return '';
          }
          return sAvatar;
        })(),
          verified_donation_count: verifiedCount,
          last_donation_date: lastDate
        }));
      }
    } catch (e) {
      console.error('Error hydrating donor data:', e);
    }
    loadDonorCampaigns();
  };

  const refreshHistoryAndProfile = () => {
    loadDonorProfile();
    loadDonorCampaigns();
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        const dId = parsed.donor_id_number || parsed.cardId || donor.donor_id_number;
        setHistoryRecords(getDonorHistory(dId, parsed.full_name || parsed.name || donor.full_name));
      } else {
        setHistoryRecords(getDonorHistory(donor.donor_id_number, donor.full_name));
      }
    } catch {
      setHistoryRecords(getDonorHistory(donor.donor_id_number, donor.full_name));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
    loadDonorProfile();
    loadDonorCampaigns();

    window.addEventListener('lalbindu_session_changed', refreshHistoryAndProfile);
    window.addEventListener('lalbindu_verification_updated', refreshHistoryAndProfile);
    window.addEventListener('lalbindu_donation_history_updated', refreshHistoryAndProfile);
    window.addEventListener('storage', refreshHistoryAndProfile);
    window.addEventListener('storage', loadDonorCampaigns);
    window.addEventListener('lalbindu_campaigns_updated', loadDonorCampaigns);

    return () => {
      window.removeEventListener('lalbindu_session_changed', refreshHistoryAndProfile);
      window.removeEventListener('lalbindu_verification_updated', refreshHistoryAndProfile);
      window.removeEventListener('lalbindu_donation_history_updated', refreshHistoryAndProfile);
      window.removeEventListener('storage', refreshHistoryAndProfile);
      window.removeEventListener('storage', loadDonorCampaigns);
      window.removeEventListener('lalbindu_campaigns_updated', loadDonorCampaigns);
    };
  }, []);

  // Update history whenever donor identity changes
  useEffect(() => {
    if (donor.donor_id_number) {
      const updatedHistory = getDonorHistory(donor.donor_id_number, donor.full_name);
      setHistoryRecords(updatedHistory);
      loadDonorCampaigns();
    }
  }, [donor.donor_id_number, donor.full_name]);

  // Load incoming contact requests from localStorage and sync across tabs
  const loadRequests = () => {
    try {
      let currentDonorId = donor.donor_id_number;
      try {
        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw);
          if (parsed.donor_id_number || parsed.cardId) {
            currentDonorId = parsed.donor_id_number || parsed.cardId;
          }
        }
      } catch {}

      const saved = localStorage.getItem('lalbindu_donor_contact_requests');
      let allReqs: IncomingContactRequest[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((p: any) => p.id));
          const base = INITIAL_DONOR_CONTACT_REQUESTS.filter(r => !customIds.has(r.id));
          allReqs = [...parsed, ...base];
        } else {
          allReqs = INITIAL_DONOR_CONTACT_REQUESTS;
        }
      } else {
        allReqs = INITIAL_DONOR_CONTACT_REQUESTS;
      }

      // Filter: only show requests designated for this donor ID
      const filtered = allReqs.filter(r => {
        if (!r.donorIdNumber) return false;
        if (currentDonorId && r.donorIdNumber.toLowerCase() === currentDonorId.toLowerCase()) return true;
        if ((!currentDonorId || currentDonorId === 'LB-0004278') && r.donorIdNumber === 'LB-0004278') return true;
        return false;
      });

      setIncomingRequests(filtered);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('lalbindu:contact-request-updated', loadRequests);
    window.addEventListener('storage', loadRequests);
    return () => {
      window.removeEventListener('lalbindu:contact-request-updated', loadRequests);
      window.removeEventListener('storage', loadRequests);
    };
  }, [donor.donor_id_number]);

  const handleAcceptRequest = (id: string) => {
    const updated = incomingRequests.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r);
    setIncomingRequests(updated);
    try {
      localStorage.setItem('lalbindu_donor_contact_requests', JSON.stringify(updated));
    } catch (e) {}
    alert(lang === 'bn' ? 'রক্তদানে সম্মতি প্রদান করা হয়েছে! রোগীর প্রতিনিধির সাথে যোগাযোগ করুন।' : 'Donation accepted! Please contact the patient representative.');
  };

  const handleDeclineRequest = (id: string) => {
    const updated = incomingRequests.map(r => r.id === id ? { ...r, status: 'declined' as const } : r);
    setIncomingRequests(updated);
    try {
      localStorage.setItem('lalbindu_donor_contact_requests', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteRequest = (id: string) => {
    const updated = incomingRequests.filter(r => r.id !== id);
    setIncomingRequests(updated);
    try {
      localStorage.setItem('lalbindu_donor_contact_requests', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSubmitDonationRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitRecordForm.hospitalName.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে হাসপাতালের নাম লিখুন।' : 'Please enter hospital name.');
      return;
    }
    const randBag = submitRecordForm.bagNumber.trim() || `BAG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    submitDonationVerification({
      donorId: donor.donor_id_number || 'LB-0004278',
      donorName: donor.full_name || 'Ahmed Rahman',
      bloodGroup: donor.blood_group || 'O+',
      hospitalName: submitRecordForm.hospitalName.trim(),
      donationDate: submitRecordForm.donationDate,
      units: Number(submitRecordForm.units) || 1,
      bagNumber: randBag
    });

    setIsSubmitRecordModalOpen(false);
    setSubmitRecordForm({
      hospitalName: '',
      donationDate: new Date().toISOString().split('T')[0],
      units: 1,
      bagNumber: '',
      notes: ''
    });

    setToastMessage(lang === 'bn' 
      ? 'রক্তদানের তথ্য সফলভাবে দাখিল করা হয়েছে! প্রশাসনিক ও হাসপাতাল যাচাইয়ের পর আপনার প্রোফাইলে যুক্ত হবে।' 
      : 'Donation proof submitted successfully! It has been routed to the pending verification queue for Super Admin review.');
    setTimeout(() => setToastMessage(null), 5000);

    const updated = getDonorHistory(donor.donor_id_number || '', donor.full_name);
    setHistoryRecords(updated);
  };

  // 3-calendar-month calculation & dynamic donor metrics
  const hasDonated = (donor.verified_donation_count || 0) > 0 && !!(donor as any).last_donation_date;
  const lastDonationDate = hasDonated ? (donor as any).last_donation_date : null;
  const nextEligibleDate = lastDonationDate ? calculateNextEligibleDate(lastDonationDate, 3) : null;
  const isResting = typeof window !== 'undefined' && nextEligibleDate ? (new Date().toISOString().split('T')[0] < nextEligibleDate) : false;
  const verifiedCount = donor.verified_donation_count || 0;
  const tierInfo = getDonorTierInfo(verifiedCount);

  const tokenCleanId = (donor.donor_id_number || 'LB-0004278').replace(/[^a-zA-Z0-9]/g, '');
  const verificationToken = `LB-TOKEN-DNR-${tokenCleanId}`;
  const verificationUrl = originUrl 
    ? `${originUrl}/verify/${verificationToken}` 
    : `https://lalbindu.bd/verify/${verificationToken}`;

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#171717',
        light: '#FFFFFF'
      }
    }).then(setQrCodeDataUrl).catch(console.error);
  }, [verificationUrl]);

  const toggleAvailability = (newStatus: AvailabilityStatus) => {
    setAvailabilityStatus(newStatus);
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        parsed.availability_status = newStatus;
        localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(parsed));
      }
      window.dispatchEvent(new Event('lalbindu_donors_updated'));
    } catch {}
  };

  const getStatusLabel = (status: AvailabilityStatus) => {
    if (status === 'available') return t.donorDashboard.availableStatus;
    if (status === 'temporarily_unavailable') return t.donorDashboard.temporarilyUnavailableStatus;
    return t.donorDashboard.pausedStatus;
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        
        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-brand-light border-2 border-brand-red/30 shrink-0 group">
              {donor.avatar_url ? (
                donor.avatar_url.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={donor.avatar_url}
                    alt={donor.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={donor.avatar_url}
                    alt={donor.full_name}
                    fill
                    className="object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-brand-red">
                  <User className="w-9 h-9 opacity-60" />
                  <span className="text-[8px] font-bold mt-0.5 uppercase tracking-wider text-gray-500">No Photo</span>
                </div>
              )}
              {/* Overlay edit button */}
              <button
                type="button"
                onClick={() => donorPhotoInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Upload or Change ID Photo"
              >
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[8px] font-bold mt-0.5">Edit Photo</span>
              </button>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{donor.full_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-brand-green text-[10px] font-extrabold uppercase flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> {t.donorDashboard.verifiedDonor}
                </span>
              </div>
              <p className="text-xs text-brand-red font-mono font-bold mt-0.5">
                {t.donorDashboard.donorIdLabel} {donor.donor_id_number}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'bn' 
                  ? `${donor.district_name_en} জেলা, ${donor.division_name_en} বিভাগ` 
                  : `${donor.district_name_en} District, ${donor.division_name_en} Division`}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => donorPhotoInputRef.current?.click()}
                  className="text-[11px] font-bold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>{donor.avatar_url ? (lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change ID Photo') : (lang === 'bn' ? 'কার্ডের ছবি যুক্ত করুন' : 'Add Image for ID')}</span>
                </button>
                {donor.avatar_url && (
                  <button
                    type="button"
                    onClick={() => {
                      setDonor(prev => ({ ...prev, avatar_url: '' }));
                      try {
                        const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
                        const activeProfile = activeRaw ? JSON.parse(activeRaw) : {};
                        activeProfile.avatar_url = '';
                        activeProfile.avatarUrl = '';
                        localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(activeProfile));

                        const accountsRaw = localStorage.getItem('lalbindu_registered_accounts_v1');
                        if (accountsRaw) {
                          const accounts = JSON.parse(accountsRaw);
                          const idx = accounts.findIndex((a: any) => a.id === donor.id || a.cardId === donor.donor_id_number);
                          if (idx >= 0) {
                            accounts[idx].avatarUrl = '';
                            localStorage.setItem('lalbindu_registered_accounts_v1', JSON.stringify(accounts));
                          }
                        }
                        window.dispatchEvent(new Event('lalbindu_session_changed'));
                      } catch (e) {}
                    }}
                    className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    • {lang === 'bn' ? 'ছবি মুছুন' : 'Remove Photo'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <div className="text-center px-4 py-2 bg-brand-light rounded-2xl border border-brand-red/20">
              <span className="block text-xl font-black text-brand-red">{donor.blood_group}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t.donorDashboard.bloodGroup}</span>
            </div>

            <div className="text-center px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="block text-xl font-black text-gray-900">
                {lang === 'bn' ? toBengaliNumber(verifiedCount) : verifiedCount}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t.donorDashboard.verifiedDonations}</span>
            </div>

            <div className={`text-center px-4 py-2 ${tierInfo.bgColor} rounded-2xl border ${tierInfo.borderColor}`}>
              <span className={`block text-xl font-black ${tierInfo.color}`}>
                {lang === 'bn' ? tierInfo.rankBn : tierInfo.rankEn}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {lang === 'bn' ? tierInfo.titleBn : t.donorDashboard.tier}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            INCOMING EMERGENCY DIRECT CONTACT REQUESTS (From /find-donor)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center space-x-2 text-brand-red">
                <AlertCircle className="w-4 h-4 fill-brand-red text-white" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'bn' ? 'সরাসরি রক্তের আবেদন ও যোগাযোগের অনুরোধ' : 'Direct Patient Blood & Contact Requests'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-red text-[10px] font-black">
                  {incomingRequests.filter(r => r.status === 'pending').length} {lang === 'bn' ? 'টি অপেক্ষমাণ' : 'Pending'}
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1">
                {lang === 'bn' ? 'আপনার কাছে প্রেরিত জরুরি রক্তের চাহিদাসমূহ' : 'Incoming Patient Contact Requests'}
              </h2>
            </div>

            <p className="text-xs text-gray-500 max-w-sm">
              {lang === 'bn' 
                ? 'রোগী বা হাসপাতালের প্রতিনিধিবৃন্দ আপনার প্রোফাইল খুঁজে সরাসরি এই রক্তদানের অনুরোধ পাঠিয়েছেন।' 
                : 'Patients or hospital coordinators who searched for your blood group and sent contact requests directly to you.'}
            </p>
          </div>

          <div className="divide-y divide-gray-100 pt-2">
            {incomingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                {lang === 'bn' ? 'বর্তমানে কোনো সরাসরি রক্তের আবেদন নেই।' : 'No direct contact requests at this moment.'}
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light border border-brand-red/20 flex flex-col items-center justify-center text-brand-red shrink-0 mt-0.5">
                      <Droplet className="w-4 h-4 fill-brand-red" />
                      <span className="text-[11px] font-black leading-none mt-0.5">{req.donorBloodGroup || 'O+'}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-gray-900">{req.hospitalName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'accepted' 
                            ? 'bg-green-100 text-brand-green' 
                            : req.status === 'declined'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-red-100 text-brand-red'
                        }`}>
                          {req.status === 'accepted' ? (lang === 'bn' ? 'সম্মতি জানানো হয়েছে' : 'Accepted') :
                           req.status === 'declined' ? (lang === 'bn' ? 'বাতিলকৃত' : 'Declined') :
                           (lang === 'bn' ? 'অপেক্ষমাণ জরুরি' : 'Pending Urgent')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                        {req.urgencyNote}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="flex items-center font-bold text-gray-700">
                          <Phone className="w-3.5 h-3.5 mr-1 text-brand-green" />
                          {req.requesterMobile}
                        </span>
                        <span>•</span>
                        <span>{new Date(req.createdAt).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-4 py-2 rounded-xl bg-brand-green hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'আমি রক্ত দিতে রাজি' : 'I Can Donate'}</span>
                        </button>

                        <a
                          href={`tel:${req.requesterMobile}`}
                          className="px-3 py-2 rounded-xl bg-brand-light hover:bg-red-100 text-brand-red text-xs font-bold border border-brand-red/20 transition-all flex items-center space-x-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'কল করুন' : 'Call'}</span>
                        </a>

                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-all"
                        >
                          {lang === 'bn' ? 'অপারগ' : 'Decline'}
                        </button>
                      </>
                    ) : req.status === 'accepted' ? (
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${req.requesterMobile}`}
                          className="px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'রোগীর সাথে যোগাযোগ করুন' : 'Call Patient Now'}</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        {lang === 'bn' ? 'অনুরোধটি বাতিল করা হয়েছে' : 'Request declined'}
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================================================================
            REGISTERED BLOOD CAMPAIGNS (Self-service donor participation)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center space-x-2 text-brand-red">
                <Calendar className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {lang === 'bn' ? 'নিবন্ধিত রক্তদান কর্মসূচি' : 'Registered Blood Donation Campaigns'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-brand-red text-[10px] font-black">
                  {registeredCampaigns.length} {lang === 'bn' ? 'টি নিবন্ধিত' : 'Registered'}
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1">
                {lang === 'bn' ? 'আপনার আসন্ন রক্তদান ক্যাম্পসমূহ' : 'Your Confirmed Blood Drive Registrations'}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/campaigns"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-light hover:bg-red-100 text-brand-red text-xs font-bold border border-brand-red/20 transition-all shrink-0"
              >
                <span>{lang === 'bn' ? 'সকল বিভাগীয় ক্যাম্প দেখুন' : 'Explore All Campaigns'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Action Notification Toast */}
          {campaignToast && (
            <div className={`mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm animate-in fade-in duration-200 ${
              campaignToast.type === 'success' 
                ? 'bg-emerald-50 text-brand-green border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-green" />
              <span>{campaignToast.message}</span>
            </div>
          )}

          <div className="pt-4 space-y-6">
            {registeredCampaigns.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-gray-800">
                  {lang === 'bn' ? 'আপনি এখনো কোনো রক্তদান কর্মসূচিতে নিবন্ধন করেননি।' : 'You have not registered for any upcoming blood drives yet.'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto">
                  {lang === 'bn' 
                    ? 'আপনার অঞ্চলের উন্মুক্ত বা প্রাতিষ্ঠানিক রক্তদান কর্মসূচিতে অংশ নিয়ে সরাসরি জীবন বাঁচাতে যুক্ত হোন। নিচের যেকোনো আসন্ন ক্যাম্পে ১-ক্লিকে এখনই যোগ দিন।' 
                    : 'Join an upcoming institutional or community blood drive across Bangladesh. Use the 1-click button below to instantly register.'}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                  <span>{lang === 'bn' ? 'নিশ্চিতকৃত ক্যাম্প নিবন্ধনসমূহ' : 'Confirmed Registrations'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registeredCampaigns.map((camp) => (
                    <div key={camp.id} className="p-5 rounded-2xl bg-[#FFF8F8] border border-red-100 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brand-green text-[10px] font-black uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {lang === 'bn' ? 'নিবন্ধন নিশ্চিত' : 'Confirmed Registration'}
                          </span>
                          <span className="text-[11px] font-bold text-brand-red">
                            {camp.date}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-gray-900 leading-snug">
                          {lang === 'bn' ? (camp.title_bn || camp.title_en) : camp.title_en}
                        </h4>

                        <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{lang === 'bn' ? (camp.venueBn || camp.venue) : camp.venue} ({camp.district})</span>
                        </p>

                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{camp.time}</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-red-100/60 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleCancelCampaign(camp.id, lang === 'bn' ? (camp.title_bn || camp.title_en) : camp.title_en)}
                          className="text-[11px] font-bold text-gray-400 hover:text-brand-red flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'নিবন্ধন প্রত্যাহার' : 'Cancel Registration'}</span>
                        </button>
                        <Link
                          href="/campaigns"
                          className="text-[11px] font-bold text-brand-red hover:underline flex items-center gap-1"
                        >
                          <span>{lang === 'bn' ? 'ক্যাম্প বিবরণ' : 'Details'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPCOMING AVAILABLE DRIVES TO JOIN (1-Click Action) */}
            {allUpcomingCampaigns.filter(c => !registeredCampaigns.some(r => r.id === c.id)).length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 fill-brand-red text-brand-red" />
                    <span>
                      {registeredCampaigns.length === 0
                        ? (lang === 'bn' ? 'আসন্ন রক্তদান কর্মসূচি — সরাসরি ১ ক্লিকে যুক্ত হোন' : 'Available Upcoming Blood Drives — Join in 1 Click')
                        : (lang === 'bn' ? 'অন্য কোনো রক্তদান ড্রাইভে যোগ দিতে চান?' : 'Available Upcoming Blood Drives You Can Also Join')}
                    </span>
                  </h4>
                  <Link href="/campaigns" className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1">
                    <span>{lang === 'bn' ? 'সকল দেখুন' : 'View All'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allUpcomingCampaigns
                    .filter(c => !registeredCampaigns.some(r => r.id === c.id))
                    .slice(0, 4)
                    .map((camp) => (
                      <div key={camp.id} className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-red">
                              {camp.date}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {camp.slotsAvailable - camp.registeredCount} {lang === 'bn' ? 'টি স্লট বাকি' : 'slots left'}
                            </span>
                          </div>

                          <h5 className="text-xs font-black text-gray-900 leading-snug">
                            {lang === 'bn' ? (camp.title_bn || camp.title_en) : camp.title_en}
                          </h5>

                          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{lang === 'bn' ? (camp.venueBn || camp.venue) : camp.venue}</span>
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium text-gray-500 truncate max-w-[50%]">
                            {lang === 'bn' ? (camp.organizerBn || camp.organizer) : camp.organizer}
                          </span>
                          <button
                            onClick={() => handleJoinCampaign(camp.id, lang === 'bn' ? (camp.title_bn || camp.title_en) : camp.title_en)}
                            className="px-3 py-1.5 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-[11px] font-bold shadow-xs transition-all flex items-center space-x-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'ড্রাইভে যোগ দিন' : 'Join Drive'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            AVAILABILITY ENGINE & THREE-CALENDAR-MONTH COOLDOWN RULES
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center space-x-2 text-brand-red">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.donorDashboard.availabilityEngineTag}</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1">
                {t.donorDashboard.availabilityHeading}
              </h2>
            </div>

            {/* Availability Status Badge & Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 font-semibold">{t.donorDashboard.currentStateLabel}</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${
                availabilityStatus === 'available'
                  ? 'bg-green-100 text-brand-green border border-green-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {getStatusLabel(availabilityStatus)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">{t.donorDashboard.lastVerifiedDonation}</span>
              <p className="text-base font-black text-gray-900">
                {hasDonated ? lastDonationDate : (lang === 'bn' ? 'পূর্ববর্তী রক্তদান নেই' : 'No previous donations')}
              </p>
              <p className="text-[11px] text-gray-500">
                {hasDonated ? (historyRecords[0]?.hospitalName || t.donorDashboard.hospitalDhaka) : (lang === 'bn' ? 'নতুন নিবন্ধিত রক্তদাতা' : 'Registered new donor')}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${hasDonated && isResting ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <span className={`text-[11px] font-bold uppercase ${hasDonated && isResting ? 'text-brand-red' : 'text-brand-green'}`}>
                {t.donorDashboard.platformWaitingRule}
              </span>
              <p className="text-base font-black text-gray-900">
                {hasDonated ? t.donorDashboard.ruleDetail : (lang === 'bn' ? 'অবিলম্বে রক্তদানে সক্ষম' : 'Immediately Available')}
              </p>
              <p className="text-[11px] text-gray-600">
                {hasDonated ? t.donorDashboard.ruleSub : (lang === 'bn' ? 'কোনো ৩ মাসের বিরতি নিয়ম প্রযোজ্য নয়' : 'No cooldown restriction active')}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-1">
              <span className="text-[11px] font-bold text-brand-green uppercase">{t.donorDashboard.nextReview}</span>
              <p className="text-base font-black text-gray-900">
                {hasDonated ? nextEligibleDate : (lang === 'bn' ? 'সরাসরি সক্রিয়' : 'Active & Ready')}
              </p>
              <p className="text-[11px] text-gray-600">
                {hasDonated ? t.donorDashboard.reviewSub : (lang === 'bn' ? 'জরুরি প্রয়োজনে প্রস্তুত' : 'Eligible for emergency requests')}
              </p>
            </div>

          </div>

          {/* Donor Controls */}
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-gray-600">
              <p className="font-bold text-gray-900">{t.donorDashboard.pauseQuestion}</p>
              <p>{t.donorDashboard.pauseExplanation}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => toggleAvailability('available')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  availabilityStatus === 'available'
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-green'
                }`}
              >
                {t.donorDashboard.acceptRequestsBtn}
              </button>

              <button
                onClick={() => toggleAvailability('paused_by_donor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  availabilityStatus === 'paused_by_donor'
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-800'
                }`}
              >
                {t.donorDashboard.pauseRequestsBtn}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-4 italic">
            {t.donorDashboard.medicalNotice}
          </p>
        </div>

        {/* =========================================================================
            UNIVERSAL DIGITAL ID CARD WITH DYNAMIC QR CODE
           ========================================================================= */}
        <div id="id-card" className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-red">
                <QrCode className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.donorDashboard.idCardTag}</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1">
                {t.donorDashboard.idCardHeading}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => donorPhotoInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-amber-700" />
                <span>{donor.avatar_url ? (lang === 'bn' ? 'ছবি পরিবর্তন' : 'Change ID Photo') : (lang === 'bn' ? 'কার্ডে ছবি দিন' : 'Add Image for ID')}</span>
              </button>

              <button
                onClick={() => {
                  const exportBtn = document.getElementById('btn-export-cr80-png');
                  if (exportBtn) {
                    exportBtn.click();
                  } else {
                    document.getElementById('id-card')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.donorDashboard.downloadPng}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationUrl);
                  alert(lang === 'bn' ? "পাবলিক কিউআর ভেরিফিকেশন লিংক ক্লিপবোর্ডে কপি হয়েছে!" : "Public QR verification link copied to clipboard!");
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.donorDashboard.shareLink}</span>
              </button>
            </div>
          </div>

          {/* Hidden File Input for ID Card Photo */}
          <input
            ref={donorPhotoInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadDonorPhoto}
            className="hidden"
          />

          {/* Professional CR80 Digital ID Card with Interactive 3D/Side Flip */}
          <div className="py-6 px-4 bg-[#F9FBFC] rounded-3xl border border-gray-100 flex flex-col items-center justify-center">
            <CR80IDCard
              roleId="donor"
              fullName={donor.full_name}
              fullNameBn={donor.fullNameBn || donor.full_name}
              designation={lang === 'bn' ? 'স্বেচ্ছাসেবী রক্তদাতা সদস্য' : 'Donor Member'}
              uniqueId={donor.donor_id_number}
              avatarUrl={donor.avatar_url || ''}
              jurisdictionName={lang === 'bn' ? `${donor.district_name_en} জেলা, ${donor.division_name_en} বিভাগ` : `${donor.district_name_en} District`}
              bloodGroup={donor.blood_group}
              donationCount={donor.verified_donation_count || 0}
              validUntil="31 Dec 2026"
              verificationToken={verificationToken}
              verificationUrl={verificationUrl}
              interactiveFlip={true}
              showActions={true}
              isDemo={false}
            />
          </div>
        </div>

        {/* =========================================================================
            DONATION HISTORY LOG
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {t.donorDashboard.donationHistoryHeading}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'bn' ? 'যাচাইকৃত রক্তদান লগ ও হাসপাতাল অনুমোদনের ইতিহাস' : 'Verified donation records & clinical confirmation history'}
              </p>
            </div>
            <button
              onClick={() => setIsSubmitRecordModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-light hover:bg-red-100 text-brand-red text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.donorDashboard.submitNewRecordBtn}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">{t.donorDashboard.tableDate}</th>
                  <th className="py-3 px-4">{t.donorDashboard.tableType}</th>
                  <th className="py-3 px-4">{t.donorDashboard.tableHospital}</th>
                  <th className="py-3 px-4">{t.donorDashboard.tableUnits}</th>
                  <th className="py-3 px-4">{t.donorDashboard.tableStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {historyRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      {lang === 'bn' ? 'কোনো রক্তদানের ইতিহাস পাওয়া যায়নি।' : 'No verified donation history found.'}
                    </td>
                  </tr>
                ) : (
                  historyRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>{item.donationDate}</div>
                        {item.bagNumber && (
                          <div className="text-[10px] text-gray-400 font-mono">{item.bagNumber}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">{item.donationType}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{item.hospitalName}</td>
                      <td className="py-3 px-4 font-bold">{item.units} {lang === 'bn' ? 'ব্যাগ' : 'Unit(s)'}</td>
                      <td className="py-3 px-4">
                        {item.status === 'verified' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{item.verifierTag || (lang === 'bn' ? 'কর্তৃপক্ষ কর্তৃক যাচাইকৃত' : 'Verified by Authority')}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{lang === 'bn' ? 'যাচাই প্রক্রিয়াধীন' : 'Verification Pending'}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Submit Blood Donation Proof */}
        {isSubmitRecordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 card-shadow border border-gray-100 relative">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-2">
                  <Droplet className="w-5 h-5 text-brand-red" />
                  <h3 className="font-black text-gray-900 text-base">
                    {lang === 'bn' ? 'নতুন রক্তদানের তথ্য দাখিল করুন' : 'Submit Blood Donation Record'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubmitRecordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitDonationRecord} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {lang === 'bn' ? 'হাসপাতাল বা রক্ত ব্যাংকের নাম *' : 'Hospital / Blood Bank / Facility *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={submitRecordForm.hospitalName}
                    onChange={(e) => setSubmitRecordForm({ ...submitRecordForm, hospitalName: e.target.value })}
                    placeholder="e.g. Dhaka Medical College Hospital"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-burgundy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {lang === 'bn' ? 'রক্তদানের তারিখ *' : 'Donation Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={submitRecordForm.donationDate}
                      onChange={(e) => setSubmitRecordForm({ ...submitRecordForm, donationDate: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {lang === 'bn' ? 'রক্তের ব্যাগ রেফারেন্স নম্বর (ঐচ্ছিক)' : 'Blood Bag Ref Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={submitRecordForm.bagNumber}
                      onChange={(e) => setSubmitRecordForm({ ...submitRecordForm, bagNumber: e.target.value })}
                      placeholder="e.g. BAG-2026-DMC-1049"
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-burgundy font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {lang === 'bn' ? 'ইউনিটের সংখ্যা' : 'Donation Units'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2"
                      value={submitRecordForm.units}
                      onChange={(e) => setSubmitRecordForm({ ...submitRecordForm, units: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-burgundy font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {lang === 'bn' ? 'অতিরিক্ত মন্তব্য / ওয়ার্ড' : 'Transfusion Details / Notes'}
                    </label>
                    <input
                      type="text"
                      value={submitRecordForm.notes}
                      onChange={(e) => setSubmitRecordForm({ ...submitRecordForm, notes: e.target.value })}
                      placeholder="e.g. Emergency transfusion"
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-light rounded-xl border border-brand-red/20 text-[11px] text-brand-burgundy flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>
                    {lang === 'bn'
                      ? 'দাখিলকৃত তথ্য সরাসরি ন্যাশনাল অ্যাডমিন ভেরিফিকেশন কিউতে পাঠানো হবে। সুপার অ্যাডমিন বা হাসপাতাল কর্তৃক অনুমোদনের সাথে সাথে আপনার মোট রক্তদান সংখ্যা বৃদ্ধি পাবে এবং ৩ মাসের বাধ্যতামূলক বিশ্রাম ট্র্যাকার হালনাগাদ হবে।'
                      : 'Submitted records are routed directly to the National Super Admin verification queue. Once approved, your official verified donation tally will increase and your 3-calendar-month rest cycle will reset.'}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitRecordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-black bg-brand-red hover:bg-brand-crimson text-white transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'যাচাইয়ের জন্য দাখিল করুন' : 'Submit for Verification'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
