import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Droplet, 
  Search, 
  AlertCircle, 
  CreditCard, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Calendar
} from 'lucide-react-native';

export default function MobileHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Ahmed!</Text>
            <Text style={styles.subGreeting}>Verified Donor • Dhaka District</Text>
          </View>
          <View style={styles.bloodGroupBadge}>
            <Text style={styles.bloodGroupText}>O+</Text>
          </View>
        </View>

        {/* Donor Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>TOTAL DONATIONS</Text>
              <Text style={styles.statsValue}>5 Units</Text>
            </View>
            <View style={styles.statusPill}>
              <ShieldCheck color="#16834A" size={14} />
              <Text style={styles.statusPillText}>Available</Text>
            </View>
          </View>

          {/* Achievement Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Next: Hero Donor</Text>
              <Text style={styles.progressCount}>5/10 Units</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '50%' }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/find')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#FFF5F6' }]}>
              <Search color="#C8102E" size={24} />
            </View>
            <Text style={styles.actionTitle}>Find Donor</Text>
            <Text style={styles.actionDesc}>64 Districts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/requests')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#FFF3E0' }]}>
              <AlertCircle color="#D84A1B" size={24} />
            </View>
            <Text style={styles.actionTitle}>Request Blood</Text>
            <Text style={styles.actionDesc}>Urgent Need</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/id')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#E8F5E9' }]}>
              <CreditCard color="#006A4E" size={24} />
            </View>
            <Text style={styles.actionTitle}>My ID Card</Text>
            <Text style={styles.actionDesc}>QR Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => alert('Viewing upcoming blood donation drives')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#F3E5F5' }]}>
              <Calendar color="#4A154B" size={24} />
            </View>
            <Text style={styles.actionTitle}>Campaigns</Text>
            <Text style={styles.actionDesc}>Local Camps</Text>
          </TouchableOpacity>

        </View>

        {/* Active Emergency Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Urgent Requests Nearby</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/requests')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestGroupBadge}>
              <Text style={styles.requestGroupText}>O+</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.hospitalName}>NICVD Heart Institute</Text>
              <Text style={styles.urgencyTag}>CRITICAL EMERGENCY • 2 UNITS</Text>
            </View>
          </View>
          <Text style={styles.requestDescription}>
            Urgent open-heart surgery tonight. Immediate 1 unit O+ donor required.
          </Text>
          <TouchableOpacity 
            style={styles.donateBtn}
            onPress={() => alert('Responding to NICVD Heart Institute request')}
          >
            <Text style={styles.donateBtnText}>I Can Donate</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F8',
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#171717',
  },
  subGreeting: {
    fontSize: 12,
    color: '#707070',
    marginTop: 2,
    fontWeight: '500',
  },
  bloodGroupBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8102E',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bloodGroupText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#707070',
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#C8102E',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16834A',
    marginLeft: 4,
  },
  progressContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C8102E',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C8102E',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#171717',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C8102E',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171717',
  },
  actionDesc: {
    fontSize: 10,
    color: '#707070',
    marginTop: 2,
    fontWeight: '500',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestGroupBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF5F6',
    borderWidth: 1.5,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestGroupText: {
    color: '#C8102E',
    fontWeight: '900',
    fontSize: 18,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  urgencyTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D84A1B',
    marginTop: 2,
  },
  requestDescription: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 14,
  },
  donateBtn: {
    backgroundColor: '#C8102E',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  donateBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
