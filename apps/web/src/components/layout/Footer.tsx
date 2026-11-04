'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import { Phone, Mail, MapPin, Heart, Facebook, Youtube, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#8E0B20] text-white pt-16 pb-8 border-t-4 border-brand-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="relative w-44 h-12 bg-white/90 rounded-lg p-1">
              <Image 
                src="/branding/lalbindu-logo.png" 
                alt="LalBindu Logo" 
                fill 
                className="object-contain p-1"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {t.tagline}
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Bangladesh&apos;s authoritative digital healthcare ecosystem connecting voluntary blood donors, patients, and hospitals nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 tracking-wide">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/find-donor" className="hover:text-white transition-colors">
                  {t.nav.findDonor}
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-white transition-colors">
                  {t.nav.bloodRequests}
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-white transition-colors">
                  {t.nav.campaigns}
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  {t.nav.achievements}
                </Link>
              </li>
              <li>
                <Link href="/verify/LB-TOKEN-DNR-0004278" className="hover:text-white transition-colors">
                  Public QR Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 tracking-wide">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+880 1612 345678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>info@lalbindu.bd</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Partners & Follow Us */}
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-white mb-3 tracking-wide">
                {t.footer.ourPartners}
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs font-semibold text-white/90 border border-white/15">
                  BDRCS (Red Crescent)
                </span>
                <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs font-semibold text-white/90 border border-white/15">
                  DGHS Health Services
                </span>
                <span className="px-2.5 py-1 bg-white/10 rounded-md text-xs font-semibold text-white/90 border border-white/15">
                  UNICEF Healthcare
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3 tracking-wide">
                {t.footer.followUs}
              </h4>
              <div className="flex items-center space-x-3">
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/70 space-y-4 md:space-y-0">
          <div>
            &copy; 2026 LalBindu. {t.footer.rightsReserved} |{' '}
            <Link href="/privacy" className="hover:text-white underline">
              {t.footer.privacyPolicy}
            </Link>{' '}
            |{' '}
            <Link href="/terms" className="hover:text-white underline">
              {t.footer.termsConditions}
            </Link>{' '}
            |{' '}
            <Link href="/dashboard/admin" className="hover:text-white underline opacity-75 hover:opacity-100">
              Official Staff Portal
            </Link>
          </div>

          <div className="flex items-center space-x-1 font-semibold text-white">
            <span>{t.footer.taglineFooter}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
