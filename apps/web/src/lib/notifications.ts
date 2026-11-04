export interface NotificationItem {
  id: string;
  type: 'emergency' | 'achievement' | 'verification' | 'id_card' | 'campaign' | 'system';
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  timeEn: string;
  timeBn: string;
  link: string;
  isRead: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  targetGroup?: 'all' | 'specific_blood_group' | 'division' | 'admins_only';
  targetValue?: string;
  sender?: string;
  createdAt?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'emergency',
    titleEn: 'Critical Emergency: O+ Blood Needed',
    titleBn: 'সংকটাপন্ন জরুরি: O+ রক্তের আবেদন',
    messageEn: 'Open-heart surgery at NICVD. Matches your O+ blood group and location.',
    messageBn: 'এনআইসিভিডিতে উন্মুক্ত হার্ট সার্জারি। আপনার রক্তের গ্রুপ ও এলাকার সাথে ম্যাচ করেছে।',
    timeEn: '15m ago',
    timeBn: '১৫ মিনিট আগে',
    link: '/blood-requests',
    isRead: false,
    priority: 'urgent',
    targetGroup: 'specific_blood_group',
    targetValue: 'O+',
    sender: 'National Emergency Dispatch',
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    type: 'achievement',
    titleEn: 'Achievement Unlocked: Life Saver!',
    titleBn: 'অর্জন আনলক: জীবন রক্ষক!',
    messageEn: 'Congratulations! You have completed 5 verified donations.',
    messageBn: 'অভিনন্দন! আপনি সফলভাবে ৫টি যাচাইকৃত রক্তদান সম্পন্ন করেছেন।',
    timeEn: '2h ago',
    timeBn: '২ ঘণ্টা আগে',
    link: '/achievements',
    isRead: false,
    priority: 'normal',
    targetGroup: 'all',
    sender: 'LalBindu Recognition Board',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'notif-3',
    type: 'verification',
    titleEn: 'Donation Record Verified by Hospital',
    titleBn: 'হাসপাতাল কর্তৃক রক্তদান রেকর্ড যাচাই সম্পন্ন',
    messageEn: 'Dhaka Medical College has approved your whole blood donation from Aug 10.',
    messageBn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল আপনার ১০ আগস্টের রক্তদান অনুমোদন করেছে।',
    timeEn: '1d ago',
    timeBn: '১ দিন আগে',
    link: '/dashboard/donor',
    isRead: false,
    priority: 'high',
    targetGroup: 'all',
    sender: 'Hospital Verification Desk',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'notif-4',
    type: 'id_card',
    titleEn: 'LalBindu Digital ID Card Active',
    titleBn: 'লালবিন্দু ডিজিটাল পরিচয়পত্র সক্রিয়',
    messageEn: 'Your cryptographic QR ID is active and ready for verification.',
    messageBn: 'আপনার কিউআর সমৃদ্ধ ডিজিটাল কার্ড প্রস্তুত ও সক্রিয় রয়েছে।',
    timeEn: '3d ago',
    timeBn: '৩ দিন আগে',
    link: '/dashboard/donor#id-card',
    isRead: true,
    priority: 'normal',
    targetGroup: 'all',
    sender: 'LalBindu Identity Secretariat',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

const NOTIFICATIONS_STORAGE_KEY = 'lalbindu_system_notifications';

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(items: NotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('lalbindu_notifications_updated'));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function addNotification(newItem: NotificationItem): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = [newItem, ...current];
  saveNotifications(updated);
  return updated;
}

export function deleteNotification(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.filter(n => n.id !== id);
  saveNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  saveNotifications(updated);
  return updated;
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveNotifications(updated);
  return updated;
}
