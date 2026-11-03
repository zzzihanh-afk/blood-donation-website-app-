'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BANGLADESH_DIVISIONS, BANGLADESH_KEY_DISTRICTS } from '@lalbindu/api-client';
import { Droplet, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    dateOfBirth: '2000-01-01',
    divisionId: 'div-dha',
    districtId: 'dist-dhaka',
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please accept terms of service and donor safety consent.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Account registered! Redirecting to your personal donor dashboard...');
      router.push('/dashboard/donor');
    }, 1000);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative w-48 h-12 mb-3">
            <Image 
              src="/branding/lalbindu-logo.png" 
              alt="LalBindu Logo" 
              fill 
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Register as a Voluntary Donor
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Join thousands of lifesavers across Bangladesh. Receive your verified digital ID card.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="Ahmed Rahman"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile (+880)</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-bold text-brand-red"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Division</label>
                <select
                  value={formData.divisionId}
                  onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-semibold"
                >
                  {BANGLADESH_DIVISIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name_en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">District</label>
                <select
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-semibold"
                >
                  {BANGLADESH_KEY_DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name_en}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-semibold"
              />
            </div>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 space-y-2">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 rounded text-brand-red focus:ring-brand-red"
                />
                <span className="text-[11px] text-gray-700 leading-relaxed">
                  I agree to the LalBindu terms of voluntary blood donation, confirm that I am aged 18+ and weigh at least 45kg, and agree to follow clinical screening guidelines.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? 'Creating Account & ID...' : 'Complete Registration & Get ID Card'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already registered?{' '}
            <Link href="/auth/login" className="font-bold text-brand-red hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
