'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  BANGLADESH_DIVISIONS, 
  BANGLADESH_KEY_DISTRICTS, 
  SAMPLE_DONORS 
} from '@lalbindu/api-client';
import { BloodGroup } from '@lalbindu/shared-types';
import { 
  Search, 
  Filter, 
  Droplet, 
  MapPin, 
  CheckCircle, 
  Phone, 
  Award, 
  X, 
  HeartHandshake,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function FindDonorPage() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalDonor, setContactModalDonor] = useState<typeof SAMPLE_DONORS[0] | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  // Available districts filtered by selected division
  const filteredDistricts = useMemo(() => {
    if (selectedDivision === 'All') return BANGLADESH_KEY_DISTRICTS;
    return BANGLADESH_KEY_DISTRICTS.filter(d => d.division_id === selectedDivision);
  }, [selectedDivision]);

  // Filtered donors list
  const filteredDonors = useMemo(() => {
    return SAMPLE_DONORS.filter(donor => {
      // Blood Group filter
      if (selectedBloodGroup !== 'All' && donor.blood_group !== selectedBloodGroup) {
        return false;
      }
      // Division filter
      if (selectedDivision !== 'All') {
        const divisionObj = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision);
        if (divisionObj && donor.division_name_en !== divisionObj.name_en) {
          return false;
        }
      }
      // District filter
      if (selectedDistrict !== 'All') {
        const districtObj = BANGLADESH_KEY_DISTRICTS.find(d => d.id === selectedDistrict);
        if (districtObj && donor.district_name_en !== districtObj.name_en) {
          return false;
        }
      }
      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = donor.full_name.toLowerCase().includes(q);
        const matchesLocation = donor.district_name_en.toLowerCase().includes(q) || donor.upazila_name_en.toLowerCase().includes(q);
        const matchesId = donor.donor_id_number.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesId) return false;
      }
      return true;
    });
  }, [selectedBloodGroup, selectedDivision, selectedDistrict, searchQuery]);

  const handleSendContactRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setContactModalDonor(null);
    }, 2000);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
            <Droplet className="w-3.5 h-3.5 fill-brand-red" />
            <span>Nationwide Donor Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Find Blood Donors Across Bangladesh
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search verified, consenting voluntary donors in all 64 districts. Donor contact privacy is strictly protected.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group</label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="All">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Division</label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict('All');
                }}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="All">All Divisions</option>
                {BANGLADESH_DIVISIONS.map(div => (
                  <option key={div.id} value={div.id}>{div.name_en} ({div.name_bn})</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District (Zilla)</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="All">All Districts</option>
                {filteredDistricts.map(dist => (
                  <option key={dist.id} value={dist.id}>{dist.name_en} ({dist.name_bn})</option>
                ))}
              </select>
            </div>

            {/* Text Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Donor Name or Area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

          </div>

          {/* Quick Filter Reset */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Showing <strong className="text-gray-900 font-bold">{filteredDonors.length}</strong> verified available donors</span>
            {(selectedBloodGroup !== 'All' || selectedDivision !== 'All' || selectedDistrict !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBloodGroup('All');
                  setSelectedDivision('All');
                  setSelectedDistrict('All');
                  setSearchQuery('');
                }}
                className="text-brand-red font-bold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between card-hover relative overflow-hidden"
            >
              {/* Top Row: Blood Group & Availability Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-light border-2 border-brand-red/30 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-brand-red">{donor.blood_group}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center">
                      {donor.full_name}
                      <span title="Verified Profile">
                        <CheckCircle className="w-4 h-4 text-brand-green ml-1.5 shrink-0" />
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-mono font-semibold">{donor.donor_id_number}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-green-100 text-brand-green text-[10px] font-extrabold rounded-full uppercase">
                  Available
                </span>
              </div>

              {/* Location & Stats */}
              <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-2xl text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    {donor.upazila_name_en}, {donor.district_name_en} ({donor.division_name_en})
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span>Verified Donations:</span>
                  <span className="font-bold text-brand-red">{donor.verified_donation_count} Times</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setContactModalDonor(donor)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Request Contact</span>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDonors.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center card-shadow border border-gray-100 max-w-md mx-auto my-8">
            <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No Donors Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              No donors matched your exact filter combination. Try adjusting the blood group or division.
            </p>
          </div>
        )}

      </div>

      {/* =========================================================================
          CONTACT REQUEST MODAL (Strict Donor Privacy Preservation)
         ========================================================================= */}
      {contactModalDonor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 card-shadow border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setContactModalDonor(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Contact Request Sent!</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  We have notified <strong>{contactModalDonor.full_name}</strong>. Once they accept your request, you will receive their direct contact details.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-xl font-black text-brand-red">
                    {contactModalDonor.blood_group}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Request Blood from {contactModalDonor.full_name}
                    </h3>
                    <p className="text-xs text-brand-green font-semibold">
                      Donor ID: {contactModalDonor.donor_id_number}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-gray-700 mb-4 space-y-1">
                  <p className="font-bold text-brand-red flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Privacy Notice:
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    To safeguard voluntary donors against harassment and spam, phone numbers are shared only when the donor accepts your emergency alert.
                  </p>
                </div>

                <form onSubmit={handleSendContactRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Patient Hospital / Clinic</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka Medical College Hospital"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Contact Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Urgency Note</label>
                    <textarea
                      rows={2}
                      placeholder="Describe the medical emergency..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Emergency Request</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
