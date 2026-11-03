import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Switch 
} from 'react-native';
import { User, Globe, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';

export default function MobileProfileScreen() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [allowEmergencyCalls, setAllowEmergencyCalls] = useState(true);
  const [allowSmsAlerts, setAllowSmsAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <Text style={styles.title}>Account & Preferences</Text>
        <Text style={styles.subtitle}>Privacy, notifications and language settings</Text>

        {/* Profile Summary Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AR</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.name}>Ahmed Rahman</Text>
            <Text style={styles.email}>ahmed.rahman@lalbindu.bd</Text>
            <Text style={styles.phone}>+880 1712 345678</Text>
          </View>
        </View>

        {/* Language Selection */}
        <Text style={styles.sectionHeading}>Language / ভাষা</Text>
        <View style={styles.settingCard}>
          <TouchableOpacity 
            style={styles.langOption}
            onPress={() => setLang('bn')}
          >
            <Text style={[styles.langText, lang === 'bn' && styles.langActive]}>বাংলা (Bangla)</Text>
            {lang === 'bn' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.langOption}
            onPress={() => setLang('en')}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langActive]}>English</Text>
            {lang === 'en' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>

        {/* Emergency Notification Controls */}
        <Text style={styles.sectionHeading}>Emergency Alert Controls</Text>
        <View style={styles.settingCard}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.switchTitle}>Emergency Phone Calls</Text>
              <Text style={styles.switchDesc}>Allow verified hospitals to call in life-or-death emergencies</Text>
            </View>
            <Switch
              value={allowEmergencyCalls}
              onValueChange={setAllowEmergencyCalls}
              trackColor={{ false: '#DDD', true: '#C8102E' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.switchTitle}>SMS Emergency Alerts</Text>
              <Text style={styles.switchDesc}>Receive instant Bangladesh SMS notifications for matched requests</Text>
            </View>
            <Switch
              value={allowSmsAlerts}
              onValueChange={setAllowSmsAlerts}
              trackColor={{ false: '#DDD', true: '#C8102E' }}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => alert('Signed out of LalBindu account')}
        >
          <LogOut color="#C8102E" size={16} />
          <Text style={styles.logoutText}>Sign Out of Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F8' },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '900', color: '#171717', marginTop: 8 },
  subtitle: { fontSize: 12, color: '#707070', marginTop: 2, marginBottom: 16 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF5F6',
    borderWidth: 1.5,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: '#C8102E' },
  name: { fontSize: 16, fontWeight: '800', color: '#171717' },
  email: { fontSize: 11, color: '#707070', marginTop: 1 },
  phone: { fontSize: 11, color: '#16834A', fontWeight: '700', marginTop: 2 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: '#171717', marginBottom: 8, marginTop: 10 },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  langText: { fontSize: 13, color: '#555555', fontWeight: '600' },
  langActive: { color: '#C8102E', fontWeight: '800' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C8102E' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  switchTitle: { fontSize: 13, fontWeight: '700', color: '#171717' },
  switchDesc: { fontSize: 10, color: '#707070', marginTop: 2, lineHeight: 14 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  logoutText: { color: '#C8102E', fontWeight: '800', fontSize: 13, marginLeft: 8 },
});
