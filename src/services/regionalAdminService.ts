/**
 * ============================================================================
 * SAHAYASETU REGIONAL ADMIN MANAGEMENT & CREDENTIAL SERVICE
 * ============================================================================
 * 
 * Purpose:
 * Coordinates storage, authentication, data scoping, and self-service credential
 * updates for district-level regional administrators across Kerala.
 */

import { RegionalAdminAccount } from '../types';

export const ADMINS_STORAGE_KEY = 'sahayasetu_regional_admins_v2';
export const ACTIVE_ADMIN_STORAGE_KEY = 'sahayasetu_active_regional_admin';
export const BENEFICIARIES_STORAGE_KEY = 'sahayasetu_beneficiaries_live_v1';

// All 14 Accredited Kerala District Regional Admin Officers
export const SEED_REGIONAL_ADMINS: RegionalAdminAccount[] = [
  {
    id: 'ADM-KL-WYD-101',
    name: 'Dr. Arunkumar Menon',
    email: 'arunkumar.menon@keralaredcross.org',
    phone: '+91 94471 28901',
    ngoName: 'Kerala Red Cross Disaster Society',
    ngoDarpanId: 'DARPAN-KL/2024/0912',
    accessKey: 'KRC-WYD-9941',
    password: 'KRC-WYD-9941',
    sdmaOfficerId: 'OFF-KL-WYD-401',
    officerCredentialId: 'OFF-KL-WYD-401',
    districtId: 'KL-WYD-2024',
    districtName: 'Wayanad',
    dateProvisioned: '01 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-KKD-102',
    name: 'Dr. Fathima Beevi',
    email: 'fathima.b@kozhikodecare.org',
    phone: '+91 94472 31094',
    ngoName: 'Kozhikode Coastal Care Foundation',
    ngoDarpanId: 'DARPAN-KL/2024/0788',
    accessKey: 'KCC-KKD-4412',
    password: 'KCC-KKD-4412',
    sdmaOfficerId: 'OFF-KL-KKD-208',
    officerCredentialId: 'OFF-KL-KKD-208',
    districtId: 'KL-KKD-2024',
    districtName: 'Kozhikode',
    dateProvisioned: '05 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-IDK-103',
    name: 'Mathew Thomas',
    email: 'mathew.t@seedsidukki.org',
    phone: '+91 94460 77312',
    ngoName: 'SEEDS High-Range Relief Trust',
    ngoDarpanId: 'DARPAN-KL/2023/1149',
    accessKey: 'SHR-IDK-7721',
    password: 'SHR-IDK-7721',
    sdmaOfficerId: 'OFF-KL-IDK-512',
    officerCredentialId: 'OFF-KL-IDK-512',
    districtId: 'KL-IDK-2024',
    districtName: 'Idukki',
    dateProvisioned: '10 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-ALP-104',
    name: 'K. R. Soman Pillai',
    email: 'soman.pillai@kuttanadrelief.org',
    phone: '+91 94473 66120',
    ngoName: 'Kuttanad Water Relief Action Group',
    ngoDarpanId: 'DARPAN-KL/2024/0521',
    accessKey: 'ALP-REL-5531',
    password: 'ALP-REL-5531',
    sdmaOfficerId: 'OFF-KL-ALP-304',
    officerCredentialId: 'OFF-KL-ALP-304',
    districtId: 'KL-ALP-2024',
    districtName: 'Alappuzha',
    dateProvisioned: '12 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-EKM-105',
    name: 'Priya R. Varma',
    email: 'priya.varma@cochinrelief.org',
    phone: '+91 94474 12055',
    ngoName: 'Cochin Disaster Recovery Collective',
    ngoDarpanId: 'DARPAN-KL/2023/0833',
    accessKey: 'EKM-PER-8821',
    password: 'EKM-PER-8821',
    sdmaOfficerId: 'OFF-KL-EKM-115',
    officerCredentialId: 'OFF-KL-EKM-115',
    districtId: 'KL-EKM-2024',
    districtName: 'Ernakulam',
    dateProvisioned: '14 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-TCR-106',
    name: 'Adv. Suresh Kurup',
    email: 'suresh.kurup@thrissurrelief.org',
    phone: '+91 94475 88910',
    ngoName: 'Central Kerala Flood Relief Guild',
    ngoDarpanId: 'DARPAN-KL/2024/0342',
    accessKey: 'TCR-DIS-3390',
    password: 'TCR-DIS-3390',
    sdmaOfficerId: 'OFF-KL-TCR-620',
    officerCredentialId: 'OFF-KL-TCR-620',
    districtId: 'KL-TCR-2024',
    districtName: 'Thrissur',
    dateProvisioned: '15 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-PLK-107',
    name: 'G. Haridasan',
    email: 'haridasan.g@palakkadtrust.org',
    phone: '+91 94466 33189',
    ngoName: 'Palakkad Tribal & Rural Relief Network',
    ngoDarpanId: 'DARPAN-KL/2024/0615',
    accessKey: 'PLK-GAP-6644',
    password: 'PLK-GAP-6644',
    sdmaOfficerId: 'OFF-KL-PLK-709',
    officerCredentialId: 'OFF-KL-PLK-709',
    districtId: 'KL-PLK-2024',
    districtName: 'Palakkad',
    dateProvisioned: '16 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-MPM-108',
    name: 'M. Abdul Rasheed',
    email: 'abdul.rasheed@malabarrelief.org',
    phone: '+91 94477 99021',
    ngoName: 'Malabar Disaster Response Force',
    ngoDarpanId: 'DARPAN-KL/2023/1209',
    accessKey: 'MPM-CHL-1198',
    password: 'MPM-CHL-1198',
    sdmaOfficerId: 'OFF-KL-MPM-814',
    officerCredentialId: 'OFF-KL-MPM-814',
    districtId: 'KL-MPM-2024',
    districtName: 'Malappuram',
    dateProvisioned: '18 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-KNR-109',
    name: 'T. K. Vijayan',
    email: 'vijayan.tk@kannurhumanitarian.org',
    phone: '+91 94478 55432',
    ngoName: 'North Malabar Humanitarian Support Foundation',
    ngoDarpanId: 'DARPAN-KL/2024/0118',
    accessKey: 'KNR-VAL-4482',
    password: 'KNR-VAL-4482',
    sdmaOfficerId: 'OFF-KL-KNR-922',
    officerCredentialId: 'OFF-KL-KNR-922',
    districtId: 'KL-KNR-2024',
    districtName: 'Kannur',
    dateProvisioned: '20 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-KSD-110',
    name: 'Dr. B. Radhakrishna Rao',
    email: 'radhakrishna.rao@kasaragodrelief.org',
    phone: '+91 94469 11840',
    ngoName: 'Chandragiri Basin Disaster Relief Mission',
    ngoDarpanId: 'DARPAN-KL/2024/0402',
    accessKey: 'KSD-BKM-7719',
    password: 'KSD-BKM-7719',
    sdmaOfficerId: 'OFF-KL-KSD-033',
    officerCredentialId: 'OFF-KL-KSD-033',
    districtId: 'KL-KSD-2024',
    districtName: 'Kasaragod',
    dateProvisioned: '22 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-KTM-111',
    name: 'Sr. Mary Joseph',
    email: 'mary.joseph@meenachilrelief.org',
    phone: '+91 94470 44512',
    ngoName: 'Meenachil Valley Relief Association',
    ngoDarpanId: 'DARPAN-KL/2023/0971',
    accessKey: 'KTM-MNC-2267',
    password: 'KTM-MNC-2267',
    sdmaOfficerId: 'OFF-KL-KTM-541',
    officerCredentialId: 'OFF-KL-KTM-541',
    districtId: 'KL-KTM-2024',
    districtName: 'Kottayam',
    dateProvisioned: '23 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-PTA-112',
    name: 'George Koshy',
    email: 'george.koshy@pamparelief.org',
    phone: '+91 94461 88204',
    ngoName: 'Pampa Basin Flood Response Cell',
    ngoDarpanId: 'DARPAN-KL/2024/0827',
    accessKey: 'PTA-PMP-9935',
    password: 'PTA-PMP-9935',
    sdmaOfficerId: 'OFF-KL-PTA-618',
    officerCredentialId: 'OFF-KL-PTA-618',
    districtId: 'KL-PTA-2024',
    districtName: 'Pathanamthitta',
    dateProvisioned: '24 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-KLM-113',
    name: 'N. Sreekumar',
    email: 'sreekumar.n@quilonrelief.org',
    phone: '+91 94479 22340',
    ngoName: 'Quilon Coastal Relief & Rehab Trust',
    ngoDarpanId: 'DARPAN-KL/2023/0754',
    accessKey: 'KLM-AST-5541',
    password: 'KLM-AST-5541',
    sdmaOfficerId: 'OFF-KL-KLM-725',
    officerCredentialId: 'OFF-KL-KLM-725',
    districtId: 'KL-KLM-2024',
    districtName: 'Kollam',
    dateProvisioned: '25 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-KL-TVM-114',
    name: 'Dr. Lakshmi Nair',
    email: 'lakshmi.nair@travancorerelief.org',
    phone: '+91 94465 77198',
    ngoName: 'Travancore Disaster Management Society',
    ngoDarpanId: 'DARPAN-KL/2024/0991',
    accessKey: 'TVM-KSD-1102',
    password: 'TVM-KSD-1102',
    sdmaOfficerId: 'OFF-KL-TVM-819',
    officerCredentialId: 'OFF-KL-TVM-819',
    districtId: 'KL-TVM-2024',
    districtName: 'Thiruvananthapuram',
    dateProvisioned: '26 Aug 2026',
    status: 'Active'
  }
];

