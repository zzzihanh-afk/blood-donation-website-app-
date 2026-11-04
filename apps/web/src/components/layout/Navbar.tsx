'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  Droplet,
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  Check,
  KeyRound,
  Lock,
  Plus,
  Megaphone,
  Calendar,
  Crown
} from 'lucide-react';
import { getCurrentSession, setCurrentSession, isAuthorizedAdmin, UserSession } from '@/lib/session';
import { 
  NotificationItem, 
  getStoredNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  syncNotificationsFromDatabase
} from '@/lib/notifications';
import { CreateNotificationModal } from '@/components/notifications/CreateNotificationModal';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [isCreateNotifOpen, setIsCreateNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<UserSession>(() => getCurrentSession());

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Sync session and notifications reactively
  useEffect(() => {
    setSession(getCurrentSession());
    setNotifications(getStoredNotifications());
    syncNotificationsFromDatabase();

    const handleSessionChange = () => {
      setSession(getCurrentSession());
    };
    const handleNotifUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener('lalbindu_session_changed', handleSessionChange);
    window.addEventListener('lalbindu_notifications_updated', handleNotifUpdate);
    return () => {
      window.removeEventListener('lalbindu_session_changed', handleSessionChange);
      window.removeEventListener('lalbindu_notifications_updated', handleNotifUpdate);
    };
  }, []);

  const isAdmin = isAuthorizedAdmin(session);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    const updated = markNotificationAsRead(item.id);
    setNotifications(updated);
    setNotifDropdownOpen(false);
    router.push(item.link);
  };

  // Strictly filter out Admin Portal for donors and public website viewers
  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/find-donor', label: t.nav.findDonor },
    { href: '/blood-requests', label: t.nav.bloodRequests },
    { href: '/campaigns', label: t.nav.campaigns },
    { href: '/achievements', label: t.nav.achievements },
    { href: '/id-cards', label: lang === 'bn' ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Cards' },
    { href: '/dashboard/donor', label: t.nav.donorDashboard },
    ...(isAdmin ? [{ href: '/dashboard/admin', label: t.nav.adminDashboard, isAdminPill: true }] : [])
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

            {/* Notification Bell & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className={`p-2 rounded-full transition-all relative ${
                  notifDropdownOpen 
                    ? 'bg-brand-light text-brand-red ring-2 ring-brand-red/30' 
                    : 'text-gray-600 hover:text-brand-red hover:bg-brand-light'
                }`}
                aria-label="Notifications"
                title={lang === 'bn' ? 'বিজ্ঞপ্তি দেখুন' : 'View Notifications'}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {lang === 'bn' ? '৩' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                  
                  {/* Top Bar */}
                  <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-brand-red" />
                      <h4 className="text-sm font-black text-gray-900">
                        {lang === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-light text-brand-red rounded-full">
                          {lang === 'bn' ? `${unreadCount}টি নতুন` : `${unreadCount} New`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* ADMIN-ONLY ACTION: Option to Add / Dispatch Notification */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            setIsCreateNotifOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-brand-burgundy hover:bg-[#400B13] text-white text-[11px] font-bold flex items-center space-x-1 shadow-sm transition-all"
                          title="Dispatch Notification & Alert (Admins Only)"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{lang === 'bn' ? 'বিজ্ঞপ্তি যুক্ত' : 'Add Alert'}</span>
                        </button>
                      )}

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] font-bold text-brand-green hover:underline flex items-center"
                        >
                          <Check className="w-3 h-3 mr-0.5" />
                          {lang === 'bn' ? 'পঠিত' : 'Mark read'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-4 flex items-start space-x-3 cursor-pointer transition-colors ${
                          !item.isRead ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Icon based on notification type */}
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'emergency' 
                            ? 'bg-red-100 text-brand-red' 
                            : item.type === 'achievement'
                            ? 'bg-amber-100 text-amber-600'
                            : item.type === 'verification'
                            ? 'bg-green-100 text-brand-green'
                            : item.type === 'campaign'
                            ? 'bg-purple-100 text-purple-600'
                            : item.type === 'system'
                            ? 'bg-rose-100 text-brand-burgundy'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'emergency' && <Droplet className="w-4 h-4 fill-brand-red" />}
                          {item.type === 'achievement' && <Award className="w-4 h-4" />}
                          {item.type === 'verification' && <ShieldCheck className="w-4 h-4" />}
                          {item.type === 'id_card' && <CreditCard className="w-4 h-4" />}
                          {item.type === 'campaign' && <Calendar className="w-4 h-4 text-purple-600" />}
                          {item.type === 'system' && <Megaphone className="w-4 h-4 text-brand-burgundy" />}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs truncate ${!item.isRead ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>
                              {lang === 'bn' ? item.titleBn : item.titleEn}
                            </h5>
                            {!item.isRead && (
                              <span className="w-2 h-2 rounded-full bg-brand-red shrink-0 ml-1.5" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">
                            {lang === 'bn' ? item.messageBn : item.messageEn}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {lang === 'bn' ? item.timeBn : item.timeEn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer Link */}
                  <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                    <Link
                      href="/dashboard/donor"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="font-bold text-brand-red hover:underline inline-flex items-center space-x-1"
                    >
                      <span>{lang === 'bn' ? 'সকল বিজ্ঞপ্তি দেখুন' : 'View all activity'}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          setIsCreateNotifOpen(true);
                        }}
                        className="font-bold text-brand-burgundy hover:underline flex items-center space-x-1"
                      >
                        <Megaphone className="w-3.5 h-3.5 text-brand-burgundy" />
                        <span>{lang === 'bn' ? 'অ্যালার্ট সম্প্রচার' : 'Broadcast'}</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* User Profile Pill / Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full border transition-all ${
                  userDropdownOpen 
                    ? isAdmin 
                      ? 'border-brand-burgundy bg-amber-50/50 ring-2 ring-brand-burgundy/20' 
                      : 'border-brand-red bg-brand-light/30 ring-2 ring-brand-red/20' 
                    : isAdmin 
                    ? 'border-amber-300 bg-amber-50/30 hover:border-brand-burgundy' 
                    : 'border-gray-200 hover:border-brand-red bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`relative w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center ${
                  isAdmin ? 'border-amber-400 bg-amber-100 text-amber-900' : 'border-brand-red/30 bg-brand-light text-brand-red'
                }`}>
                  {session.avatarUrl ? (
                    session.avatarUrl.startsWith('data:') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.avatarUrl}
                        alt={session.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={session.avatarUrl}
                        alt={session.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    )
                  ) : (
                    <User className="w-4 h-4 opacity-70" />
                  )}
                </div>
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-gray-900">{session.name}</div>
                  <div className={`text-[10px] font-medium flex items-center ${
                    isAdmin ? 'text-brand-burgundy font-bold' : 'text-brand-red'
                  }`}>
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-brand-burgundy" /> {session.roleLabelEn}
                      </>
                    ) : (
                      <>
                        <Droplet className="w-2.5 h-2.5 mr-0.5 fill-brand-red" /> {session.roleLabelEn}
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">{lang === 'bn' ? 'লগইন আছেন' : 'Signed in as'}</p>
                    <p className="text-xs font-bold text-gray-900">{session.email}</p>
                    <p className={`text-[10px] font-semibold ${isAdmin ? 'text-brand-burgundy' : 'text-brand-green'}`}>
                      {isAdmin 
                        ? (session.role === 'super_admin' || session.id === 'superadmin' || session.authorityLevel === 'highest'
                            ? (lang === 'bn' ? `জাতীয় সুপার অ্যাডমিন আইডি: ${session.adminId || 'superadmin'}` : `National Super Admin ID: ${session.adminId || 'superadmin'}`)
                            : (lang === 'bn' ? `কো-অ্যাডমিন আইডি: ${session.adminId || 'coadmin'}` : `Co-Admin ID: ${session.adminId || 'coadmin'}`))
                        : (lang === 'bn' ? `যাচাইকৃত দাতা আইডি: ${session.donorId}` : `Verified Donor ID: ${session.donorId}`)}
                    </p>
                  </div>

                  {isAdmin ? (
                    <>
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-brand-burgundy hover:bg-brand-light transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-brand-burgundy" />
                        {t.nav.adminDashboard}
                      </Link>

                      <Link
                        href="/dashboard/admin/id-cards"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-brand-light hover:text-brand-burgundy transition-colors"
                      >
                        <CreditCard className="w-4 h-4 mr-2.5 text-amber-600" />
                        {lang === 'bn' ? 'আইডি কার্ড স্টুডিও' : 'ID Card Template Studio'}
                      </Link>

                      <Link
                        href="/dashboard/donor"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-brand-light hover:text-brand-red transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-brand-red" />
                        {t.nav.donorDashboard}
                      </Link>

                      {/* Switch to Public Donor View Option */}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setCurrentSession('donor');
                          setUserDropdownOpen(false);
                          router.push('/');
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-gray-400" />
                        <span>{lang === 'bn' ? 'সাধারণ দাতা মোডে পরিবর্তন' : 'Switch to Public Donor View'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* DONOR / WEBSITE VIEWER LINKS ONLY (Admin Portal is strictly hidden) */}
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

                      {/* Executive / Staff Portal Login Option for authorized testing */}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setCurrentSession('superadmin');
                          setUserDropdownOpen(false);
                          router.push('/dashboard/admin');
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-xs font-semibold text-brand-burgundy bg-amber-50/50 hover:bg-amber-100/70 transition-colors"
                      >
                        <Crown className="w-4 h-4 mr-2.5 text-amber-600" />
                        <span>{lang === 'bn' ? 'সুপার অ্যাডমিন লগইন (superadmin)' : 'Switch to Super Admin (superadmin)'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentSession('co_admin');
                          setUserDropdownOpen(false);
                          router.push('/dashboard/admin');
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50/30 hover:bg-amber-100/50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-emerald-600" />
                        <span>{lang === 'bn' ? 'কো-অ্যাডমিন লগইন (coadmin)' : 'Switch to Co-Admin (coadmin)'}</span>
                      </button>
                    </>
                  )}

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
                {session.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900">{session.name}</p>
                <p className="text-[10px] text-brand-red">
                  {isAdmin ? `Admin ID: ${session.adminId}` : `Donor ID: ${session.donorId}`}
                </p>
              </div>
            </div>
            {isAdmin ? (
              <button
                onClick={() => {
                  setCurrentSession('donor');
                  setMobileMenuOpen(false);
                  router.push('/');
                }}
                className="px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-300 rounded-full"
              >
                {lang === 'bn' ? 'দাতা মোড' : 'Donor Mode'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentSession('super_admin');
                  setMobileMenuOpen(false);
                  router.push('/dashboard/admin');
                }}
                className="px-3 py-1.5 text-xs font-bold text-brand-burgundy bg-amber-50 border border-amber-300 rounded-full"
              >
                {lang === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Admin Notification Creator Modal */}
      <CreateNotificationModal
        isOpen={isCreateNotifOpen}
        onClose={() => setIsCreateNotifOpen(false)}
        adminName={session.name}
        adminRole={session.roleLabelEn}
      />
    </header>
  );
};
