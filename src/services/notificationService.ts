/**
 * ============================================================================
 * SAHAYASETU CITIZEN NOTIFICATIONS SERVICE
 * ============================================================================
 * 
 * Purpose:
 * Dispatches and persists real-time job assignment alerts and SMS notifications
 * to registered displaced citizens when Regional Admins match and assign them.
 */

export interface CitizenNotification {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  type: 'JOB_ASSIGNMENT' | 'RELIEF_AID';
  title: string;
  message: string;
  messageMalayalam: string;
  jobTitle: string;
  agencyName: string;
  dailyWage: number;
  districtName: string;
  assignedDate: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'sahayasetu_citizen_notifications_v1';

export const getCitizenNotifications = (beneficiaryId?: string): CitizenNotification[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const all: CitizenNotification[] = JSON.parse(raw);
    if (!beneficiaryId) return all;
    return all.filter(n => n.beneficiaryId === beneficiaryId);
  } catch {
    return [];
  }
};

export const addCitizenNotification = (
  data: Omit<CitizenNotification, 'id' | 'timestamp' | 'read'>
): CitizenNotification => {
  const newNotif: CitizenNotification = {
    ...data,
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: Date.now(),
    read: false
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getCitizenNotifications();
      const updated = [newNotif, ...existing];
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('sahayasetu_notifications_updated'));
    } catch (err) {
      console.warn('Failed to save citizen notification to localStorage', err);
    }
  }

  return newNotif;
};

export const markNotificationAsRead = (notificationId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const all = getCitizenNotifications();
    const updated = all.map(n => n.id === notificationId ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sahayasetu_notifications_updated'));
  } catch (err) {
    console.warn('Failed to update notification read status', err);
  }
};