/**
 * Loads all provisioned regional administrators from persistent storage.
 * Automatically refreshes to all 14 Kerala district officers if fewer are found.
 */
export const getStoredRegionalAdmins = (): RegionalAdminAccount[] => {
  if (typeof window === 'undefined') return SEED_REGIONAL_ADMINS;
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(SEED_REGIONAL_ADMINS));
      return SEED_REGIONAL_ADMINS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 14) {
      return parsed.map(adm => ({
        ...adm,
        officerCredentialId: adm.officerCredentialId || adm.sdmaOfficerId || `OFF-${adm.districtId?.split('-')[1] || 'REG'}-${adm.id?.replace('ADM-', '') || '101'}`,
        sdmaOfficerId: adm.officerCredentialId || adm.sdmaOfficerId || `OFF-${adm.districtId?.split('-')[1] || 'REG'}-${adm.id?.replace('ADM-', '') || '101'}`,
        password: adm.password || adm.accessKey || 'Pass@2026'
      }));
    }
    // Upgrade stored list to full 14 district officers
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(SEED_REGIONAL_ADMINS));
    return SEED_REGIONAL_ADMINS;
  } catch {
    return SEED_REGIONAL_ADMINS;
  }
};

/**
 * Saves provisioned regional administrators to persistent storage.
 */
