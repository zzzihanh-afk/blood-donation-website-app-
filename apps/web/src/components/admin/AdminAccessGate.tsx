'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { getCurrentSession, isAuthorizedAdmin, UserSession } from '@/lib/session';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Crown
} from 'lucide-react';

interface AdminAccessGateProps {
  children: React.ReactNode;
}

export const AdminAccessGate: React.FC<AdminAccessGateProps> = ({ children }) => {
  const { lang } = useLanguage();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSession(getCurrentSession());

    const handleSessionChange = () => {
      setSession(getCurrentSession());
    };

    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    return () => {
      window.removeEventListener('lalbindu_session_changed', handleSessionChange);
    };
  }, []);

  if (!mounted || !session) {
    return (
      <div className="min-h-screen bg-[#FFF8F8] flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is an authorized admin, render the admin dashboard content seamlessly
  if (isAuthorizedAdmin(session)) {
    return <>{children}</>;
  }

  // If user is a DONOR or PUBLIC WEBSITE VIEWER, render the strict access barrier
  return (
    <div className="min-h-[85vh] bg-[#FFF8F8] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-10 card-shadow border border-red-100 text-center relative overflow-hidden space-y-6">
        
        {/* Top security accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-burgundy via-brand-red to-brand-crimson" />

        {/* Shield Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 text-brand-red border border-red-200 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 text-brand-red" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-100 text-brand-red border border-red-200 flex items-center space-x-1">
            <Lock className="w-3 h-3 mr-1" />
            <span>{lang === 'bn' ? 'প্রশাসনিক প্রবেশাধিকার সংরক্ষিত' : 'Restricted Administrative Access'}</span>
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
            {lang === 'bn' ? 'সাধারণ রক্তদাতাদের জন্য বন্ধ' : 'Closed Off From Donors & Viewers'}
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {lang === 'bn' 
              ? 'অ্যাডমিন পোর্টাল সাধারণ ব্যবহারকারীদের জন্য উন্মুক্ত নয়' 
              : 'Admin Portal is Closed Off from Donors & Viewers'}
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'লালবিন্দু প্রশাসনিক গভর্নেন্স পোর্টালটি শুধুমাত্র ন্যাশনাল সুপার অ্যাডমিনিস্ট্রেটর এবং অনুমোদিত আঞ্চলিক সমন্বয়কদের জন্য সংরক্ষিত। রক্তদাতা ও সাধারণ দর্শনার্থীরা শুধুমাত্র পাবলিক ওয়েবসাইট ও দাতা প্রোফাইল দেখতে পারবেন।'
              : 'The LalBindu Administrative Governance Suite is strictly closed off to donors and public website viewers. Only authorized National Super Administrators and verified institutional coordinators have clearance to enter this area.'}
          </p>
        </div>

        {/* Current Signed-In Session Information Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-light text-brand-red font-bold flex items-center justify-center border border-red-200">
              <User className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{session.name}</p>
              <p className="text-[11px] text-gray-500">
                {lang === 'bn' ? session.roleLabelBn : session.roleLabelEn}
                {session.donorId && ` • ID: ${session.donorId}`}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-red-100 text-brand-red border border-red-200">
            {lang === 'bn' ? 'প্রবেশাধিকার নেই' : 'Access Denied'}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'পাবলিক ওয়েবসাইটে ফিরে যান' : 'Return to Public Website'}</span>
          </Link>

          <Link
            href="/dashboard/donor"
            className="flex-1 py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <User className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রক্তদাতা ড্যাশবোর্ডে যান' : 'Go to Donor Dashboard'}</span>
          </Link>
        </div>

        {/* Executive / Staff Switcher (For testing or official staff login) */}
        <div className="pt-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-amber-50 to-red-50 border border-amber-300 rounded-2xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-amber-950 flex items-center">
                <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                {lang === 'bn' ? 'সুপার অ্যাডমিন প্রবেশাধিকার (সর্বোচ্চ ক্ষমতা)' : 'Super Admin Clearance (Highest Authority)'}
              </p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                {lang === 'bn' 
                  ? 'আইডি: superadmin | পাসওয়ার্ড: superadmin — শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাকাউন্ট তৈরি ও কো-অ্যাডমিন নিয়োগ করতে পারেন।' 
                  : 'ID: superadmin | Password: superadmin — Only Super Admin holds exclusive authority to create accounts and delegate Co-Admins.'}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl bg-brand-burgundy hover:bg-[#400B13] text-white text-xs font-black shadow-sm whitespace-nowrap transition-colors flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? 'অ্যাডমিন লগইন' : 'Official Admin Login'}</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
