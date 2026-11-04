'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { 
  CampaignItem, 
  getStoredCampaigns, 
  addCampaign, 
  deleteCampaign, 
  registerCampaignDonor,
  checkCanCreateCampaign,
  getSimulatedRole,
  setSimulatedRole
} from '@/lib/campaigns';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { AccessRestrictedModal } from '@/components/campaigns/AccessRestrictedModal';
import { BANGLADESH_DIVISIONS } from '@lalbindu/api-client';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Lock,
  Trash2,
  Sparkles,
  Filter,
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function CampaignsPage() {
  const { t, lang } = useLanguage();

  // Campaigns list state with localStorage sync
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [registeredCampaignId, setRegisteredCampaignId] = useState<string | null>(null);

  // Role Access Control Simulation State
  const [currentRole, setCurrentRole] = useState<string>('super_admin');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    setCampaigns(getStoredCampaigns());
    const savedRole = getSimulatedRole();
    setCurrentRole(savedRole);
  }, []);

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    setSimulatedRole(newRole);
    const authStatus = checkCanCreateCampaign(newRole);
    setToastMessage(lang === 'bn' 
      ? `অ্যাক্সেস মোড পরিবর্তন করা হয়েছে: ${newRole.toUpperCase()} (${authStatus.allowed ? 'অনুমোদিত' : 'সীমাবদ্ধ'})` 
      : `Switched access context to: ${newRole.toUpperCase()} (${authStatus.allowed ? 'Authorized' : 'Restricted'})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    const auth = checkCanCreateCampaign(currentRole);
    if (auth.allowed) {
      setIsCreateModalOpen(true);
    } else {
      setIsRestrictedModalOpen(true);
    }
  };

  const handleCampaignCreated = (newCamp: CampaignItem) => {
    const updated = addCampaign(newCamp);
    setCampaigns(updated);
    setToastMessage(lang === 'bn' 
      ? `"${newCamp.title_bn || newCamp.title_en}" সফলভাবে প্রকাশিত হয়েছে এবং সর্বজনীন তালিকায় যুক্ত হয়েছে!` 
      : `Campaign "${newCamp.title_en}" published successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteCampaign = (id: string, title: string) => {
    if (!confirm(lang === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" কর্মসূচিটি বাতিল করতে চান?` : `Are you sure you want to remove the campaign "${title}"?`)) {
      return;
    }
    const updated = deleteCampaign(id);
    setCampaigns(updated);
    setToastMessage(lang === 'bn' ? 'কর্মসূচিটি সফলভাবে অপসারণ করা হয়েছে।' : 'Campaign removed successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegister = (id: string) => {
    setRegisteredCampaignId(id);
    const { updated } = registerCampaignDonor(id);
    setCampaigns(updated);
    setToastMessage(lang === 'bn' 
      ? 'আপনি সফলভাবে এই রক্তদান কর্মসূচিতে অংশগ্রহণের নিবন্ধন করেছেন! ক্যাম্পের ২৪ ঘণ্টা পূর্বে আপনাকে এসএমএস অ্যালার্ট পাঠানো হবে।' 
      : 'You have registered for this blood drive! SMS notification will arrive 24 hours prior.');
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filtered campaigns
  const filteredCampaigns = selectedDivision === 'all'
    ? campaigns
    : campaigns.filter(c => c.division.toLowerCase() === selectedDivision.toLowerCase());

  const accessStatus = checkCanCreateCampaign(currentRole);

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Global Action Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-green font-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SUPER ADMIN & ROLE ACCESS CONTROLLER BANNER
            Allows verifying and demonstrating that only Super Admin and authorized 
            coordinators can add campaigns.
           ------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${accessStatus.allowed ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
              {accessStatus.allowed ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  {lang === 'bn' ? 'অ্যাক্সেস কন্ট্রোল ও পোর্টাল স্ট্যাটাস' : 'Access Control & Permission Context'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  accessStatus.allowed ? 'bg-emerald-100 text-brand-green' : 'bg-red-100 text-brand-red'
                }`}>
                  {accessStatus.allowed 
                    ? (lang === 'bn' ? 'কর্মসূচি যুক্ত করার অনুমতিপ্রাপ্ত' : 'Creation Allowed') 
                    : (lang === 'bn' ? 'কেবল পরিদর্শনযোগ্য (সীমাবদ্ধ)' : 'Restricted (Read-Only)')}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 mt-0.5">
                {lang === 'bn' ? accessStatus.reasonBn : accessStatus.reason}
              </p>
            </div>
          </div>

          {/* Quick Role Switcher for Testing Access Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">{t.campaignsPage.viewAsRole}</span>
            <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
              <button
                onClick={() => handleRoleChange('super_admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  currentRole === 'super_admin'
                    ? 'bg-brand-burgundy text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>👑 Super Admin</span>
              </button>
              <button
                onClick={() => handleRoleChange('division_admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  currentRole === 'division_admin'
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🛡️ Division Admin</span>
              </button>
              <button
                onClick={() => handleRoleChange('donor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  currentRole === 'donor'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>👤 Regular Donor</span>
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            PAGE HEADER & CREATE CAMPAIGN ACTION
           ------------------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.campaignsPage.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t.campaignsPage.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              {t.campaignsPage.subtitle}
            </p>
          </div>

          {/* Action Buttons: Add Campaign & Super Admin Portal Link */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action Button to Add Campaign */}
            <button
              onClick={handleOpenCreateModal}
              className={`px-5 py-3 rounded-2xl text-xs font-black shadow-md flex items-center space-x-2 transition-all ${
                accessStatus.allowed
                  ? 'bg-gradient-to-r from-brand-burgundy to-brand-red hover:from-brand-burgundy/90 hover:to-brand-red/90 text-white shadow-red-900/10'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              {accessStatus.allowed ? (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t.campaignsPage.createCampaignBtn}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>{t.campaignsPage.createCampaignBtn}</span>
                  <span className="text-[10px] text-brand-red ml-1 font-bold">({lang === 'bn' ? 'অ্যাডমিন লক' : 'Admin Locked'})</span>
                </>
              )}
            </button>

            {/* Quick Link to Main Admin Portal */}
            <Link
              href="/dashboard/admin"
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-brand-burgundy flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-brand-burgundy" />
              <span>{t.campaignsPage.adminPortalBtn}</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            DIVISION FILTER TABS
           ------------------------------------------------------------------- */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDivision('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedDivision === 'all'
                ? 'bg-brand-burgundy text-white border-brand-burgundy shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.campaignsPage.filterAll} ({campaigns.length})
          </button>
          {BANGLADESH_DIVISIONS.map((div) => {
            const count = campaigns.filter(c => c.division.toLowerCase() === div.name_en.toLowerCase()).length;
            return (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.name_en)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDivision.toLowerCase() === div.name_en.toLowerCase()
                    ? 'bg-brand-burgundy text-white border-brand-burgundy shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {lang === 'bn' ? div.name_bn : div.name_en} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------------------------
            CAMPAIGN CARDS GRID
           ------------------------------------------------------------------- */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 card-shadow space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 text-brand-red flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">
              {lang === 'bn' ? 'এই অঞ্চলে কোনো কর্মসূচি পাওয়া যায়নি' : 'No Campaigns Found for Selected Division'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {lang === 'bn' 
                ? 'সুপার অ্যাডমিন বা অনুমোদিত আঞ্চলিক সমন্বয়ক হিসেবে আপনি নতুন কর্মসূচি প্রকাশ করতে পারেন।' 
                : 'As a Super Administrator or regional coordinator, you can create and publish the first drive.'}
            </p>
            {accessStatus.allowed && (
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-burgundy text-white text-xs font-bold shadow-md hover:bg-brand-burgundy/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t.campaignsPage.createCampaignBtn}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between card-hover relative overflow-hidden group"
              >
                {/* Administrative Authority Stamp */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-brand-red border border-red-200">
                      {t.campaignsPage.upcomingDrive}
                    </span>
                    {camp.isOfficialAdmin && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        <span>{lang === 'bn' ? 'অফিশিয়াল অ্যাডমিন' : 'Admin Verified'}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-brand-green flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1" />
                    {camp.district}
                  </span>
                </div>

                {/* Campaign Titles */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                    {lang === 'bn' ? camp.title_bn : camp.title_en}
                  </h3>
                  <p className="text-xs font-bold text-brand-red mb-3">
                    {lang === 'bn' ? camp.title_en : camp.title_bn}
                  </p>

                  {/* Campaign Schedule & Location Info */}
                  <div className="space-y-2 bg-gray-50 p-3.5 rounded-2xl text-xs text-gray-600 mb-4 border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium">{camp.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{camp.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{lang === 'bn' && camp.venueBn ? camp.venueBn : camp.venue}</span>
                    </div>
                  </div>

                  {/* Organizer & Slot Availability */}
                  <div className="text-xs text-gray-500 space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] truncate max-w-[60%]">
                        {t.campaignsPage.organizerLabel} <strong>{lang === 'bn' && camp.organizerBn ? camp.organizerBn : camp.organizer}</strong>
                      </span>
                      <span className="text-brand-green font-bold text-xs shrink-0">
                        {lang === 'bn' 
                          ? `${camp.slotsAvailable - camp.registeredCount} টি স্লট বাকি`
                          : `${camp.slotsAvailable - camp.registeredCount} ${t.campaignsPage.slotsLeft}`}
                      </span>
                    </div>

                    {/* Approver Credit */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{t.campaignsPage.authorizedBy} <strong className="text-gray-700">{camp.approvedBy}</strong></span>
                      {camp.contactPhone && (
                        <span className="font-mono text-gray-500">{camp.contactPhone}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Button and Super Admin Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleRegister(camp.id)}
                    disabled={registeredCampaignId === camp.id || camp.registeredCount >= camp.slotsAvailable}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                      registeredCampaignId === camp.id
                        ? 'bg-brand-green text-white cursor-default'
                        : camp.registeredCount >= camp.slotsAvailable
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
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

                  {/* Administrative Controls for Super Admin */}
                  {accessStatus.allowed && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-brand-burgundy flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {lang === 'bn' ? 'সুপার অ্যাডমিন নিয়ন্ত্রণ' : 'Admin Controls'}
                      </span>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.title_en)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline flex items-center space-x-1 p-1 rounded"
                        title="Remove Campaign"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t.campaignsPage.deleteBtn}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* -------------------------------------------------------------------
            MODALS
           ------------------------------------------------------------------- */}
        <CreateCampaignModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCampaignCreated}
          approverName={currentRole === 'super_admin' ? 'Md. Rahman Hossain (LA0010001)' : 'Authorized Regional Admin'}
          approverRole={currentRole === 'super_admin' ? 'Super Administrator' : 'Division Administrator'}
        />

        <AccessRestrictedModal
          isOpen={isRestrictedModalOpen}
          onClose={() => setIsRestrictedModalOpen(false)}
          currentRole={currentRole}
        />

      </div>
    </div>
  );
}