export const saveStoredRegionalAdmins = (admins: RegionalAdminAccount[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
    // Dispatch storage event for cross-component reactive sync
    window.dispatchEvent(new Event('sahayasetu_admins_updated'));
  } catch (err) {
    console.warn('Failed to save regional admins to storage', err);
  }
};

/**
 * Gets currently authenticated Regional Admin session.
 */
export const getActiveRegionalAdmin = (): RegionalAdminAccount | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Sets or clears the active Regional Admin session.
 */
export const setActiveRegionalAdmin = (admin: RegionalAdminAccount | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (admin) {
      localStorage.setItem(ACTIVE_ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ACTIVE_ADMIN_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('sahayasetu_active_admin_updated'));
  } catch (err) {
    console.warn('Failed to set active regional admin', err);
  }
};

/**
 * Validates the currently active Regional Admin session.
 * If the account was suspended or deleted by Super Admin, immediately terminates the session and returns invalid.
 */
export const validateActiveRegionalAdminSession = (): {
  isValid: boolean;
  admin: RegionalAdminAccount | null;
  reason?: 'suspended' | 'deleted';
} => {
  const active = getActiveRegionalAdmin();
  if (!active) {
    return { isValid: false, admin: null };
  }

  const allAdmins = getStoredRegionalAdmins();
  const liveAdmin = allAdmins.find(a => a.id === active.id);

  if (!liveAdmin) {
    // Admin was deleted by Super Admin
    setActiveRegionalAdmin(null);
    return { isValid: false, admin: null, reason: 'deleted' };
  }

  if (liveAdmin.status === 'Suspended') {
    // Admin was suspended by Super Admin
    setActiveRegionalAdmin(null);
    return { isValid: false, admin: null, reason: 'suspended' };
  }

  return { isValid: true, admin: liveAdmin };
};

