'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { CR80IDCard } from '@/components/id-card/CR80IDCard';
import { REFERENCE_SAMPLE_PROFILES } from '@lalbindu/api-client';
import { 
  LandmarkWatermark, 
  CardBadgeIcon, 
  CardFrontDesignConfig, 
  CardBackDesignConfig, 
  CardDesignSettings,
  IdCardTemplateAuditLog
} from '@lalbindu/shared-types';
import { 
  CreditCard, 
  Palette, 
  Layers, 
  Sliders, 
  Save, 
  Upload, 
  CheckCircle, 
  Clock, 
  History, 
  Copy, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  Download, 
  Printer, 
  Share2, 
  ArrowLeft,
  Settings2,
  FileCheck,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Monitor,
  Smartphone,
  ChevronRight,
  Check
} from 'lucide-react';

interface RoleTemplateState {
  id: string;
  roleId: string;
  roleNameEn: string;
  roleNameBn: string;
  category: 'administrative' | 'community' | 'healthcare';
  status: 'published' | 'draft' | 'archived';
  versionTag: string;
  frontConfig: CardFrontDesignConfig;
  backConfig: CardBackDesignConfig;
  settings: CardDesignSettings;
}

const INITIAL_ROLE_TEMPLATES: Record<string, RoleTemplateState> = {
  super_admin: {
    id: 'tpl-super-admin',
    roleId: 'super_admin',
    roleNameEn: 'Super Administrator',
    roleNameBn: 'প্রধান প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'smriti_soudho',
      badgeIcon: 'gold_star'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#580F1A',
      secondaryColor: '#30080E',
      accentColor: '#D4AF37',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Super Admin',
      ribbonLabelBn: 'প্রধান প্রশাসক'
    }
  },
  division_admin: {
    id: 'tpl-division-admin',
    roleId: 'division_admin',
    roleNameEn: 'Division Administrator',
    roleNameBn: 'বিভাগীয় প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'sangsad_bhaban',
      badgeIcon: 'star'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#0D3B66',
      secondaryColor: '#062038',
      accentColor: '#F4D35E',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Division Administrator',
      ribbonLabelBn: 'বিভাগীয় প্রশাসক'
    }
  },
  district_admin: {
    id: 'tpl-district-admin',
    roleId: 'district_admin',
    roleNameEn: 'District Administrator',
    roleNameBn: 'জেলা প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'ahsan_manzil',
      badgeIcon: 'fort'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#006A4E',
      secondaryColor: '#004532',
      accentColor: '#A7F3D0',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'District Administrator',
      ribbonLabelBn: 'জেলা প্রশাসক'
    }
  },
  upazila_admin: {
    id: 'tpl-upazila-admin',
    roleId: 'upazila_admin',
    roleNameEn: 'Upazila Administrator',
    roleNameBn: 'উপজেলা প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'shat_gombuj',
      badgeIcon: 'mosque'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#D84A1B',
      secondaryColor: '#93300E',
      accentColor: '#FED7AA',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Upazila Administrator',
      ribbonLabelBn: 'উপজেলা প্রশাসক'
    }
  },
  thana_admin: {
    id: 'tpl-thana-admin',
    roleId: 'thana_admin',
    roleNameEn: 'Metropolitan Thana Administrator',
    roleNameBn: 'মেট্রোপলিটন থানা প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'smriti_soudho',
      badgeIcon: 'building'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#008080',
      secondaryColor: '#004C4C',
      accentColor: '#99F6E4',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Metropolitan Thana Administrator',
      ribbonLabelBn: 'মেট্রোপলিটন থানা প্রশাসক'
    }
  },
  union_admin: {
    id: 'tpl-union-admin',
    roleId: 'union_admin',
    roleNameEn: 'Union Administrator',
    roleNameBn: 'ইউনিয়ন প্রশাসক',
    category: 'administrative',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'ahsan_manzil',
      badgeIcon: 'star'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#4A154B',
      secondaryColor: '#2B082C',
      accentColor: '#E9D5FF',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Union Administrator',
      ribbonLabelBn: 'ইউনিয়ন সমন্বয়ক'
    }
  },
  donor: {
    id: 'tpl-donor',
    roleId: 'donor',
    roleNameEn: 'Voluntary Blood Donor',
    roleNameBn: 'স্বেচ্ছাসেবী রক্তদাতা',
    category: 'community',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: false,
      showBloodGroup: true,
      showDonations: true,
      showValidity: true,
      watermarkType: 'blood_drop',
      badgeIcon: 'community'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'blood_drop'
    },
    settings: {
      primaryColor: '#006A4E',
      secondaryColor: '#C8102E',
      accentColor: '#C8102E',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Donor',
      ribbonLabelBn: 'রক্তদাতা'
    }
  },
  volunteer: {
    id: 'tpl-volunteer',
    roleId: 'volunteer',
    roleNameEn: 'Platform Volunteer',
    roleNameBn: 'প্ল্যাটফর্ম স্বেচ্ছাসেবক',
    category: 'community',
    status: 'published',
    versionTag: 'v1.0.0',
    frontConfig: {
      showLogo: true,
      showPhoto: true,
      showBadge: true,
      showJurisdiction: true,
      showValidity: true,
      watermarkType: 'volunteers',
      badgeIcon: 'user'
    },
    backConfig: {
      showQr: true,
      showVerifyBadge: true,
      showSlogan: true,
      watermarkType: 'bd_map'
    },
    settings: {
      primaryColor: '#1B4931',
      secondaryColor: '#0C2618',
      accentColor: '#A7F3D0',
      textColor: '#171717',
      borderRadius: '24px',
      ribbonLabel: 'Volunteer',
      ribbonLabelBn: 'স্বেচ্ছাসেবক'
    }
  }
};

