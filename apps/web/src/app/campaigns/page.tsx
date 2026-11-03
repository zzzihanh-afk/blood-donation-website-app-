'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Calendar, MapPin, Users, Clock, CheckCircle2, Building2, Plus, ArrowRight } from 'lucide-react';

export default function CampaignsPage() {
  const { t, lang } = useLanguage();
  const [registeredCampaignId, setRegisteredCampaignId] = useState<string | null>(null);

  const sampleCampaigns = [
    {
      id: 'camp-01',
      title_en: 'Dhaka University Central Blood Donation Drive',
      title_bn: 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় রক্তদান কর্মসূচি',
      organizer: lang === 'bn' ? 'বাঁধন (ডিইউ জোন) ও লালবিন্দু' : 'Badhan (DU Zone) & LalBindu',
      venue: lang === 'bn' ? 'টিএসসি প্রাঙ্গণ, ঢাকা বিশ্ববিদ্যালয়' : 'Teacher-Student Centre (TSC), University of Dhaka',
      district: lang === 'bn' ? 'ঢাকা' : 'Dhaka',
      date: lang === 'bn' ? '১৫ নভেম্বর, ২০২৬' : 'November 15, 2026',
      time: lang === 'bn' ? 'সকাল ০৯:০০ - বিকাল ০৫:০০' : '09:00 AM - 05:00 PM',
      slotsAvailable: 150,
      registeredCount: 88,
      status: 'upcoming'
    },
    {
      id: 'camp-02',
      title_en: 'Chattogram Metropolitan Community Blood Camp',
      title_bn: 'চট্টগ্রাম মহানগরী কমিউনিটি রক্তদান ক্যাম্প',
      organizer: lang === 'bn' ? 'সন্ধানী (সিএমসি ইউনিট) ও রেড ক্রিসেন্ট' : 'Sandhani (CMC Unit) & Red Crescent',
      venue: lang === 'bn' ? 'চট্টগ্রাম প্রেস ক্লাব অডিটোরিয়াম, জামাল খান' : 'Chattogram Press Club Auditorium, Jamal Khan',
      district: lang === 'bn' ? 'চট্টগ্রাম' : 'Chattogram',
      date: lang === 'bn' ? '২২ নভেম্বর, ২০২৬' : 'November 22, 2026',
      time: lang === 'bn' ? 'সকাল ১০:০০ - বিকাল ০৪:০০' : '10:00 AM - 04:00 PM',
      slotsAvailable: 200,
      registeredCount: 142,
      status: 'upcoming'
    },
    {
      id: 'camp-03',
      title_en: 'Rajshahi University Humanity Blood Drive',
      title_bn: 'রাজশাহী বিশ্ববিদ্যালয় মানবিক রক্তদান উৎসব',
      organizer: lang === 'bn' ? 'লালবিন্দু ইয়ুথ ক্লাব রাজশাহী' : 'LalBindu Youth Club Rajshahi',
      venue: lang === 'bn' ? 'সাবাশ বাংলাদেশ চত্বর, রাবি ক্যাম্পাস' : 'Shabash Bangladesh Chattar, RU Campus',
      district: lang === 'bn' ? 'রাজশাহী' : 'Rajshahi',
      date: lang === 'bn' ? '২৮ নভেম্বর, ২০২৬' : 'November 28, 2026',
      time: lang === 'bn' ? 'সকাল ০৯:৩০ - বিকাল ০৪:৩০' : '09:30 AM - 04:30 PM',
      slotsAvailable: 120,
      registeredCount: 45,
      status: 'upcoming'
    }
  ];

  const handleRegister = (id: string) => {
    setRegisteredCampaignId(id);
    alert(lang === 'bn' 
      ? 'আপনি সফলভাবে এই রক্তদান কর্মসূচিতে অংশগ্রহণের নিবন্ধন করেছেন! ক্যাম্পের ২৪ ঘণ্টা পূর্বে আপনাকে এসএমএস অ্যালার্ট পাঠানো হবে।'
      : 'You have successfully registered for this blood donation camp! You will receive an SMS reminder 24 hours prior.');
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.campaignsPage.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t.campaignsPage.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t.campaignsPage.subtitle}
            </p>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-brand-red border border-red-200">
                    {t.campaignsPage.upcomingDrive}
                  </span>
                  <span className="text-xs font-bold text-brand-green flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                    {camp.district}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {lang === 'bn' ? camp.title_bn : camp.title_en}
                </h3>
                <p className="text-xs font-bold text-brand-red mb-3">
                  {lang === 'bn' ? camp.title_en : camp.title_bn}
                </p>

                <div className="space-y-2 bg-gray-50 p-3 rounded-2xl text-xs text-gray-600 mb-4 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{camp.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{camp.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="line-clamp-1">{camp.venue}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex items-center justify-between mb-4">
                  <span>{t.campaignsPage.organizerLabel} <strong>{camp.organizer}</strong></span>
                  <span className="text-brand-green font-bold">
                    {lang === 'bn' 
                      ? `${camp.slotsAvailable - camp.registeredCount} টি স্লট বাকি`
                      : `${camp.slotsAvailable - camp.registeredCount} ${t.campaignsPage.slotsLeft}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRegister(camp.id)}
                disabled={registeredCampaignId === camp.id}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                  registeredCampaignId === camp.id
                    ? 'bg-brand-green text-white cursor-default'
                    : 'bg-brand-red hover:bg-brand-crimson text-white'
                }`}
              >
                {registeredCampaignId === camp.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.campaignsPage.registeredBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.campaignsPage.registerBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
