import React from 'react';

interface LandmarkProps {
  primaryColor?: string;
  className?: string;
}

// 1. Jatiyo Smriti Soudho (National Martyrs' Monument, Savar) — Super Admin
export const SmritiSoudhoSVG: React.FC<LandmarkProps> = ({ primaryColor = '#580F1A', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="smritiGrad1" x1="80" y1="5" x2="80" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryColor} stopOpacity="0.85" />
        <stop offset="100%" stopColor={primaryColor} stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="smritiGrad2" x1="80" y1="20" x2="80" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={primaryColor} stopOpacity="0.65" />
        <stop offset="100%" stopColor={primaryColor} stopOpacity="0.15" />
      </linearGradient>
    </defs>
    {/* Base Staircase Platform */}
    <path d="M10 125 L150 125 L145 120 L15 120 Z" fill={primaryColor} fillOpacity="0.4" />
    <path d="M20 120 L140 120 L135 116 L25 116 Z" fill={primaryColor} fillOpacity="0.5" />
    <path d="M30 116 L130 116 L125 112 L35 112 Z" fill={primaryColor} fillOpacity="0.6" />

    {/* Layer 7 (Outermost Spire Pair) */}
    <polygon points="80,45 25,115 42,115" fill={primaryColor} fillOpacity="0.22" />
    <polygon points="80,45 135,115 118,115" fill={primaryColor} fillOpacity="0.26" />

    {/* Layer 6 */}
    <polygon points="80,36 38,115 52,115" fill={primaryColor} fillOpacity="0.30" />
    <polygon points="80,36 122,115 108,115" fill={primaryColor} fillOpacity="0.35" />

    {/* Layer 5 */}
    <polygon points="80,28 48,115 60,115" fill={primaryColor} fillOpacity="0.40" />
    <polygon points="80,28 112,115 100,115" fill={primaryColor} fillOpacity="0.45" />

    {/* Layer 4 */}
    <polygon points="80,20 56,115 67,115" fill={primaryColor} fillOpacity="0.50" />
    <polygon points="80,20 104,115 93,115" fill={primaryColor} fillOpacity="0.55" />

    {/* Layer 3 */}
    <polygon points="80,14 63,115 72,115" fill={primaryColor} fillOpacity="0.60" />
    <polygon points="80,14 97,115 88,115" fill={primaryColor} fillOpacity="0.65" />

    {/* Layer 2 */}
    <polygon points="80,8 69,115 76,115" fill={primaryColor} fillOpacity="0.75" />
    <polygon points="80,8 91,115 84,115" fill={primaryColor} fillOpacity="0.80" />

    {/* Layer 1 (Tallest Central Needle) */}
    <polygon points="80,2 75,115 85,115" fill="url(#smritiGrad1)" />
    <line x1="80" y1="2" x2="80" y2="115" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
  </svg>
);

// 2. Jatiya Sangsad Bhaban (National Parliament, Dhaka) — Division Admin
export const SangsadBhabanSVG: React.FC<LandmarkProps> = ({ primaryColor = '#0D3B66', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Lake & Reflection Lines */}
    <path d="M5 115 C50 112 120 118 165 115" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M15 118 C60 115 110 120 155 118" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.3" />

    {/* Central Parliament Tower Block */}
    <rect x="55" y="30" width="60" height="85" rx="3" fill={primaryColor} fillOpacity="0.45" />
    <rect x="62" y="22" width="46" height="15" rx="2" fill={primaryColor} fillOpacity="0.6" />
    <polygon points="85,10 65,22 105,22" fill={primaryColor} fillOpacity="0.75" />

    {/* Circular & Triangular Architectural Cutouts (Louis Kahn's iconic style) */}
    <circle cx="85" cy="52" r="13" fill="#FFFFFF" fillOpacity="0.9" />
    <circle cx="85" cy="52" r="9" fill={primaryColor} fillOpacity="0.5" />
    <polygon points="85,74 72,96 98,96" fill="#FFFFFF" fillOpacity="0.95" />
    <rect x="81" y="96" width="8" height="19" fill="#FFFFFF" fillOpacity="0.95" />

    {/* Left Flanking Pavilion Block */}
    <rect x="22" y="45" width="38" height="70" rx="3" fill={primaryColor} fillOpacity="0.35" />
    <circle cx="41" cy="62" r="8" fill="#FFFFFF" fillOpacity="0.85" />
    <rect x="36" y="80" width="10" height="35" rx="2" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Right Flanking Pavilion Block */}
    <rect x="110" y="45" width="38" height="70" rx="3" fill={primaryColor} fillOpacity="0.35" />
    <circle cx="129" cy="62" r="8" fill="#FFFFFF" fillOpacity="0.85" />
    <rect x="124" y="80" width="10" height="35" rx="2" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Outermost Wings */}
    <rect x="8" y="60" width="18" height="55" rx="2" fill={primaryColor} fillOpacity="0.25" />
    <rect x="144" y="60" width="18" height="55" rx="2" fill={primaryColor} fillOpacity="0.25" />
  </svg>
);