const SAMPLE_AUDIT_LOGS: IdCardTemplateAuditLog[] = [
  {
    id: 'log-01',
    template_id: 'tpl-super-admin',
    action: 'VERSION_PUBLISHED',
    previous_version_tag: 'v0.9.0',
    new_version_tag: 'v1.0.0',
    performed_by_name: 'Md. Rahman Hossain (Super Admin)',
    created_at: '2026-11-03 12:45 PM',
    details: { change: 'Refined CR80 burgundy wave and Jatiyo Smriti Soudho watermark' }
  },
  {
    id: 'log-02',
    template_id: 'tpl-donor',
    action: 'VERSION_PUBLISHED',
    previous_version_tag: 'v0.9.5',
    new_version_tag: 'v1.0.0',
    performed_by_name: 'Md. Rahman Hossain (Super Admin)',
    created_at: '2026-11-03 11:30 AM',
    details: { change: 'Added prominent red blood group circle badge and total donation count' }
  },
  {
    id: 'log-03',
    template_id: 'tpl-district-admin',
    action: 'DRAFT_SAVED',
    new_version_tag: 'v1.0.1-draft',
    performed_by_name: 'Farhana Akter (Admin Lead)',
    created_at: '2026-11-03 10:15 AM',
    details: { change: 'Tested emerald green accent with Ahsan Manzil heritage watermark' }
  }
];

