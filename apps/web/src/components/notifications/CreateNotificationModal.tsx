'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { BANGLADESH_DIVISIONS } from '@lalbindu/api-client';
import { NotificationItem, addNotification } from '@/lib/notifications';
import { 
  X, 
  Bell, 
  Send, 
  Droplet, 
  Award, 
  ShieldCheck, 
  Calendar, 
  Megaphone,
  AlertTriangle,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatched?: (newItem: NotificationItem) => void;
  adminName?: string;
  adminRole?: string;
}

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onDispatched,
  adminName = 'Md. Rahman Hossain (LA0010001)',
  adminRole = 'Super Administrator'
}) => {
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    type: 'emergency' as NotificationItem['type'],
    priority: 'urgent' as NotificationItem['priority'],
    titleEn: '',
    titleBn: '',
    messageEn: '',
    messageBn: '',
    targetGroup: 'all' as NotificationItem['targetGroup'],
    targetValue: '',
    link: '/blood-requests',
    sender: `${adminName} (${adminRole})`
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleEn.trim() || !form.messageEn.trim()) {
      setErrorMsg(lang === 'bn' 
        ? 'দয়া করে বিজ্ঞপ্তির শিরোনাম এবং বিস্তারিত বিবরণ প্রদান করুন।' 
        : 'Please fill in the notification title and message.');
      return;
    }

    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: form.type,
      priority: form.priority,
      titleEn: form.titleEn.trim(),
      titleBn: form.titleBn.trim() || form.titleEn.trim(),
      messageEn: form.messageEn.trim(),
      messageBn: form.messageBn.trim() || form.messageEn.trim(),
      timeEn: 'Just now',
      timeBn: 'এইমাত্র',
      link: form.link.trim() || '/blood-requests',
      isRead: false,
      targetGroup: form.targetGroup,
      targetValue: form.targetValue || undefined,
      sender: form.sender,
      createdAt: new Date().toISOString()
    };

    const updated = addNotification(newItem);
    if (onDispatched) {
      onDispatched(newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-burgundy via-brand-red to-brand-crimson p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 text-white">
                  {lang === 'bn' ? 'অ্যাডমিন সম্প্রচার কনসোল' : 'Admin Alert Dispatch Console'}
                </span>
              </div>
              <h2 className="text-xl font-black mt-1">
                {lang === 'bn' ? 'নতুন জরুরি বিজ্ঞপ্তি সম্প্রচার করুন' : 'Dispatch Notification & Alert'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-brand-red flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'বিজ্ঞপ্তির ধরন (Alert Type) *' : 'Notification Type *'}
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              >
                <option value="emergency">🚨 জরুরি রক্তের আবেদন (Critical Blood Emergency)</option>
                <option value="campaign">📅 রক্তদান ক্যাম্পেইন ঘোষণা (Donation Campaign)</option>
                <option value="verification">🛡️ হাসপাতাল যাচাইকরণ ও সনদ (Verification & Milestones)</option>
                <option value="system">📢 প্রাতিষ্ঠানিক প্ল্যাটফর্ম বার্তা (System & Governance Notice)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'অগ্রাধিকার স্তর (Priority Level) *' : 'Priority Level *'}
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              >
                <option value="urgent">🔴 সংকটকালীন ও সর্বোচ্চ (Urgent / Critical)</option>
                <option value="high">🟠 উচ্চ অগ্রাধিকার (High Priority)</option>
                <option value="normal">🟢 সাধারণ নোটিশ (Standard / Normal)</option>
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'প্রাপক ও অডিয়েন্স (Target Audience) *' : 'Target Audience *'}
              </label>
              <select
                value={form.targetGroup}
                onChange={(e) => setForm({ ...form, targetGroup: e.target.value as any })}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              >
                <option value="all">👥 সকল নিবন্ধিত রক্তদাতা ও পরিদর্শক (All Donors & Viewers)</option>
                <option value="specific_blood_group">🩸 নির্দিষ্ট রক্তের গ্রুপ (Specific Blood Group)</option>
                <option value="division">📍 নির্দিষ্ট বিভাগীয় অঞ্চল (Specific Division)</option>
                <option value="admins_only">🛡️ শুধুমাত্র সমন্বয়ক ও অ্যাডমিন (Coordinators Only)</option>
              </select>
            </div>

            {form.targetGroup === 'specific_blood_group' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Select Target Blood Group'}
                </label>
                <select
                  value={form.targetValue}
                  onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 font-bold"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            ) : form.targetGroup === 'division' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select Target Division'}
                </label>
                <select
                  value={form.targetValue}
                  onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 font-bold"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.name_en}>{lang === 'bn' ? d.name_bn : d.name_en}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'bn' ? 'প্রেরক পদবি (Sender Authority)' : 'Sender Authority'}
                </label>
                <input
                  type="text"
                  readOnly
                  value={form.sender}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-gray-100 text-gray-600"
                />
              </div>
            )}
          </div>

          {/* Title Inputs (EN & BN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'শিরোনাম (ইংরেজি) *' : 'Alert Title (English) *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Critical Emergency: AB- Blood Needed at DMC"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'শিরোনাম (বাংলা)' : 'Alert Title (Bengali)'}
              </label>
              <input
                type="text"
                placeholder="উদাঃ জরুরি আবেদন: ঢামেকে এবি- রক্তের প্রয়োজন"
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
          </div>

          {/* Message Bodies (EN & BN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'বিজ্ঞপ্তি বার্তা (ইংরেজি) *' : 'Message Body (English) *'}
              </label>
              <textarea
                required
                rows={3}
                placeholder="Enter detailed alert or instructions for donors..."
                value={form.messageEn}
                onChange={(e) => setForm({ ...form, messageEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'bn' ? 'বিজ্ঞপ্তি বার্তা (বাংলা)' : 'Message Body (Bengali)'}
              </label>
              <textarea
                rows={3}
                placeholder="রক্তদাতা ও ব্যবহারকারীদের জন্য বিস্তারিত বার্তা লিখুন..."
                value={form.messageBn}
                onChange={(e) => setForm({ ...form, messageBn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
          </div>

          {/* Target Link */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {lang === 'bn' ? 'অ্যাকশন লিংক (Action Destination Link) *' : 'Destination URL / Action Link *'}
            </label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="/blood-requests or /campaigns or /dashboard/donor"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17] text-white text-xs font-black shadow-md flex items-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'bn' ? 'বিজ্ঞপ্তি সম্প্রচার করুন' : 'Dispatch Live Alert'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
