import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Share 
} from 'react-native';
import { QrCode, ShieldCheck, Share2, Download, Droplet } from 'lucide-react-native';

export default function MobileIdCardScreen() {
  const cardData = {
    name: 'Ahmed Rahman',
    id: 'LB-0004278',
    bloodGroup: 'O+',
    role: 'Voluntary Blood Donor',
    roleBn: 'স্বেচ্ছাসেবী রক্তদাতা',
    status: 'Active',
    verifiedDonations: 5,
    issued: '2025-01-10',
    verificationUrl: 'https://lalbindu.bd/verify/LB-TOKEN-DNR-0004278'
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `LalBindu Digital ID Card: ${cardData.name} (${cardData.bloodGroup} Donor). Verify authenticity at: ${cardData.verificationUrl}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <Text style={styles.title}>Universal Digital ID Card</Text>
        <Text style={styles.subtitle}>Cryptographically verifiable across Bangladesh</Text>

        {/* The Card */}
        <View style={styles.cardContainer}>
          
          <View style={styles.cardHeader}>
            <View style={styles.logoRow}>
              <View style={styles.logoDot}>
                <Droplet color="#C8102E" size={14} />
              </View>
              <Text style={styles.brandTitle}>LalBindu</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activeText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.donorInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.donorName}>{cardData.name}</Text>
              <Text style={styles.donorRole}>{cardData.role}</Text>
              <Text style={styles.donorRoleBn}>{cardData.roleBn}</Text>
              <Text style={styles.idNumber}>{cardData.id}</Text>
            </View>

            <View style={styles.bloodBadge}>
              <Text style={styles.bloodBadgeText}>{cardData.bloodGroup}</Text>
            </View>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrRow}>
            <View style={styles.qrBox}>
              <QrCode color="#171717" size={64} />
            </View>
            <View style={styles.qrMeta}>
              <Text style={styles.metaTitle}>Digital QR Security</Text>
              <Text style={styles.metaDesc}>Scan with any phone camera or LalBindu app to verify validity.</Text>
              <Text style={styles.metaIssued}>Issued: {cardData.issued}</Text>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            This credential verifies LalBindu platform membership and donation history. It is not an unrestricted medical clearance.
          </Text>

        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleShare}>
            <Share2 color="#FFFFFF" size={16} />
            <Text style={styles.btnText}>Share ID Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => alert('Saving ID Card image to phone gallery...')}>
            <Download color="#171717" size={16} />
            <Text style={styles.secondaryBtnText}>Save Image</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F8' },
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#171717', marginTop: 8 },
  subtitle: { fontSize: 12, color: '#707070', marginTop: 2, marginBottom: 20 },
  cardContainer: {
    backgroundColor: '#C8102E',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#C8102E',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  brandTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  donorInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  donorName: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  donorRole: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', marginTop: 2 },
  donorRoleBn: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, marginTop: 1 },
  idNumber: { color: '#F4D35E', fontSize: 13, fontWeight: '800', fontFamily: 'monospace', marginTop: 6 },
  bloodBadge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodBadgeText: { color: '#C8102E', fontSize: 20, fontWeight: '900' },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  qrBox: {
    width: 76,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrMeta: { flex: 1, marginLeft: 12 },
  metaTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  metaDesc: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10, marginTop: 2, lineHeight: 14 },
  metaIssued: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', marginTop: 4 },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 12,
  },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C8102E',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, marginLeft: 6 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  secondaryBtnText: { color: '#171717', fontWeight: '800', fontSize: 13, marginLeft: 6 },
});
