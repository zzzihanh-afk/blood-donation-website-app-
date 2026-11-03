import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView 
} from 'react-native';
import { Search, MapPin, CheckCircle, Droplet, HeartHandshake } from 'lucide-react-native';
import { SAMPLE_DONORS } from '@lalbindu/api-client';

export default function MobileFindDonorScreen() {
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = SAMPLE_DONORS.filter(d => {
    if (selectedGroup !== 'All' && d.blood_group !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!d.full_name.toLowerCase().includes(q) && !d.district_name_en.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <Text style={styles.title}>Find Blood Donors</Text>
        <Text style={styles.subtitle}>Across all 64 districts in Bangladesh</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search color="#999" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search donor name or district..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Blood Group Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {bloodGroups.map(bg => (
            <TouchableOpacity
              key={bg}
              onPress={() => setSelectedGroup(bg)}
              style={[
                styles.groupChip,
                selectedGroup === bg && styles.groupChipActive
              ]}
            >
              <Text style={[
                styles.groupChipText,
                selectedGroup === bg && styles.groupChipTextActive
              ]}>
                {bg}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Donors List */}
        <ScrollView contentContainerStyle={styles.donorsList}>
          {filteredDonors.map(donor => (
            <View key={donor.id} style={styles.donorCard}>
              <View style={styles.cardHeader}>
                <View style={styles.donorGroupBadge}>
                  <Text style={styles.donorGroupText}>{donor.blood_group}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.donorName}>{donor.full_name}</Text>
                  <Text style={styles.donorLocation}>
                    <MapPin color="#707070" size={12} /> {donor.district_name_en} ({donor.division_name_en})
                  </Text>
                </View>
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>AVAILABLE</Text>
                </View>
              </View>

              <View style={styles.donorMetaRow}>
                <Text style={styles.metaLabel}>Verified Donations: <Text style={styles.metaValue}>{donor.verified_donation_count} Times</Text></Text>
                <Text style={styles.idLabel}>ID: {donor.donor_id_number}</Text>
              </View>

              <TouchableOpacity 
                style={styles.requestBtn}
                onPress={() => alert(`Sending emergency contact request to ${donor.full_name}`)}
              >
                <HeartHandshake color="#FFFFFF" size={16} />
                <Text style={styles.requestBtnText}>Request Blood Contact</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F8',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#171717',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#707070',
    marginTop: 2,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#171717',
  },
  filterScroll: {
    maxHeight: 40,
    marginBottom: 14,
  },
  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 8,
    justifyContent: 'center',
  },
  groupChipActive: {
    backgroundColor: '#C8102E',
    borderColor: '#C8102E',
  },
  groupChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#171717',
  },
  groupChipTextActive: {
    color: '#FFFFFF',
  },
  donorsList: {
    paddingBottom: 20,
  },
  donorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  donorGroupBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF5F6',
    borderWidth: 1.5,
    borderColor: '#C8102E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donorGroupText: {
    color: '#C8102E',
    fontWeight: '900',
    fontSize: 18,
  },
  donorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  donorLocation: {
    fontSize: 12,
    color: '#707070',
    marginTop: 2,
  },
  availableBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableBadgeText: {
    color: '#16834A',
    fontSize: 9,
    fontWeight: '900',
  },
  donorMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 11,
    color: '#707070',
  },
  metaValue: {
    fontWeight: '800',
    color: '#C8102E',
  },
  idLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#999999',
  },
  requestBtn: {
    flexDirection: 'row',
    backgroundColor: '#C8102E',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },
});
