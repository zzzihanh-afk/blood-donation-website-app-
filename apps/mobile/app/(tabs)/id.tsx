import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Share,
  Image,
  Dimensions,
  Linking
} from 'react-native';
import { 
  QrCode, 
  ShieldCheck, 
  Share2, 
  Download, 
  Droplet, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  Copy,
  Check
} from 'lucide-react-native';
import { REFERENCE_SAMPLE_PROFILES } from '@lalbindu/api-client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 8 Master Role Definitions matching reference poster image exactly
interface RoleMeta {
  roleId: string;
  roleNameEn: string;
  roleNameBn: string;
  primaryColor: string;
  secondaryColor: string;
  badgeLabel: string;
  landmark: string;
}

const ROLES_METADATA: RoleMeta[] = [
  {
    roleId: 'super_admin',
    roleNameEn: 'Super Admin',
    roleNameBn: 'সুপার অ্যাডমিন',
    primaryColor: '#580F1A',
    secondaryColor: '#30080E',
    badgeLabel: 'Gold Rosette',
    landmark: 'Jatiyo Smriti Soudho'
  },
  {
    roleId: 'division_admin',
    roleNameEn: 'Division Administrator',
    roleNameBn: 'বিভাগীয় প্রশাসক',
    primaryColor: '#0D3B66',
    secondaryColor: '#062038',
    badgeLabel: 'Royal Blue Star',
    landmark: 'Jatiya Sangsad Bhaban'
  },
  {
    roleId: 'district_admin',
    roleNameEn: 'District Administrator',
    roleNameBn: 'জেলা প্রশাসক',
    primaryColor: '#006A4E',
    secondaryColor: '#004532',
    badgeLabel: 'Historic Fort Crest',
    landmark: 'Ahsan Manzil / Lalbagh'
  },
  {
    roleId: 'upazila_admin',
    roleNameEn: 'Upazila Administrator',
    roleNameBn: 'উপজেলা প্রশাসক',
    primaryColor: '#D84A1B',
    secondaryColor: '#93300E',
    badgeLabel: 'Terracotta Arch',
    landmark: 'Shat Gombuj Masjid'
  },
  {
    roleId: 'thana_admin',
    roleNameEn: 'Metropolitan Thana Administrator',
    roleNameBn: 'মেট্রোপলিটন থানা প্রশাসক',
    primaryColor: '#008080',
    secondaryColor: '#004C4C',
    badgeLabel: 'Civic Tower Crest',
    landmark: 'Metropolitan Civic Skyline'
  },
  {
    roleId: 'union_admin',
    roleNameEn: 'Union Administrator',
    roleNameBn: 'ইউনিয়ন প্রশাসক',
    primaryColor: '#4A154B',
    secondaryColor: '#2B082C',
    badgeLabel: 'Purple Star Crest',
    landmark: 'Central Shaheed Minar'
  },
  {
    roleId: 'donor',
    roleNameEn: 'Donor Member',
    roleNameBn: 'স্বেচ্ছাসেবী রক্তদাতা',
    primaryColor: '#006A4E',
    secondaryColor: '#004532',
    badgeLabel: 'Blood Group Crest',
    landmark: 'Heart & Droplet'
  },
  {
    roleId: 'volunteer',
    roleNameEn: 'Volunteer',
    roleNameBn: 'প্ল্যাটফর্ম স্বেচ্ছাসেবক',
    primaryColor: '#1B4931',
    secondaryColor: '#0C2618',
    badgeLabel: 'Volunteer Shield',
    landmark: 'Volunteer Unit'
  }
];

