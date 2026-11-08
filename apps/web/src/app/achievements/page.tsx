'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import { DEFAULT_ACHIEVEMENTS } from '@lalbindu/business-rules';
import { getCurrentSession } from '@/lib/session';
import { Award, CheckCircle2, Lock, Download, Share2, Droplet, Sparkles, Heart, ShieldCheck, Printer, Check } from 'lucide-react';

interface ActiveDonorInfo {
  fullName: string;
  fullNameBn: string;
  donorId: string;
  bloodGroup: string;
  district: string;
  districtBn: string;
  verifiedDonations: number;
}

const DEFAULT_DEMO_DONOR: ActiveDonorInfo = {
  fullName: 'Voluntary Donor',
  fullNameBn: 'স্বেচ্ছাসেবী রক্তদাতা',
  donorId: 'LB-0000000',
  bloodGroup: 'O+',
  district: 'Dhaka',
  districtBn: 'ঢাকা',
  verifiedDonations: 0
};

function toBengaliNumber(val: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

function getTierInfo(count: number) {
  if (count >= 10) {
    return {
      titleEn: 'Platinum Lifesaver (Rank 4)',
      titleBn: 'প্লাটিনাম লাইফসেভার (র‌্যাঙ্ক ৪)'
    };
  }
  if (count >= 5) {
    return {
      titleEn: 'Gold Lifesaver (Rank 3)',
      titleBn: 'গোল্ড লাইফসেভার (র‌্যাঙ্ক ৩)'
    };
  }
  if (count >= 3) {
    return {
      titleEn: 'Silver Lifesaver (Rank 2)',
      titleBn: 'সিলভার লাইফসেভার (র‌্যাঙ্ক ২)'
    };
  }
  if (count >= 1) {
    return {
      titleEn: 'Bronze Lifesaver (Rank 1)',
      titleBn: 'ব্রোঞ্জ লাইফসেভার (র‌্যাঙ্ক ১)'
    };
  }
  return {
    titleEn: 'New Donor (Rank 0)',
    titleBn: 'নতুন রক্তদাতা (র‌্যাঙ্ক ০)'
  };
}

function getNextMilestoneInfo(count: number) {
  if (count < 1) {
    const remaining = 1 - count;
    return {
      descEn: `${remaining} more donation to First Drop (1)`,
      descBn: `প্রথম বিন্দু (১ বার রক্তদান) হতে আর ${toBengaliNumber(remaining)}টি রক্তদান বাকি`
    };
  }
  if (count < 5) {
    const remaining = 5 - count;
    return {
      descEn: `${remaining} more to Life Saver (5)`,
      descBn: `জীবন রক্ষক (৫ বার) হতে আর ${toBengaliNumber(remaining)}টি রক্তদান বাকি`
    };
  }
  if (count < 10) {
    const remaining = 10 - count;
    return {
      descEn: `${remaining} more to Hero Donor (10)`,
      descBn: `বীর রক্তদাতা (১০ বার) হতে আর ${toBengaliNumber(remaining)}টি রক্তদান বাকি`
    };
  }
  if (count < 25) {
    const remaining = 25 - count;
    return {
      descEn: `${remaining} more to Guardian of Life (25)`,
      descBn: `জীবনের অভিভাবক (২৫ বার) হতে আর ${toBengaliNumber(remaining)}টি রক্তদান বাকি`
    };
  }
  return {
    descEn: 'All Humanitarian Milestones Achieved!',
    descBn: 'সকল মানবিক মাইলফলক অর্জিত!'
  };
}

export default function AchievementsPage() {
  const { t, lang } = useLanguage();
  const [donorInfo, setDonorInfo] = useState<ActiveDonorInfo>(DEFAULT_DEMO_DONOR);
  const [selectedCertificate, setSelectedCertificate] = useState<typeof DEFAULT_ACHIEVEMENTS[0] | null>(null);

  const loadDonorData = () => {
    try {
      const activeRaw = localStorage.getItem('lalbindu_active_donor_profile');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed && (parsed.full_name || parsed.name)) {
          const uId = parsed.donor_id_number || parsed.cardId || 'LB-0004278';
          const count = typeof parsed.verified_donation_count === 'number' 
            ? parsed.verified_donation_count 
            : (uId === 'LB-0004278' ? 5 : 0);

          setDonorInfo({
            fullName: parsed.full_name || parsed.name || 'Voluntary Donor',
            fullNameBn: parsed.fullNameBn || parsed.nameBn || parsed.full_name || parsed.name || 'স্বেচ্ছাসেবী রক্তদাতা',
            donorId: uId,
            bloodGroup: parsed.blood_group || parsed.bloodGroup || 'O+',
            district: parsed.district_name_en || parsed.district || 'Dhaka',
            districtBn: parsed.district_name_en || parsed.district || 'ঢাকা',
            verifiedDonations: count
          });
          return;
        }
      }

      const session = getCurrentSession();
      if (session && session.role === 'donor') {
        const uId = session.donorId || (session as any).cardId || 'LB-0004278';
        const count = typeof (session as any).verified_donation_count === 'number'
          ? (session as any).verified_donation_count
          : (uId === 'LB-0004278' ? 5 : 0);

        setDonorInfo({
          fullName: session.name || 'Voluntary Donor',
          fullNameBn: session.name || 'স্বেচ্ছাসেবী রক্তদাতা',
          donorId: uId,
          bloodGroup: session.bloodGroup || 'O+',
          district: 'Dhaka',
          districtBn: 'ঢাকা',
          verifiedDonations: count
        });
        return;
      }

      if (session && session.role === 'public') {
        setDonorInfo({
          fullName: 'Guest Donor',
          fullNameBn: 'অতিথি রক্তদাতা',
          donorId: 'GUEST',
          bloodGroup: 'O+',
          district: 'Dhaka',
          districtBn: 'ঢাকা',
          verifiedDonations: 0
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDonorData();
    window.addEventListener('lalbindu_session_changed', loadDonorData);
    window.addEventListener('lalbindu_verification_updated', loadDonorData);
    window.addEventListener('storage', loadDonorData);

    return () => {
      window.removeEventListener('lalbindu_session_changed', loadDonorData);
      window.removeEventListener('lalbindu_verification_updated', loadDonorData);
      window.removeEventListener('storage', loadDonorData);
    };
  }, []);

  const verifiedDonations = donorInfo.verifiedDonations;
  const tierInfo = getTierInfo(verifiedDonations);
  const nextMilestone = getNextMilestoneInfo(verifiedDonations);

  // Helper to get medal badge styling matching reference image
  const getBadgeStyle = (id: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-gray-100 border border-gray-200'
      };
    }
    switch (id) {
      case 'ach-first-drop':
        return {
          bg: 'bg-gradient-to-br from-brand-crimson to-brand-red shadow-brand-red/30 border border-brand-red/40'
        };
      case 'ach-life-saver':
        return {
          bg: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 shadow-slate-500/30 border border-slate-600'
        };
      case 'ach-hero-donor':
        return {
          bg: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 shadow-amber-500/40 border border-amber-400'
        };
      case 'ach-guardian-life':
        return {
          bg: 'bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 shadow-purple-500/30 border border-purple-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-brand-crimson to-brand-red shadow-brand-red/30'
        };
    }
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>{t.achievementsPage.tag}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {t.achievementsPage.title}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {t.achievementsPage.subtitle}
          </p>

          {/* User Progress Bar Summary */}
          <div className="mt-6 bg-white p-4 rounded-3xl card-shadow border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-red font-black text-xl border border-brand-red/20">
                {lang === 'bn' ? toBengaliNumber(verifiedDonations) : verifiedDonations}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">{t.achievementsPage.yourVerifiedDonations}</p>
                <p className="text-sm font-bold text-gray-900">
                  {lang === 'bn' ? tierInfo.titleBn : tierInfo.titleEn}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">{t.achievementsPage.nextMilestoneLabel}</p>
              <p className="text-xs font-bold text-brand-red">
                {lang === 'bn' ? nextMilestone.descBn : nextMilestone.descEn}
              </p>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DEFAULT_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = verifiedDonations >= ach.required_count;
            const progress = Math.min(verifiedDonations, ach.required_count);
            const percentage = Math.round((progress / ach.required_count) * 100);
            const badgeStyle = getBadgeStyle(ach.id, isUnlocked);

            return (
              <div
                key={ach.id}
                className={`bg-white rounded-3xl p-6 card-shadow border flex flex-col justify-between relative overflow-hidden card-hover ${
                  isUnlocked ? 'border-brand-red/30' : 'border-gray-200 opacity-90'
                }`}
              >
                {/* Badge Crest with Official LalBindu Logo */}
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg relative ${badgeStyle.bg}`}>
                    <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src="/branding/lalbindu-emblem.png"
                          alt="LalBindu Official Logo"
                          fill
                          className={`object-contain ${!isUnlocked ? 'grayscale opacity-30' : 'drop-shadow-sm'}`}
                          priority
                        />
                      </div>
                    </div>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-6 h-6 text-white bg-brand-green rounded-full absolute -top-1 -right-1 shadow-md" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500 bg-white rounded-full p-0.5 absolute -top-1 -right-1 shadow-md border border-gray-200" />
                    )}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mt-4">
                    {lang === 'bn' ? ach.title_bn : ach.title_en}
                  </h3>
                  <p className="text-xs font-bold text-brand-red">
                    {lang === 'bn' ? ach.title_en : ach.title_bn}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed min-h-[34px]">
                    {lang === 'bn' ? ach.description_bn : ach.description_en}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">{t.achievementsPage.milestone}</span>
                    <span className="text-gray-900">
                      {lang === 'bn' ? `${toBengaliNumber(ach.required_count)} বার রক্তদান` : `${ach.required_count} Donations`}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-brand-green' : 'bg-brand-red'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>
                      {lang === 'bn' 
                        ? `${toBengaliNumber(progress)} / ${toBengaliNumber(ach.required_count)} সম্পন্ন`
                        : `${progress} / ${ach.required_count} ${t.achievementsPage.completedText}`}
                    </span>
                    <span>{lang === 'bn' ? `${toBengaliNumber(percentage)}%` : `${percentage}%`}</span>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={() => setSelectedCertificate(ach)}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-brand-light text-brand-red hover:bg-brand-red hover:text-white font-bold text-xs border border-brand-red/20 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.achievementsPage.viewCertificateBtn}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Official Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 card-shadow border-4 border-amber-400/80 relative text-center shadow-2xl">
            
            {/* Ornate Certificate Frame */}
            <div className="border-2 border-brand-red/40 p-6 sm:p-8 rounded-2xl relative bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF9F9] shadow-inner">
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-brand-red" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-brand-red" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-brand-red" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-brand-red" />

              {/* Official LalBindu Logo in Certificate Header (Replacing the symbol) */}
              <div className="flex justify-center mb-4">
                <div className="relative w-56 sm:w-64 h-14 sm:h-16">
                  <Image
                    src="/branding/lalbindu-logo.png"
                    alt="LalBindu Official Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Certificate Sub-Header */}
              <div className="space-y-0.5 mb-4">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-brand-red font-black">
                  {lang === 'bn' 
                    ? 'গণপ্রজাতন্ত্রী বাংলাদেশ | জাতীয় স্বেচ্ছায় রক্তদান নেটওয়ার্ক' 
                    : 'People’s Republic of Bangladesh • National Blood Donation Network'}
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {lang === 'bn' ? 'মানবিক অবদানের স্বীকৃতি ও সম্মাননা সনদ' : 'Certificate of Humanitarian Citation'}
                </h2>
              </div>

              {/* Awarded To Recipient */}
              <div className="my-5 py-3 border-y border-amber-200/60 bg-amber-50/30 rounded-xl">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                  {lang === 'bn' ? 'গর্বের সাথে সম্মাননা প্রদান করা হচ্ছে' : 'Proudly Presented To'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-brand-red tracking-tight mt-0.5">
                  {lang === 'bn' ? (donorInfo.fullNameBn || donorInfo.fullName) : donorInfo.fullName}
                </h3>
                <div className="flex items-center justify-center space-x-3 text-xs mt-1">
                  <span className="font-mono font-bold text-gray-700 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                    ID: {donorInfo.donorId}
                  </span>
                  <span className="font-extrabold text-brand-red bg-red-100 px-2 py-0.5 rounded-full">
                    {donorInfo.bloodGroup} POSITIVE
                  </span>
                  <span className="text-gray-600 font-medium">
                    {lang === 'bn' ? `${donorInfo.districtBn} জেলা` : `${donorInfo.district} District`}
                  </span>
                </div>
              </div>

              {/* Milestone Details */}
              <div className="my-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-light border border-brand-red/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-xs font-black text-brand-red">
                    {lang === 'bn' ? selectedCertificate.title_bn : selectedCertificate.title_en}
                    {' '}({lang === 'bn' ? `${toBengaliNumber(selectedCertificate.required_count)} বার রক্তদান` : `${selectedCertificate.required_count} Donations`})
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
                  {lang === 'bn' 
                    ? `সফল ও যাচাইকৃত ${toBengaliNumber(selectedCertificate.required_count)} বার রক্তদানের মাধ্যমে বাংলাদেশের বিভিন্ন হাসপাতালে চিকিৎসাধীন সংকটাপন্ন মানুষের জীবন রক্ষায় নিঃস্বার্থ মানবিক অবদানের জন্য এই সনদপত্র প্রদান করা হলো।`
                    : `In grateful recognition of ${selectedCertificate.required_count} verified whole-blood donations contributing directly to saving human lives across hospitals in Bangladesh.`}
                </p>
              </div>

              {/* Signatures & Seal Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 grid grid-cols-3 items-center text-center">
                
                {/* Left Signature */}
                <div className="text-[10px] text-gray-600 space-y-0.5">
                  <div className="h-8 flex items-end justify-center font-serif italic text-sm text-gray-800 font-bold">
                    Prof. Dr. A. K. Azad
                  </div>
                  <div className="w-24 mx-auto border-t border-gray-400" />
                  <p className="font-bold text-gray-800 mt-1">{t.achievementsPage.centralBoard}</p>
                  <p className="text-gray-400">{t.achievementsPage.secretariatDhaka}</p>
                </div>

                {/* Center Gold Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center bg-white p-1">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/branding/lalbindu-emblem.png"
                          alt="LalBindu Official Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[6px] font-black uppercase tracking-wider text-amber-900 mt-0.5">OFFICIAL SEAL</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-700 mt-1">
                    LB-CERT-{donorInfo.donorId.replace(/[^a-zA-Z0-9]/g, '')}
                  </span>
                </div>

                {/* Right Verification Authority */}
                <div className="text-[10px] text-gray-600 space-y-0.5">
                  <div className="h-8 flex items-end justify-center text-xs text-brand-green font-bold">
                    <ShieldCheck className="w-4 h-4 mr-1 inline" />
                    <span>VERIFIED</span>
                  </div>
                  <div className="w-24 mx-auto border-t border-gray-400" />
                  <p className="font-bold text-brand-green mt-1">{t.achievementsPage.cryptoVerified}</p>
                  <p className="text-gray-400">{lang === 'bn' ? 'তারিখ: ৩ নভেম্বর, ২০২৬' : 'Date: Nov 3, 2026'}</p>
                </div>

              </div>

            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2.5 px-5 rounded-full bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সনদ প্রিন্ট / পিডিএফ ডাউনলোড' : 'Print / Download Certificate PDF'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/verify/LB-TOKEN-DNR-${donorInfo.donorId.replace(/[^a-zA-Z0-9]/g, '')}` : '');
                  alert(lang === 'bn' ? 'সনদের অনলাইন ভেরিফিকেশন লিংক কপি হয়েছে!' : 'Online certificate verification link copied!');
                }}
                className="py-2.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লিংক শেয়ার' : 'Share Link'}</span>
              </button>

              <button
                onClick={() => setSelectedCertificate(null)}
                className="py-2.5 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
              >
                {t.achievementsPage.closeBtn}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
