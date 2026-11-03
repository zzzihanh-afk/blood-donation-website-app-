export const brandColors = {
  primary: '#C8102E',      // Primary Red
  secondary: '#E31E36',    // Secondary Red / Crimson
  bangladeshGreen: '#006A4E', // Bangladesh Heritage Green
  darkText: '#171717',     // Dark neutral text
  lightBg: '#FFF5F6',      // Subtle light red background tint
  pureWhite: '#FFFFFF',
  mutedText: '#707070',
  success: '#16834A',
  warning: '#E69A17',
  error: '#D32F2F',
  info: '#1976D2'
} as const;

export interface RoleCardTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeTextColor: string;
  labelEn: string;
  labelBn: string;
  borderStyle: string;
}

export const roleCardThemes: Record<string, RoleCardTheme> = {
  super_admin: {
    primaryColor: '#580F1A', // Deep Burgundy
    secondaryColor: '#30080E',
    accentColor: '#D4AF37',  // Royal Gold
    badgeTextColor: '#FFFFFF',
    labelEn: 'Super Administrator',
    labelBn: 'প্রধান প্রশাসক',
    borderStyle: 'solid 2px #D4AF37'
  },
  division_admin: {
    primaryColor: '#0D3B66', // Royal Blue
    secondaryColor: '#062038',
    accentColor: '#F4D35E',  // Gold
    badgeTextColor: '#FFFFFF',
    labelEn: 'Division Administrator',
    labelBn: 'বিভাগীয় প্রশাসক',
    borderStyle: 'solid 2px #F4D35E'
  },
  district_admin: {
    primaryColor: '#006A4E', // Emerald Green
    secondaryColor: '#004532',
    accentColor: '#E8F5E9',
    badgeTextColor: '#FFFFFF',
    labelEn: 'District Administrator',
    labelBn: 'জেলা সমন্বয়ক ও প্রশাসক',
    borderStyle: 'solid 2px #006A4E'
  },
  upazila_admin: {
    primaryColor: '#D84A1B', // Terracotta Orange
    secondaryColor: '#93300E',
    accentColor: '#FFF3E0',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Upazila Administrator',
    labelBn: 'উপজেলা প্রশাসক',
    borderStyle: 'solid 2px #D84A1B'
  },
  thana_admin: {
    primaryColor: '#008080', // Teal
    secondaryColor: '#004C4C',
    accentColor: '#E0F2F1',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Metropolitan Thana Admin',
    labelBn: 'মেট্রোপলিটন থানা প্রশাসক',
    borderStyle: 'solid 2px #008080'
  },
  city_corp_admin: {
    primaryColor: '#1B4931', // Dark Forest Green
    secondaryColor: '#0C2618',
    accentColor: '#D4AF37',  // Gold
    badgeTextColor: '#FFFFFF',
    labelEn: 'City Corporation Admin',
    labelBn: 'সিটি কর্পোরেশন প্রশাসক',
    borderStyle: 'solid 2px #D4AF37'
  },
  municipality_admin: {
    primaryColor: '#1D3557', // Navy Blue
    secondaryColor: '#0E1D33',
    accentColor: '#A8DADC',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Municipality Administrator',
    labelBn: 'পৌরসভা প্রশাসক',
    borderStyle: 'solid 2px #1D3557'
  },
  union_admin: {
    primaryColor: '#4A154B', // Imperial Purple
    secondaryColor: '#2B082C',
    accentColor: '#F3E5F5',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Union Administrator',
    labelBn: 'ইউনিয়ন সমন্বয়ক',
    borderStyle: 'solid 2px #4A154B'
  },
  ward_admin: {
    primaryColor: '#9B111E', // Ruby Rose
    secondaryColor: '#580A11',
    accentColor: '#FFEBEE',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Ward Administrator',
    labelBn: 'ওয়ার্ড প্রতিনিধি',
    borderStyle: 'solid 2px #9B111E'
  },
  donor: {
    primaryColor: '#C8102E', // LalBindu Red
    secondaryColor: '#8E0B20',
    accentColor: '#FFF5F6',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Voluntary Blood Donor',
    labelBn: 'স্বেচ্ছাসেবী রক্তদাতা',
    borderStyle: 'solid 2px #C8102E'
  },
  volunteer: {
    primaryColor: '#006A4E', // Green
    secondaryColor: '#004734',
    accentColor: '#E8F5E9',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Platform Volunteer',
    labelBn: 'প্ল্যাটফর্ম স্বেচ্ছাসেবক',
    borderStyle: 'solid 2px #006A4E'
  },
  hospital_staff: {
    primaryColor: '#1565C0', // Clinical Cobalt
    secondaryColor: '#0B3F7A',
    accentColor: '#E3F2FD',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Hospital Clinical Staff',
    labelBn: 'হাসপাতাল প্রতিনিধি',
    borderStyle: 'solid 2px #1565C0'
  },
  verification_officer: {
    primaryColor: '#2E7D32', // Verification Green
    secondaryColor: '#1B5E20',
    accentColor: '#C8E6C9',
    badgeTextColor: '#FFFFFF',
    labelEn: 'Donation Verification Officer',
    labelBn: 'রক্তদান যাচাইকরণ কর্মকর্তা',
    borderStyle: 'solid 2px #2E7D32'
  }
};

export const availabilityStatusTokens = {
  available: {
    labelEn: 'Available for Requests',
    labelBn: 'রক্তদানের জন্য প্রস্তুত',
    color: '#16834A',
    bgColor: '#E8F5E9'
  },
  temporarily_unavailable: {
    labelEn: 'Temporarily Unavailable (Resting Period)',
    labelBn: 'সাময়িক বিরতিতে আছেন',
    color: '#D84A1B',
    bgColor: '#FFF3E0'
  },
  needs_confirmation: {
    labelEn: 'Needs Donor Confirmation',
    labelBn: 'সম্মতি নিশ্চিতকরণ প্রয়োজন',
    color: '#E69A17',
    bgColor: '#FFFDE7'
  },
  paused_by_donor: {
    labelEn: 'Paused by Donor',
    labelBn: 'দাতা কর্তৃক স্থগিত',
    color: '#707070',
    bgColor: '#EEEEEE'
  },
  hidden_from_search: {
    labelEn: 'Hidden from Search',
    labelBn: 'অনুসন্ধান থেকে লুকায়িত',
    color: '#707070',
    bgColor: '#EEEEEE'
  },
  under_review: {
    labelEn: 'Under Review',
    labelBn: 'পর্যালোচনাধীন',
    color: '#1976D2',
    bgColor: '#E3F2FD'
  },
  suspended: {
    labelEn: 'Account Suspended',
    labelBn: 'অ্যাকাউন্ট স্থগিত',
    color: '#D32F2F',
    bgColor: '#FFEBEE'
  }
};
