'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
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
import { 
  getAllDiscoverableDonors, 
  DiscoverableDonor 
} from '@/lib/donors';

function matchesDivision(donorDiv: string | undefined, selectedDivId: string): boolean {
  if (selectedDivId === 'All') return true;
  if (!donorDiv) return false;
  const dNorm = donorDiv.trim().toLowerCase();
  const divObj = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivId);
  if (!divObj) return dNorm === selectedDivId.toLowerCase();
  const divEn = divObj.name_en.toLowerCase();
  const divBn = divObj.name_bn.toLowerCase();
  const divId = divObj.id.toLowerCase();
  return (
    dNorm === divEn ||
    dNorm === divBn ||
    dNorm === divId ||
    dNorm.includes(divEn) ||
    divEn.includes(dNorm)
  );
}

function matchesDistrict(donorDist: string | undefined, selectedDistId: string): boolean {
  if (selectedDistId === 'All') return true;
  if (!donorDist) return false;
  const dNorm = donorDist.trim().toLowerCase();
  const distObj = BANGLADESH_KEY_DISTRICTS.find(d => d.id === selectedDistId);
  if (!distObj) return dNorm === selectedDistId.toLowerCase();
  const distEn = distObj.name_en.toLowerCase();
  const distBn = distObj.name_bn.toLowerCase();
  const distId = distObj.id.toLowerCase();
  return (
    dNorm === distEn ||
    dNorm === distBn ||
    dNorm === distId ||
    dNorm.includes(distEn) ||
    distEn.includes(dNorm)
  );
}