export default function IdCardTemplateDesignerPage() {
  const { lang } = useLanguage();
  const [templates, setTemplates] = useState<Record<string, RoleTemplateState>>(INITIAL_ROLE_TEMPLATES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('super_admin');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('prof-super-admin');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [auditLogsOpen, setAuditLogsOpen] = useState<boolean>(false);
  const [migrationModalOpen, setMigrationModalOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const currentTemplate = templates[selectedRoleId] || templates['super_admin'];
  const currentProfile = REFERENCE_SAMPLE_PROFILES.find((p: any) => p.id === selectedProfileId) || REFERENCE_SAMPLE_PROFILES[0];

  // Keep profile synchronized with selected role
  useEffect(() => {
    const matchedProfile = REFERENCE_SAMPLE_PROFILES.find((p: any) => p.role_id === selectedRoleId);
    if (matchedProfile) {
      setSelectedProfileId(matchedProfile.id);
    }
  }, [selectedRoleId]);

  // Update front configuration property
  const updateFrontConfig = (key: keyof CardFrontDesignConfig, val: any) => {
    setTemplates(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        status: 'draft',
        frontConfig: {
          ...prev[selectedRoleId].frontConfig,
          [key]: val
        }
      }
    }));
  };

  // Update back configuration property
  const updateBackConfig = (key: keyof CardBackDesignConfig, val: any) => {
    setTemplates(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        status: 'draft',
        backConfig: {
          ...prev[selectedRoleId].backConfig,
          [key]: val
        }
      }
    }));
  };

  // Update design settings
  const updateSettings = (key: keyof CardDesignSettings, val: string) => {
    setTemplates(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        status: 'draft',
        settings: {
          ...prev[selectedRoleId].settings,
          [key]: val
        }
      }
    }));
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    setTemplates(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        status: 'draft'
      }
    }));
    setSaveToast(lang === 'bn' ? 'ড্রাফট টেমপ্লেট সফলভাবে সংরক্ষিত হয়েছে!' : 'Template draft successfully saved!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Handle Publish Template
  const handlePublish = () => {
    // Parse version increment
    const currentVer = currentTemplate.versionTag;
    const parts = currentVer.replace('v', '').split('.').map(Number);
    const nextVer = `v${parts[0]}.${parts[1] + 1}.0`;

    setTemplates(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        status: 'published',
        versionTag: nextVer
      }
    }));

    setSaveToast(lang === 'bn' ? `টেমপ্লেট সংস্করণ ${nextVer} প্রকাশিত হয়েছে!` : `Template version ${nextVer} published live!`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  // Handle Rollback
  const handleRollback = () => {
    if (confirm(lang === 'bn' ? 'আপনি কি পূর্ববর্তী সংস্করণে ফিরে যেতে চান?' : 'Roll back to previous published version?')) {
      setTemplates(prev => ({
        ...prev,
        [selectedRoleId]: {
          ...INITIAL_ROLE_TEMPLATES[selectedRoleId],
          status: 'published'
        }
      }));
      setSaveToast(lang === 'bn' ? 'পূর্ববর্তী সংস্করণ সফলভাবে পুনর্বহাল করা হয়েছে।' : 'Rolled back to original published version.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-6 sm:py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header & Breadcrumb */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
              <Link href="/dashboard/admin" className="hover:text-brand-red flex items-center">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {lang === 'bn' ? 'প্রশাসক ড্যাশবোর্ড' : 'Admin Suite'}
              </Link>
              <span>/</span>
              <span className="text-brand-red font-bold">{lang === 'bn' ? 'আইডি কার্ড টেমপ্লেট ডিজাইনার' : 'ID Card Template Designer'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-light flex items-center justify-center text-brand-red font-black shadow-sm border border-brand-red/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {lang === 'bn' ? 'সুপার অ্যাডমিন আইডি কার্ড টেমপ্লেট স্টুডিও' : 'Super Admin ID Card Template Studio'}
                </h1>
                <p className="text-xs text-gray-500">
                  {lang === 'bn' 
                    ? 'কোড পরিবর্তন ছাড়াই প্রতিটি পদের জন্য প্রিমিয়াম সিআর৮০ পরিচয়পত্র কাস্টমাইজ, প্রিভিউ ও প্রকাশ করুন।' 
                    : 'Design, customize, preview, and publish CR80 identity cards across all roles without touching code.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAuditLogsOpen(true)}
              className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition-all flex items-center space-x-1.5"
            >
              <History className="w-3.5 h-3.5 text-gray-500" />
              <span>{lang === 'bn' ? 'অডিট লগ' : 'Audit Logs'}</span>
            </button>

            <button
              onClick={() => setMigrationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-light hover:bg-red-100 text-brand-red text-xs font-bold border border-brand-red/20 transition-all flex items-center space-x-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'কার্ড রি-ইস্যু / মাইগ্রেশন' : 'Migrate Cards'}</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-green font-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Roles Quick Switcher Tab Bar */}
        <div className="bg-white rounded-2xl p-2.5 card-shadow border border-gray-100 flex items-center space-x-2 overflow-x-auto">
          {Object.values(templates).map((tpl) => {
            const isSelected = selectedRoleId === tpl.roleId;
            return (
              <button
                key={tpl.roleId}
                onClick={() => setSelectedRoleId(tpl.roleId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-brand-red text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.settings.primaryColor }} />
                <span>{lang === 'bn' ? tpl.roleNameBn : tpl.roleNameEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {tpl.versionTag}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            THREE-PANEL VISUAL TEMPLATE DESIGNER
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* -----------------------------------------------------------------------
              LEFT PANEL: DESIGN ELEMENTS & FIELD TOGGLES (Col span 3)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 card-shadow border border-gray-100 space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Layers className="w-4 h-4 text-brand-red" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                {lang === 'bn' ? 'কার্ড উপাদান ও ফিল্ড' : 'Card Elements & Fields'}
              </h2>
            </div>

            {/* Front Field Toggles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'bn' ? 'সম্মুখ ভাগ (Front Side)' : 'Front Side Fields'}
              </h3>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'লালবিন্দু অফিশিয়াল লোগো' : 'Official LalBindu Logo'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.frontConfig.showLogo}
                  onChange={(e) => updateFrontConfig('showLogo', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'সদস্যের ছবি' : 'Profile Photograph'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.frontConfig.showPhoto}
                  onChange={(e) => updateFrontConfig('showPhoto', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'পদবি ও ব্যাজ প্রতীক' : 'Role Badge Emblem'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.frontConfig.showBadge}
                  onChange={(e) => updateFrontConfig('showBadge', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'এখতিয়ার / সংস্থা' : 'Jurisdiction / Org'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.frontConfig.showJurisdiction}
                  onChange={(e) => updateFrontConfig('showJurisdiction', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'রক্তের গ্রুপ ক্রেস্ট' : 'Blood Group Crest (Donor)'}</span>
                <input
                  type="checkbox"
                  checked={!!currentTemplate.frontConfig.showBloodGroup}
                  onChange={(e) => updateFrontConfig('showBloodGroup', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'মোট রক্তদান সংখ্যা' : 'Donation Count (Donor)'}</span>
                <input
                  type="checkbox"
                  checked={!!currentTemplate.frontConfig.showDonations}
                  onChange={(e) => updateFrontConfig('showDonations', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'মেয়াদ উত্তীর্ণের তারিখ' : 'Validity Expiry Date'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.frontConfig.showValidity}
                  onChange={(e) => updateFrontConfig('showValidity', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>
            </div>

            {/* Landmark / Architectural Watermark */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700 block">
                {lang === 'bn' ? 'ঐতিহাসিক স্থাপনা ওয়াটারমার্ক' : 'Architectural Watermark'}
              </label>
              <select
                value={currentTemplate.frontConfig.watermarkType}
                onChange={(e) => updateFrontConfig('watermarkType', e.target.value as LandmarkWatermark)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 font-medium"
              >
                <option value="smriti_soudho">জাতীয় স্মৃতিসৌধ (Smriti Soudho)</option>
                <option value="sangsad_bhaban">জাতীয় সংসদ ভবন (Sangsad Bhaban)</option>
                <option value="ahsan_manzil">আহসান মঞ্জিল / লালবাগ কেল্লা (Ahsan Manzil)</option>
                <option value="shat_gombuj">ষাট গম্বুজ মসজিদ (Sixty Dome Mosque)</option>
                <option value="blood_drop">লালবিন্দু রক্তের ফোঁটা (LalBindu Drop)</option>
                <option value="volunteers">স্বেচ্ছাসেবক দল (Community Volunteers)</option>
                <option value="bd_map">বাংলাদেশ মানচিত্র (BD Map)</option>
                <option value="none">কোনোটি নয় (None)</option>
              </select>
            </div>

            {/* Back Field Toggles */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'bn' ? 'বিপরীত ভাগ (Back Side)' : 'Back Side Fields'}
              </h3>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'যাচাই কিউআর কোড' : 'Verification QR Code'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.backConfig.showQr}
                  onChange={(e) => updateBackConfig('showQr', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? '"SCAN TO VERIFY" ব্যাজ' : '"SCAN TO VERIFY" Badge'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.backConfig.showVerifyBadge}
                  onChange={(e) => updateBackConfig('showVerifyBadge', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>{lang === 'bn' ? 'অঙ্গীকার স্লোগান রিবন' : 'Slogan Footer Ribbon'}</span>
                <input
                  type="checkbox"
                  checked={currentTemplate.backConfig.showSlogan}
                  onChange={(e) => updateBackConfig('showSlogan', e.target.checked)}
                  className="rounded text-brand-red focus:ring-brand-red w-4 h-4"
                />
              </label>
            </div>

            {/* Allowed Dynamic Fields Registry */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Dynamic Variables Registry
              </span>
              <div className="flex flex-wrap gap-1 text-[9px] font-mono text-gray-600">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{full_name}}'}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{unique_id}}'}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{role_name}}'}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{jurisdiction}}'}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{blood_group}}'}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{'{{qr_token}}'}</span>
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              CENTER PANEL: LIVE INTERACTIVE CR80 PREVIEW (Col span 6)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between space-y-6">
            
            {/* Preview Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-brand-red" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  {lang === 'bn' ? 'লাইভ সিআর৮০ প্রিভিউ' : 'CR80 Live Preview'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  currentTemplate.status === 'published'
                    ? 'bg-green-100 text-brand-green'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentTemplate.status} • {currentTemplate.versionTag}
                </span>
              </div>

              {/* Sample Profile Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-gray-500">
                  {lang === 'bn' ? 'স্যাম্পল প্রোফাইল:' : 'Sample Profile:'}
                </span>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="text-xs p-1.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold focus:outline-none"
                >
                  {REFERENCE_SAMPLE_PROFILES.map((prof: any) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.full_name} ({prof.unique_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Render Stage */}
            <div className="py-6 px-4 bg-[#F8FAFC] rounded-3xl border border-gray-100 flex items-center justify-center min-h-[380px] relative overflow-hidden">
              
              <CR80IDCard
                roleId={selectedRoleId}
                fullName={currentProfile.full_name}
                fullNameBn={currentProfile.full_name_bn}
                designation={currentProfile.designation_en}
                designationBn={currentProfile.designation_bn}
                uniqueId={currentProfile.unique_id}
                avatarUrl={currentProfile.avatar_url}
                organizationName={currentProfile.organization_name}
                jurisdictionName={currentProfile.jurisdiction_en}
                bloodGroup={currentProfile.blood_group}
                donationCount={currentProfile.donation_count}
                validUntil={currentProfile.valid_until}
                verificationToken={currentProfile.verification_token}
                frontConfig={currentTemplate.frontConfig}
                backConfig={currentTemplate.backConfig}
                settings={currentTemplate.settings}
                scale={zoomLevel}
                interactiveFlip={true}
                showActions={true}
                isDemo={true}
              />

            </div>

            {/* Bottom Preview Controls (Zoom & Side toggles) */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(1.2, zoomLevel + 0.1))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="text-[10px] font-bold text-gray-500 hover:text-brand-red ml-2"
                >
                  {lang === 'bn' ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              <div className="text-[11px] text-gray-400">
                CR80 Spec: 85.6mm × 54mm (1.586 : 1 Aspect Ratio)
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              RIGHT PANEL: DESIGN SETTINGS & PUBLISHING (Col span 3)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 card-shadow border border-gray-100 space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Palette className="w-4 h-4 text-brand-red" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                {lang === 'bn' ? 'রং ও প্রকাশনা সেটিংস' : 'Styling & Publishing'}
              </h2>
            </div>

            {/* Color Customization Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'bn' ? 'প্রধান রং (Primary Color)' : 'Primary Accent Color'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentTemplate.settings.primaryColor}
                    onChange={(e) => updateSettings('primaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={currentTemplate.settings.primaryColor}
                    onChange={(e) => updateSettings('primaryColor', e.target.value)}
                    className="flex-1 text-xs font-mono p-2 rounded-xl border border-gray-200 bg-gray-50 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'bn' ? 'গৌণ ওয়েভ রং (Secondary Color)' : 'Secondary Wave Tint'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentTemplate.settings.secondaryColor}
                    onChange={(e) => updateSettings('secondaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={currentTemplate.settings.secondaryColor}
                    onChange={(e) => updateSettings('secondaryColor', e.target.value)}
                    className="flex-1 text-xs font-mono p-2 rounded-xl border border-gray-200 bg-gray-50 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'bn' ? 'টপ রিবন লেবেল (Header Ribbon)' : 'Top Header Ribbon Label'}
                </label>
                <input
                  type="text"
                  value={currentTemplate.settings.ribbonLabel}
                  onChange={(e) => updateSettings('ribbonLabel', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'bn' ? 'ব্যাজ প্রতীক (Badge Icon)' : 'Badge Emblem Icon'}
                </label>
                <select
                  value={currentTemplate.frontConfig.badgeIcon}
                  onChange={(e) => updateFrontConfig('badgeIcon', e.target.value as CardBadgeIcon)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-medium"
                >
                  <option value="gold_star">গোল্ডেন স্টার (Gold Rosette Star)</option>
                  <option value="star">রয়েল স্টার (Royal Blue Star)</option>
                  <option value="fort">কেল্লা প্রতীক (Historic Fort)</option>
                  <option value="mosque">ঐতিহ্য প্রতীক (Heritage Terracotta)</option>
                  <option value="building">আধুনিক স্থাপত্য (Building)</option>
                  <option value="community">কমিউনিটি রক্তদাতা (Community)</option>
                  <option value="user">যাচাইকৃত ব্যবহারকারী (Shield User)</option>
                </select>
              </div>
            </div>

            {/* Publishing & Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveDraft}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Save className="w-4 h-4 text-gray-600" />
                <span>{lang === 'bn' ? 'ড্রাফট হিসেবে সংরক্ষণ' : 'Save as Draft'}</span>
              </button>

              <button
                onClick={handlePublish}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-brand-red/20"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'নতুন সংস্করণ প্রকাশ করুন (Publish)' : 'Publish Live Version'}</span>
              </button>

              <button
                onClick={handleRollback}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-brand-red border border-gray-200 text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'পূর্ববর্তী সংস্করণে রোলব্যাক' : 'Rollback to Previous Version'}</span>
              </button>
            </div>

            {/* Safe Notice */}
            <p className="text-[10px] text-gray-400 italic leading-relaxed pt-2">
              {lang === 'bn' 
                ? '* কোনো টেমপ্লেট প্রকাশ করলে পূর্বে ইস্যুকৃত সচল কার্ডগুলি অপরিবর্তিত থাকে যদি না আপনি স্পষ্টভাবে মাইগ্রেশন বা রি-ইস্যু অনুমোদন করেন।' 
                : '* Publishing a template applies to new cards. Previously issued active cards preserve their original version unless reissuance is explicitly triggered.'}
            </p>

          </div>

        </div>

      </div>

      {/* =========================================================================
          AUDIT LOGS MODAL / DRAWER
         ========================================================================= */}
      {auditLogsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 card-shadow border border-gray-100 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-black text-gray-900">
                  {lang === 'bn' ? 'আইডি কার্ড টেমপ্লেট অডিট লগ ও পরিবর্তনের ইতিহাস' : 'ID Card Template Audit Logs & Modification History'}
                </h3>
              </div>
              <button
                onClick={() => setAuditLogsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 divide-y divide-gray-100">
              {SAMPLE_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-red text-[10px] font-mono font-bold">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {log.created_at}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {log.performed_by_name}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {log.details?.change}
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">
                    Template: {log.template_id} • {log.previous_version_tag ? `${log.previous_version_tag} → ` : ''}{log.new_version_tag}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setAuditLogsOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BULK CARD REISSUANCE / MIGRATION MODAL
         ========================================================================= */}
      {migrationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 card-shadow border border-gray-100 relative">
            <div className="flex items-center space-x-2 text-brand-red mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-black text-gray-900">
                {lang === 'bn' ? 'কার্ড টেমপ্লেট মাইগ্রেশন ও রি-ইস্যু পলিসি' : 'Template Migration & Card Reissuance'}
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {lang === 'bn'
                ? `বর্তমান "${currentTemplate.roleNameEn}" পদের জন্য সর্বশেষ প্রকাশিত সংস্করণ "${currentTemplate.versionTag}" প্রযোজ্য হয়েছে। আপনি কি উক্ত পদের সকল সক্রিয় আইডি কার্ড এই সংস্করণে হালনাগাদ করতে চান?`
                : `The latest published template "${currentTemplate.versionTag}" is ready for "${currentTemplate.roleNameEn}". Would you like to migrate all previously issued active cards to this template?`}
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1 mb-6">
              <p className="font-bold">সুরক্ষা নিশ্চয়তা (Security Guarantee):</p>
              <p>• ইউজার রোল, কার্ড নম্বর বা কিউআর কোডের টোকেন পরিবর্তন হবে না।</p>
              <p>• পাবলিক ভেরিফিকেশন লিংক পূর্বের মতোই অক্ষুণ্ণ থাকবে।</p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setMigrationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                onClick={() => {
                  setMigrationModalOpen(false);
                  setSaveToast(lang === 'bn' ? 'সকল সক্রিয় কার্ডে নতুন টেমপ্লেট সফলভাবে প্রয়োগ করা হয়েছে!' : 'All active cards successfully migrated to latest published template!');
                  setTimeout(() => setSaveToast(null), 4000);
                }}
                className="px-5 py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white text-xs font-bold shadow-md"
              >
                {lang === 'bn' ? 'মাইগ্রেশন অনুমোদন করুন' : 'Confirm & Reissue'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
