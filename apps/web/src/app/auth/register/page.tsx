'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BANGLADESH_DIVISIONS, BANGLADESH_KEY_DISTRICTS } from '@lalbindu/api-client';
import { Droplet, ArrowRight, ShieldCheck, CheckCircle2, Crown, AlertCircle, Lock, UserPlus, Sparkles, Camera, Upload, Trash2 } from 'lucide-react';
import { getCurrentSession, setCurrentSession, UserSession } from '@/lib/session';
import { getStoredAccounts, saveStoredAccounts, createAccountByAuthority, AccountUser } from '@/lib/accounts';

export default function RegisterPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);
  const [adminMode, setAdminMode] = useState<'donor' | 'executive'>('donor');

  // Form State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [roleToCreate, setRoleToCreate] = useState<'donor' | 'co_super_admin' | 'division_admin'>('donor');
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameBn: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    bloodGroup: 'O+',
    divisionId: 'Dhaka',
    districtId: 'Dhaka',
    avatarUrl: '',
    termsAccepted: false
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const activeSession = getCurrentSession();
    setSession(activeSession);
    const hasHighestPower = activeSession.role === 'super_admin' || activeSession.id === 'superadmin' || activeSession.canCreateAccounts === true;
    setIsSuperAdminMode(hasHighestPower);

    const handleSessionChange = () => {
      const s = getCurrentSession();
      setSession(s);
      setIsSuperAdminMode(s.role === 'super_admin' || s.id === 'superadmin' || s.canCreateAccounts === true);
    };

    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    return () => window.removeEventListener('lalbindu_session_changed', handleSessionChange);
  }, []);

  // Filter districts dynamically based on selected division
  const currentDivisionObj = BANGLADESH_DIVISIONS.find(d => d.name_en === formData.divisionId);
  const filteredDistricts = BANGLADESH_KEY_DISTRICTS.filter(d => 
    currentDivisionObj ? d.division_id === currentDivisionObj.id : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your full legal name.' });
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid mobile number (+880).' });
      return;
    }

    if (!formData.termsAccepted) {
      setStatusMessage({ type: 'error', text: 'Please agree to the voluntary blood donation terms and clinical guidelines.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Path A: Super Admin Provisioning Executive Official (Co-Admin)
      if (isSuperAdminMode && adminMode === 'executive' && session) {
        const username = formData.username.trim() || formData.email.split('@')[0] || `adm-${Date.now().toString(36)}`;
        const result = createAccountByAuthority(
          {
            name: formData.fullName.trim(),
            nameBn: formData.fullNameBn.trim(),
            username: username,
            password: formData.password || (roleToCreate === 'co_super_admin' ? 'coadmin' : 'admin123'),
            phone: formData.phone.trim(),
            email: formData.email.trim() || `${username}@lalbindu.bd`,
            role: roleToCreate,
            bloodGroup: formData.bloodGroup,
            division: formData.divisionId,
            district: formData.districtId,
            avatarUrl: formData.avatarUrl || ''
          },
          session.role,
          session.id
        );

        if (!result.success || !result.account) {
          setStatusMessage({ type: 'error', text: result.error || 'Failed to provision administrative account.' });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `Administrative Account "${result.account.name}" (${result.account.role.toUpperCase()}) provisioned successfully! ID: ${result.account.cardId}, Password: ${result.account.password}`
        });

        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 1200);
        return;
      }

      // Path B: Voluntary Blood Donor Registration -> Immediate Provisioning & Open Dashboard
      const rand4Digits = Math.floor(1000 + Math.random() * 9000);
      const donorCardId = `LB-000${rand4Digits}`;
      const newAccountId = `usr-donor-${Date.now().toString(36)}-${rand4Digits}`;
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      const rawUsername = formData.email 
        ? formData.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') 
        : `donor_${cleanPhone.slice(-6) || rand4Digits}`;
      const username = rawUsername || `donor_${rand4Digits}`;

      const newAccount: AccountUser = {
        id: newAccountId,
        username: username,
        password: formData.password || 'donor123',
        name: formData.fullName.trim(),
        nameBn: formData.fullNameBn.trim() || formData.fullName.trim(),
        email: formData.email.trim() || `${username}@lalbindu.bd`,
        phone: formData.phone.trim(),
        role: 'donor',
        authorityLevel: 'standard',
        status: 'Active',
        bloodGroup: formData.bloodGroup,
        division: formData.divisionId,
        district: formData.districtId,
        cardId: donorCardId,
        isSuperAdmin: false,
        canCreateAccounts: false,
        canDelegateAuthority: false,
        delegatedPermissions: {
          canCreateDonors: false,
          canCreateCoAdmins: false,
          canManageVerifications: false,
          canBroadcastAlerts: false,
          canApproveCampaigns: false,
          canManageIDCards: false
        },
        createdAt: new Date().toISOString(),
        avatarUrl: formData.avatarUrl || ''
      };

      // 1. Save to registered accounts list (allowing login in future)
      const accounts = getStoredAccounts();
      const existingIdx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
      if (existingIdx >= 0) {
        newAccount.username = `${username}_${rand4Digits}`;
      }
      accounts.push(newAccount);
      saveStoredAccounts(accounts);

      // 2. Save active donor profile for instant dashboard & ID card hydration
      const activeDonorProfile = {
        id: newAccountId,
        full_name: formData.fullName.trim(),
        fullNameBn: formData.fullNameBn.trim() || formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${username}@lalbindu.bd`,
        avatar_url: formData.avatarUrl || '',
        donor_id_number: donorCardId,
        blood_group: formData.bloodGroup,
        division_name_en: formData.divisionId,
        district_name_en: formData.districtId,
        upazila_name_en: 'Sadar',
        verified_donation_count: 0,
        availability_status: 'available',
        is_ready_to_donate: true,
        is_profile_verified: true,
        is_phone_verified: true,
        blood_group_verified: true,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('lalbindu_active_donor_profile', JSON.stringify(activeDonorProfile));

      // 3. Immediately switch active session to new donor account
      setCurrentSession(newAccountId);

      // 4. Provide instant feedback & open donor dashboard
      setStatusMessage({
        type: 'success',
        text: `Registration successful! Welcome, ${formData.fullName.trim()}. Opening your Official LalBindu Donor Portal & CR80 Digital ID Card (${donorCardId})...`
      });

      setTimeout(() => {
        router.push('/dashboard/donor');
      }, 400);
    }, 450);
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
            {isSuperAdminMode && adminMode === 'executive' 
              ? 'Executive Authority Provisioning' 
              : 'Register as a Voluntary Donor'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isSuperAdminMode && adminMode === 'executive'
              ? 'Supreme Administrator Portal: Appoint Co-Admins and Regional Coordinators'
              : 'Join thousands of lifesavers across Bangladesh. Receive your verified digital ID card.'}
          </p>
        </div>

        {/* Super Admin Control Bar (Only appears if Super Admin is logged in) */}
        {isSuperAdminMode && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-brand-burgundy to-[#30080E] text-white shadow-lg border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-gray-950">
                    Super Admin Active
                  </span>
                  <span className="text-[10px] font-mono text-amber-200">ID: superadmin</span>
                </div>
                <p className="text-xs text-white/90 mt-0.5">
                  Mode: <span className="font-bold text-amber-300">{adminMode === 'donor' ? 'Voluntary Donor Registration' : 'Executive Co-Admin Delegation'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setAdminMode(adminMode === 'donor' ? 'executive' : 'donor')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                {adminMode === 'donor' ? 'Switch to Co-Admin Mode' : 'Switch to Donor Mode'}
              </button>
              <Link
                href="/dashboard/admin"
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-black transition-all shadow-sm"
              >
                Admin Suite
              </Link>
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* If Super Admin in Executive Mode, allow selecting role & password */}
            {isSuperAdminMode && adminMode === 'executive' && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="block font-black text-gray-900 text-xs">
                  Provision Authority Role & Power Level
                </label>
                <select
                  value={roleToCreate}
                  onChange={(e) => setRoleToCreate(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy font-bold text-brand-burgundy"
                >
                  <option value="co_super_admin">👑 Co-Super Administrator (Delegated Executive Authority)</option>
                  <option value="division_admin">Division Administrator / Regional Coordinator</option>
                  <option value="donor">Voluntary Blood Donor</option>
                </select>
                <p className="text-[11px] text-amber-800 font-medium">
                  {roleToCreate === 'co_super_admin'
                    ? 'Delegates administrative authority to oversee operations, verify donors, and dispatch alerts.'
                    : 'Assigns regional coordination privileges under Super Admin oversight.'}
                </p>
              </div>
            )}

            {/* Full Legal Name */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 text-xs">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="Ahmed Rahman"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-medium text-xs text-gray-900 transition-all"
              />
            </div>

            {/* ID Card Photograph (Option to Add Image for ID) */}
            <div className="bg-red-50/40 border border-dashed border-red-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-gray-800 text-xs">
                  ID Card Photograph (ছবি নির্বাচন করুন)
                </label>
                {formData.avatarUrl ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-300">
                    ✓ Photo Attached
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-gray-500">
                    Optional
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {formData.avatarUrl ? (
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden border-2 border-brand-red shadow-sm shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formData.avatarUrl} 
                      alt="ID Photo Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-14 h-16 rounded-xl bg-gray-100 border border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase">No Photo</span>
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-brand-red border border-brand-red/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.avatarUrl ? 'Change ID Photo' : 'Upload ID Photo'}</span>
                  </button>

                  {formData.avatarUrl ? (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Photo</span>
                    </button>
                  ) : (
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Portrait photo for digital CR80 ID Card. If left blank, no random picture is assigned.
                    </p>
                  )}
                </div>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Mobile (+880) and Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">Mobile (+880) *</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-medium text-xs text-gray-900 transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-bold text-xs text-brand-red transition-all cursor-pointer"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Division and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">Division *</label>
                <select
                  value={formData.divisionId}
                  onChange={(e) => {
                    const newDiv = e.target.value;
                    const firstDistrict = BANGLADESH_KEY_DISTRICTS.find(d => {
                      const div = BANGLADESH_DIVISIONS.find(x => x.name_en === newDiv);
                      return div ? d.division_id === div.id : false;
                    });
                    setFormData({ 
                      ...formData, 
                      divisionId: newDiv, 
                      districtId: firstDistrict ? firstDistrict.name_en : newDiv 
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-medium text-xs text-gray-900 transition-all cursor-pointer"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.name_en}>{d.name_en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">District *</label>
                <select
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-medium text-xs text-gray-900 transition-all cursor-pointer"
                >
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map(d => (
                      <option key={d.id} value={d.name_en}>{d.name_en}</option>
                    ))
                  ) : (
                    <option value={formData.divisionId}>{formData.divisionId}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div>
              <label className="block font-bold text-gray-700 mb-1 text-xs">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 font-medium text-xs text-gray-900 transition-all"
              />
            </div>

            {/* If in executive mode, allow setting temporary password */}
            {isSuperAdminMode && adminMode === 'executive' && (
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">Temporary Password</label>
                <input
                  type="text"
                  placeholder="e.g. coadmin or admin123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white font-mono text-xs"
                />
              </div>
            )}

            {/* Terms and Clinical Screening Guidelines */}
            <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-100/70 text-xs text-gray-700">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] leading-relaxed text-gray-700">
                  I agree to the LalBindu terms of voluntary blood donation, confirm that I am aged 18+ and weigh at least 45kg, and agree to follow clinical screening guidelines.
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer text-white ${
                isSuperAdminMode && adminMode === 'executive'
                  ? 'bg-gradient-to-r from-brand-burgundy to-[#30080E] hover:opacity-95'
                  : 'bg-brand-red hover:bg-brand-crimson'
              }`}
            >
              <span>
                {loading 
                  ? 'Activating Donor Account & Generating ID...' 
                  : isSuperAdminMode && adminMode === 'executive'
                  ? 'Provision Official Administrative Account'
                  : 'Complete Registration & Get ID Card ->'}
              </span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already registered?{' '}
            <Link href="/auth/login" className="font-bold text-brand-red hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
