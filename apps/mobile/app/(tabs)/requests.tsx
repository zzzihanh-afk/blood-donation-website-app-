import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { AlertCircle, MapPin, Plus, Heart } from 'lucide-react-native';
import { SAMPLE_BLOOD_REQUESTS } from '@lalbindu/api-client';

export default function MobileRequestsScreen() {
  const [requests] = useState(SAMPLE_BLOOD_REQUESTS);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Emergency Requests</Text>
            <Text style={styles.subtitle}>Verified clinical emergencies</Text>
          </View>
          <TouchableOpacity 
            style={styles.postBtn}
            onPress={() => alert('Opening emergency blood request form')}
          >
            <Plus color="#FFFFFF" size={16} />
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {requests.map(req => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{req.urgency.replace('_', ' ').toUpperCase()}</Text>
                </View>
                <Text style={styles.code}>{req.request_code}</Text>
              </View>

              <View style={styles.mainInfo}>
                <View style={styles.groupBadge}>
                  <Text style={styles.groupText}>{req.blood_group}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.hospital}>{req.hospital_name}</Text>
                  <Text style={styles.district}>{req.hospital_district_en} District</Text>
                </View>
              </View>

              <View style={styles.descBox}>
                <Text style={styles.descText}>{req.description}</Text>
                <Text style={styles.unitsText}>Units Needed: {req.units_needed} ({req.component})</Text>
              </View>

              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => alert(`Contacting hospital for ${req.request_code}`)}
              >
                <Heart color="#FFFFFF" size={16} />
                <Text style={styles.actionBtnText}>I Can Donate</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F8' },
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#171717' },
  subtitle: { fontSize: 12, color: '#707070', marginTop: 2 },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8102E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  postBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, marginLeft: 4 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { color: '#C8102E', fontWeight: '900', fontSize: 9 },
  code: { fontSize: 11, fontFamily: 'monospace', color: '#999' },
  mainInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  groupBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF5F6',
    borderWidth: 1.5,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupText: { color: '#C8102E', fontWeight: '900', fontSize: 18 },
  hospital: { fontSize: 14, fontWeight: '800', color: '#171717' },
  district: { fontSize: 12, color: '#707070', marginTop: 1 },
  descBox: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  descText: { fontSize: 12, color: '#555', lineHeight: 16 },
  unitsText: { fontSize: 11, fontWeight: '800', color: '#C8102E', marginTop: 6 },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#C8102E',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, marginLeft: 6 },
});
