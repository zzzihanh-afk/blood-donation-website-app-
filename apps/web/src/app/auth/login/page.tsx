'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Lock, ArrowRight, ShieldCheck, Droplet, CheckCircle2 } from 'lucide-react';
import { normalizeBangladeshPhone } from '@lalbindu/validation';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/donor');
    }, 800);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/donor');
    }, 800);
  };

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Brand Header */}
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
            Sign In to LalBindu
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access your donor dashboard, emergency requests, and digital ID card.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100">
          
          {/* Auth Mode Toggle */}
          <div className="flex rounded-2xl bg-gray-100 p-1 mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('phone');
                setOtpSent(false);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mobile OTP (+880)
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Email & Password
            </button>
          </div>

          {/* Phone OTP Form */}
          {authMode === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Bangladesh Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      A 6-digit verification code will be sent to your number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs text-brand-red flex items-center justify-between">
                    <span>Code sent to <strong>{normalizeBangladeshPhone(phone)}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[10px] underline font-bold"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-black py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify & Enter Dashboard'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Email & Password Form */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ahmed.rahman@lalbindu.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-brand-red hover:underline">
              Register as Donor
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
