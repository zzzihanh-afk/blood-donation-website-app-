'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { BANGLADESH_DIVISIONS, BANGLADESH_KEY_DISTRICTS } from '@lalbindu/api-client';
import { getDistrictsByDivision } from '@/lib/bangladeshLocations';
import { CampaignItem } from '@/lib/campaigns';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ShieldCheck, 
  Phone, 
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCamp: CampaignItem) => void;
  approverName?: string;
  approverRole?: string;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  approverName = 'Md. Rahman Hossain (LA0010001)',
  approverRole = 'Super Administrator'
}) => {
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    title_en: '',
    title_bn: '',
    organizer: '',
    organizerBn: '',
    division: 'Dhaka',
    district: 'Dhaka',
    venue: '',
    venueBn: '',
    date: 'December 05, 2026',
    time: '09:00 AM - 05:00 PM',
    slotsAvailable: 150,
    contactPhone: '+880 1711-000000'
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_en.trim() || !form.organizer.trim() || !form.venue.trim()) {
      setErrorMsg(lang === 'bn' 
        ? 'দয়া করে ক্যাম্পেইনের নাম, আয়োজক সংস্থা ও স্থান প্রদান করুন।' 
        : 'Please fill in the campaign title, organizer, and venue.');
      return;
    }

    const newCamp: CampaignItem = {
      id: `camp-${Date.now()}`,
      title_en: form.title_en.trim(),
      title_bn: form.title_bn.trim() || form.title_en.trim(),
      organizer: form.organizer.trim(),
      organizerBn: form.organizerBn.trim() || form.organizer.trim(),
      division: form.division,
      district: form.district,
      venue: form.venue.trim(),
      venueBn: form.venueBn.trim() || form.venue.trim(),
      date: form.date,
      time: form.time,
      slotsAvailable: Number(form.slotsAvailable) || 100,
      registeredCount: 0,
      status: 'upcoming',
      approvedBy: approverName,
      approvedRole: approverRole,
      isOfficialAdmin: true,
      contactPhone: form.contactPhone.trim(),
      createdAt: new Date().toISOString()
    };

    onCreated(newCamp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-brand-burgundy to-brand-red p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 text-white">
                  {lang === 'bn' ? 'সুপার অ্যাডমিন ও প্রধান পোর্টাল অনুমোদিত' : 'Super Admin & Main Portal Authorized'}
                </span>
              </div>
              <h2 className="text-xl font-black mt-1">
                {lang === 'bn' ? 'নতুন রক্তদান কর্মসূচি যুক্ত করুন' : 'Create Blood Donation Campaign'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-brand-red flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Authorization Notice Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start space-x-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">
                {lang === 'bn' ? `অনুমোদনকারী: ${approverName} (${approverRole})` : `Authorized By: ${approverName} (${approverRole})`}
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {lang === 'bn' 
                  ? 'এই কর্মসূচিটি অবিলম্বে লালবিন্দু পাবলিক পোর্টালে প্রকাশিত হবে এবং দাতা ও স্বেচ্ছাসেবকগণ সরাসরি স্লট নিবন্ধন করতে পারবেন।' 
                  : 'This drive will immediately appear live on the LalBindu public portal with official verification badges and slot booking enabled.'}
              </p>
            </div>
          </div>

          {/* Title Inputs (EN & BN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'কর্মসূচির শিরোনাম (ইংরেজি) *' : 'Campaign Title (English) *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Central University Blood Camp"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'কর্মসূচির শিরোনাম (বাংলা)' : 'Campaign Title (Bengali)'}
              </label>
              <input
                type="text"
                placeholder="উদাঃ কেন্দ্রীয় বিশ্ববিদ্যালয় রক্তদান ক্যাম্প"
                value={form.title_bn}
                onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
          </div>

          {/* Organizer / Affiliated Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'আয়োজক সংস্থা / পার্টনার ক্লাব *' : 'Organizing Body / Partner Club *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Badhan / Red Crescent / LalBindu Club"
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'জরুরি হেল্পলাইন নম্বর *' : 'Emergency Helpline Phone *'}
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+880 1711-xxxxxx"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
                />
              </div>
            </div>
          </div>

          {/* Division & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'বিভাগ (Division) *' : 'Division *'}
              </label>
              <select
                value={form.division}
                onChange={(e) => {
                  const newDiv = e.target.value;
                  const dists = getDistrictsByDivision(newDiv);
                  setForm({ 
                    ...form, 
                    division: newDiv,
                    district: dists.length > 0 ? dists[0].nameEn : newDiv
                  });
                }}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 cursor-pointer"
              >
                {BANGLADESH_DIVISIONS.map(d => (
                  <option key={d.id} value={d.name_en}>
                    {lang === 'bn' ? d.name_bn : d.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'জেলা (District) *' : 'District *'}
              </label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 cursor-pointer"
              >
                {getDistrictsByDivision(form.division).map(d => (
                  <option key={d.id} value={d.nameEn}>
                    {lang === 'bn' ? d.nameBn : d.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {lang === 'bn' ? 'সুনির্দিষ্ট স্থান ও মিলনায়তন (Venue) *' : 'Venue / Exact Location *'}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Teacher-Student Centre (TSC), University Campus"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
          </div>

          {/* Date, Time & Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'তারিখ (Date) *' : 'Date *'}
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 05, 2026"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'সময় (Time Window) *' : 'Time Window *'}
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="09:00 AM - 05:00 PM"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'টার্গেট স্লট (Capacity) *' : 'Target Slots (Capacity) *'}
              </label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min={10}
                  max={2000}
                  value={form.slotsAvailable}
                  onChange={(e) => setForm({ ...form, slotsAvailable: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-brand-burgundy/90 hover:to-brand-red/90 text-white text-xs font-black shadow-md flex items-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'bn' ? 'কর্মসূচি প্রকাশ করুন' : 'Publish Official Campaign'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
