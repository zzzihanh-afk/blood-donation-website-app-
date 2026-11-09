'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Lock, ArrowRight, ShieldCheck, Droplet, CheckCircle2, Crown, AlertCircle, KeyRound, UserCheck, Eye, EyeOff } from 'lucide-react';
import { normalizeBangladeshPhone } from '@lalbindu/validation';
import { authenticateAccount } from '@/lib/accounts';
import { setCurrentSession, getCurrentSession, logoutSession, isAuthenticatedSession, UserSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'credentials' | 'phone'>('credentials');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setActiveSession(getCurrentSession());
    const handleSessionChange = () => setActiveSession(getCurrentSession());
    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    return () => window.removeEventListener('lalbindu_session_changed', handleSessionChange);
  }, []);

  // Auto-fill Super Admin credentials
  const handleQuickSuperAdminFill = () => {
    setAuthMode('credentials');
    setIdentifier('superadmin');
    setPassword('superadmin');
    setErrorMessage('');
  };

  // Auto-fill Co-Admin credentials
  const handleQuickCoAdminFill = () => {
    setAuthMode('credentials');
    setIdentifier('coadmin');
    setPassword('coadmin');
    setErrorMessage('');
  };

  // Direct Credentials Login (Handles Super Admin, Co-Admin, and provisioned accounts)
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    setTimeout(() => {
      const result = authenticateAccount(identifier, password);

      if (!result.success || !result.account) {
        setLoading(false);
        setErrorMessage(result.error || 'Invalid credentials. Only accounts provisioned by the Super Admin can sign in.');
        return;
      }

      const acc = result.account;
      setLoading(false);

      if (acc.role === 'super_admin' || acc.id === 'superadmin') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        setCurrentSession(acc.id === 'superadmin' ? 'superadmin' : acc.id);
        setSuccessMessage('National Super Admin Authenticated! Entering Administrative Suite...');
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 600);
      } else if (acc.role === 'co_super_admin' || acc.authorityLevel === 'co_admin') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        setCurrentSession(acc.id);
        setSuccessMessage('Co-Administrator Authenticated under Super Admin Delegation!');
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 600);
      } else if (acc.role === 'district_admin') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        setCurrentSession(acc.id);
        setSuccessMessage(`District Administrator (${acc.district || 'District'}) Authenticated! Entering Administrative Suite...`);
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 600);
      } else if (acc.role === 'division_admin') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        setCurrentSession(acc.id);
        setSuccessMessage(`Division Administrator (${acc.division || 'Division'}) Authenticated! Entering Administrative Suite...`);
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 600);
      } else if (acc.role === 'upazila_admin' || acc.role === 'hospital_admin') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        setCurrentSession(acc.id);
        setSuccessMessage('Regional Administrative Officer Authenticated! Entering Administrative Suite...');
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 600);
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('lalbindu_superadmin_masquerading');
        }
        const donorProfile = {
          id: acc.id,
          full_name: acc.name,
          fullNameBn: acc.nameBn || acc.name,
          phone: acc.phone,
          email: acc.email,
          avatar_url: acc.avatarUrl || '',
          donor_id_number: acc.cardId,
          blood_group: acc.bloodGroup || 'O+',
          division_name_en: acc.division || 'Dhaka',
          district_name_en: acc.district || 'Dhaka',
          upazila_name_en: acc.upazila || 'Sadar',
          verified_donation_count: typeof (acc as any).verified_donation_count === 'number' ? (acc as any).verified_donation_count : (acc.cardId === 'LB-0004278' ? 5 : 0),
          last_donation_date: (acc as any).last_donation_date || (acc.cardId === 'LB-0004278' ? '2026-08-10' : null),
          availability_status: 'available',
          is_ready_to_donate: true,
          is_profile_verified: true,
          is_phone_verified: true,
          blood_group_verified: true,
          created_at: acc.createdAt || new Date().toISOString()
        };
        try {
          localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(donorProfile));
        } catch (e) {}
        setCurrentSession(acc.id);
        setSuccessMessage(`Welcome back, ${acc.name}! Entering Donor Dashboard...`);
        setTimeout(() => {
          router.push('/dashboard/donor');
        }, 500);
      }
    }, 500);
  };

  // Phone OTP Flow for Donors
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        const rawAccounts = localStorage.getItem('lalbindu_registered_accounts_v1');
        if (rawAccounts) {
          const accounts = JSON.parse(rawAccounts);
          const cleanInput = phone.replace(/[^0-9]/g, '');
          const match = accounts.find((a: any) => a.role === 'donor' && a.phone.replace(/[^0-9]/g, '').endsWith(cleanInput));
          if (match) {
            const donorProfile = {
              id: match.id,
              full_name: match.name,
              fullNameBn: match.nameBn || match.name,
              phone: match.phone,
              email: match.email,
              avatar_url: match.avatarUrl || '',
              donor_id_number: match.cardId,
              blood_group: match.bloodGroup || 'O+',
              division_name_en: match.division || 'Dhaka',
              district_name_en: match.district || 'Dhaka',
              upazila_name_en: match.upazila || 'Sadar',
              verified_donation_count: typeof (match as any).verified_donation_count === 'number' ? (match as any).verified_donation_count : (match.cardId === 'LB-0004278' ? 5 : 0),
              last_donation_date: (match as any).last_donation_date || (match.cardId === 'LB-0004278' ? '2026-08-10' : null),
              availability_status: 'available',
              is_ready_to_donate: true,
              is_profile_verified: true,
              is_phone_verified: true,
              blood_group_verified: true,
              created_at: match.createdAt || new Date().toISOString()
            };
            localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(donorProfile));
            setCurrentSession(match.id);
            router.push('/dashboard/donor');
            return;
          }
        }
      } catch (e) {}
      setCurrentSession('donor');
      router.push('/dashboard/donor');
    }, 800);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block relative w-48 h-12 mb-3">
            <Image 
              src="/branding/lalbindu-logo.png" 
              alt="LalBindu Logo" 
              fill 
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign In to LalBindu
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Authoritative Healthcare & Emergency Blood Network of Bangladesh
          </p>
        </div>

        {/* Active Session Notice & Immediate Logout Action */}
        {activeSession && isAuthenticatedSession(activeSession) && (
          <div className="p-4 rounded-3xl bg-amber-50/90 border border-amber-200 text-xs flex items-center justify-between gap-3 text-amber-950 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
                <UserCheck className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Signed in as {activeSession.name}</p>
                <p className="text-[10px] text-amber-800 font-medium">
                  {activeSession.email || activeSession.roleLabelEn || 'Active User Session'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logoutSession();
                setSuccessMessage('Successfully logged out.');
                setTimeout(() => setSuccessMessage(''), 2500);
              }}
              className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Log Out
            </button>
          </div>
        )}

        {/* Super Admin Credentials Showcase Card */}
        <div className="bg-gradient-to-r from-brand-burgundy to-[#30080E] rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-white">
            <Crown className="w-32 h-32" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Highest Authority Access</span>
            </span>
            <span className="text-[10px] font-mono text-gray-300">Supreme Role</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
              <span>National Super Admin Credentials</span>
            </h3>
            <p className="text-[11px] text-gray-300">
              Holds highest authority. Only Super Admin can create accounts and delegate Co-Admins.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-black/30 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-gray-400 block font-sans">Super Admin ID:</span>
              <strong className="text-amber-300 text-xs">superadmin</strong>
            </div>
            <div className="bg-black/30 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-gray-400 block font-sans">Password:</span>
              <strong className="text-amber-300 text-xs">superadmin</strong>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickSuperAdminFill}
              className="flex-1 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-[11px] font-black transition-colors flex items-center justify-center space-x-1 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Auto-Fill Super Admin</span>
            </button>
            <button
              type="button"
              onClick={handleQuickCoAdminFill}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors flex items-center justify-center space-x-1 border border-white/20"
              title="Dr. Nusrat Jahan (Co-Admin delegated by Super Admin)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Co-Admin (coadmin)</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          
          {/* Auth Mode Toggle */}
          <div className="flex rounded-2xl bg-gray-100 p-1 mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('credentials');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'credentials'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ID & Password (Admin / Donor)
            </button>
            <button
              onClick={() => {
                setAuthMode('phone');
                setOtpSent(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mobile OTP (+880)
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-brand-red text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-green-50 border border-green-200 text-brand-green text-xs flex items-start space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Credentials Form (Super Admin, Co-Admin, Provisioned Users) */}
          {authMode === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile (+880) / Donor ID (LB-...) / Username / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 018XXXXXXXX, LB-0082782, or superadmin"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  <span className="text-[10px] text-gray-400">Default for demo: donor123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 focus:border-brand-burgundy font-mono"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Verifying Account...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Mobile OTP Form */}
          {authMode === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Bangladesh Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      A 6-digit verification code will be sent to your number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-brand-red flex items-center justify-between">
                    <span>Code sent to <strong>{normalizeBangladeshPhone(phone)}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[10px] underline font-bold"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-black py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify & Enter Dashboard'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 space-y-1">
            <p>
              Want to donate blood and get your official digital ID card?{' '}
              <Link href="/auth/register" className="font-bold text-brand-red hover:underline">
                Create Donor Account (Public)
              </Link>
            </p>
            <p className="text-[10px] text-gray-400">
              * Note: Public registration creates Voluntary Donor accounts only. Administrative and Co-Admin roles are exclusively provisioned under Super Admin authority.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
