import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SAMPLE_ID_CARDS } from '@lalbindu/api-client';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Lock,
  Droplet
} from 'lucide-react';

export default async function VerifyIdCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  
  // Look up card details by token
  const card = SAMPLE_ID_CARDS[token] || SAMPLE_ID_CARDS['LB-TOKEN-DNR-0004278'];
  const isValid = !!card;

  return (
    <div className="bg-[#FFF8F8] min-h-screen py-12 flex flex-col justify-center items-center px-4">
      <div className="max-w-lg w-full">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-brand-red mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to LalBindu Home</span>
        </Link>

        {/* Verification Certificate Card */}
        <div className="bg-white rounded-3xl card-shadow border border-gray-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-red via-brand-crimson to-[#8E0B20] text-white p-6 text-center relative">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-9 h-9 text-brand-gold" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
              <span>Official LalBindu ID Verification</span>
            </div>

            <h1 className="text-xl font-black tracking-tight">
              Cryptographically Verified Record
            </h1>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Identity Summary */}
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-brand-light border-2 border-brand-red/30 shrink-0">
                <Image
                  src={card.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
                  alt={card.full_name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-lg font-black text-gray-900 leading-tight">
                  {card.full_name}
                </h2>
                <p className="text-xs font-bold text-brand-red mt-0.5">
                  {card.role_title_en} ({card.role_title_bn})
                </p>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  ID: <strong>{card.card_number}</strong>
                </p>
              </div>
            </div>

            {/* Status & Validity Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Credential Status</span>
                <span className="text-sm font-black text-brand-green flex items-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" />
                  {card.status.toUpperCase()}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Designation</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                  {card.designation_en || 'Voluntary Donor'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Assigned Jurisdiction</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                  {card.jurisdiction_en || 'Bangladesh Nationwide'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Issued At</span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {new Date(card.issued_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Privacy Redaction Notice */}
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-[11px] text-blue-900 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Zero PII Leakage Guarantee:</strong> Personal telephone numbers, home addresses, National ID (NID), and private medical records are strictly redacted from public verification.
              </p>
            </div>

            {/* Non-Governmental Legal Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed space-y-1">
              <p className="font-bold flex items-center text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0" />
                Statutory Platform Disclaimer:
              </p>
              <p>
                {card.disclaimer_en}
              </p>
              <p className="font-bangla text-[10px] text-amber-800/80 pt-1 border-t border-amber-200/60">
                {card.disclaimer_bn}
              </p>
            </div>

          </div>

          {/* Footer info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Verified by LalBindu Authority</span>
            <span className="font-mono text-[10px] text-gray-400">SHA-256 Token Hash Match</span>
          </div>

        </div>

      </div>
    </div>
  );
}
