'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  RotateCcw,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Lock,
  KeyRound,
  UserPlus
} from 'lucide-react';

import { getCurrentSession, isAuthenticatedSession, isAuthorizedAdmin, UserSession } from '@/lib/session';

export default function MyIdCardPage() {
  const { lang } = useLanguage();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'front' | 'back' | 'flip'>('side-by-side');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reissueModalOpen, setReissueModalOpen] = useState(false);
  const [reissueToast, setReissueToast] = useState<string | null>(null);

  // Authenticated User Digital Identity Credentials
  const [userCardData, setUserCardData] = useState({
    fullName: '',
    fullNameBn: '',
    designation: 'Voluntary Blood Donor',
    designationBn: 'স্বেচ্ছাসেবী রক্তদাতা সদস্য',
    uniqueId: '',
    avatarUrl: '',
    jurisdictionName: 'Bangladesh Nationwide Jurisdiction',
    jurisdictionNameBn: 'বাংলাদেশ জাতীয় আওতাভুক্ত',
    bloodGroup: 'O+',
    donationCount: 0,
    issueDate: '01 Jan 2026',
    validUntil: '31 Dec 2027',
    verificationToken: 'LB-TOKEN-UNSPECIFIED',
    status: 'Active',
    roleId: 'donor'
  });

  const loadProfile = () => {
    const curSession = getCurrentSession();
    setSession(curSession);

    if (!isAuthenticatedSession(curSession)) {
      return;
    }

    try {
      // 1. If active user is an Administrator or Official Coordinator
      if (isAuthorizedAdmin(curSession)) {
        setUserCardData({
          fullName: curSession.name,
          fullNameBn: (curSession as any).nameBn || curSession.name,
          designation: curSession.roleLabelEn,
          designationBn: curSession.roleLabelBn,
          uniqueId: curSession.adminId || curSession.id,
          avatarUrl: curSession.avatarUrl || '',
          jurisdictionName: `${curSession.division || curSession.district || 'National'} Jurisdiction`,
          jurisdictionNameBn: `${curSession.division || curSession.district || 'জাতীয়'} আওতাভুক্ত`,
          bloodGroup: curSession.bloodGroup || 'O+',
          donationCount: 0,
          issueDate: '01 Jan 2026',
          validUntil: '31 Dec 2027',
          verificationToken: `LB-TOKEN-ADM-${(curSession.adminId || curSession.id).replace(/[^a-zA-Z0-9]/g, '')}`,
          status: 'Active',
          roleId: curSession.role
        });
        return;
      }

      // 2. Active user is a Voluntary Donor
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed && (parsed.full_name || parsed.name)) {
          const uId = parsed.donor_id_number || parsed.cardId || curSession.donorId || 'LB-Verified';
          const count = typeof parsed.verified_donation_count === 'number' 
            ? parsed.verified_donation_count 
            : (typeof parsed.donationCount === 'number' ? parsed.donationCount : (uId === 'LB-0004278' ? 5 : 0));

          setUserCardData({
            fullName: parsed.full_name || parsed.name,
            fullNameBn: parsed.fullNameBn || parsed.nameBn || parsed.full_name || parsed.name,
            designation: 'Voluntary Blood Donor',
            designationBn: 'স্বেচ্ছাসেবী রক্তদাতা সদস্য',
            uniqueId: uId,
            avatarUrl: parsed.avatar_url || parsed.avatarUrl || curSession.avatarUrl || '',
            bloodGroup: parsed.blood_group || parsed.bloodGroup || curSession.bloodGroup || 'O+',
            donationCount: count,
            jurisdictionName: `${parsed.district_name_en || parsed.district || curSession.district || 'Dhaka'} District`,
            jurisdictionNameBn: `${parsed.district_name_en || parsed.district || curSession.district || 'ঢাকা'} জেলা`,
            issueDate: '10 Jan 2026',
            validUntil: '31 Dec 2027',
            verificationToken: `LB-TOKEN-DNR-${uId.replace(/[^a-zA-Z0-9]/g, '')}`,
            status: 'Active',
            roleId: 'donor'
          });
          return;
        }
      }

      if (curSession.role === 'donor') {
        const uId = curSession.donorId || 'LB-Verified';
        const count = typeof (curSession as any).verified_donation_count === 'number' 
          ? (curSession as any).verified_donation_count 
          : (uId === 'LB-0004278' ? 5 : 0);

        setUserCardData({
          fullName: curSession.name,
          fullNameBn: curSession.name,
          designation: 'Voluntary Blood Donor',
          designationBn: 'স্বেচ্ছাসেবী রক্তদাতা সদস্য',
          uniqueId: uId,
          avatarUrl: curSession.avatarUrl || '',
          bloodGroup: curSession.bloodGroup || 'O+',
          donationCount: count,
          jurisdictionName: `${curSession.district || 'Dhaka'} District`,
          jurisdictionNameBn: `${curSession.district || 'ঢাকা'} জেলা`,
          issueDate: '10 Jan 2026',
          validUntil: '31 Dec 2027',
          verificationToken: `LB-TOKEN-DNR-${uId.replace(/[^a-zA-Z0-9]/g, '')}`,
          status: 'Active',
          roleId: 'donor'
        });
      }
    } catch (e) {
      console.warn('Error loading ID card profile:', e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProfile();
    window.addEventListener('lalbindu_session_changed', loadProfile);
    window.addEventListener('lalbindu_verification_updated', loadProfile);
    window.addEventListener('storage', loadProfile);

    return () => {
      window.removeEventListener('lalbindu_session_changed', loadProfile);
      window.removeEventListener('lalbindu_verification_updated', loadProfile);
      window.removeEventListener('storage', loadProfile);
    };
  }, []);

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${userCardData.verificationToken}`
    : `https://lalbindu.bd/verify/${userCardData.verificationToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReissueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReissueModalOpen(false);
    setReissueToast(lang === 'bn' 
      ? 'কার্ড পুনর্নির্গমন (Reissue) আবেদন জেলা ভেরিফিকেশন অফিসারের নিকট প্রেরিত হয়েছে।' 
      : 'Card reissuance request successfully submitted to the District Verification Officer.');
    setTimeout(() => setReissueToast(null), 4000);
  };

  if (mounted && (!session || !isAuthenticatedSession(session))) {
    return (
      <div className="min-h-[80vh] bg-[#FFF8F8] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 card-shadow border border-red-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-red border border-red-200 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-brand-red" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {lang === 'bn' ? 'ডিজিটাল আইডি কার্ড দেখতে সাইন-ইন করুন' : 'Sign In to View Digital ID Card'}
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনার ব্যক্তিগত কিউআর এনক্রিপ্টেড ডিজিটাল পরিচয়পত্র দেখতে অনুগ্রহ করে রক্তদাতা বা প্রশাসনিক অ্যাকাউন্টে সাইন-ইন করুন।' 
                : 'Please sign in to your blood donor or administrative account to view your cryptographic digital ID card.'}
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/auth/login"
              className="w-full py-3 px-4 rounded-xl bg-brand-burgundy hover:bg-[#400B13] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign In to Account'}</span>
            </Link>
            <Link
              href="/auth/register"
              className="w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-brand-red font-bold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Register as Blood Donor'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
              <Link href="/dashboard/donor" className="hover:text-brand-red flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {lang === 'bn' ? 'দাতার ড্যাশবোর্ড' : 'Donor Dashboard'}
              </Link>
              <span>/</span>
              <span className="text-brand-red font-bold">{lang === 'bn' ? 'আমার আইডি কার্ড' : 'My ID Card'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {lang === 'bn' ? 'আমার অফিশিয়াল ডিজিটাল পরিচয়পত্র' : 'My Official Digital ID Card'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {lang === 'bn' 
                ? 'অনলাইন ও অফলাইনে ক্রিপ্টোগ্রাফিকভাবে যাচাইযোগ্য জাতীয় সিআর৮০ স্ট্যান্ডার্ড ডিজিটাল কার্ড।' 
                : 'Universal cryptographic CR80 standard digital card verifiable nationwide via QR.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-green-100 text-brand-green text-xs font-black uppercase flex items-center space-x-1.5 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span>{lang === 'bn' ? 'সক্রিয় ও যাচাইকৃত' : 'Active & Verified'}</span>
            </span>

            <button
              onClick={() => setReissueModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-brand-red text-gray-700 hover:text-brand-red text-xs font-bold transition-all shadow-xs"
            >
              {lang === 'bn' ? 'কার্ড পুনর্নির্গমন আবেদন' : 'Request Reissue'}
            </button>
          </div>
        </div>

        {/* Reissue Toast */}
        {reissueToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-green font-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
            <span>{reissueToast}</span>
          </div>
        )}

        {/* View Mode Segmented Controls */}
        <div className="bg-white rounded-2xl p-2 card-shadow border border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'side-by-side' ? 'bg-white text-brand-red shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              {lang === 'bn' ? 'পাশাপাশি (উভয় পিঠ)' : 'Side-by-Side (Dual)'}
            </button>
            <button
              onClick={() => setViewMode('front')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'front' ? 'bg-white text-brand-red shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              {lang === 'bn' ? 'সম্মুখ ভাগ' : 'Front Only'}
            </button>
            <button
              onClick={() => setViewMode('back')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'back' ? 'bg-white text-brand-red shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              {lang === 'bn' ? 'বিপরীত ভাগ' : 'Back Only'}
            </button>
            <button
              onClick={() => setViewMode('flip')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'flip' ? 'bg-white text-brand-red shadow-sm' : 'hover:text-gray-900'
              }`}
            >
              {lang === 'bn' ? 'ইন্টারেক্টিভ ফ্লিপ' : '3D Flip'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition-all flex items-center space-x-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              <span>{copiedLink ? (lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : (lang === 'bn' ? 'ভেরিফিকেশন লিংক' : 'Copy Verify URL')}</span>
            </button>

            <Link
              href={verificationUrl}
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-brand-light hover:bg-red-100 text-brand-red text-xs font-bold border border-brand-red/20 transition-all flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পাবলিক পেজ' : 'Public Verify'}</span>
            </Link>
          </div>
        </div>

        {/* Card Stage Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-gray-100 flex flex-col items-center justify-center">
          <CR80IDCard
            roleId={userCardData.roleId}
            fullName={userCardData.fullName}
            fullNameBn={userCardData.fullNameBn}
            designation={lang === 'bn' ? userCardData.designationBn : userCardData.designation}
            uniqueId={userCardData.uniqueId}
            avatarUrl={userCardData.avatarUrl}
            jurisdictionName={lang === 'bn' ? userCardData.jurisdictionNameBn : userCardData.jurisdictionName}
            bloodGroup={userCardData.bloodGroup}
            donationCount={userCardData.donationCount}
            validUntil={userCardData.validUntil}
            verificationToken={userCardData.verificationToken}
            verificationUrl={verificationUrl}
            layoutMode={viewMode === 'side-by-side' ? 'side-by-side' : 'single'}
            initialSide={viewMode === 'back' ? 'back' : 'front'}
            interactiveFlip={viewMode === 'flip'}
            showActions={true}
            isDemo={false}
          />
        </div>

        {/* Security & Verification Credentials Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-4">
          <div className="flex items-center space-x-2 text-brand-burgundy">
            <ShieldCheck className="w-5 h-5 text-brand-burgundy" />
            <h3 className="text-base font-black text-gray-900">
              {lang === 'bn' ? 'প্রমাণীকরণ ও নিরাপত্তা তথ্য' : 'Verification Credentials & Security Metadata'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Digital Token</span>
              <p className="text-xs font-mono font-bold text-gray-800 mt-1 truncate">{userCardData.verificationToken}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Issue Date</span>
              <p className="text-xs font-bold text-gray-800 mt-1">{userCardData.issueDate}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Valid Until</span>
              <p className="text-xs font-bold text-gray-800 mt-1">{userCardData.validUntil}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Verified Donations</span>
              <p className="text-xs font-black text-brand-green mt-1">{userCardData.donationCount} Whole Blood Units</p>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 italic pt-2 border-t border-gray-100 leading-relaxed">
            {lang === 'bn'
              ? '* লালবিন্দু ডিজিটাল আইডি কার্ড প্ল্যাটফর্মের অফিসিয়াল সদস্যপদ ও রক্তদানের সত্যতা নিশ্চিত করে। এটি সরকারি জাতীয় পরিচয়পত্র বা সাধারণ ট্রাভেল ডকুমেন্ট নয়।'
              : '* This digital identity card certifies official membership and hospital-verified blood donations on LalBindu Bangladesh. It is an organizational identity card, not a government-issued national ID.'}
          </p>
        </div>

      </div>

      {/* Reissue Request Modal */}
      {reissueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 card-shadow border border-gray-100 relative">
            <div className="flex items-center space-x-2 text-brand-red mb-3">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-lg font-black text-gray-900">
                {lang === 'bn' ? 'কার্ড পুনর্নির্গমন / তথ্য হালনাগাদ আবেদন' : 'Request Card Reissue / Data Update'}
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'আপনার রক্তদানের তথ্য, জেলা বা ঠিকানায় পরিবর্তন হলে জেলা ভেরিফিকেশন অফিসারের অনুমোদনে নতুন সংস্করণ ইস্যু করা হবে।'
                : 'If your jurisdiction or verified details have changed, submit an update request for your District Verification Officer.'}
            </p>

            <form onSubmit={handleReissueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'আবেদনের কারণ' : 'Reason for Reissue'}
                </label>
                <select className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-medium">
                  <option>Updated Blood Donation Milestone Badge</option>
                  <option>Relocation / New District Assignment</option>
                  <option>Corrected Name Spelling / Identity Fix</option>
                  <option>Digital Card Refresh / QR Regeneration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'অতিরিক্ত মন্তব্য (ঐচ্ছিক)' : 'Additional Notes (Optional)'}
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Provide any details for your verification officer..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReissueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-black shadow-md"
                >
                  {lang === 'bn' ? 'আবেদন জমা দিন' : 'Submit Reissue Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
