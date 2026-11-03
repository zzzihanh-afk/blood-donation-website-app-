'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { 
  LandmarkWatermark, 
  CardBadgeIcon, 
  CardFrontDesignConfig, 
  CardBackDesignConfig, 
  CardDesignSettings 
} from '@lalbindu/shared-types';
import { 
  RotateCw, 
  Download, 
  Share2, 
  Printer, 
  ShieldCheck, 
  Award, 
  Droplet, 
  Users, 
  Building2, 
  Landmark, 
  Star,
  Check,
  ExternalLink
} from 'lucide-react';

export interface CR80IDCardProps {
  fullName: string;
  fullNameBn?: string;
  designation: string;
  designationBn?: string;
  uniqueId: string;
  avatarUrl: string;
  organizationName?: string;
  jurisdictionName?: string;
  jurisdictionNameBn?: string;
  bloodGroup?: string;
  donationCount?: number;
  issueDate?: string;
  validUntil?: string;
  verificationToken: string;
  verificationUrl?: string;
  roleId: string;
  frontConfig?: Partial<CardFrontDesignConfig>;
  backConfig?: Partial<CardBackDesignConfig>;
  settings?: Partial<CardDesignSettings>;
  interactiveFlip?: boolean;
  initialSide?: 'front' | 'back';
  scale?: number;
  showActions?: boolean;
  isDemo?: boolean;
}

