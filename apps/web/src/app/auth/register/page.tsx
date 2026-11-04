'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BANGLADESH_DIVISIONS, BANGLADESH_KEY_DISTRICTS } from '@lalbindu/api-client';
import { Droplet, ArrowRight, ShieldCheck, CheckCircle2, Lock, Crown, AlertCircle, KeyRound, UserPlus } from 'lucide-react';
import { getCurrentSession, UserSession } from '@/lib/session';
import { createAccountByAuthority, submitPendingApplication } from '@/lib/accounts';

export default function RegisterPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);

  // Form State
  const [roleToCreate, setRoleToCreate] = useState<'donor' | 'co_super_admin' | 'division_admin'>('donor');
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameBn: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    bloodGroup: 'O+',
    dateOfBirth: '2000-01-01',
    divisionId: 'Dhaka',
    districtId: 'Dhaka',
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const activeSession = getCurrentSession();
    setSession(activeSession);
    setIsSuperAdminMode(activeSession.role === 'super_admin' || activeSession.id === 'superadmin' || activeSession.canCreateAccounts === true);

    const handleSessionChange = () => {
      const s = getCurrentSession();
      setSession(s);
      setIsSuperAdminMode(s.role === 'super_admin' || s.id === 'superadmin' || s.canCreateAccounts === true);
    };

    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    return () => window.removeEventListener('lalbindu_session_changed', handleSessionChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.termsAccepted) {
      setStatusMessage({ type: 'error', text: 'Please agree to the LalBindu verification and patient safety charter.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Path A: Super Admin or Delegated Co-Admin Provisioning
      if (isSuperAdminMode && session) {
        const username = formData.username.trim() || formData.email.split('@')[0] || `usr-${Date.now().toString(36)}`;
        const result = createAccountByAuthority(
          {
            name: formData.fullName,
            nameBn: formData.fullNameBn,
            username: username,
            password: formData.password || (roleToCreate === 'co_super_admin' ? 'coadmin' : 'donor123'),
            phone: formData.phone,
            email: formData.email || `${username}@lalbindu.bd`,
            role: roleToCreate,
            bloodGroup: formData.bloodGroup,
            division: formData.divisionId,
            district: formData.districtId
          },
          session.role,
          session.id
        );

        if (!result.success || !result.account) {
          setStatusMessage({ type: 'error', text: result.error || 'Failed to create account.' });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `Account "${result.account.name}" (${result.account.role.toUpperCase()}) successfully provisioned with ID ${result.account.cardId}! Temporary Password: ${result.account.password}`
        });

        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 2000);
        return;
      }

      // Path B: Public Guest Submission for Super Admin Approval
      submitPendingApplication({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || '',
        bloodGroup: formData.bloodGroup,
        divisionId: formData.divisionId,
        districtId: formData.districtId
      });

      setStatusMessage({
        type: 'info',
        text: 'Application submitted! Under the LalBindu Governance Charter, only the National Super Admin (superadmin) can approve and provision accounts. Your request is queued for Super Admin signoff.'
      });

      setFormData({
        fullName: '',
        fullNameBn: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        bloodGroup: 'O+',
        dateOfBirth: '2000-01-01',
        divisionId: 'Dhaka',
        districtId: 'Dhaka',
        termsAccepted: false
      });
    }, 700);
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-14 flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Header */}
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
            {isSuperAdminMode ? 'Account Provisioning Center' : 'Request Official Donor Account'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Authoritative Healthcare Identity Provisioning for Bangladesh
          </p>
        </div>

        {/* Security Directive Banner */}
        {isSuperAdminMode ? (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-brand-burgundy to-[#30080E] text-white shadow-lg border border-amber-500/40 flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-gray-950">
                  Highest Authority Active
                </span>
                <span className="text-[10px] font-mono text-amber-200">ID: {session?.adminId || 'superadmin'}</span>
              </div>
              <p className="text-xs font-bold text-white mt-1">
                You hold exclusive authority to provision new donor, coordinator, or Co-Admin accounts.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Security Policy: Super Admin Clearance
              </span>
              <p className="font-semibold mt-1 leading-relaxed">
                To guarantee zero blood fraud, direct self-registration is closed. Accounts are strictly provisioned by the <strong>National Super Admin (ID: superadmin)</strong> or delegated Co-Admins.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[11px] text-amber-800">Are you the Super Admin?</span>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center space-x-1 font-black text-brand-burgundy hover:underline"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Log in as Super Admin (superadmin / superadmin)</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs flex items-start space-x-2.5 animate-in fade-in ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 text-green-900 border border-green-200' 
              : statusMessage.type === 'info'
              ? 'bg-blue-50 text-blue-900 border border-blue-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />}
            {statusMessage.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
            <span className="font-medium leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* If Super Admin, allow selecting role to provision */}
            {isSuperAdminMode && (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                <label className="block font-black text-gray-900 text-xs">
                  Provision Account Role & Power Level
                </label>
                <select
                  value={roleToCreate}
                  onChange={(e) => setRoleToCreate(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy font-bold text-brand-burgundy"
                >
                  <option value="donor">Voluntary Blood Donor (Verified Digital ID)</option>
                  <option value="co_super_admin">👑 Co-Super Administrator (Delegated Authority)</option>
                  <option value="division_admin">Division Administrator / Regional Coordinator</option>
                </select>
                {roleToCreate === 'co_super_admin' && (
                  <p className="text-[11px] text-amber-800 font-medium">
                    This delegates administrative authority to the new Co-Admin, enabling them to verify donors, approve hospital requests, and dispatch alerts.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Legal Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamal Uddin"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name (Bangla)</label>
                <input
                  type="text"
                  placeholder="উদাঃ কামাল উদ্দিন"
                  value={formData.fullNameBn}
                  onChange={(e) => setFormData({ ...formData, fullNameBn: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile (+880) *</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-bold text-brand-red"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Division *</label>
                <select
                  value={formData.divisionId}
                  onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.name_en}>{d.name_en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Gazipur"
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@lalbindu.bd"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold"
                />
              </div>

              {isSuperAdminMode ? (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assign Initial Password</label>
                  <input
                    type="text"
                    placeholder="e.g. donor123 or coadmin"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Preferred Username (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. kamal.donor"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white font-semibold font-mono"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 space-y-2">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 rounded text-brand-burgundy focus:ring-brand-burgundy"
                />
                <span className="text-[11px] text-gray-700 leading-relaxed">
                  I certify compliance with the LalBindu National Blood Security Charter, confirmed donor health standards, and Super Admin oversight regulations.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-4 text-white ${
                isSuperAdminMode 
                  ? 'bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-[#400B13] hover:to-[#6a0b17]'
                  : 'bg-brand-red hover:bg-brand-crimson'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {loading 
                  ? 'Processing Authority Clearance...' 
                  : isSuperAdminMode 
                  ? 'Provision Account with Super Admin Authority' 
                  : 'Submit Application for Super Admin Approval'}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have an authorized account?{' '}
            <Link href="/auth/login" className="font-bold text-brand-burgundy hover:underline">
              Sign In (superadmin / coadmin)
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
