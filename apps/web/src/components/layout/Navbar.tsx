'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  CreditCard, 
  LogOut,
  Droplet
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/find-donor', label: t.nav.findDonor },
    { href: '/blood-requests', label: t.nav.bloodRequests },
    { href: '/campaigns', label: t.nav.campaigns },
    { href: '/achievements', label: t.nav.achievements },
    { href: '/dashboard/donor', label: t.nav.donorDashboard },
    { href: '/dashboard/admin', label: t.nav.adminDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-44 h-12">
              <Image 
                src="/branding/lalbindu-logo.png" 
                alt="LalBindu Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'text-gray-700 hover:text-brand-red hover:bg-brand-light'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls (Search, Notif, Lang, Profile) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Search Input */}
            <div className="relative w-48 lg:w-56">
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-gray-200 hover:border-brand-red text-gray-700 hover:text-brand-red transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-green" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2 text-gray-600 hover:text-brand-red rounded-full hover:bg-brand-light transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>

            {/* User Profile Pill / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-brand-red bg-white hover:bg-gray-50 transition-all"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-brand-light border border-brand-red/30 flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    alt="Ahmed Rahman Avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-gray-900">Ahmed Rahman</div>
                  <div className="text-[10px] text-brand-red font-medium flex items-center">
                    <Droplet className="w-2.5 h-2.5 mr-0.5 fill-brand-red" /> O+ Donor
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-xs font-bold text-gray-900">ahmed.rahman@lalbindu.bd</p>
                    <p className="text-[10px] text-brand-green font-semibold">Verified Donor ID: LB-0004278</p>
                  </div>

                  <Link
                    href="/dashboard/donor"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-brand-light hover:text-brand-red transition-colors"
                  >
                    <User className="w-4 h-4 mr-2.5 text-brand-red" />
                    {t.nav.donorDashboard}
                  </Link>

                  <Link
                    href="/dashboard/donor#id-card"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-brand-light hover:text-brand-red transition-colors"
                  >
                    <CreditCard className="w-4 h-4 mr-2.5 text-brand-green" />
                    {t.nav.myIdCard}
                  </Link>

                  <Link
                    href="/dashboard/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-brand-light hover:text-brand-red transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5 text-brand-burgundy" />
                    {t.nav.adminDashboard}
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    href="/auth/login"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2.5" />
                    {t.nav.logout}
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1 text-xs font-bold text-brand-green border border-gray-200 rounded-lg"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brand-red rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:bg-brand-light hover:text-brand-red"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-xs font-bold text-brand-red">
                AR
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">Ahmed Rahman</p>
                <p className="text-[10px] text-brand-red">Donor ID: LB-0004278</p>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="px-3 py-1.5 text-xs font-bold text-brand-red border border-brand-red rounded-full"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
