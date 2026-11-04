'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Lock, ShieldAlert, ArrowRight, X } from 'lucide-react';

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
}

export const AccessRestrictedModal: React.FC<AccessRestrictedModalProps> = ({
  isOpen,
  onClose,
  currentRole
}) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-red-100 text-brand-red flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-[11px] font-black uppercase mb-3 border border-red-200">
          <Lock className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'প্রশাসনিক অনুমতি আবশ্যক' : 'Administrative Clearance Required'}</span>
        </div>

        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
          {lang === 'bn' 
            ? 'রক্তদান কর্মসূচি তৈরির অনুমতি সীমাবদ্ধ' 
            : 'Campaign Creation is Restricted'}
        </h3>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          {lang === 'bn' 
            ? `আপনার বর্তমান ভূমিকা (${currentRole.toUpperCase()}) এর জন্য সরাসরি রক্তদান কর্মসূচি প্রকাশের অনুমতি নেই। ভুয়া বা অনুমতিবিহীন রক্তদান ক্যাম্পেইন রোধে এই সুবিধাটি কেবল সুপার অ্যাডমিনিস্ট্রেটর এবং কেন্দ্রীয় অ্যাডমিন পোর্টাল কর্তৃক অনুমোদিত সমন্বয়কদের জন্য সংরক্ষিত।` 
            : `Your active profile (${currentRole.toUpperCase()}) does not hold blood campaign publishing rights. To prevent unverified drives and ensure patient safety, public drives can only be authorized by Super Administrators or regional coordinators explicitly delegated in the Super Admin Portal.`}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 mb-6">
          <p className="font-bold mb-1">
            {lang === 'bn' ? 'অনুমতি প্রাপ্তির উপায়:' : 'How to Obtain Authorization:'}
          </p>
          <p className="text-[11px] text-amber-800">
            {lang === 'bn'
              ? 'সুপার অ্যাডমিন ড্যাশবোর্ডের "সমন্বয়ক নিয়োগ ও অনুমোদন" সেকশনে সুপার অ্যাডমিন আপনার অ্যাকাউন্টে কর্মসূচি তৈরির অনুমতি যুক্ত করতে পারবেন।'
              : 'The Super Administrator can grant campaign publishing permissions to your administrative account via the Super Admin Delegation Console.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/admin"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-colors shadow-md"
          >
            <span>{lang === 'bn' ? 'সুপার অ্যাডমিন পোর্টালে যান' : 'Go to Super Admin Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