export default function FindDonorPage() {
  const { t, lang } = useLanguage();
  const [donors, setDonors] = useState<DiscoverableDonor[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalDonor, setContactModalDonor] = useState<DiscoverableDonor | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requestFormData, setRequestFormData] = useState({
    patientHospital: '',
    contactMobile: '',
    urgencyNote: ''
  });

  // Hydrate donors on mount and sync reactively with account registrations/updates
  useEffect(() => {
    const refreshDonors = () => {
      setDonors(getAllDiscoverableDonors());
    };
    refreshDonors();

    window.addEventListener('lalbindu_donors_updated', refreshDonors);
    window.addEventListener('lalbindu_accounts_updated', refreshDonors);
    window.addEventListener('lalbindu_session_changed', refreshDonors);
    window.addEventListener('storage', refreshDonors);
    return () => {
      window.removeEventListener('lalbindu_donors_updated', refreshDonors);
      window.removeEventListener('lalbindu_accounts_updated', refreshDonors);
      window.removeEventListener('lalbindu_session_changed', refreshDonors);
      window.removeEventListener('storage', refreshDonors);
    };
  }, []);

  // Available districts filtered by selected division
  const filteredDistricts = useMemo(() => {
    if (selectedDivision === 'All') return BANGLADESH_KEY_DISTRICTS;
    return BANGLADESH_KEY_DISTRICTS.filter(d => d.division_id === selectedDivision);
  }, [selectedDivision]);

  // Filtered donors list
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Blood Group filter
      if (selectedBloodGroup !== 'All' && donor.blood_group !== selectedBloodGroup) {
        return false;
      }
      // Division filter
      if (!matchesDivision(donor.division_name_en, selectedDivision)) {
        return false;
      }
      // District filter
      if (!matchesDistrict(donor.district_name_en, selectedDistrict)) {
        return false;
      }
      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (donor.full_name || '').toLowerCase().includes(q) || ((donor as any).fullNameBn || '').toLowerCase().includes(q);
        const matchesLocation = (donor.district_name_en || '').toLowerCase().includes(q) || (donor.upazila_name_en || '').toLowerCase().includes(q) || (donor.division_name_en || '').toLowerCase().includes(q);
        const matchesId = (donor.donor_id_number || '').toLowerCase().includes(q);
        const matchesBlood = (donor.blood_group || '').toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesId && !matchesBlood) return false;
      }
      return true;
    });
  }, [donors, selectedBloodGroup, selectedDivision, selectedDistrict, searchQuery]);

  const handleSendContactRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalDonor) return;

    const newContactReq = {
      id: `cnt-${Date.now()}`,
      donorId: contactModalDonor.id,
      donorIdNumber: contactModalDonor.donor_id_number,
      donorName: contactModalDonor.full_name,
      donorBloodGroup: contactModalDonor.blood_group,
      hospitalName: requestFormData.patientHospital || 'Dhaka Medical College Hospital',
      requesterMobile: requestFormData.contactMobile || '+8801712345678',
      urgencyNote: requestFormData.urgencyNote || 'Urgent blood requirement for critical patient.',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('lalbindu_donor_contact_requests') || '[]');
      const updated = [newContactReq, ...existing];
      localStorage.setItem('lalbindu_donor_contact_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('lalbindu:contact-request-updated'));
    } catch (err) {
      console.error('Failed to save contact request', err);
    }

    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setContactModalDonor(null);
      setRequestFormData({
        patientHospital: '',
        contactMobile: '',
        urgencyNote: ''
      });
    }, 2500);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
            <Droplet className="w-3.5 h-3.5 fill-brand-red" />
            <span>{t.findDonorPage.tag}</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {t.findDonorPage.title}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t.findDonorPage.subtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.bloodGroup}</label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-bold text-brand-red"
              >
                <option value="All">{t.findDonorPage.allGroups}</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.division}</label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict('All');
                }}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="All">{t.findDonorPage.allDivisions}</option>
                {BANGLADESH_DIVISIONS.map(div => (
                  <option key={div.id} value={div.id}>{lang === 'bn' ? div.name_bn : div.name_en}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.district}</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="All">{t.findDonorPage.allDistricts}</option>
                {filteredDistricts.map(dist => (
                  <option key={dist.id} value={dist.id}>{lang === 'bn' ? dist.name_bn : dist.name_en}</option>
                ))}
              </select>
            </div>

            {/* Text Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.searchKeywords}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.findDonorPage.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 pl-9 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

          </div>

          {/* Quick Filter Reset */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              {t.findDonorPage.showingText} <strong className="text-gray-900 font-bold">{lang === 'bn' ? `${filteredDonors.length} জন` : filteredDonors.length}</strong> {t.findDonorPage.verifiedAvailableDonors}
            </span>
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
                {t.findDonorPage.resetFilters}
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
                      <span title={t.findDonorPage.verifiedProfile}>
                        <CheckCircle className="w-4 h-4 text-brand-green ml-1.5 shrink-0" />
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-mono font-semibold">{donor.donor_id_number}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase ${
                  donor.availability_status === 'available'
                    ? 'bg-green-100 text-brand-green'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {donor.availability_status === 'available' ? t.findDonorPage.available : (lang === 'bn' ? 'সাময়িক বিরতি' : 'Paused')}
                </span>
              </div>

              {/* Location & Stats */}
              <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-2xl text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    {lang === 'bn' 
                      ? `${donor.upazila_name_en}, ${donor.district_name_en} জেলা`
                      : `${donor.upazila_name_en}, ${donor.district_name_en} (${donor.division_name_en})`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span>{t.findDonorPage.verifiedDonationsCount}</span>
                  <span className="font-bold text-brand-red">
                    {lang === 'bn' ? `${donor.verified_donation_count} বার` : `${donor.verified_donation_count} Times`}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setContactModalDonor(donor)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{t.findDonorPage.requestContactBtn}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDonors.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center card-shadow border border-gray-100 max-w-md mx-auto my-8">
            <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">{t.findDonorPage.noDonorsFound}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {t.findDonorPage.noDonorsSub}
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
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.findDonorPage.requestSentTitle}</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  {lang === 'bn' 
                    ? `জরুরি রক্তের অনুরোধ সফলভাবে পাঠানো হয়েছে! দাতা ${contactModalDonor.full_name}-এর ড্যাশবোর্ডে এটি প্রদর্শিত হচ্ছে।` 
                    : `Emergency contact request sent to ${contactModalDonor.full_name}! It is now visible in their Donor Dashboard.`}
                </p>
                <div className="pt-2">
                  <a
                    href="/dashboard/donor"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold shadow-md hover:bg-brand-crimson transition-all"
                  >
                    <span>{lang === 'bn' ? 'দাতা ড্যাশবোর্ডে দেখুন →' : 'View in Donor Dashboard →'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-xl font-black text-brand-red">
                    {contactModalDonor.blood_group}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {t.findDonorPage.requestBloodFrom} {contactModalDonor.full_name}
                    </h3>
                    <p className="text-xs text-brand-green font-semibold">
                      ID: {contactModalDonor.donor_id_number}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-gray-700 mb-4 space-y-1">
                  <p className="font-bold text-brand-red flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {t.findDonorPage.privacyNoticeTitle}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {t.findDonorPage.privacyNoticeDesc}
                  </p>
                </div>

                <form onSubmit={handleSendContactRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.patientHospital}</label>
                    <input
                      type="text"
                      required
                      value={requestFormData.patientHospital}
                      onChange={(e) => setRequestFormData({ ...requestFormData, patientHospital: e.target.value })}
                      placeholder="e.g. Dhaka Medical College Hospital"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.contactMobile}</label>
                    <input
                      type="tel"
                      required
                      value={requestFormData.contactMobile}
                      onChange={(e) => setRequestFormData({ ...requestFormData, contactMobile: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.findDonorPage.urgencyNote}</label>
                    <textarea
                      rows={2}
                      value={requestFormData.urgencyNote}
                      onChange={(e) => setRequestFormData({ ...requestFormData, urgencyNote: e.target.value })}
                      placeholder="Describe the medical emergency..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.findDonorPage.dispatchBtn}</span>
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
