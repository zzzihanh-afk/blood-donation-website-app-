'use client';

import React, { useState } from 'react';
import { DEFAULT_ACHIEVEMENTS } from '@lalbindu/business-rules';
import { Award, CheckCircle2, Lock, Download, Share2, Droplet, Sparkles, Heart } from 'lucide-react';

export default function AchievementsPage() {
  const verifiedDonations = 5; // Sample user has 5 verified donations (Life Saver unlocked)
  const [selectedCertificate, setSelectedCertificate] = useState<typeof DEFAULT_ACHIEVEMENTS[0] | null>(null);

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Donor Recognition & Badges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            LalBindu Humanitarian Milestones
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Every drop is recognized. Achievements are automatically unlocked strictly through genuine, hospital-verified blood donations.
          </p>

          {/* User Progress Bar Summary */}
          <div className="mt-6 bg-white p-4 rounded-3xl card-shadow border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-red font-black text-xl">
                {verifiedDonations}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">Your Verified Donations</p>
                <p className="text-sm font-bold text-gray-900">Life Saver Tier (Rank 2)</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Next Milestone</p>
              <p className="text-xs font-bold text-brand-red">5 more to Hero Donor (10)</p>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DEFAULT_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = verifiedDonations >= ach.required_count;
            const progress = Math.min(verifiedDonations, ach.required_count);
            const percentage = Math.round((progress / ach.required_count) * 100);

            return (
              <div
                key={ach.id}
                className={`bg-white rounded-3xl p-6 card-shadow border flex flex-col justify-between relative overflow-hidden card-hover ${
                  isUnlocked ? 'border-brand-red/30' : 'border-gray-200 opacity-90'
                }`}
              >
                {/* Badge Crest */}
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg relative ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-brand-crimson to-brand-red text-white shadow-brand-red/30'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Award className="w-10 h-10" />
                    {isUnlocked ? (
                      <CheckCircle2 className="w-6 h-6 text-white bg-brand-green rounded-full absolute -top-1 -right-1" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500 absolute -top-1 -right-1" />
                    )}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mt-4">{ach.title_en}</h3>
                  <p className="text-xs font-bold text-brand-red">{ach.title_bn}</p>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed min-h-[34px]">
                    {ach.description_en}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Milestone</span>
                    <span className="text-gray-900">{ach.required_count} Donations</span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-brand-green' : 'bg-brand-red'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{progress} / {ach.required_count} Completed</span>
                    <span>{percentage}%</span>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={() => setSelectedCertificate(ach)}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-brand-light text-brand-red hover:bg-brand-red hover:text-white font-bold text-xs border border-brand-red/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 card-shadow border-4 border-brand-gold relative text-center">
            
            <div className="border-2 border-brand-red/30 p-6 rounded-2xl relative bg-gradient-to-b from-white via-red-50/30 to-white">
              
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-widest text-brand-red font-extrabold">
                Certificate of Humanitarian Recognition
              </p>
              
              <h2 className="text-2xl font-black text-gray-900 mt-2">
                {selectedCertificate.title_en}
              </h2>
              <p className="text-xs font-bold text-brand-green">
                {selectedCertificate.title_bn}
              </p>

              <p className="text-xs text-gray-600 mt-4 leading-relaxed max-w-md mx-auto">
                Presented to <strong>Ahmed Rahman</strong> (Donor ID: LB-0004278) in grateful recognition of {selectedCertificate.required_count} verified whole-blood donations contributing directly to saving human lives across Bangladesh.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
                <div>
                  <p className="font-bold text-gray-800">LalBindu Central Board</p>
                  <p>Secretariat, Dhaka</p>
                </div>
                <div>
                  <p className="font-bold text-brand-green">Cryptographically Verified</p>
                  <p>Date: Nov 3, 2026</p>
                </div>
              </div>

            </div>

            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                onClick={() => alert("Downloading official LalBindu PDF Certificate...")}
                className="py-2.5 px-5 rounded-full bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => setSelectedCertificate(null)}
                className="py-2.5 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