export default function MobileIdCardScreen() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('super_admin');
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Active Role and Profile
  const currentRole = ROLES_METADATA.find(r => r.roleId === selectedRoleId) || ROLES_METADATA[0];
  const currentProfile = REFERENCE_SAMPLE_PROFILES.find(p => p.role_id === selectedRoleId) || REFERENCE_SAMPLE_PROFILES[0];

  const verificationUrl = currentProfile.verification_url || `https://lalbindu.bd/verify/${currentProfile.unique_id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        title: `LalBindu Official ID Card — ${currentProfile.full_name}`,
        message: `LalBindu Bangladesh Verified Digital ID Card\n` +
          `Name: ${currentProfile.full_name} (${currentProfile.full_name_bn})\n` +
          `Designation: ${currentProfile.designation_en}\n` +
          `ID: ${currentProfile.unique_id}\n` +
          `Status: Active Verified Credential\n` +
          `Verify Authenticity Online: ${verificationUrl}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = () => {
    setCopiedNotification('Verification Link Ready to Share!');
    setTimeout(() => setCopiedNotification(null), 3000);
    handleShare();
  };

  const handleOpenVerify = () => {
    Linking.openURL(verificationUrl).catch(err => console.error('Could not open verify link', err));
  };

  // Render Role Badge Icon Crest
  const renderBadgeIcon = (roleId: string, color: string) => {
    switch (roleId) {
      case 'super_admin':
        return (
          <View style={[styles.badgePill, { backgroundColor: '#FDF6B2', borderColor: '#D4AF37' }]}>
            <Award color="#D4AF37" size={14} />
          </View>
        );
      case 'division_admin':
        return (
          <View style={[styles.badgePill, { backgroundColor: '#DBEAFE', borderColor: '#2563EB' }]}>
            <ShieldCheck color="#2563EB" size={14} />
          </View>
        );
      case 'donor':
        return (
          <View style={[styles.badgePill, { backgroundColor: '#FEE2E2', borderColor: '#C8102E' }]}>
            <Droplet color="#C8102E" size={14} />
          </View>
        );
      default:
        return (
          <View style={[styles.badgePill, { backgroundColor: '#E0F2FE', borderColor: color }]}>
            <ShieldCheck color={color} size={14} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Title Section */}
        <View style={styles.header}>
          <View style={styles.headerTag}>
            <Sparkles color="#C8102E" size={12} />
            <Text style={styles.headerTagText}>OFFICIAL CR80 DIGITAL IDENTITY</Text>
          </View>
          <Text style={styles.title}>LalBindu Digital ID Cards</Text>
          <Text style={styles.subtitle}>
            Standard CR80 (85.6mm × 54mm) digital credentials across all 8 nationwide roles.
          </Text>
        </View>

        {/* Feedback Toast */}
        {copiedNotification && (
          <View style={styles.toast}>
            <Check color="#16A34A" size={14} />
            <Text style={styles.toastText}>{copiedNotification}</Text>
          </View>
        )}

        {/* 8-Role Selector Horizontal Pill ScrollView */}
        <View style={styles.rolePickerContainer}>
          <Text style={styles.sectionHeading}>SELECT ROLE TO PREVIEW (8 ROLES):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleScroll}>
            {ROLES_METADATA.map((role) => {
              const isSelected = role.roleId === selectedRoleId;
              return (
                <TouchableOpacity
                  key={role.roleId}
                  style={[
                    styles.rolePill,
                    isSelected ? { backgroundColor: role.primaryColor, borderColor: role.primaryColor } : styles.rolePillInactive
                  ]}
                  onPress={() => setSelectedRoleId(role.roleId)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.roleDot, 
                      { backgroundColor: isSelected ? '#FFFFFF' : role.primaryColor }
                    ]} 
                  />
                  <Text style={[styles.rolePillText, isSelected ? styles.rolePillTextActive : styles.rolePillTextInactive]}>
                    {role.roleNameEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* View Mode Toggle (Both / Front / Back) */}
        <View style={styles.viewModeToggleRow}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'both' && styles.toggleBtnActive]}
            onPress={() => setViewMode('both')}
          >
            <Layers size={13} color={viewMode === 'both' ? '#FFFFFF' : '#4B5563'} />
            <Text style={[styles.toggleBtnText, viewMode === 'both' && styles.toggleBtnTextActive]}>
              Front & Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'front' && styles.toggleBtnActive]}
            onPress={() => setViewMode('front')}
          >
            <Text style={[styles.toggleBtnText, viewMode === 'front' && styles.toggleBtnTextActive]}>
              Front Side
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'back' && styles.toggleBtnActive]}
            onPress={() => setViewMode('back')}
          >
            <Text style={[styles.toggleBtnText, viewMode === 'back' && styles.toggleBtnTextActive]}>
              Back Side
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* CARD PRESENTATION WRAPPER */}
        {/* ================================================================= */}
        <View style={styles.cardsWrapper}>

          {/* FRONT CARD */}
          {(viewMode === 'both' || viewMode === 'front') && (
            <View style={styles.cardOuterContainer}>
              {/* Floating Top Role Header Pill */}
              <View style={[styles.floatingRolePill, { backgroundColor: currentRole.primaryColor }]}>
                <Text style={styles.floatingRolePillText}>
                  {currentRole.roleNameEn.toUpperCase()}
                </Text>
              </View>

              {/* Card Body */}
              <View style={styles.cr80Card}>
                {/* Top Row: LalBindu Logo & Right Badge */}
                <View style={styles.cardTopBar}>
                  <View style={styles.logoRow}>
                    <View style={styles.logoCircle}>
                      <Droplet color="#C8102E" size={13} fill="#C8102E" />
                    </View>
                    <View>
                      <Text style={styles.logoBrand}>LalBindu</Text>
                      <Text style={styles.logoTagline}>Every Drop Connects a Life.</Text>
                    </View>
                  </View>

                  {renderBadgeIcon(currentRole.roleId, currentRole.primaryColor)}
                </View>

                {/* Middle Info Section */}
                <View style={styles.cardMiddleRow}>
                  {/* Portrait with role-colored border */}
                  <View style={[styles.avatarFrame, { borderColor: currentRole.primaryColor }]}>
                    <Image 
                      source={{ uri: currentProfile.avatar_url }} 
                      style={styles.avatarImage} 
                    />
                  </View>

                  {/* Text Details Column */}
                  <View style={styles.detailsColumn}>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {currentProfile.full_name}
                    </Text>
                    <Text style={[styles.designationText, { color: currentRole.primaryColor }]} numberOfLines={1}>
                      {currentProfile.designation_en}
                    </Text>
                    <Text style={styles.idNumberText}>
                      ID: {currentProfile.unique_id}
                    </Text>

                    {/* Jurisdiction or Organization */}
                    {(currentProfile.organization_name || currentProfile.jurisdiction_en) && (
                      <Text style={styles.jurisdictionText} numberOfLines={1}>
                        {currentProfile.organization_name || currentProfile.jurisdiction_en}
                      </Text>
                    )}

                    {/* Total Donations for Donor */}
                    {currentProfile.donation_count !== undefined && (
                      <Text style={styles.donationsText}>
                        Total Donations: {currentProfile.donation_count}
                      </Text>
                    )}

                    <Text style={styles.validUntilText}>
                      Valid Until: {currentProfile.valid_until || '31 Dec 2026'}
                    </Text>
                  </View>

                  {/* Donor Blood Group Badge Crest */}
                  {currentProfile.blood_group && (
                    <View style={styles.bloodCrest}>
                      <Droplet color="#FFFFFF" size={11} fill="#FFFFFF" />
                      <Text style={styles.bloodCrestText}>{currentProfile.blood_group}</Text>
                    </View>
                  )}
                </View>

                {/* Bottom Decorative Wave Ribbons */}
                <View style={styles.bottomWaveContainer}>
                  <View style={[styles.waveLayer1, { backgroundColor: currentRole.primaryColor }]} />
                  <View style={[styles.waveLayer2, { backgroundColor: currentRole.secondaryColor }]} />
                </View>
              </View>
            </View>
          )}

          {/* BACK CARD */}
          {(viewMode === 'both' || viewMode === 'back') && (
            <View style={[styles.cardOuterContainer, viewMode === 'both' && { marginTop: 24 }]}>
              {/* Dummy spacing header to match alignment */}
              <View style={[styles.floatingRolePill, { opacity: 0 }]}>
                <Text style={styles.floatingRolePillText}>BACK</Text>
              </View>

              {/* Card Body */}
              <View style={styles.cr80Card}>
                {/* Centered LalBindu Logo */}
                <View style={styles.backCenterLogo}>
                  <View style={styles.logoRow}>
                    <View style={styles.logoCircle}>
                      <Droplet color="#C8102E" size={13} fill="#C8102E" />
                    </View>
                    <View>
                      <Text style={styles.logoBrand}>LalBindu</Text>
                      <Text style={styles.logoTagline}>Every Drop Connects a Life.</Text>
                    </View>
                  </View>
                </View>

                {/* Center Scannable QR Code */}
                <View style={styles.qrCenterBox}>
                  <View style={styles.qrWhiteBox}>
                    <QrCode color="#171717" size={62} />
                  </View>

                  {/* "SCAN TO VERIFY" Black Pill */}
                  <View style={styles.scanVerifyPill}>
                    <Text style={styles.scanVerifyText}>SCAN TO VERIFY</Text>
                  </View>

                  {/* Verification URL */}
                  <Text style={styles.qrUrlText} numberOfLines={1}>
                    https://lalbindu.bd/verify/{currentProfile.unique_id}
                  </Text>

                  {/* Issue Date & Status */}
                  <Text style={styles.issuedStatusText}>
                    Issued: 01 Jan 2025 | Valid: Active
                  </Text>
                </View>

                {/* Bottom Slogan Footer Ribbon */}
                <View style={[styles.sloganFooter, { backgroundColor: currentRole.primaryColor }]}>
                  <Text style={styles.sloganFooterText}>
                    Together for a Blood-Safe Bangladesh ❤️
                  </Text>
                </View>
              </View>
            </View>
          )}

        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleShare}>
            <Share2 color="#FFFFFF" size={15} />
            <Text style={styles.btnText}>Share ID Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleOpenVerify}>
            <ExternalLink color="#171717" size={15} />
            <Text style={styles.secondaryBtnText}>Verify Online</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Poster Footer Banner (Matching reference image) */}
        <View style={styles.bottomPosterBanner}>
          <View style={styles.posterLogoRow}>
            <View style={styles.posterDropBadge}>
              <Droplet color="#C8102E" size={16} fill="#C8102E" />
            </View>
            <View>
              <Text style={styles.posterBrandTitle}>LalBindu</Text>
              <Text style={styles.posterTagline}>Every Drop Connects a Life.</Text>
            </View>
          </View>
          
          <View style={styles.posterDivider} />

          <Text style={styles.posterSloganText}>
            Together for a Blood-Safe Bangladesh ❤️
          </Text>
          <Text style={styles.posterSubText}>
            Universal Cryptographically Verifiable CR80 Digital Identity Standard across 64 Districts.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF8F8' 
  },
  container: { 
    padding: 16, 
    paddingBottom: 40 
  },
  header: { 
    marginBottom: 16 
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    gap: 4
  },
  headerTagText: {
    color: '#C8102E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  title: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#171717', 
    letterSpacing: -0.5 
  },
  subtitle: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 2, 
    lineHeight: 16 
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6
  },
  toastText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700'
  },
  rolePickerContainer: {
    marginBottom: 16
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  roleScroll: {
    paddingVertical: 2,
    gap: 8
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6
  },
  rolePillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB'
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800'
  },
  rolePillTextActive: {
    color: '#FFFFFF'
  },
  rolePillTextInactive: {
    color: '#374151'
  },
  viewModeToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 3,
    marginBottom: 20
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 11,
    gap: 4
  },
  toggleBtnActive: {
    backgroundColor: '#C8102E',
    shadowColor: '#C8102E',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563'
  },
  toggleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  cardsWrapper: {
    alignItems: 'center',
    marginBottom: 22
  },
  cardOuterContainer: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 12
  },
  floatingRolePill: {
    position: 'absolute',
    top: 0,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingVertical: 3.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  floatingRolePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  cr80Card: {
    width: '100%',
    aspectRatio: 1.586, // Exact CR80 ratio: 85.6mm / 54mm
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 12,
    position: 'relative'
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  logoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: '#C8102E',
    lineHeight: 14
  },
  logoTagline: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#6B7280',
    lineHeight: 8
  },
  badgePill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    gap: 10,
    marginVertical: 'auto'
  },
  avatarFrame: {
    width: 62,
    height: 74,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 16
  },
  designationText: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
    marginTop: 1
  },
  idNumberText: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#374151',
    marginTop: 2
  },
  jurisdictionText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 1
  },
  donationsText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 1
  },
  validUntilText: {
    fontSize: 7.5,
    color: '#9CA3AF',
    marginTop: 2
  },
  bloodCrest: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#C8102E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  bloodCrestText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 11
  },
  bottomWaveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 18,
    zIndex: 5
  },
  waveLayer1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 8
  },
  waveLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 40,
    right: 0,
    height: 8,
    borderTopLeftRadius: 20,
    opacity: 0.75
  },
  backCenterLogo: {
    alignItems: 'center',
    paddingTop: 2,
    zIndex: 10
  },
  qrCenterBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
    zIndex: 10
  },
  qrWhiteBox: {
    padding: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  scanVerifyPill: {
    backgroundColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4
  },
  scanVerifyText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  qrUrlText: {
    fontSize: 7.5,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#374151',
    marginTop: 3
  },
  issuedStatusText: {
    fontSize: 6.5,
    color: '#6B7280',
    marginTop: 1
  },
  sloganFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  sloganFooterText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '800'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C8102E',
    paddingVertical: 13,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#C8102E',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 13,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6
  },
  secondaryBtnText: {
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 12
  },
  bottomPosterBanner: {
    backgroundColor: '#580F1A',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30080E'
  },
  posterLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  posterDropBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  posterBrandTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  posterTagline: {
    color: '#FECDD3',
    fontSize: 8,
    fontStyle: 'italic'
  },
  posterDivider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6
  },
  posterSloganText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center'
  },
  posterSubText: {
    color: '#FECDD3',
    fontSize: 8.5,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 12
  }
});
