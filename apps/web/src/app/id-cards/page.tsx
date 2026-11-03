'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { REFERENCE_SAMPLE_PROFILES } from '@lalbindu/api-client';
import { 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Award,
  ChevronRight,
  Sliders
} from 'lucide-react';

export default function IdCardsMasterShowcasePage() {
  const { lang } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'admin' | 'community'>('all');

  // Master 8 Role Definitions exactly matching the reference poster image
  const ROLE_DEFINITIONS = [
    {
      roleId: 'super_admin',
      roleNameEn: 'Super Admin',
      roleNameBn: 'সুপার অ্যাডমিন',
      category: 'admin',
      profileId: 'prof-super-admin',
      primaryColor: '#580F1A',
      secondaryColor: '#30080E',
      landmark: 'Jatiyo Smriti Soudho (জাতীয় স্মৃতিসৌধ)',
      badge: 'Gold Rosette Star (গোল্ডেন রোজেট)'
    },
    {
      roleId: 'division_admin',
      roleNameEn: 'Division Administrator',
      roleNameBn: 'বিভাগীয় প্রশাসক',
      category: 'admin',
      profileId: 'prof-div-admin',
      primaryColor: '#0D3B66',
      secondaryColor: '#062038',
      landmark: 'Jatiya Sangsad Bhaban (জাতীয় সংসদ ভবন)',
      badge: 'Royal Blue Star (রয়েল ব্লু স্টার)'
    },
    {
      roleId: 'district_admin',
      roleNameEn: 'District Administrator',
      roleNameBn: 'জেলা প্রশাসক',
      category: 'admin',
      profileId: 'prof-dist-admin',
      primaryColor: '#006A4E',
      secondaryColor: '#004532',
      landmark: 'Ahsan Manzil (আহসান মঞ্জিল / লালবাগ)',
      badge: 'Historic Fort Crest (ঐতিহ্য কেল্লা)'
    },
    {
      roleId: 'upazila_admin',
      roleNameEn: 'Upazila Administrator',
      roleNameBn: 'উপজেলা প্রশাসক',
      category: 'admin',
      profileId: 'prof-upazila-admin',
      primaryColor: '#D84A1B',
      secondaryColor: '#93300E',
      landmark: 'Shat Gombuj Masjid (ষাট গম্বুজ মসজিদ)',
      badge: 'Terracotta Arch Crest (টেরাকোটা গম্বুজ)'
    },
    {
      roleId: 'thana_admin',
      roleNameEn: 'Metropolitan Thana Administrator',
      roleNameBn: 'মেট্রোপলিটন থানা প্রশাসক',
      category: 'admin',
      profileId: 'prof-thana-admin',
      primaryColor: '#008080',
      secondaryColor: '#004C4C',
      landmark: 'Metropolitan Civic Skyline (মেট্রোপলিটন স্থাপত্য)',
      badge: 'Civic Tower Crest (পৌর ভবন)'
    },
    {
      roleId: 'union_admin',
      roleNameEn: 'Union Administrator',
      roleNameBn: 'ইউনিয়ন প্রশাসক',
      category: 'admin',
      profileId: 'prof-union-admin',
      primaryColor: '#4A154B',
      secondaryColor: '#2B082C',
      landmark: 'Central Shaheed Minar (কেন্দ্রীয় শহীদ মিনার)',
      badge: 'Purple Star Crest (বেগুনি স্টার)'
    },
    {
      roleId: 'donor',
      roleNameEn: 'Voluntary Blood Donor',
      roleNameBn: 'স্বেচ্ছাসেবী রক্তদাতা',
      category: 'community',
      profileId: 'prof-donor',
      primaryColor: '#006A4E',
      secondaryColor: '#004532',
      landmark: 'Heart & Droplet Crest (রক্তের ফোঁটা ও হৃদয়)',
      badge: 'Blood Group Crest (B+ গ্রুপ ব্যাজ)'
    },
    {
      roleId: 'volunteer',
      roleNameEn: 'Platform Volunteer',
      roleNameBn: 'প্ল্যাটফর্ম স্বেচ্ছাসেবক',
      category: 'community',
      profileId: 'prof-volunteer',
      primaryColor: '#1B4931',
      secondaryColor: '#0C2618',
      landmark: 'Volunteer Unit Silhouette (স্বেচ্ছাসেবক দল)',
      badge: 'Volunteer Shield (যাচাইকৃত ব্যাজ)'
    }
  ];

  const filteredRoles = ROLE_DEFINITIONS.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.category === selectedFilter;
  });

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-gray-100 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-3 z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-light text-brand-red text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অফিশিয়াল ডিজিটাল পরিচয়পত্র সিস্টেম' : 'Official CR80 Identity Standard'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {lang === 'bn' 
                ? 'লালবিন্দু বাংলাদেশ — ভূমিকা-ভিত্তিক ডিজিটাল পরিচয়পত্র সংগ্রহ' 
                : 'LalBindu Bangladesh — Role-Based Digital ID Card Collection'}
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed">
              {lang === 'bn'
                ? 'সুপার অ্যাডমিন থেকে শুরু করে প্রত্যন্ত ইউনিয়নের স্বেচ্ছাসেবী রক্তদাতা পর্যন্ত প্রতিটি সদস্যের জন্য নির্ধারিত প্রিমিয়াম সিআর৮০ (৮৫.৬ × ৫৪ মিমি) অনুভূমিক পরিচয়পত্র। প্রতিটি কার্ডে রয়েছে পৃথক ঐতিহাসিক স্থাপনার জলছাপ, অফিশিয়াল ব্যাজ এবং কিউআর ভেরিফিকেশন।'
                : 'CR80 standard (85.6mm × 54mm) horizontal identity cards connecting voluntary blood donors, coordinators, and administrators nationwide. Featuring high-fidelity vector landmarks, role insignia, and cryptographically verifiable QR codes.'}
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                href="/dashboard/id-card"
                className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-black shadow-md shadow-brand-red/20 transition-all flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'bn' ? 'আমার আইডি কার্ড দেখুন' : 'My Personal ID Card'}</span>
              </Link>

              <Link
                href="/dashboard/admin/id-cards"
                className="px-5 py-2.5 rounded-xl bg-brand-burgundy hover:bg-[#400B13] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সুপার অ্যাডমিন টেমপ্লেট ডিজাইনার' : 'Template Designer Studio'}</span>
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center z-10">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-brand-red/10 via-brand-light to-amber-50 flex flex-col items-center justify-center p-4 text-center border border-brand-red/20">
              <ShieldCheck className="w-10 h-10 text-brand-red mb-1" />
              <span className="text-xs font-black text-gray-900 leading-tight">64 Districts</span>
              <span className="text-[10px] text-gray-500 font-semibold">Verified Ecosystem</span>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="bg-white rounded-2xl p-2 card-shadow border border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'all'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {lang === 'bn' ? 'সকল ৮টি ভূমিকা (All 8 Roles)' : 'All 8 Roles Master Board'}
            </button>

            <button
              onClick={() => setSelectedFilter('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'admin'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {lang === 'bn' ? 'প্রশাসনিক নেতৃত্ব (Administration)' : 'Administrative Leadership'}
            </button>

            <button
              onClick={() => setSelectedFilter('community')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'community'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {lang === 'bn' ? 'রক্তদাতা ও স্বেচ্ছাসেবক (Community)' : 'Donors & Volunteers'}
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium px-2">
            CR80 Spec: <strong>85.6mm × 54mm</strong> (1.586 : 1 Aspect Ratio)
          </div>
        </div>

        {/* 8-Card Grid: Matching the reference image poster layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
          {filteredRoles.map((role) => {
            const profile = REFERENCE_SAMPLE_PROFILES.find((p) => p.role_id === role.roleId) || REFERENCE_SAMPLE_PROFILES[0];
            return (
              <div 
                key={role.roleId}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Card Pair Header */}
                <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shadow-xs" 
                      style={{ backgroundColor: role.primaryColor }} 
                    />
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-gray-900 leading-tight">
                        {lang === 'bn' ? role.roleNameBn : role.roleNameEn}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Landmark: {role.landmark}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono">
                    CR80 • v1.0.0
                  </span>
                </div>

                {/* Dual Card Render (Front and Back side-by-side) */}
                <div className="py-2 flex justify-center">
                  <CR80IDCard
                    roleId={role.roleId}
                    fullName={profile.full_name}
                    fullNameBn={profile.full_name_bn}
                    designation={profile.designation_en}
                    designationBn={profile.designation_bn}
                    uniqueId={profile.unique_id}
                    avatarUrl={profile.avatar_url}
                    organizationName={profile.organization_name}
                    jurisdictionName={profile.jurisdiction_en}
                    bloodGroup={profile.blood_group}
                    donationCount={profile.donation_count}
                    validUntil={profile.valid_until}
                    verificationToken={profile.verification_token}
                    settings={{
                      primaryColor: role.primaryColor,
                      secondaryColor: role.secondaryColor,
                      ribbonLabel: role.roleNameEn
                    }}
                    layoutMode="side-by-side"
                    showActions={true}
                    isDemo={false}
                  />
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span>Badge: <strong>{role.badge}</strong></span>
                  <Link 
                    href={`/verify/${profile.verification_token}`}
                    className="text-brand-red font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>{lang === 'bn' ? 'অনলাইন যাচাই' : 'Verify Online'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Poster Red Wave Banner at Bottom (Exactly like reference image footer) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#580F1A] via-[#8E0B20] to-[#580F1A] text-white p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-red-950">
          <div className="flex items-center space-x-5">
            <div className="relative w-40 sm:w-48 h-12">
              <Image
                src="/branding/lalbindu-logo.png"
                alt="LalBindu"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <div className="hidden sm:block h-10 w-[1.5px] bg-white/20" />
            <div>
              <p className="text-base sm:text-lg font-black tracking-wide text-white">
                Together for a Blood-Safe Bangladesh ❤️
              </p>
              <p className="text-xs text-red-200/90 font-medium">
                Every Drop Connects a Life. Universal Nationwide Digital ID & Verification Standard.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সম্পূর্ণ শোকেস প্রিন্ট' : 'Print Master Board'}</span>
            </button>

            <Link
              href="/dashboard/donor"
              className="px-4 py-2 rounded-xl bg-white text-brand-burgundy text-xs font-black shadow-md hover:bg-gray-100 transition-all flex items-center space-x-1.5"
            >
              <span>{lang === 'bn' ? 'দাতার ড্যাশবোর্ড' : 'Donor Portal'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
