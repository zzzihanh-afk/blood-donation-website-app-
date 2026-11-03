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
  Droplet,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { 
  SmritiSoudhoSVG, 
  SangsadBhabanSVG, 
  AhsanManzilSVG, 
  ShatGombujSVG, 
  ThanaSkylineSVG,
  ShaheedMinarSVG,
  VolunteersSVG, 
  DonorHeartDropSVG,
  BangladeshMapSVG, 
  RoleBadgeEmblem 
} from './LandmarkIllustrations';

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
  layoutMode?: 'side-by-side' | 'single';
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
  layoutMode = 'side-by-side',
  interactiveFlip = true,
  initialSide = 'front',
  scale = 1,
  showActions = true,
  isDemo = false
}) => {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>(initialSide);
  const [activeLayout, setActiveLayout] = useState<'side-by-side' | 'single'>(layoutMode);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLayout(layoutMode);
  }, [layoutMode]);

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
      roleId === 'thana_admin' ? 'thana_skyline' :
      roleId === 'union_admin' ? 'shaheed_minar' :
      roleId === 'donor' ? 'blood_drop' :
      roleId === 'volunteer' ? 'volunteers' : 'smriti_soudho'
    ),
    badgeIcon: frontConfig.badgeIcon ?? (
      roleId === 'super_admin' ? 'gold_star' :
      roleId === 'division_admin' ? 'blue_star' :
      roleId === 'district_admin' ? 'fort' :
      roleId === 'upazila_admin' ? 'arch' :
      roleId === 'thana_admin' ? 'building' :
      roleId === 'union_admin' ? 'purple_star' :
      roleId === 'donor' ? 'community' :
      roleId === 'volunteer' ? 'user' : 'gold_star'
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
        return { primary: '#006A4E', secondary: '#004532', accent: '#C8102E', ribbon: 'Donor' };
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

  // Generate QR Code with crisp contrast
  useEffect(() => {
    QRCode.toDataURL(targetVerifyUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#171717',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [targetVerifyUrl]);

  const handleExportPNG = (side: 'front' | 'back' | 'both') => {
    alert(`Exporting ${side.toUpperCase()} in high-resolution CR80 (85.6mm × 54mm) 300 DPI vector format...`);
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
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Helper to render the appropriate landmark vector
  const renderLandmarkSVG = (type: string) => {
    switch (type) {
      case 'smriti_soudho':
        return <SmritiSoudhoSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'sangsad_bhaban':
        return <SangsadBhabanSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'ahsan_manzil':
        return <AhsanManzilSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'shat_gombuj':
        return <ShatGombujSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'thana_skyline':
        return <ThanaSkylineSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'shaheed_minar':
        return <ShaheedMinarSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'volunteers':
        return <VolunteersSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'blood_drop':
        return <DonorHeartDropSVG primaryColor={primaryColor} className="w-full h-full" />;
      case 'bd_map':
        return <BangladeshMapSVG color={primaryColor} className="w-full h-full" />;
      case 'none':
        return null;
      default:
        return <SmritiSoudhoSVG primaryColor={primaryColor} className="w-full h-full" />;
    }
  };

  // =========================================================================
  // FRONT CARD COMPONENT
  // =========================================================================
  const renderFrontCard = () => (
    <div className="relative pt-3.5 flex flex-col items-center w-full max-w-[430px]">
      {/* Top Floating Role Header Pill */}
      <div 
        style={{ backgroundColor: primaryColor }}
        className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-white text-[11px] font-black tracking-wide uppercase shadow-md flex items-center space-x-1.5 z-30 border border-white/20 whitespace-nowrap"
      >
        <span>{ribbonLabel}</span>
      </div>

      {/* Main Front Card Body (CR80 aspect ratio: 85.6mm × 54mm ≈ 1.586 : 1) */}
      <div 
        className="w-full aspect-[1.586/1] rounded-[22px] shadow-xl relative select-none bg-gradient-to-br from-white via-[#FCFDFE] to-[#F7FAFC] border border-gray-200/90 overflow-hidden flex flex-col justify-between p-3.5 sm:p-4"
      >
        {/* Top Bar: LalBindu Logo & Top-Right Role Badge Emblem */}
        <div className="flex items-center justify-between z-20 pt-1">
          {front.showLogo ? (
            <div className="relative w-28 sm:w-32 h-8">
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
            <div className="z-20">
              <RoleBadgeEmblem 
                roleId={roleId} 
                badgeIcon={front.badgeIcon} 
                primaryColor={primaryColor} 
                className="w-8 sm:w-9 h-8 sm:h-9"
              />
            </div>
          )}
        </div>

        {/* Middle Section: Photo & Cardholder Information */}
        <div className="flex items-center space-x-3 z-20 my-auto">
          {/* Photo with colored border */}
          {front.showPhoto && (
            <div 
              style={{ borderColor: primaryColor }}
              className="relative w-16 sm:w-18 h-20 sm:h-22 rounded-2xl overflow-hidden bg-gray-100 border-[2.5px] shrink-0 shadow-md"
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
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="text-sm sm:text-base font-black text-gray-900 leading-tight truncate">
              {fullName}
            </h3>
            <p 
              style={{ color: roleId === 'donor' ? '#006A4E' : primaryColor }}
              className="text-xs font-black mt-0.5 leading-snug truncate"
            >
              {designation}
            </p>
            <p className="text-[10px] sm:text-[11px] font-mono font-bold text-gray-700 mt-0.5">
              ID: {uniqueId}
            </p>

            {/* Organization or Jurisdiction */}
            {front.showJurisdiction && (organizationName || jurisdictionName) && (
              <p className="text-[10px] text-gray-500 font-semibold truncate mt-0.5">
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
            <div className="shrink-0 flex flex-col items-center justify-center mr-0.5 z-20">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-brand-red to-brand-crimson text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
                <Droplet className="w-3 h-3 fill-white" />
                <span className="text-xs font-black leading-none mt-0.5">{bloodGroup}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right: Architectural Landmark Graphic Illustration */}
        {front.watermarkType && front.watermarkType !== 'none' && (
          <div className="absolute right-0 bottom-1 w-44 sm:w-48 h-28 sm:h-32 pointer-events-none z-10 opacity-85 flex items-end justify-end">
            {renderLandmarkSVG(front.watermarkType)}
          </div>
        )}

        {/* Bottom Elegant Sweeping Brand Wave */}
        <div className="absolute -bottom-1 -left-2 -right-2 h-10 pointer-events-none z-10">
          <svg viewBox="0 0 500 70" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d="M0,35 C150,60 320,15 500,40 L500,70 L0,70 Z" 
              fill={primaryColor} 
            />
            <path 
              d="M0,45 C180,68 350,28 500,52 L500,70 L0,70 Z" 
              fill={secondaryColor} 
              opacity="0.85"
            />
          </svg>
        </div>

      </div>
    </div>
  );

  // =========================================================================
  // BACK CARD COMPONENT
  // =========================================================================
  const renderBackCard = () => (
    <div className="relative pt-3.5 flex flex-col items-center w-full max-w-[430px]">
      {/* Top Placeholder Ribbon to match height alignment */}
      <div className="h-6 w-full invisible" />

      {/* Main Back Card Body */}
      <div 
        className="w-full aspect-[1.586/1] rounded-[22px] shadow-xl relative select-none bg-gradient-to-br from-[#FCFDFE] via-white to-[#F5F8FA] border border-gray-200/90 overflow-hidden flex flex-col justify-between p-3.5 sm:p-4"
      >
        {/* Top Centered Logo */}
        <div className="flex justify-center z-20 pt-1">
          <div className="relative w-32 sm:w-36 h-8">
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
        <div className="flex flex-col items-center justify-center my-auto z-20">
          {back.showQr && (
            <div className="p-1 bg-white rounded-xl shadow-md border border-gray-200">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Verification QR" 
                  className="w-18 sm:w-20 h-18 sm:h-20 object-contain"
                />
              ) : (
                <div className="w-18 sm:w-20 h-18 sm:h-20 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                  Generating QR...
                </div>
              )}
            </div>
          )}

          {/* "SCAN TO VERIFY" Black Pill */}
          {back.showVerifyBadge && (
            <div 
              className="mt-1.5 px-3 py-0.5 rounded-full bg-[#171717] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-sm border border-black/40"
            >
              SCAN TO VERIFY
            </div>
          )}

          {/* Verification URL text */}
          <p className="text-[8.5px] sm:text-[9.5px] font-mono font-bold text-gray-800 mt-1">
            https://lalbindu.bd/verify/{uniqueId}
          </p>

          {/* Issue Date & Status */}
          <p className="text-[7.5px] sm:text-[8px] text-gray-500 font-semibold mt-0.5">
            Issued: {issueDate} | Valid: Active
          </p>
        </div>

        {/* Subtle Right Map / Droplet Watermark */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-28 sm:w-32 h-28 sm:h-32 pointer-events-none opacity-25 z-10 flex items-center justify-center">
          {back.watermarkType === 'blood_drop' ? (
            <DonorHeartDropSVG primaryColor="#C8102E" className="w-full h-full" />
          ) : (
            <BangladeshMapSVG color={primaryColor} className="w-full h-full" />
          )}
        </div>

        {/* Bottom Curved Wave Ribbon with Official Slogan */}
        {back.showSlogan && (
          <div 
            style={{ backgroundColor: primaryColor }}
            className="absolute bottom-0 left-0 right-0 py-1.5 px-4 text-center z-20 flex items-center justify-center space-x-1"
          >
            <p className="text-[8.5px] sm:text-[9.5px] text-white font-bold tracking-tight">
              Together for a Blood-Safe Bangladesh ❤️
            </p>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      {/* DEMO Indicator Tag */}
      {isDemo && (
        <span className="mb-3 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold tracking-wider border border-amber-300">
          DEMO PREVIEW • SAMPLE DATA
        </span>
      )}

      {/* Main Render Area */}
      <div 
        ref={cardContainerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        className="w-full transition-transform duration-200"
      >
        {activeLayout === 'side-by-side' ? (
          /* ===============================================================
             SIDE-BY-SIDE VIEW (Front and Back side-by-side, matching Image 2)
             =============================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 justify-items-center w-full max-w-[920px] mx-auto">
            {renderFrontCard()}
            {renderBackCard()}
          </div>
        ) : (
          /* ===============================================================
             SINGLE FLIP VIEW (Front or Back)
             =============================================================== */
          <div className="flex justify-center w-full">
            {currentSide === 'front' ? renderFrontCard() : renderBackCard()}
          </div>
        )}
      </div>

      {/* Action Controls */}
      {showActions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {/* Toggle between Side-by-Side and Single View */}
          <button
            onClick={() => setActiveLayout(activeLayout === 'side-by-side' ? 'single' : 'side-by-side')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-300 hover:border-brand-red text-gray-800 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-brand-red" />
            <span>
              {activeLayout === 'side-by-side' ? 'Switch to Single Card View' : 'Side-by-Side (Front & Back)'}
            </span>
          </button>

          {/* Interactive Flip (if in single view) */}
          {activeLayout === 'single' && interactiveFlip && (
            <button
              onClick={() => setCurrentSide(currentSide === 'front' ? 'back' : 'front')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-gray-300 hover:border-brand-red text-gray-800 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-brand-red" />
              <span>Flip to {currentSide === 'front' ? 'Back Side' : 'Front Side'}</span>
            </button>
          )}

          {/* Export PNG */}
          <button
            onClick={() => handleExportPNG(activeLayout === 'side-by-side' ? 'both' : currentSide)}
            className="px-3.5 py-1.5 rounded-full bg-brand-light hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CR80 PNG</span>
          </button>

          {/* Print PDF */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          {/* Share / Copy Link */}
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share / Link'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