/**
 * Authenticates regional admin using Officer Credential ID and Password created by Super Admin.
 * Supports Officer Credential ID (e.g., OFF-KL-WYD-401), SDMA ID, Admin ID, or Email.
 */
export const authenticateRegionalAdmin = (
  identifier: string,
  secret: string
): { success: boolean; admin?: RegionalAdminAccount; error?: string } => {
  const cleanId = identifier.trim().toLowerCase();
  const cleanSecret = secret.trim();

  if (!cleanId || !cleanSecret) {
    return { success: false, error: 'Please enter both Officer Credential ID and Password.' };
  }

  const admins = getStoredRegionalAdmins();
  const matched = admins.find(a => 
    (a.officerCredentialId && a.officerCredentialId.toLowerCase() === cleanId) ||
    (a.sdmaOfficerId && a.sdmaOfficerId.toLowerCase() === cleanId) ||
    a.id.toLowerCase() === cleanId ||
    a.email.toLowerCase() === cleanId
  );

  if (!matched) {
    return { 
      success: false, 
      error: `No regional administrator found with Officer Credential ID "${identifier}". Please verify the ID generated by the Super Admin.` 
    };
  }

  if (matched.status === 'Suspended') {
    return { 
      success: false, 
      error: 'Your regional administrator credentials have been SUSPENDED by the Super Admin. You cannot log in until your status is re-activated by the Super Admin.' 
    };
  }

  const expectedSecret = (matched.password || matched.accessKey || '').trim();
  if (expectedSecret !== cleanSecret) {
    return { 
      success: false, 
      error: 'Invalid password. Please check the password generated by the Super Admin or contact administration.' 
    };
  }

  // Set active session
  setActiveRegionalAdmin(matched);
  return { success: true, admin: matched };
};

/**
 * Allows the regional admin to update their own credentials (name, email, phone, accessKey/password).
 * Updates both the persistent admin list and the active session, so Super Admin can inspect changes.
 */
export const updateRegionalAdminSelfCredentials = (
  adminId: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    accessKey?: string;
  }
): { success: boolean; updatedAdmin?: RegionalAdminAccount; error?: string } => {
  const admins = getStoredRegionalAdmins();
  const index = admins.findIndex(a => a.id === adminId);

  if (index === -1) {
    return { success: false, error: 'Admin record not found.' };
  }

  const current = admins[index];
  const newSecret = updates.accessKey ? updates.accessKey.trim() : (current.password || current.accessKey);

  const updated: RegionalAdminAccount = {
    ...current,
    name: updates.name?.trim() || current.name,
    email: updates.email?.trim() || current.email,
    phone: updates.phone?.trim() || current.phone,
    accessKey: newSecret,
    password: newSecret
  };

  admins[index] = updated;
  saveStoredRegionalAdmins(admins);
  setActiveRegionalAdmin(updated);

  return { success: true, updatedAdmin: updated };
};

/**
 * COMPLETELY WIPES ALL USER DATA
 * Clears localStorage of all beneficiaries, removes cached registrations,
 * and leaves a fresh start.
 */
export const purgeAllUserData = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BENEFICIARIES_STORAGE_KEY);
    localStorage.removeItem('sahayasetu_beneficiaries_v1');
    localStorage.removeItem('sahayasetu_beneficiaries_v2');
    localStorage.removeItem('sahayasetu_beneficiaries_cache');
    localStorage.removeItem('sahayasetu_mock_users');
    localStorage.setItem('sahayasetu_purged_fresh_start_v3', 'true');
    window.dispatchEvent(new Event('sahayasetu_data_purged'));
  } catch (err) {
    console.warn('Failed to purge user data', err);
  }
};