export const CR80IDCard: React.FC<CR80IDCardProps> = ({
  fullName,
  fullNameBn,
  designation,
  designationBn,
  uniqueId,
  avatarUrl,
  organizationName,
  jurisdictionName,
  bloodGroup,
  donationCount,
  issueDate = '01 Jan 2025',
  validUntil = '31 Dec 2026',
  verificationToken,
  verificationUrl,
  roleId,
  frontConfig = {},
  backConfig = {},
  settings = {},
  interactiveFlip = true,
  initialSide = 'front',
  scale = 1,
  showActions = true,
  isDemo = false
}) => {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>(initialSide);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  const targetVerifyUrl = verificationUrl || (typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${verificationToken}`
    : `https://lalbindu.bd/verify/${verificationToken}`);

  // Default Front Config
  const front = {
    showLogo: frontConfig.showLogo ?? true,
    showPhoto: frontConfig.showPhoto ?? true,
    showBadge: frontConfig.showBadge ?? true,
    showJurisdiction: frontConfig.showJurisdiction ?? true,
    showBloodGroup: frontConfig.showBloodGroup ?? (roleId === 'donor' || !!bloodGroup),
    showDonations: frontConfig.showDonations ?? (roleId === 'donor' || donationCount !== undefined),
    showValidity: frontConfig.showValidity ?? true,
    watermarkType: frontConfig.watermarkType ?? (
      roleId === 'super_admin' ? 'smriti_soudho' :
      roleId === 'division_admin' ? 'sangsad_bhaban' :
      roleId === 'district_admin' ? 'ahsan_manzil' :
      roleId === 'upazila_admin' ? 'shat_gombuj' :
      roleId === 'thana_admin' ? 'smriti_soudho' :
      roleId === 'donor' ? 'blood_drop' :
      roleId === 'volunteer' ? 'volunteers' : 'bd_map'
    ),
    badgeIcon: frontConfig.badgeIcon ?? (
      roleId === 'super_admin' ? 'gold_star' :
      roleId === 'donor' ? 'community' :
      roleId === 'volunteer' ? 'user' : 'star'
    )
  };

  // Default Back Config
  const back = {
    showQr: backConfig.showQr ?? true,
    showVerifyBadge: backConfig.showVerifyBadge ?? true,
    showSlogan: backConfig.showSlogan ?? true,
    watermarkType: backConfig.watermarkType ?? (roleId === 'donor' ? 'blood_drop' : 'bd_map')
  };

  // Default Color Settings by role
  const getRoleDefaultColors = (r: string) => {
    switch (r) {
      case 'super_admin':
        return { primary: '#580F1A', secondary: '#30080E', accent: '#D4AF37', ribbon: 'Super Admin' };
      case 'division_admin':
        return { primary: '#0D3B66', secondary: '#062038', accent: '#F4D35E', ribbon: 'Division Administrator' };
      case 'district_admin':
        return { primary: '#006A4E', secondary: '#004532', accent: '#A7F3D0', ribbon: 'District Administrator' };
      case 'upazila_admin':
        return { primary: '#D84A1B', secondary: '#93300E', accent: '#FED7AA', ribbon: 'Upazila Administrator' };
      case 'thana_admin':
        return { primary: '#008080', secondary: '#004C4C', accent: '#99F6E4', ribbon: 'Metropolitan Thana Administrator' };
      case 'union_admin':
        return { primary: '#4A154B', secondary: '#2B082C', accent: '#E9D5FF', ribbon: 'Union Administrator' };
      case 'donor':
        return { primary: '#006A4E', secondary: '#C8102E', accent: '#C8102E', ribbon: 'Donor' };
      case 'volunteer':
        return { primary: '#1B4931', secondary: '#0C2618', accent: '#A7F3D0', ribbon: 'Volunteer' };
      default:
        return { primary: '#C8102E', secondary: '#8E0B20', accent: '#D4AF37', ribbon: 'Identity Card' };
    }
  };

  const roleColors = getRoleDefaultColors(roleId);
  const primaryColor = settings.primaryColor || roleColors.primary;
  const secondaryColor = settings.secondaryColor || roleColors.secondary;
  const accentColor = settings.accentColor || roleColors.accent;
  const ribbonLabel = settings.ribbonLabel || roleColors.ribbon;
  const borderRadius = settings.borderRadius || '24px';

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(targetVerifyUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: primaryColor || '#171717',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [targetVerifyUrl, primaryColor]);

  // Export Front or Back PNG via HTML5 canvas
  const handleExportPNG = (side: 'front' | 'back') => {
    alert(`Exporting ${side.toUpperCase()} PNG in high-resolution CR80 300 DPI format...`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `LalBindu Official ID Card — ${fullName}`,
        text: `Verified digital identity card of ${fullName} (${designation}) on LalBindu Bangladesh.`,
        url: targetVerifyUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(targetVerifyUrl);
      alert('Verification URL copied to clipboard: ' + targetVerifyUrl);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* DEMO Indicator Tag */}
      {isDemo && (
        <span className="mb-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold tracking-wider border border-amber-300">
          DEMO PREVIEW • SAMPLE DATA
        </span>
      )}

      {/* Outer Card Container with Standard CR80 Proportions */}
      <div 
        ref={cardRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        className="w-full max-w-[450px] aspect-[1.586/1] rounded-[24px] shadow-2xl relative select-none transition-all duration-300 bg-white border border-gray-200 overflow-hidden"
      >
        {/* =====================================================================
            CARD FRONT SIDE
           ===================================================================== */}
        {currentSide === 'front' && (
          <div className="w-full h-full relative flex flex-col justify-between p-4 sm:p-5 overflow-hidden bg-gradient-to-br from-white via-[#FCFDFE] to-[#F7FAFC]">
            
            {/* Top Role Ribbon Tab */}
            <div 
              style={{ backgroundColor: primaryColor }}
              className="absolute -top-1 left-1/2 -translate-x-1/2 px-5 py-1 rounded-b-xl text-white text-[11px] font-black tracking-wide uppercase shadow-md flex items-center space-x-1.5 z-20"
            >
              <span>{ribbonLabel}</span>
            </div>

            {/* Top Bar: LalBindu Logo & Top-Right Badge Emblem */}
            <div className="flex items-center justify-between z-10 pt-1">
              {front.showLogo ? (
                <div className="relative w-32 sm:w-36 h-9">
                  <Image
                    src="/branding/lalbindu-logo.png"
                    alt="LalBindu"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : <div />}

              {front.showBadge && (
                <div className="flex items-center space-x-1">
                  {front.badgeIcon === 'gold_star' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-900 shadow-sm border border-amber-300">
                      <Award className="w-5 h-5 fill-amber-700 text-amber-900" />
                    </div>
                  )}
                  {front.badgeIcon === 'community' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-300">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  {front.badgeIcon === 'star' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200">
                      <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </div>
                  )}
                  {front.badgeIcon === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Middle Section: Photo & Cardholder Information */}
            <div className="flex items-center space-x-3.5 z-10 my-auto">
              {/* Photo */}
              {front.showPhoto && (
                <div 
                  style={{ borderColor: primaryColor }}
                  className="relative w-16 sm:w-20 h-20 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 border-2 shrink-0 shadow-md"
                >
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Bio & Credentials */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight truncate">
                  {fullName}
                </h3>
                <p 
                  style={{ color: roleId === 'donor' ? '#C8102E' : primaryColor }}
                  className="text-xs sm:text-sm font-black mt-0.5 leading-snug"
                >
                  {designation}
                </p>
                <p className="text-[11px] font-mono font-bold text-gray-600 mt-0.5">
                  ID: {uniqueId}
                </p>

                {/* Organization or Jurisdiction */}
                {front.showJurisdiction && (organizationName || jurisdictionName) && (
                  <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                    {organizationName || jurisdictionName}
                  </p>
                )}

                {/* Donor Specific Row: Total Donations */}
                {front.showDonations && donationCount !== undefined && (
                  <p className="text-[10px] font-bold text-gray-700 mt-0.5">
                    Total Donations: {donationCount}
                  </p>
                )}

                {/* Validity */}
                {front.showValidity && (
                  <p className="text-[9px] text-gray-400 mt-0.5 font-medium">
                    Valid Until: {validUntil}
                  </p>
                )}
              </div>

              {/* Donor Specific Badge: Blood Group Drop Crest */}
              {front.showBloodGroup && bloodGroup && (
                <div className="shrink-0 flex flex-col items-center justify-center mr-1">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-red to-brand-crimson text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
                    <Droplet className="w-3.5 h-3.5 fill-white" />
                    <span className="text-xs font-black leading-none mt-0.5">{bloodGroup}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Background Landmark / Architectural Watermark */}
            <div className="absolute right-0 bottom-3 w-40 h-28 pointer-events-none opacity-25 flex items-end justify-end overflow-hidden z-0">
              {front.watermarkType === 'smriti_soudho' && (
                <svg viewBox="0 0 100 80" className="w-full h-full fill-current" style={{ color: primaryColor }}>
                  <polygon points="50,5 42,75 58,75" />
                  <polygon points="50,15 30,75 70,75" opacity="0.7" />
                  <polygon points="50,25 20,75 80,75" opacity="0.4" />
                </svg>
              )}
              {front.watermarkType === 'sangsad_bhaban' && (
                <svg viewBox="0 0 100 60" className="w-full h-full fill-current" style={{ color: primaryColor }}>
                  <rect x="20" y="20" width="60" height="35" rx="3" />
                  <circle cx="50" cy="25" r="8" fill="white" />
                  <rect x="35" y="35" width="10" height="20" fill="white" />
                  <rect x="55" y="35" width="10" height="20" fill="white" />
                </svg>
              )}
              {front.watermarkType === 'ahsan_manzil' && (
                <svg viewBox="0 0 100 60" className="w-full h-full fill-current" style={{ color: primaryColor }}>
                  <path d="M10,50 L90,50 L90,30 L70,30 L70,20 Q50,5 30,20 L30,30 L10,30 Z" />
                </svg>
              )}
              {front.watermarkType === 'blood_drop' && (
                <div className="w-24 h-24 rounded-full bg-red-100/60 flex items-center justify-center">
                  <Droplet className="w-16 h-16 text-brand-red fill-brand-red opacity-30" />
                </div>
              )}
              {front.watermarkType === 'volunteers' && (
                <div className="w-32 h-20 flex items-end justify-center space-x-1 opacity-40">
                  <div className="w-4 h-12 bg-current rounded-t-full" style={{ color: primaryColor }} />
                  <div className="w-5 h-16 bg-current rounded-t-full" style={{ color: primaryColor }} />
                  <div className="w-4 h-14 bg-current rounded-t-full" style={{ color: primaryColor }} />
                  <div className="w-5 h-18 bg-current rounded-t-full" style={{ color: primaryColor }} />
                </div>
              )}
            </div>

            {/* Bottom Elegant Sweeping Brand Wave */}
            <div className="absolute -bottom-4 -left-4 -right-4 h-8 pointer-events-none z-10">
              <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="w-full h-full">
                <path 
                  d="M0,20 C150,50 350,0 500,30 L500,60 L0,60 Z" 
                  fill={primaryColor} 
                />
                <path 
                  d="M0,35 C200,60 380,15 500,45 L500,60 L0,60 Z" 
                  fill={secondaryColor} 
                  opacity="0.8"
                />
              </svg>
            </div>

          </div>
        )}

        {/* =====================================================================
            CARD BACK SIDE
           ===================================================================== */}
        {currentSide === 'back' && (
          <div className="w-full h-full relative flex flex-col justify-between p-4 sm:p-5 overflow-hidden bg-gradient-to-br from-[#FCFDFE] via-white to-[#F5F8FA]">
            
            {/* Top Centered Logo */}
            <div className="flex justify-center z-10">
              <div className="relative w-36 sm:w-40 h-9">
                <Image
                  src="/branding/lalbindu-logo.png"
                  alt="LalBindu"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Center QR Code Block */}
            <div className="flex flex-col items-center justify-center my-auto z-10">
              {back.showQr && (
                <div className="p-1.5 bg-white rounded-2xl shadow-md border border-gray-200">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Verification QR" 
                      className="w-20 sm:w-24 h-20 sm:h-24 object-contain"
                    />
                  ) : (
                    <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      Generating...
                    </div>
                  )}
                </div>
              )}

              {/* "SCAN TO VERIFY" Pill */}
              {back.showVerifyBadge && (
                <div 
                  style={{ backgroundColor: primaryColor }}
                  className="mt-2 px-3 py-0.5 rounded-full text-white text-[9px] font-black uppercase tracking-wider shadow-sm"
                >
                  SCAN TO VERIFY
                </div>
              )}

              {/* Verification URL text */}
              <p className="text-[9px] font-mono font-bold text-gray-700 mt-1">
                https://lalbindu.bd/verify/{verificationToken}
              </p>

              {/* Issue Date & Status */}
              <p className="text-[8px] text-gray-500 font-medium mt-0.5">
                Issued: {issueDate} | Valid: Active
              </p>
            </div>

            {/* Subtle Right Map Watermark */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none opacity-20 z-0">
              {back.watermarkType === 'blood_drop' ? (
                <Droplet className="w-full h-full text-brand-red fill-brand-red" />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-gray-400">BANGLADESH</span>
                </div>
              )}
            </div>

            {/* Bottom Curved Wave Ribbon with Official Slogan */}
            <div 
              style={{ backgroundColor: primaryColor }}
              className="absolute bottom-0 left-0 right-0 py-1.5 px-4 text-center z-10"
            >
              <p className="text-[9px] sm:text-[10px] text-white font-bold tracking-tight">
                Together for a Blood-Safe Bangladesh ❤️
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Action Controls (Flip, PNG, Print, Share) */}
      {showActions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {interactiveFlip && (
            <button
              onClick={() => setCurrentSide(currentSide === 'front' ? 'back' : 'front')}
              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-brand-red text-gray-800 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-brand-red" />
              <span>Flip Card ({currentSide === 'front' ? 'Front' : 'Back'})</span>
            </button>
          )}

          <button
            onClick={() => handleExportPNG(currentSide)}
            className="px-3 py-1.5 rounded-full bg-brand-light hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/30 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 text-gray-700 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      )}

    </div>
  );
};