// 3. Ahsan Manzil / Lalbagh Fort (Historic Heritage, Dhaka) — District Admin
export const AhsanManzilSVG: React.FC<LandmarkProps> = ({ primaryColor = '#006A4E', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Podium & Imperial Grand Staircase */}
    <rect x="10" y="100" width="150" height="16" rx="2" fill={primaryColor} fillOpacity="0.4" />
    <polygon points="85,82 55,116 115,116" fill={primaryColor} fillOpacity="0.6" />
    {/* Stairs Lines */}
    <line x1="60" y1="112" x2="110" y2="112" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="65" y1="106" x2="105" y2="106" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="70" y1="100" x2="100" y2="100" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
    <line x1="75" y1="94" x2="95" y2="94" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />

    {/* Main Palace Body */}
    <rect x="18" y="55" width="134" height="46" rx="2" fill={primaryColor} fillOpacity="0.35" />

    {/* Central Octagonal Dome Drum & Mughal Cupola */}
    <rect x="70" y="32" width="30" height="24" fill={primaryColor} fillOpacity="0.5" />
    <path d="M68 32 Q85 8 102 32 Z" fill={primaryColor} fillOpacity="0.8" />
    <line x1="85" y1="8" x2="85" y2="2" stroke={primaryColor} strokeWidth="1.5" />
    <circle cx="85" cy="2" r="1.5" fill={primaryColor} />

    {/* Symmetrical Left Arches */}
    <path d="M26 80 Q32 70 38 80 L38 98 L26 98 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M43 80 Q49 70 55 80 L55 98 L43 98 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M26 62 Q32 56 38 62 L38 74 L26 74 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M43 62 Q49 56 55 62 L55 74 L43 74 Z" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Symmetrical Right Arches */}
    <path d="M115 80 Q121 70 127 80 L127 98 L115 98 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M132 80 Q138 70 144 80 L144 98 L132 98 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M115 62 Q121 56 127 62 L127 74 L115 74 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M132 62 Q138 56 144 62 L144 74 L132 74 Z" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Central Grand Portico */}
    <rect x="65" y="55" width="40" height="44" fill={primaryColor} fillOpacity="0.5" />
    <path d="M72 82 Q85 70 98 82 L98 100 L72 100 Z" fill="#FFFFFF" fillOpacity="0.95" />
  </svg>
);

