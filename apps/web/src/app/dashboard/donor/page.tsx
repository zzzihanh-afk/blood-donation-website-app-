'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useLanguage } from '@/components/LanguageContext';
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
  UserCheck
} from 'lucide-react';

export default function DonorDashboardPage() {
  const { t, lang } = useLanguage();
  const donor = SAMPLE_DONORS[0]; // Ahmed Rahman
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(donor.availability_status);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // 3-calendar-month calculation
  const lastDonationDate = '2026-08-10';
  const nextEligibleDate = calculateNextEligibleDate(lastDonationDate, 3); // 2026-11-10

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/LB-TOKEN-DNR-0004278` 
    : 'https://lalbindu.bd/verify/LB-TOKEN-DNR-0004278';

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
  };

  const getStatusLabel = (status: AvailabilityStatus) => {
    if (status === 'available') return t.donorDashboard.availableStatus;
    if (status === 'temporarily_unavailable') return t.donorDashboard.temporarilyUnavailableStatus;
    return t.donorDashboard.pausedStatus;
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-brand-light border-2 border-brand-red/30 shrink-0">
              <Image
                src={donor.avatar_url || ''}
                alt={donor.full_name}
                fill
                className="object-cover"
              />
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
                {lang === 'bn' ? 'ঢাকা জেলা, ঢাকা বিভাগ' : `${donor.district_name_en} District, ${donor.division_name_en} Division`}
              </p>
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
                {lang === 'bn' ? '৫' : donor.verified_donation_count}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t.donorDashboard.verifiedDonations}</span>
            </div>

            <div className="text-center px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="block text-xl font-black text-brand-green">
                {lang === 'bn' ? 'র‌্যাঙ্ক ২' : 'Rank 2'}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t.donorDashboard.tier}</span>
            </div>
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
              <p className="text-base font-black text-gray-900">{lastDonationDate}</p>
              <p className="text-[11px] text-gray-500">{t.donorDashboard.hospitalDhaka}</p>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-1">
              <span className="text-[11px] font-bold text-brand-red uppercase">{t.donorDashboard.platformWaitingRule}</span>
              <p className="text-base font-black text-gray-900">{t.donorDashboard.ruleDetail}</p>
              <p className="text-[11px] text-gray-600">{t.donorDashboard.ruleSub}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-1">
              <span className="text-[11px] font-bold text-brand-green uppercase">{t.donorDashboard.nextReview}</span>
              <p className="text-base font-black text-gray-900">{nextEligibleDate}</p>
              <p className="text-[11px] text-gray-600">{t.donorDashboard.reviewSub}</p>
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

            <div className="flex items-center space-x-3">
              <button
                onClick={() => alert("Downloading ID Card Image (PNG)...")}
                className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.donorDashboard.downloadPng}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationUrl);
                  alert(lang === 'bn' ? "পাবলিক কিউআর ভেরিফিকেশন লিংক ক্লিপবোর্ডে কপি হয়েছে!" : "Public QR verification link copied to clipboard!");
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.donorDashboard.shareLink}</span>
              </button>
            </div>
          </div>

          {/* Visual Digital Card Preview */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-[#C8102E] via-[#E31E36] to-[#8E0B20] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border-2 border-white/20">
            
            {/* Top Brand Stripe */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-red">
                  <Droplet className="w-5 h-5 fill-brand-red" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-none">{t.donorDashboard.cardTitle}</h3>
                  <span className="text-[9px] text-white/80 uppercase tracking-wider">{t.donorDashboard.cardSub}</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                {t.donorDashboard.activeMember}
              </span>
            </div>

            {/* Cardholder Body */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/40 shrink-0">
                <Image
                  src={donor.avatar_url || ''}
                  alt={donor.full_name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="text-lg font-black leading-tight">{donor.full_name}</h4>
                <p className="text-xs font-bold text-brand-gold mt-0.5 font-mono">
                  {donor.donor_id_number}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-0.5 bg-white text-brand-red font-black text-xs rounded-md shadow-sm">
                    {donor.blood_group}
                  </span>
                  <span className="text-[11px] text-white/90 font-medium">
                    {lang === 'bn' ? 'ঢাকা জেলা' : `${donor.district_name_en} District`}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code and Validity Footer */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between">
              <div className="text-[10px] text-white/80 space-y-0.5">
                <p>{lang === 'bn' ? 'অবস্থা:' : 'Status:'} <strong className="text-white">{t.donorDashboard.statusVerifiedDonor}</strong></p>
                <p>{lang === 'bn' ? 'যাচাইকৃত রক্তদান:' : 'Verified Donations:'} <strong className="text-white">{lang === 'bn' ? '৫ বার' : `${donor.verified_donation_count} Times`}</strong></p>
                <p>{t.donorDashboard.issueDateLabel}</p>
              </div>

              {/* Dynamic QR Code */}
              <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Verification QR Code" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-10 h-10 text-gray-800" />
                )}
              </div>
            </div>

            <p className="text-[8px] text-center text-white/60 mt-3">
              {t.donorDashboard.scanNotice}
            </p>

          </div>
        </div>

        {/* =========================================================================
            DONATION HISTORY LOG
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {t.donorDashboard.donationHistoryHeading}
            </h2>
            <button
              onClick={() => alert("Donation record submission modal")}
              className="text-xs font-bold text-brand-red hover:underline"
            >
              {t.donorDashboard.submitNewRecordBtn}
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
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-900">2026-08-10</td>
                  <td className="py-3 px-4">{t.donorDashboard.wholeBlood}</td>
                  <td className="py-3 px-4">{t.donorDashboard.hospitalDhaka}</td>
                  <td className="py-3 px-4 font-bold">{lang === 'bn' ? '১ ব্যাগ' : '1 Unit'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-brand-green font-bold text-[10px]">
                      {t.donorDashboard.verifiedByHospital}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-900">2026-04-15</td>
                  <td className="py-3 px-4">{t.donorDashboard.wholeBlood}</td>
                  <td className="py-3 px-4">{lang === 'bn' ? 'এনআইসিভিডি হৃদরোগ ইনস্টিটিউট' : 'NICVD Heart Institute'}</td>
                  <td className="py-3 px-4 font-bold">{lang === 'bn' ? '১ ব্যাগ' : '1 Unit'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-brand-green font-bold text-[10px]">
                      {t.donorDashboard.verifiedByOfficer}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-900">2025-12-01</td>
                  <td className="py-3 px-4">{t.donorDashboard.wholeBlood}</td>
                  <td className="py-3 px-4">{lang === 'bn' ? 'রেড ক্রিসেন্ট হলি ফ্যামিলি হাসপাতাল' : 'Red Crescent Holy Family Hospital'}</td>
                  <td className="py-3 px-4 font-bold">{lang === 'bn' ? '১ ব্যাগ' : '1 Unit'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-brand-green font-bold text-[10px]">
                      {t.donorDashboard.verifiedByHospital}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
