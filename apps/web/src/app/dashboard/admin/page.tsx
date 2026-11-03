'use client';

import React, { useState } from 'react';
import { 
  BANGLADESH_DIVISIONS, 
  BANGLADESH_KEY_DISTRICTS 
} from '@lalbindu/api-client';
import { roleCardThemes } from '@lalbindu/design-tokens';
import { 
  ShieldCheck, 
  Users, 
  Droplet, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  CreditCard, 
  MapPin, 
  UserCheck, 
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'national' | 'division' | 'district' | 'upazila'>('national');
  const [selectedDivision, setSelectedDivision] = useState('div-dha');
  const [selectedDistrict, setSelectedDistrict] = useState('dist-dhaka');
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'admins' | 'id-cards'>('overview');

  // Sample donation verification requests
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'don-rec-01',
      donorName: 'Tanvir Hossain',
      donorId: 'LB-0008819',
      bloodGroup: 'B+',
      hospitalName: 'Rajshahi Medical College Hospital',
      donationDate: '2026-11-02',
      units: 1,
      bagNumber: 'BAG-2026-RMC-8120',
      status: 'pending'
    },
    {
      id: 'don-rec-02',
      donorName: 'Sumaiya Akter',
      donorId: 'LB-0003411',
      bloodGroup: 'O-',
      hospitalName: 'Dhaka Medical College Hospital',
      donationDate: '2026-11-01',
      units: 1,
      bagNumber: 'BAG-2026-DMC-1049',
      status: 'pending'
    }
  ]);

  const handleApprove = (id: string) => {
    setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
    alert('Donation verified! Donor count updated and 3-calendar-month resting interval initiated.');
  };

  const handleReject = (id: string) => {
    setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
    alert('Donation rejected with feedback.');
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Jurisdiction Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-burgundy mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-burgundy" />
              <span className="text-xs font-bold uppercase tracking-wider">Administrative Governance Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Bangladesh Nationwide Admin Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Multi-tier jurisdiction governance across 8 Divisions, 64 Districts, Upazilas, Thanas, and Wards.
            </p>
          </div>

          {/* Jurisdiction Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Governance Level</label>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value as any)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20"
              >
                <option value="national">National Super Admin</option>
                <option value="division">Division Administrator</option>
                <option value="district">District Coordinator</option>
                <option value="upazila">Upazila / Thana Admin</option>
              </select>
            </div>

            {selectedJurisdiction !== 'national' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Division</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name_en}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Jurisdiction Overview' },
            { id: 'verifications', label: `Pending Verifications (${pendingVerifications.length})` },
            { id: 'admins', label: 'Subordinate Appointments' },
            { id: 'id-cards', label: 'Administrative ID Card Templates' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-burgundy text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-burgundy hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: JURISDICTION OVERVIEW
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Registered Donors</span>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {selectedJurisdiction === 'national' ? '1,245,320' : '312,400'}
                </p>
                <p className="text-[11px] text-brand-green font-bold mt-1">+1,240 this week</p>
              </div>

              <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Available for Requests</span>
                <p className="text-2xl font-black text-brand-green mt-1">
                  {selectedJurisdiction === 'national' ? '745,180' : '182,300'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Consented & Ready</p>
              </div>

              <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Resting Cooldown</span>
                <p className="text-2xl font-black text-brand-red mt-1">
                  {selectedJurisdiction === 'national' ? '98,450' : '24,600'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">3-Month Waiting Window</p>
              </div>

              <div className="bg-white p-5 rounded-3xl card-shadow border border-gray-100">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Active Emergencies</span>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {selectedJurisdiction === 'national' ? '42 Cases' : '8 Cases'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Across partner hospitals</p>
              </div>
            </div>

            {/* Subordinate Hierarchy Tree */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-4">
                Active Governance Hierarchy In Jurisdiction
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">Divisional Secretariats</p>
                  <p className="text-2xl font-black text-brand-burgundy mt-1">8 Divisions</p>
                  <p className="text-[11px] text-gray-500">All 8 active & staffed</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">District Coordinators</p>
                  <p className="text-2xl font-black text-brand-green mt-1">64 Zillas</p>
                  <p className="text-[11px] text-gray-500">100% Nationwide coverage</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">Upazila & Thana Units</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">495 Units</p>
                  <p className="text-[11px] text-gray-500">Local emergency hubs</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">City Corporations & Pourashavas</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">342 Urban Councils</p>
                  <p className="text-[11px] text-gray-500">Metropolitan wards</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: DONATION VERIFICATIONS QUEUE
           ========================================================================= */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">Clinical Verification Queue</h2>
                <p className="text-xs text-gray-500">
                  Submissions require evidence checks against hospital records before counting toward donor milestones.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {pendingVerifications.length} Cases Pending
              </span>
            </div>

            {pendingVerifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Donor Name & ID</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Hospital / Blood Bank</th>
                      <th className="py-3 px-4">Donation Date</th>
                      <th className="py-3 px-4">Bag Reference</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {pendingVerifications.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900">{item.donorName}</p>
                          <p className="text-[11px] font-mono text-brand-red">{item.donorId}</p>
                        </td>
                        <td className="py-3 px-4 font-black text-brand-red">{item.bloodGroup}</td>
                        <td className="py-3 px-4">{item.hospitalName}</td>
                        <td className="py-3 px-4 font-semibold">{item.donationDate}</td>
                        <td className="py-3 px-4 font-mono text-gray-500">{item.bagNumber}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1.5 bg-brand-green hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto text-brand-green mb-2" />
                <p className="font-bold text-gray-700">All submissions verified!</p>
                <p className="text-xs">No pending verification cases in this jurisdiction.</p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SUBORDINATE ADMINISTRATOR APPOINTMENTS
           ========================================================================= */}
        {activeTab === 'admins' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900">Appointed Administrators & Coordinators</h2>
                <p className="text-xs text-gray-500">
                  Every appointed representative holds an individual LalBindu Administrative Digital ID Card.
                </p>
              </div>
              <button
                onClick={() => alert("Appointment nomination workflow modal")}
                className="px-4 py-2 bg-brand-burgundy hover:bg-[#400B13] text-white font-bold text-xs rounded-xl shadow-md"
              >
                + Appoint New Coordinator
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Kazi Mahbubur Rahman',
                  role: 'District Administrator',
                  roleBn: 'জেলা সমন্বয়ক ও প্রশাসক',
                  jurisdiction: 'Dhaka District',
                  cardId: 'LB-CARD-ADM-DHAKA-01',
                  color: '#006A4E',
                  status: 'Active'
                },
                {
                  name: 'Dr. Shah Alam',
                  role: 'Division Administrator',
                  roleBn: 'বিভাগীয় প্রশাসক',
                  jurisdiction: 'Chattogram Division',
                  cardId: 'LB-CARD-ADM-CTG-01',
                  color: '#0D3B66',
                  status: 'Active'
                },
                {
                  name: 'Tahmina Begum',
                  role: 'Upazila Administrator',
                  roleBn: 'উপজেলা প্রশাসক',
                  jurisdiction: 'Mirpur Metropolitan Thana',
                  cardId: 'LB-CARD-ADM-MIRPUR-02',
                  color: '#008080',
                  status: 'Active'
                }
              ].map((adm, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: adm.color }}>
                        {adm.role}
                      </span>
                      <span className="text-[10px] font-bold text-brand-green">{adm.status}</span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900">{adm.name}</h4>
                    <p className="text-xs font-semibold text-gray-500">{adm.roleBn}</p>
                    <p className="text-xs text-gray-700 mt-2">
                      Jurisdiction: <strong>{adm.jurisdiction}</strong>
                    </p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{adm.cardId}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Reviewing credentials for ${adm.name}`)}
                      className="text-xs font-bold text-brand-burgundy hover:underline"
                    >
                      View ID Card
                    </button>
                    <button
                      onClick={() => alert(`Jurisdiction settings for ${adm.name}`)}
                      className="text-xs text-gray-500 hover:text-gray-900"
                    >
                      Manage Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ADMINISTRATIVE ID CARD TEMPLATES & DISTINCT PALETTES
           ========================================================================= */}
        {activeTab === 'id-cards' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Administrative ID Card Hierarchy & Color Themes
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Every administrative level has a distinct visual template and designated color theme configured in the database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(roleCardThemes).map(([roleKey, theme]) => (
                <div
                  key={roleKey}
                  className="rounded-2xl p-5 border text-white shadow-md flex flex-col justify-between"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                        {roleKey.replace('_', ' ')}
                      </span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                    </div>

                    <h4 className="text-base font-black">{theme.labelEn}</h4>
                    <p className="text-xs font-bold text-white/80">{theme.labelBn}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/70">
                    <span>Hex: {theme.primaryColor}</span>
                    <span className="font-bold text-white">Cryptographic QR Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
