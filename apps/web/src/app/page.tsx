'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { 
  BANGLADESH_DIVISIONS, 
  SAMPLE_BLOOD_REQUESTS 
} from '@lalbindu/api-client';
import { 
  Users, 
  Droplet, 
  Building2, 
  Heart, 
  Award, 
  ArrowRight, 
  AlertCircle, 
  QrCode, 
  Share2, 
  Bell, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [selectedDivision, setSelectedDivision] = useState('div-dha');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/find-donor?bloodGroup=${encodeURIComponent(selectedBloodGroup)}&division=${selectedDivision}`);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen">
      
      {/* =========================================================================
          HERO BANNER SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-20 hero-gradient border-b border-brand-red/10">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]">
                {t.hero.headlineLead} <br />
                <span className="text-brand-red">{t.hero.headlineAccent}</span> <br />
                {t.hero.headlineTail}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                {t.hero.subheadline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/find-donor"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-brand-red hover:bg-brand-crimson text-white font-bold text-sm shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35 transition-all space-x-2 group"
                >
                  <Droplet className="w-4 h-4 fill-white" />
                  <span>{t.hero.findDonorBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/blood-requests?action=new"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-brand-red border-2 border-brand-red font-bold text-sm shadow-md hover:shadow-lg transition-all space-x-2 group"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{t.hero.requestBloodBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Slogan pill */}
              <div className="pt-2 flex items-center space-x-2 text-xs font-semibold text-brand-green">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.hero.slogan}</span>
              </div>

            </div>

            {/* Right Visual Graphic Column matching Reference Artwork */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden card-shadow bg-gradient-to-br from-white via-brand-light to-red-100 p-6 flex flex-col justify-between border-2 border-brand-red/20">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-brand-red animate-ping" />
                    <span className="text-xs font-extrabold text-brand-red tracking-wider uppercase">{t.hero.liveTag}</span>
                  </div>
                  <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
                    {t.hero.verifiedPlatform}
                  </span>
                </div>

                {/* Center Blood Drop Pulse Illustration */}
                <div className="relative flex flex-col items-center justify-center my-auto">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-red/20 rounded-full animate-pulse" />
                    <div className="relative w-28 h-28 bg-gradient-to-b from-brand-crimson to-brand-red rounded-full flex items-center justify-center shadow-xl shadow-brand-red/40 border-4 border-white">
                      <Droplet className="w-14 h-14 text-white fill-white" />
                      <Heart className="w-6 h-6 text-white fill-white absolute bottom-5" />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      {t.hero.pulseTitle}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-[280px]">
                      {t.hero.pulseDesc}
                    </p>
                  </div>
                </div>

                {/* Bottom Trust Metric */}
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">{t.hero.idVerificationTitle}</p>
                      <p className="text-xs font-bold text-gray-900">{t.hero.idVerificationDesc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-green text-white rounded-full">
                    {t.hero.activeStatus}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          NATIONWIDE STATS BAR (Matches reference layout)
         ========================================================================= */}
      <section className="relative -mt-8 max-w-6xl mx-auto px-4 z-20">
        <div className="bg-white rounded-2xl card-shadow border border-gray-100 px-6 py-5 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="pt-2 md:pt-0">
            <div className="flex items-center justify-center space-x-2 text-brand-red mb-1">
              <Users className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {lang === 'bn' ? '১২,৪৫,৩২০' : '1,245,320'}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.stats.registeredDonors}</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="flex items-center justify-center space-x-2 text-brand-red mb-1">
              <Droplet className="w-5 h-5 fill-brand-red" />
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {lang === 'bn' ? '৯৮,৪৫০' : '98,450'}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.stats.totalDonations}</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="flex items-center justify-center space-x-2 text-brand-red mb-1">
              <Building2 className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {lang === 'bn' ? '২৫০+' : '250+'}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.stats.partnerHospitals}</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="flex items-center justify-center space-x-2 text-brand-red mb-1">
              <Heart className="w-5 h-5 fill-brand-red" />
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {lang === 'bn' ? '১২,৫০০+' : '12,500+'}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.stats.livesSaved}</p>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="flex items-center justify-center space-x-2 text-brand-red mb-1">
              <Award className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {lang === 'bn' ? '৫০+' : '50+'}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.stats.achievementsCount}</p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          KEY ACTION & FEATURE GRID (Matching reference visual arrangement)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top 3 Primary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Find a Donor Quick Filter */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center space-x-2.5 text-brand-red mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                  <Search className="w-4 h-4 fill-brand-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.quickCards.findDonorTitle}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t.quickCards.findDonorDesc}</p>

              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.quickCards.bloodGroup}</label>
                    <select
                      value={selectedBloodGroup}
                      onChange={(e) => setSelectedBloodGroup(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.quickCards.division}</label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    >
                      {BANGLADESH_DIVISIONS.map(div => (
                        <option key={div.id} value={div.id}>
                          {lang === 'bn' ? div.name_bn : div.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>{t.quickCards.searchDonorBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
            
            {/* Background watermark map */}
            <div className="absolute -bottom-8 -right-8 w-36 h-36 opacity-10 pointer-events-none">
              <Droplet className="w-full h-full fill-brand-red text-brand-red" />
            </div>
          </div>

          {/* Card 2: Emergency Blood Request */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center space-x-2.5 text-brand-red mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-brand-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.quickCards.emergencyTitle}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t.quickCards.emergencyDesc}</p>
            </div>

            <div className="flex items-center justify-between my-2 p-3 bg-red-50 rounded-2xl border border-red-100">
              <div className="text-xs font-bold text-brand-red">
                <span>{t.quickCards.activeEmergenciesToday}</span>
                <span className="block text-lg font-black text-gray-900">{t.quickCards.urgentCases}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-md">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
            </div>

            <Link
              href="/blood-requests?action=new"
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{t.quickCards.requestNowBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Your Profile & ID Card */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 text-brand-green mb-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-brand-green" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.quickCards.idCardTitle}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">{t.quickCards.idCardDesc}</p>

              {/* Mini ID Card Preview */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-2xl border border-brand-red/20 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-brand-red uppercase tracking-wider">{t.quickCards.donorIdMini}</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">Ahmed Rahman</div>
                  <div className="text-[11px] font-bold text-brand-green">O+ • LB-0004278</div>
                </div>
                <div className="w-11 h-11 bg-white p-1 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                  <QrCode className="w-8 h-8 text-gray-800" />
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/donor#id-card"
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{t.quickCards.viewIdCardBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Bottom 3 Feature & Community Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 4: Our Achievements Badges */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-brand-red">
                  <Award className="w-5 h-5" />
                  <h3 className="text-base font-bold text-gray-900">{t.quickCards.achievementsTitle}</h3>
                </div>
                <Link href="/achievements" className="text-xs font-bold text-brand-red hover:underline flex items-center">
                  {t.quickCards.viewAll} <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t.quickCards.achievementsDesc}</p>

              {/* Milestone Badge Row */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-2xl bg-red-50 border border-red-100">
                  <div className="w-8 h-8 mx-auto rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    1
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mt-1.5">{lang === 'bn' ? 'প্রথম বিন্দু' : 'First Drop'}</p>
                  <p className="text-[9px] text-gray-500">{lang === 'bn' ? '১ বার' : '1 Unit'}</p>
                </div>

                <div className="p-2 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    5
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mt-1.5">{lang === 'bn' ? 'জীবন রক্ষক' : 'Life Saver'}</p>
                  <p className="text-[9px] text-gray-500">{lang === 'bn' ? '৫ বার' : '5 Units'}</p>
                </div>

                <div className="p-2 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="w-8 h-8 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    10
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mt-1.5">{lang === 'bn' ? 'বীর দাতা' : 'Hero'}</p>
                  <p className="text-[9px] text-gray-500">{lang === 'bn' ? '১০ বার' : '10 Units'}</p>
                </div>

                <div className="p-2 rounded-2xl bg-purple-50 border border-purple-100">
                  <div className="w-8 h-8 mx-auto rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    25
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mt-1.5">{lang === 'bn' ? 'অভিভাবক' : 'Guardian'}</p>
                  <p className="text-[9px] text-gray-500">{lang === 'bn' ? '২৫ বার' : '25 Units'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Join Our Community */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-brand-red mb-2">
                <Users className="w-5 h-5" />
                <h3 className="text-base font-bold text-gray-900">{t.quickCards.joinTitle}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t.quickCards.joinDesc}</p>

              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-900">{t.quickCards.volunteersCount}</p>
                  <p className="text-[11px] text-gray-600">{t.quickCards.volunteersDesc}</p>
                </div>
              </div>
            </div>

            <Link
              href="/auth/register?role=volunteer"
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{t.quickCards.joinNowBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Key Features Overview */}
          <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-brand-red mb-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-gray-900">{t.quickCards.keyFeaturesTitle}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-700">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fDigitalId}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fCampaigns}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fRequests}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fAlerts}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fBadges}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fMatching}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fHistory}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{t.quickCards.fShare}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{t.quickCards.bilingualSupport}</span>
              <span className="font-bold text-brand-red">{t.quickCards.available247}</span>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          LIVE EMERGENCY REQUESTS FEED (Real-time humanitarian coordination)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-red">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.emergencyFeed.tag}</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              {t.emergencyFeed.heading}
            </h2>
          </div>
          <Link
            href="/blood-requests"
            className="mt-3 sm:mt-0 text-xs font-bold text-brand-red hover:underline flex items-center space-x-1"
          >
            <span>{t.emergencyFeed.viewAllBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_BLOOD_REQUESTS.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-5 card-shadow border border-gray-100 flex flex-col justify-between card-hover relative overflow-hidden"
            >
              {/* Urgency Badge Strip */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                  req.urgency === 'critical_emergency'
                    ? 'bg-red-100 text-brand-red border border-red-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {lang === 'bn' 
                    ? (req.urgency === 'critical_emergency' ? 'সংকটাপন্ন জরুরি' : 'জরুরি')
                    : req.urgency.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {req.request_code}
                </span>
              </div>

              {/* Main details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light border border-brand-red/30 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-brand-red">{req.blood_group}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{req.hospital_name}</h4>
                    <p className="text-xs text-gray-500">
                      {lang === 'bn' ? `${req.hospital_district_bn} জেলা` : `${req.hospital_district_en} District`}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {req.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>{t.emergencyFeed.unitsNeeded} <strong className="text-gray-900 font-bold">{lang === 'bn' ? `${req.units_needed} ব্যাগ` : `${req.units_needed} Units`}</strong></span>
                  <span>{t.emergencyFeed.fulfilled} <strong className="text-brand-green font-bold">{lang === 'bn' ? `${req.units_fulfilled} ব্যাগ` : `${req.units_fulfilled} Units`}</strong></span>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/blood-requests?id=${req.id}`}
                className="mt-4 w-full py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs text-center shadow transition-all block"
              >
                {t.emergencyFeed.canDonateBtn}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MOBILE APP PREVIEW & DOWNLOAD SECTION
         ========================================================================= */}
      <section className="bg-gradient-to-r from-[#8E0B20] to-[#580F1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                {t.mobileSection.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {t.mobileSection.heading}
              </h2>
              <p className="text-sm text-white/80 max-w-lg leading-relaxed">
                {t.mobileSection.desc}
              </p>

              <div className="flex flex-wrap gap-4 pt-3">
                <button 
                  onClick={() => alert("LalBindu Android APK is in production build staging (Phase 6).")}
                  className="px-5 py-3 rounded-2xl bg-white text-gray-900 font-bold text-xs flex items-center space-x-2.5 shadow-lg hover:bg-gray-100 transition-all"
                >
                  <Smartphone className="w-5 h-5 text-brand-green" />
                  <div className="text-left">
                    <span className="block text-[9px] text-gray-500 uppercase leading-none">{t.mobileSection.downloadFor}</span>
                    <span className="text-xs font-black">{t.mobileSection.androidBtn}</span>
                  </div>
                </button>

                <button 
                  onClick={() => alert("LalBindu iOS App Store bundle is in production build staging (Phase 6).")}
                  className="px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/30 font-bold text-xs flex items-center space-x-2.5 shadow-lg hover:bg-white/20 transition-all"
                >
                  <Smartphone className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <span className="block text-[9px] text-white/70 uppercase leading-none">{t.mobileSection.availableFor}</span>
                    <span className="text-xs font-black">{t.mobileSection.iosBtn}</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 h-[420px] bg-black/40 rounded-[36px] p-3 border-4 border-white/20 shadow-2xl flex flex-col justify-between">
                <div className="bg-white rounded-[26px] h-full p-4 text-gray-900 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs font-black text-brand-red">LalBindu Mobile</div>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-brand-green rounded-full font-bold">Online</span>
                    </div>

                    <div className="bg-brand-light p-3 rounded-2xl border border-brand-red/20 mb-3 text-center">
                      <div className="text-[10px] text-gray-500">{lang === 'bn' ? 'রক্তদাতা ড্যাশবোর্ড' : 'Donor Dashboard'}</div>
                      <div className="text-sm font-black text-gray-900">Ahmed Rahman</div>
                      <div className="text-xs font-bold text-brand-red">{lang === 'bn' ? 'রক্তের গ্রুপ: O+ পজিটিভ' : 'Blood Group: O+ Positive'}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                        <span>{lang === 'bn' ? 'মোট রক্তদান' : 'Total Donations'}</span>
                        <strong className="font-bold text-brand-red">{lang === 'bn' ? '৫ বার' : '5 Units'}</strong>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                        <span>{lang === 'bn' ? 'অবস্থা' : 'Status'}</span>
                        <strong className="font-bold text-brand-green">{lang === 'bn' ? 'প্রস্তুত' : 'Available'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2 flex justify-around text-gray-400">
                    <Droplet className="w-5 h-5 text-brand-red" />
                    <Search className="w-5 h-5" />
                    <QrCode className="w-5 h-5" />
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
