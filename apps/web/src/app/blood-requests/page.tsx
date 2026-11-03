'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { 
  SAMPLE_BLOOD_REQUESTS, 
  BANGLADESH_KEY_DISTRICTS 
} from '@lalbindu/api-client';
import { BloodRequestItem } from '@lalbindu/shared-types';
import { 
  AlertCircle, 
  Plus, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  X, 
  Droplet,
  Send,
  Building2,
  Heart
} from 'lucide-react';

export default function BloodRequestsPage() {
  const { t, lang } = useLanguage();
  const [requests, setRequests] = useState<BloodRequestItem[]>(SAMPLE_BLOOD_REQUESTS);
  const [filterUrgency, setFilterUrgency] = useState<string>('All');
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [donateModalRequest, setDonateModalRequest] = useState<BloodRequestItem | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New Request Form State
  const [formData, setFormData] = useState({
    patientInitials: '',
    bloodGroup: 'O+',
    component: 'Whole Blood',
    unitsNeeded: 1,
    hospitalName: '',
    districtName: 'Dhaka',
    hospitalAddress: '',
    requesterPhone: '',
    urgency: 'urgent',
    description: ''
  });

  const filteredRequests = requests.filter(r => {
    if (filterUrgency !== 'All' && r.urgency !== filterUrgency) return false;
    return true;
  });

  const getUrgencyLabel = (u: string) => {
    if (u === 'critical_emergency') return t.bloodRequestsPage.criticalEmergency;
    if (u === 'urgent') return t.bloodRequestsPage.urgent;
    if (u === 'routine') return t.bloodRequestsPage.routine;
    return t.bloodRequestsPage.allEmergencies;
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: BloodRequestItem = {
      id: `req-${Date.now()}`,
      request_code: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_name_initials: formData.patientInitials,
      blood_group: formData.bloodGroup as any,
      component: formData.component,
      units_needed: Number(formData.unitsNeeded),
      units_fulfilled: 0,
      urgency: formData.urgency as any,
      hospital_name: formData.hospitalName,
      hospital_district_en: formData.districtName,
      hospital_district_bn: formData.districtName,
      hospital_address: formData.hospitalAddress,
      required_datetime: new Date().toISOString(),
      requester_contact_phone: formData.requesterPhone,
      description: formData.description,
      verification_status: 'verified',
      request_status: 'open',
      created_at: new Date().toISOString()
    };

    setRequests([newReq, ...requests]);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setNewRequestModalOpen(false);
    }, 1500);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.bloodRequestsPage.tag}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t.bloodRequestsPage.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t.bloodRequestsPage.subtitle}
            </p>
          </div>

          <button
            onClick={() => setNewRequestModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-lg shadow-brand-red/25 transition-all space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.bloodRequestsPage.postBtn}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {['All', 'critical_emergency', 'urgent', 'routine'].map(u => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                filterUrgency === u
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-red'
              }`}
            >
              {getUrgencyLabel(u)}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 card-shadow border border-gray-100 flex flex-col justify-between card-hover relative overflow-hidden"
            >
              {/* Header with Urgency & Blood Group */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                    req.urgency === 'critical_emergency'
                      ? 'bg-red-100 text-brand-red border border-red-200'
                      : req.urgency === 'urgent'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {getUrgencyLabel(req.urgency)}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-400">
                    {req.request_code}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-light border-2 border-brand-red/30 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-brand-red">{req.blood_group}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">{req.hospital_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {lang === 'bn' ? `${req.hospital_district_bn} জেলা` : `${req.hospital_district_en} District`}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2 mb-4">
                  <p className="font-medium line-clamp-2">{req.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>{t.bloodRequestsPage.componentLabel} <strong>{req.component}</strong></span>
                    <span>
                      {t.bloodRequestsPage.unitsNeededLabel}{' '}
                      <strong className="text-brand-red">
                        {lang === 'bn' ? `${req.units_needed} ব্যাগ প্রয়োজন` : `${req.units_needed} Needed`}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => setDonateModalRequest(req)}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{t.bloodRequestsPage.iCanDonateBtn}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* =========================================================================
          POST EMERGENCY REQUEST MODAL
         ========================================================================= */}
      {newRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 card-shadow border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setNewRequestModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t.bloodRequestsPage.publishedTitle}</h3>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  {t.bloodRequestsPage.publishedDesc}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 text-brand-red mb-2">
                  <Droplet className="w-5 h-5 fill-brand-red" />
                  <h3 className="text-lg font-bold text-gray-900">{t.bloodRequestsPage.postModalTitle}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {t.bloodRequestsPage.postModalSub}
                </p>

                <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.patientInitials}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. M. A. (ICU Bed 4)"
                        value={formData.patientInitials}
                        onChange={(e) => setFormData({ ...formData, patientInitials: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.bloodGroupRequired}</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-bold text-brand-red"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.unitsNeeded}</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        required
                        value={formData.unitsNeeded}
                        onChange={(e) => setFormData({ ...formData, unitsNeeded: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.urgencyLevel}</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-bold text-brand-red"
                      >
                        <option value="critical_emergency">{t.bloodRequestsPage.criticalEmergency}</option>
                        <option value="urgent">{t.bloodRequestsPage.urgent}</option>
                        <option value="routine">{t.bloodRequestsPage.routine}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.hospitalName}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka Medical College Hospital"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.district}</label>
                      <select
                        value={formData.districtName}
                        onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      >
                        {BANGLADESH_KEY_DISTRICTS.map(d => (
                          <option key={d.id} value={d.name_en}>{lang === 'bn' ? d.name_bn : d.name_en}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.requesterPhone}</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={formData.requesterPhone}
                        onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{t.bloodRequestsPage.clinicalReason}</label>
                    <textarea
                      rows={2}
                      placeholder="Briefly state patient diagnosis and requirement context..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-4"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.bloodRequestsPage.publishAlertBtn}</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          DONOR RESPONSE MODAL ("I WANT TO DONATE")
         ========================================================================= */}
      {donateModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 card-shadow border border-gray-100 relative">
            <button
              onClick={() => setDonateModalRequest(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-xl font-black text-brand-red">
                {donateModalRequest.blood_group}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {t.bloodRequestsPage.confirmDonationTitle}
                </h3>
                <p className="text-xs text-gray-500">
                  {donateModalRequest.hospital_name}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              {t.bloodRequestsPage.confirmDesc} <strong>{donateModalRequest.requester_contact_phone}</strong>.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert(lang === 'bn' 
                    ? `ধন্যবাদ! আবেদনকারীকে আপনার সম্মতির নোটিফিকেশন পাঠানো হয়েছে। আপনি তাকে ${donateModalRequest.requester_contact_phone} নম্বরে সরাসরি কল করতে পারেন।`
                    : `Thank you! The requester has been notified of your commitment. You may reach them at ${donateModalRequest.requester_contact_phone}`);
                  setDonateModalRequest(null);
                }}
                className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.bloodRequestsPage.confirmShareBtn}</span>
              </button>

              <button
                onClick={() => setDonateModalRequest(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
              >
                {t.bloodRequestsPage.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