// 4. Sixty Dome Mosque (Shat Gombuj Masjid, Bagerhat) — Upazila Admin
export const ShatGombujSVG: React.FC<LandmarkProps> = ({ primaryColor = '#D84A1B', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Wall & Terracotta Foundation */}
    <rect x="15" y="55" width="140" height="58" rx="2" fill={primaryColor} fillOpacity="0.35" />

    {/* Corner Tapering Round Minarets (Khan Jahan Ali style) */}
    <path d="M10 113 L17 48 L27 48 L24 113 Z" fill={primaryColor} fillOpacity="0.75" />
    <path d="M146 113 L143 48 L153 48 L160 113 Z" fill={primaryColor} fillOpacity="0.75" />
    <circle cx="22" cy="45" r="5" fill={primaryColor} fillOpacity="0.85" />
    <circle cx="148" cy="45" r="5" fill={primaryColor} fillOpacity="0.85" />

    {/* Multiple Terracotta Domes (Curved row) */}
    <path d="M30 55 Q42 38 54 55 Z" fill={primaryColor} fillOpacity="0.7" />
    <path d="M52 55 Q64 35 76 55 Z" fill={primaryColor} fillOpacity="0.8" />
    <path d="M74 55 Q85 30 96 55 Z" fill={primaryColor} fillOpacity="0.9" />
    <path d="M94 55 Q106 35 118 55 Z" fill={primaryColor} fillOpacity="0.8" />
    <path d="M116 55 Q128 38 140 55 Z" fill={primaryColor} fillOpacity="0.7" />

    {/* Traditional Pointed Two-Centred Bengali Arches */}
    <path d="M32 102 L32 82 Q42 70 52 82 L52 102 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M58 102 L58 82 Q68 68 78 82 L78 102 Z" fill="#FFFFFF" fillOpacity="0.9" />
    <path d="M84 102 L84 78 Q96 64 108 78 L108 102 Z" fill="#FFFFFF" fillOpacity="0.95" />
    <path d="M114 102 L114 82 Q124 70 134 82 L134 102 Z" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

// 5. Metropolitan Skyline / Modern Civic Architecture — Thana Admin
export const ThanaSkylineSVG: React.FC<LandmarkProps> = ({ primaryColor = '#008080', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bridge / Flyover Structure */}
    <path d="M5 110 C45 95 125 95 165 110" stroke={primaryColor} strokeWidth="3" strokeOpacity="0.6" />
    <path d="M5 118 C45 105 125 105 165 118" stroke={primaryColor} strokeWidth="2" strokeOpacity="0.4" />
    <line x1="50" y1="98" x2="50" y2="120" stroke={primaryColor} strokeWidth="2" strokeOpacity="0.5" />
    <line x1="85" y1="95" x2="85" y2="120" stroke={primaryColor} strokeWidth="2.5" strokeOpacity="0.6" />
    <line x1="120" y1="98" x2="120" y2="120" stroke={primaryColor} strokeWidth="2" strokeOpacity="0.5" />

    {/* Modern High-Rise Civic Towers in Background */}
    <rect x="25" y="45" width="22" height="60" rx="2" fill={primaryColor} fillOpacity="0.3" />
    <rect x="52" y="30" width="28" height="75" rx="2" fill={primaryColor} fillOpacity="0.45" />
    <polygon points="66,15 52,30 80,30" fill={primaryColor} fillOpacity="0.6" />
    <rect x="85" y="20" width="32" height="85" rx="2" fill={primaryColor} fillOpacity="0.55" />
    <line x1="101" y1="20" x2="101" y2="6" stroke={primaryColor} strokeWidth="2" strokeOpacity="0.7" />
    <rect x="122" y="50" width="24" height="55" rx="2" fill={primaryColor} fillOpacity="0.35" />

    {/* Tower Window Grids */}
    <circle cx="101" cy="40" r="4" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="101" cy="55" r="4" fill="#FFFFFF" fillOpacity="0.85" />
    <rect x="58" y="42" width="5" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="68" y="42" width="5" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="58" y="58" width="5" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
    <rect x="68" y="58" width="5" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

// 6. Shaheed Minar / Union Heritage — Union Admin
export const ShaheedMinarSVG: React.FC<LandmarkProps> = ({ primaryColor = '#4A154B', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Podium & Red Sun */}
    <rect x="20" y="105" width="130" height="12" rx="2" fill={primaryColor} fillOpacity="0.4" />
    <circle cx="85" cy="55" r="28" fill="#C8102E" fillOpacity="0.75" />

    {/* Central Tall Minar Column */}
    <path d="M78 105 L78 28 C78 20 92 20 92 28 L92 105 Z" fill={primaryColor} fillOpacity="0.75" />
    <rect x="82" y="32" width="6" height="70" fill="#FFFFFF" fillOpacity="0.85" />

    {/* Left Flanking Columns */}
    <path d="M52 105 L52 48 C52 42 64 42 64 48 L64 105 Z" fill={primaryColor} fillOpacity="0.55" />
    <rect x="56" y="52" width="4" height="50" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M30 105 L30 65 C30 60 40 60 40 65 L40 105 Z" fill={primaryColor} fillOpacity="0.4" />

    {/* Right Flanking Columns */}
    <path d="M106 105 L106 48 C106 42 118 42 118 48 L118 105 Z" fill={primaryColor} fillOpacity="0.55" />
    <rect x="110" y="52" width="4" height="50" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M130 105 L130 65 C130 60 140 60 140 65 L140 105 Z" fill={primaryColor} fillOpacity="0.4" />
  </svg>
);

// 7. Community Volunteers Silhouette — Volunteer
export const VolunteersSVG: React.FC<LandmarkProps> = ({ primaryColor = '#1B4931', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 170 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill={primaryColor} fillOpacity="0.55">
      {/* Figure 1 */}
      <circle cx="28" cy="40" r="7" />
      <path d="M18 75 C18 58 38 58 38 75 L36 95 L20 95 Z" />

      {/* Figure 2 */}
      <circle cx="55" cy="32" r="8" />
      <path d="M43 72 C43 52 67 52 67 72 L64 95 L46 95 Z" />

      {/* Center Figure (Leader/Active) */}
      <circle cx="85" cy="24" r="9" fillOpacity="0.8" />
      <path d="M71 68 C71 45 99 45 99 68 L95 95 L75 95 Z" fillOpacity="0.8" />

      {/* Figure 4 */}
      <circle cx="115" cy="32" r="8" />
      <path d="M103 72 C103 52 127 52 127 72 L124 95 L106 95 Z" />

      {/* Figure 5 */}
      <circle cx="142" cy="40" r="7" />
      <path d="M132 75 C132 58 152 58 152 75 L150 95 L134 95 Z" />

      {/* Connecting Arm/Hand lines (Unity) */}
      <path d="M32 60 Q55 68 75 58 Q95 68 115 58 Q135 68 142 60" stroke={primaryColor} strokeWidth="3.5" strokeOpacity="0.6" fill="none" />
    </g>
  </svg>
);

// 8. Donor Heart & Droplet Crest — Donor
export const DonorHeartDropSVG: React.FC<LandmarkProps> = ({ primaryColor = '#C8102E', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 140 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M70 12 C70 12 35 48 35 78 C35 98 50 112 70 112 C90 112 105 98 105 78 C105 48 70 12 70 12 Z" 
      fill={primaryColor} 
      fillOpacity="0.45" 
    />
    <path 
      d="M70 45 C62 38 48 42 48 55 C48 70 70 85 70 85 C70 85 92 70 92 55 C92 42 78 38 70 45 Z" 
      fill="#FFFFFF" 
      fillOpacity="0.9" 
    />
    <path 
      d="M70 50 C64 45 54 48 54 57 C54 68 70 79 70 79 C70 79 86 68 86 57 C86 48 76 45 70 50 Z" 
      fill={primaryColor} 
      fillOpacity="0.8" 
    />
  </svg>
);

// 9. Bangladesh Map Vector Outline (High-contrast accurate silhouette for Card Back)
export const BangladeshMapSVG: React.FC<{ color?: string; className?: string }> = ({ color = '#C8102E', className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M100 12 
         C112 10 125 15 135 22 
         C145 30 152 42 150 55 
         C148 68 160 75 168 85 
         C176 96 182 110 178 122 
         C174 135 165 145 162 158 
         C160 172 165 185 168 198 
         C170 205 165 212 158 210 
         C148 206 142 195 135 188 
         C128 180 120 185 112 192 
         C104 200 95 215 88 220 
         C80 226 72 218 68 208 
         C64 198 62 185 58 174 
         C52 160 40 150 35 138 
         C30 124 35 110 40 98 
         C46 84 55 72 62 60 
         C68 48 76 35 84 24 
         C90 16 95 12 100 12 Z" 
      fill={color} 
      fillOpacity="0.14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeOpacity="0.4" 
    />
    {/* Sundarbans Coastal Island Nodes */}
    <circle cx="85" cy="226" r="3.5" fill={color} fillOpacity="0.3" />
    <circle cx="98" cy="222" r="3" fill={color} fillOpacity="0.3" />
    <circle cx="112" cy="214" r="3" fill={color} fillOpacity="0.3" />
    <circle cx="126" cy="208" r="4" fill={color} fillOpacity="0.3" />
    <circle cx="142" cy="216" r="3" fill={color} fillOpacity="0.25" />
    <circle cx="155" cy="220" r="2.5" fill={color} fillOpacity="0.25" />
  </svg>
);

// 10. Official Role Emblem Badge (Top Right of Front Card)
export const RoleBadgeEmblem: React.FC<{ roleId: string; badgeIcon?: string; primaryColor?: string; className?: string }> = ({
  roleId,
  badgeIcon,
  primaryColor = '#580F1A',
  className = 'w-9 h-9'
}) => {
  // Super Admin: Gold Rosette Award Star with ribbon
  if (roleId === 'super_admin' || badgeIcon === 'gold_star') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 flex items-center justify-center shadow-md border-2 border-amber-200 relative`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-amber-700 text-amber-900 drop-shadow-sm">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
        {/* Ribbon tails underneath */}
        <div className="absolute -bottom-1.5 flex space-x-0.5">
          <div className="w-1.5 h-2 bg-amber-600 rounded-b-sm transform -rotate-12" />
          <div className="w-1.5 h-2 bg-amber-600 rounded-b-sm transform rotate-12" />
        </div>
      </div>
    );
  }

  // Division Admin: Royal Blue Star Badge
  if (roleId === 'division_admin' || badgeIcon === 'blue_star') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-300 flex items-center justify-center shadow-md border-2 border-blue-200 relative`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-blue-900 drop-shadow-sm">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
        <div className="absolute -bottom-1.5 flex space-x-0.5">
          <div className="w-1.5 h-2 bg-blue-700 rounded-b-sm transform -rotate-12" />
          <div className="w-1.5 h-2 bg-blue-700 rounded-b-sm transform rotate-12" />
        </div>
      </div>
    );
  }

  // District Admin: Emerald Fort / Heritage Crest
  if (roleId === 'district_admin' || badgeIcon === 'fort') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md border-2 border-emerald-200`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-emerald-900">
          <path d="M2 20h20v-4H2v4zm2-6h2v-2H4v2zm4 0h2v-2H8v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM3 10h18l-9-7-9 7z" />
        </svg>
      </div>
    );
  }

  // Upazila Admin: Terracotta Heritage Dome / Arch Crest
  if (roleId === 'upazila_admin' || badgeIcon === 'arch') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shadow-md border-2 border-orange-200`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-orange-950">
          <path d="M12 2C8 6 4 10 4 14v6h16v-6c0-4-4-8-8-12zm0 16c-2.2 0-4-1.8-4-4 0-1.5 1-3 4-5 3 2 4 3.5 4 5 0 2.2-1.8 4-4 4z" />
        </svg>
      </div>
    );
  }

  // Metropolitan Thana Admin: Teal Civic Tower Crest
  if (roleId === 'thana_admin' || badgeIcon === 'building') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-teal-600 to-cyan-400 flex items-center justify-center shadow-md border-2 border-teal-200`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-teal-950">
          <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm-4-8h2v2H8V4zm0 4h2v2H8V8zm0 4h2v2H8v-2zm-4-8h2v2H4V4zm0 4h2v2H4V8zm0 4h2v2H4v-2zm12 8H4v-2h12v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2zm0-4h-2V4h2v2z" />
        </svg>
      </div>
    );
  }

  // Union Admin: Purple Star Crest
  if (roleId === 'union_admin' || badgeIcon === 'purple_star') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-400 flex items-center justify-center shadow-md border-2 border-purple-200`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-purple-950">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
      </div>
    );
  }

  // Volunteer: Green Volunteer Shield / Silhouette
  if (roleId === 'volunteer') {
    return (
      <div className={`${className} rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center shadow-md border-2 border-emerald-300`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      </div>
    );
  }

  // Donor / Default: Green Community / Droplet Badge
  return (
    <div className={`${className} rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md border-2 border-emerald-200`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};
