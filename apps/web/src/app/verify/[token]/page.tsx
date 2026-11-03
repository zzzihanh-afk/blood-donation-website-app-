'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { SAMPLE_ID_CARDS } from '@lalbindu/api-client';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Lock,
  Droplet
} from 'lucide-react';

export default function VerifyIdCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { t, lang } = useLanguage();
  
  // Look up card details by token
  const card = SAMPLE_ID_CARDS[token] || SAMPLE_ID_CARDS['LB-TOKEN-DNR-0004278'];

  // Determine roleId from card number or token
  const getRoleId = () => {
    if (token.includes('LA001') || card.card_number.includes('LA001')) return 'super_admin';
    if (token.includes('LA01') || card.card_number.includes('LA01')) return 'division_admin';
    if (token.includes('LA02') || card.card_number.includes('LA02') || token.includes('ADM-DHAKA')) return 'district_admin';
    if (token.includes('LA03') || card.card_number.includes('LA03')) return 'upazila_admin';
    if (token.includes('LA04') || card.card_number.includes('LA04')) return 'thana_admin';
    if (token.includes('LA05') || card.card_number.includes('LA05')) return 'union_admin';
    if (token.includes('VL') || card.card_number.includes('VL')) return 'volunteer';
    return 'donor';
  };

  const detectedRoleId = getRoleId();

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10 flex flex-col justify-center items-center px-4">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-brand-red"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.verifyPage.backHome}</span>
        </Link>

        {/* Live Rendered CR80 Digital ID Card */}
        <div className="flex justify-center">
          <CR80IDCard
            roleId={detectedRoleId}
            fullName={card.full_name}
            designation={lang === 'bn' ? (card.designation_bn || card.role_title_bn) : (card.designation_en || card.role_title_en)}
            uniqueId={card.card_number}
            avatarUrl={card.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
            jurisdictionName={lang === 'bn' ? card.jurisdiction_bn || undefined : card.jurisdiction_en || undefined}
            bloodGroup={detectedRoleId === 'donor' ? 'O+' : undefined}
            donationCount={detectedRoleId === 'donor' ? 5 : undefined}
            validUntil={card.expires_at ? new Date(card.expires_at).toLocaleDateString() : '31 Dec 2026'}
            verificationToken={token}
            interactiveFlip={true}
            showActions={true}
            isDemo={false}
          />
        </div>

        {/* Verification Certificate Card */}
        <div className="bg-white rounded-3xl card-shadow border border-gray-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-red via-brand-crimson to-[#8E0B20] text-white p-5 text-center relative">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t.verifyPage.officialVerification}</span>
            </div>

            <h1 className="text-xl font-black tracking-tight">
              {t.verifyPage.cryptoRecord}
            </h1>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Status & Validity Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{t.verifyPage.credentialStatus}</span>
                <span className="text-sm font-black text-brand-green flex items-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" />
                  {lang === 'bn' ? 'সক্রিয় (ACTIVE)' : 'ACTIVE'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{t.verifyPage.designation}</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                  {lang === 'bn' ? (card.designation_bn || 'স্বেচ্ছাসেবী রক্তদাতা') : (card.designation_en || 'Voluntary Donor')}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{t.verifyPage.jurisdiction}</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                  {lang === 'bn' ? (card.jurisdiction_bn || 'সারাদেশ') : (card.jurisdiction_en || 'Bangladesh Nationwide')}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">{t.verifyPage.issuedAt}</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {new Date(card.issued_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                </span>
              </div>
            </div>

            {/* Privacy Redaction Notice */}
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-[11px] text-blue-900 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>{t.verifyPage.zeroPiiTitle}</strong> {t.verifyPage.zeroPiiDesc}
              </p>
            </div>

            {/* Non-Governmental Legal Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed space-y-1">
              <p className="font-bold flex items-center text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {t.verifyPage.disclaimerTitle}
              </p>
              <p>
                {lang === 'bn' ? card.disclaimer_bn : card.disclaimer_en}
              </p>
            </div>

          </div>

          {/* Footer info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{t.verifyPage.verifiedByAuth}</span>
            <span className="font-mono text-[10px] text-gray-400">{t.verifyPage.tokenMatch}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
