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
  drawBangladeshMapOnCanvas,
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

  useEffect(() => {
    setCurrentSide(initialSide);
  }, [initialSide]);

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
      roleId === 'super_admin' || roleId === 'co_super_admin' ? 'smriti_soudho' :
      roleId === 'division_admin' ? 'sangsad_bhaban' :
      roleId === 'district_admin' ? 'ahsan_manzil' :
      roleId === 'upazila_admin' ? 'shat_gombuj' :
      roleId === 'thana_admin' ? 'thana_skyline' :
      roleId === 'union_admin' ? 'shaheed_minar' :
      roleId === 'donor' ? 'blood_drop' :
      roleId === 'volunteer' ? 'volunteers' : 'smriti_soudho'
    ),
    badgeIcon: frontConfig.badgeIcon ?? (
      roleId === 'super_admin' || roleId === 'co_super_admin' ? 'gold_star' :
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
    watermarkType: backConfig.watermarkType ?? 'bd_map'
  };

  // Default Color Settings by role
  const getRoleDefaultColors = (r: string) => {
    switch (r) {
      case 'super_admin':
      case 'co_super_admin':
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

  // High-Resolution 300 DPI CR80 Canvas Vector Generator (1011 × 638 pixels = 85.6mm × 54.0mm)
  const generateCardCanvas = async (s: 'front' | 'back'): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1011; // 85.6mm at 300 DPI
    canvas.height = 638; // 54.0mm at 300 DPI
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Card Background (Smooth rounded rectangle with subtle gradient)
    const r = 40;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.7, '#FCFDFE');
    bgGrad.addColorStop(1, '#F7FAFC');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (s === 'front') {
      // Top Role Header Ribbon
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      const rw = 340;
      const rh = 44;
      const rx = (canvas.width - rw) / 2;
      ctx.roundRect(rx, 0, rw, rh, [0, 0, 18, 18]);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ribbonLabel.toUpperCase(), canvas.width / 2, 29);

      // LalBindu Brand Text on Left
      ctx.fillStyle = '#C8102E';
      ctx.font = '900 38px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('LalBindu', 60, 95);
      ctx.fillStyle = '#707070';
      ctx.font = 'italic 600 14px "Inter", sans-serif';
      ctx.fillText('Every Drop Connects a Life.', 60, 118);

      // Try drawing official logo if available
      try {
        const logoImg = new window.Image();
        logoImg.src = '/branding/lalbindu-logo.png';
        await new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; setTimeout(res, 300); });
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.clearRect(55, 45, 230, 80);
          ctx.drawImage(logoImg, 60, 50, 190, 52);
        }
      } catch (e) {}

      // Cardholder Information
      ctx.fillStyle = '#171717';
      ctx.font = '900 34px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(fullName, 260, 240);

      ctx.fillStyle = primaryColor;
      ctx.font = '900 22px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(designation, 260, 275);

      ctx.fillStyle = '#4B5563';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`ID: ${uniqueId}`, 260, 310);

      if (front.showJurisdiction) {
        ctx.fillStyle = '#6B7280';
        ctx.font = '600 18px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(organizationName || jurisdictionName || 'LalBindu Bangladesh', 260, 345);
      }

      if (front.showDonations) {
        const donText = donationCount !== undefined ? donationCount : 5;
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 18px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`Total Donations: ${donText}`, 260, 380);
      }

      if (front.showValidity) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '600 16px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(`Valid Until: ${validUntil || '31 Dec 2026'}`, 260, 420);
      }

      // Sweeping Curve along bottom
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 90);
      ctx.bezierCurveTo(canvas.width * 0.3, canvas.height - 35, canvas.width * 0.7, canvas.height - 130, canvas.width, canvas.height - 75);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 60);
      ctx.bezierCurveTo(canvas.width * 0.35, canvas.height - 15, canvas.width * 0.75, canvas.height - 90, canvas.width, canvas.height - 45);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Photo Frame & Avatar
      if (front.showPhoto) {
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 5;
        ctx.fillStyle = '#E5E7EB';
        ctx.beginPath();
        ctx.roundRect(60, 180, 160, 200, 24);
        ctx.fill();
        ctx.stroke();

        if (avatarUrl) {
          try {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.src = avatarUrl;
            await new Promise((res) => { img.onload = res; img.onerror = res; setTimeout(res, 500); });
            if (img.complete && img.naturalWidth > 0) {
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(60, 180, 160, 200, 24);
              ctx.clip();
              ctx.drawImage(img, 60, 180, 160, 200);
              ctx.restore();
            }
          } catch (e) {}
        }
      }

      // Blood group badge for donor
      if (front.showBloodGroup) {
        ctx.fillStyle = '#C8102E';
        ctx.beginPath();
        ctx.arc(canvas.width - 120, 240, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 24px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(bloodGroup || 'O+', canvas.width - 120, 248);
      }

    } else {
      // BACK SIDE
      ctx.fillStyle = '#C8102E';
      ctx.font = '900 38px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LalBindu', canvas.width / 2, 85);
      ctx.fillStyle = '#707070';
      ctx.font = 'italic 600 14px "Inter", sans-serif';
      ctx.fillText('Every Drop Connects a Life.', canvas.width / 2, 108);

      try {
        const logoImg = new window.Image();
        logoImg.src = '/branding/lalbindu-logo.png';
        await new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; setTimeout(res, 300); });
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.clearRect((canvas.width - 240) / 2, 40, 240, 75);
          ctx.drawImage(logoImg, (canvas.width - 200) / 2, 45, 200, 54);
        }
      } catch (e) {}

      // Draw 100% Authentic Geographically Accurate 8-Division Bangladesh Map Watermark
      await drawBangladeshMapOnCanvas(ctx, primaryColor, 570, 45, 390, 525);

      // QR Code
      let activeQr = qrDataUrl;
      if (!activeQr) {
        try {
          activeQr = await QRCode.toDataURL(targetVerifyUrl, {
            width: 260,
            margin: 1,
            color: { dark: '#171717', light: '#FFFFFF' }
          });
        } catch (e) {}
      }

      if (activeQr) {
        const qrImg = new window.Image();
        qrImg.src = activeQr;
        await new Promise((res) => { qrImg.onload = res; qrImg.onerror = res; setTimeout(res, 400); });
        if (qrImg.complete) {
          ctx.drawImage(qrImg, (canvas.width - 200) / 2, 135, 200, 200);
        }
      }

      // "SCAN TO VERIFY" badge
      ctx.fillStyle = '#171717';
      ctx.beginPath();
      ctx.roundRect((canvas.width - 220) / 2, 355, 220, 34, 17);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN TO VERIFY', canvas.width / 2, 378);

      // Verification URL
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`https://lalbindu.bd/verify/${uniqueId}`, canvas.width / 2, 415);

      // Issue & Valid
      ctx.fillStyle = '#6B7280';
      ctx.font = '600 14px "Inter", sans-serif';
      ctx.fillText(`Issued: ${issueDate} | Valid: Active`, canvas.width / 2, 440);

      // Slogan wave footer
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillText('Together for a Blood-Safe Bangladesh ❤️', canvas.width / 2, canvas.height - 18);
    }

    return canvas;
  };

  // High-Resolution 300 DPI CR80 PNG Client-Side Exporter
  const handleExportPNG = async (side: 'front' | 'back' | 'both') => {
    const exportSide = async (s: 'front' | 'back') => {
      const canvas = await generateCardCanvas(s);
      const link = document.createElement('a');
      link.download = `LalBindu-CR80-${uniqueId}-${s.toUpperCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    if (side === 'both') {
      await exportSide('front');
      setTimeout(() => exportSide('back'), 450);
    } else {
      await exportSide(side);
    }
  };

  // Dedicated Print-Ready 1-Page PDF Generator (Isolates CR80 Cards and Redacts Background UI)
  const handlePrintPDF = async () => {
    // Open isolated window immediately to prevent popup blocking in modern browsers
    const printWin = typeof window !== 'undefined' ? window.open('', '_blank', 'width=950,height=1000') : null;
    if (printWin) {
      printWin.document.write(`<!DOCTYPE html><html><head><title>Preparing CR80 ID Card...</title></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:90vh;margin:0;background:#FFF8F8;"><div style="text-align:center;"><h2 style="color:#C8102E;margin-bottom:8px;">LalBindu Bangladesh</h2><p style="color:#555;font-size:13px;font-weight:600;">Generating High-Resolution CR80 Print Sheet (85.6mm × 54.0mm)...</p></div></body></html>`);
    }

    // Generate high-resolution 300 DPI canvases for Front & Back
    const frontCanvas = await generateCardCanvas('front');
    const backCanvas = await generateCardCanvas('back');
    const frontImg = frontCanvas.toDataURL('image/png');
    const backImg = backCanvas.toDataURL('image/png');

    const printDocHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LalBindu CR80 ID Card — ${fullName} (${uniqueId})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      color: #171717;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .print-bar {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 780px;
      justify-content: space-between;
    }
    .btn-print {
      background: #C8102E;
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-print:hover {
      background: #9B0D23;
    }
    .btn-close {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .sheet-container {
      background: #ffffff;
      width: 100%;
      max-width: 780px;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
    }
    .sheet-header {
      text-align: center;
      border-bottom: 2px solid #C8102E;
      padding-bottom: 16px;
      margin-bottom: 25px;
    }
    .sheet-title {
      font-size: 20px;
      font-weight: 900;
      color: #C8102E;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }
    .sheet-subtitle {
      font-size: 11px;
      color: #4b5563;
      margin: 0;
      font-weight: 600;
    }
    .cards-row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 28px;
      margin: 25px 0;
    }
    .card-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 85.6mm;
    }
    .card-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #4b5563;
      margin-bottom: 8px;
    }
    .card-cut-guide {
      position: relative;
      padding: 2.5mm;
      border: 1.5px dashed #9ca3af;
      border-radius: 4.5mm;
      background: #ffffff;
    }
    .card-img {
      width: 85.6mm;
      height: 54.0mm;
      display: block;
      border-radius: 3.18mm;
      box-shadow: 0 1mm 3mm rgba(0,0,0,0.12);
    }
    .meta-grid {
      margin-top: 25px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 14px 18px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      font-size: 11px;
    }
    .meta-grid strong {
      color: #111827;
      display: block;
      margin-bottom: 2px;
    }
    .meta-grid span {
      color: #4b5563;
      font-weight: 600;
    }
    .cut-instructions {
      margin-top: 22px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 8px;
      text-align: center;
      font-size: 10.5px;
      color: #991b1b;
      line-height: 1.5;
    }
    .print-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 9px;
      color: #6b7280;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-bar {
        display: none !important;
      }
      .sheet-container {
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-size: 13px; font-weight: 700; color: #111827;">
      🖨️ Ready to Print / Save CR80 Identity Card PDF (Page 1 of 1)
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn-print" onclick="window.print()">
        <span>Print or Save as PDF</span>
      </button>
      <button class="btn-close" onclick="window.close()">Close</button>
    </div>
  </div>

  <div class="sheet-container">
    <div class="sheet-header">
      <h1 class="sheet-title">LALBINDU BANGLADESH — CR80 DIGITAL IDENTITY CREDENTIAL</h1>
      <p class="sheet-subtitle">Official Standard CR80 Dimensions: 85.6mm × 54.0mm • Verifiable Nationwide via QR Scan</p>
    </div>

    <div class="cards-row">
      <div class="card-block">
        <div class="card-label">Front Side (85.6 × 54.0 mm)</div>
        <div class="card-cut-guide">
          <img class="card-img" src="${frontImg}" alt="Front Card" />
        </div>
      </div>

      <div class="card-block">
        <div class="card-label">Back Side (85.6 × 54.0 mm)</div>
        <div class="card-cut-guide">
          <img class="card-img" src="${backImg}" alt="Back Card" />
        </div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <strong>Cardholder Name</strong>
        <span>${fullName} ${fullNameBn ? '(' + fullNameBn + ')' : ''}</span>
      </div>
      <div>
        <strong>Role Designation</strong>
        <span>${designation}</span>
      </div>
      <div>
        <strong>Unique ID Number</strong>
        <span style="font-family: monospace; font-weight: bold;">${uniqueId}</span>
      </div>
      <div>
        <strong>Jurisdiction / Org</strong>
        <span>${organizationName || jurisdictionName || 'LalBindu Bangladesh'}</span>
      </div>
      <div>
        <strong>Issued & Status</strong>
        <span>${issueDate} • Active Verified</span>
      </div>
      <div>
        <strong>Validity Expiration</strong>
        <span>${validUntil}</span>
      </div>
    </div>

    <div class="cut-instructions">
      ✂️ <strong>Printing & Cutting Guide:</strong> In your browser print dialog, select Destination <strong>"Save as PDF"</strong> (or Microsoft Print to PDF), set Scale to <strong>100% (Actual Size)</strong>, and enable <strong>"Background graphics"</strong>. Cut along the outer dashed lines for exact physical CR80 card dimensions (300+ GSM cardstock or PVC substrate recommended).
    </div>

    <div class="print-footer">
      LalBindu Foundation Bangladesh • Verification Portal: ${targetVerifyUrl} • Every Drop Connects a Life ❤️
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    // Populate print window or fallback to iframe
    if (printWin && !printWin.closed) {
      printWin.document.open();
      printWin.document.write(printDocHtml);
      printWin.document.close();
      printWin.focus();
    } else {
      // Fallback: iframe print
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(printDocHtml);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        }, 400);
      }
    }
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
              style={{ color: primaryColor }}
              className="text-xs font-black mt-0.5 leading-snug truncate"
            >
              {designation}
            </p>
            <p className="text-[10px] sm:text-[11px] font-mono font-bold text-gray-700 mt-0.5">
              ID: {uniqueId}
            </p>

            {/* Organization or Jurisdiction */}
            {front.showJurisdiction && (
              <p className="text-[10px] text-gray-500 font-semibold truncate mt-0.5">
                {organizationName || jurisdictionName || 'LalBindu Bangladesh'}
              </p>
            )}

            {/* Donor Specific Row: Total Donations */}
            {front.showDonations && (
              <p className="text-[10px] font-bold text-gray-700 mt-0.5">
                Total Donations: {donationCount !== undefined ? donationCount : 5}
              </p>
            )}

            {/* Validity */}
            {front.showValidity && (
              <p className="text-[9px] text-gray-400 mt-0.5 font-medium">
                Valid Until: {validUntil || '31 Dec 2026'}
              </p>
            )}
          </div>

          {/* Donor Specific Badge: Blood Group Drop Crest */}
          {front.showBloodGroup && (
            <div className="shrink-0 flex flex-col items-center justify-center mr-0.5 z-20">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-brand-red to-brand-crimson text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
                <Droplet className="w-3 h-3 fill-white" />
                <span className="text-xs font-black leading-none mt-0.5">{bloodGroup || 'O+'}</span>
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

        {/* High-Clarity Bangladesh Map Vector Watermark */}
        <div className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-34 sm:w-42 h-38 sm:h-46 pointer-events-none opacity-85 z-10 flex items-center justify-center">
          <BangladeshMapSVG color={primaryColor} className="w-full h-full" />
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
            id="btn-export-cr80-png"
            onClick={() => handleExportPNG(activeLayout === 'side-by-side' ? 'both' : currentSide)}
            className="px-3.5 py-1.5 rounded-full bg-brand-light hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CR80 PNG</span>
          </button>

          {/* Print PDF */}
          <button
            id="btn-print-cr80-pdf"
            onClick={handlePrintPDF}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            title="Generate high-resolution 1-page CR80 PDF print sheet"
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
