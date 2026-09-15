/**
 * ============================================================================
 * SAHAYASETU APPLICATION ROOT COMPONENT (App.tsx)
 * ============================================================================
 * 
 * Purpose:
 * Central coordination shell integrating all functional modules, routing state,
 * global telemetry toggles, and notification systems.
 * 
 * Capabilities Managed:
 * 1. Unified Navigation: Switches between the 6 core humanitarian modules:
 *    - Beneficiary Profile Intake & Live Roster (BPI)
 *    - Job Requisitions & Skill-Matching Engine (JME)
 *    - Super Admin Statewide Command & Multi-Tenancy (SGA)
 *    - Beneficiary Self-Portal & Wage Verification
 *    - Citizen Onboarding & Field Officer Registration Dossier
 *    - Logged-In Citizen Personal Workspace & Readiness Dashboard
 * 2. Role-Based Perspective Switcher: Enables testing the interface as:
 *    - Regional Relief Coordinator (Priya Sharma)
 *    - Statewide Super Admin
 *    - Displaced Artisan Beneficiary
 *    - New Public Applicant
 * 3. State Management: Maintains live interactive state for candidate dispatches,
 *    rapid registrations, tenant provisioning, and simulated offline VSAT syncing.
 * 4. Toast Notification Dispatcher: Queues real-time feedback with SMS references.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NavigationTab, 
  UserRole, 
  Beneficiary, 
  JobRequisition, 
  DistrictTenant, 
  WageEntry, 
  ToastNotification,
  RegionalAdminAccount,
  SuperAdminTab
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { BeneficiaryIntakeView } from './views/BeneficiaryIntakeView';
import { SkillMatchingView } from './views/SkillMatchingView';
import { SuperAdminCommandView } from './views/SuperAdminCommandView';
import { BeneficiarySelfPortalView } from './views/BeneficiarySelfPortalView';
import { UserRegistrationView } from './views/UserRegistrationView';
import { GoogleSignInView } from './views/GoogleSignInView';
import { RegionalAdminLoginView } from './views/RegionalAdminLoginView';
import { SuperAdminLoginView, isSuperAdminLoggedIn, setSuperAdminLoggedIn } from './views/SuperAdminLoginView';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { RegionalAdminLoginModal } from './components/RegionalAdminLoginModal';
import { EditRegionalAdminCredentialsModal } from './components/EditRegionalAdminCredentialsModal';
import { 
  getActiveRegionalAdmin, 
  setActiveRegionalAdmin, 
  saveStoredRegionalAdmins,
  validateActiveRegionalAdminSession,
  purgeAllUserData, 
  BENEFICIARIES_STORAGE_KEY 
} from './services/regionalAdminService';
import { 
  persistBeneficiary, 
  persistJobApproval, 
  persistJobPost,
  fetchAllBeneficiaries, 
  fetchRegionalAdminsFromDb,
  fetchJobPostsFromDb,
  fetchDisasterDetailsFromDb,
  purgeAllUsersFromDb,
  deleteBeneficiaryFromDb,
  subscribeToAllEntitiesRealtime,
  subscribeToRegionalAdminsRealtime
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { revertCitizenJobAssignment } from './services/notificationService';
import { isSameJurisdiction, getDistrictDisplayName } from './utils/jurisdictionUtils';

// ----------------------------------------------------------------------------
// FRESH HUMANITARIAN REQUISITIONS
// ----------------------------------------------------------------------------
const INITIAL_REQUISITIONS: JobRequisition[] = [
  {
    id: 'JOB-WYD-101',
    title: 'Retaining Wall & Debris Silt Clearance',
    agency: 'KSDMA / Kerala PWD',
    sectorLocation: 'Chooralmala Sector 2',
    priority: 'SOS Urgent',
    requiredSkills: ['Masonry', 'General Civil Labor'],
    requiredCount: 15,
    assignedCount: 0,
    dailyWage: 950,
    hardshipAllowance: 200,
    durationWeeks: 6,
    startDate: 'Immediate',
    status: 'Open',
    districtId: 'KL-WYD-2024',
    districtName: 'Wayanad'
  },
  {
    id: 'JOB-WYD-102',
    title: 'Emergency Electrical Grid Reconnection',
    agency: 'KSEB Relief Wing',
    sectorLocation: 'Meppadi Town Substation',
    priority: 'SOS Urgent',
    requiredSkills: ['Electrical'],
    requiredCount: 8,
    assignedCount: 0,
    dailyWage: 1050,
    hardshipAllowance: 250,
    durationWeeks: 4,
    startDate: 'Immediate',
    status: 'Open',
    districtId: 'KL-WYD-2024',
    districtName: 'Wayanad'
  },
  {
    id: 'JOB-KKD-201',
    title: 'Chaliyar River Bank Stone Pitching',
    agency: 'Minor Irrigation Dept',
    sectorLocation: 'Feroke Bridge Embankment',
    priority: 'High Priority',
    requiredSkills: ['Masonry', 'General Civil Labor'],
    requiredCount: 12,
    assignedCount: 0,
    dailyWage: 900,
    hardshipAllowance: 150,
    durationWeeks: 5,
    startDate: 'Immediate',
    status: 'Open',
    districtId: 'KL-KKD-2024',
    districtName: 'Kozhikode'
  },
  {
    id: 'JOB-IDK-301',
    title: 'Culvert Reconstruction & Road Clearing',
    agency: 'Hill Area Development',
    sectorLocation: 'Peerumade Ghat Road',
    priority: 'High Priority',
    requiredSkills: ['Heavy Machinery', 'General Civil Labor'],
    requiredCount: 10,
    assignedCount: 0,
    dailyWage: 950,
    hardshipAllowance: 200,
    durationWeeks: 8,
    startDate: 'Immediate',
    status: 'Open',
    districtId: 'KL-IDK-2024',
    districtName: 'Idukki'
  },
  {
    id: 'JOB-ALP-401',
    title: 'Polder Embankment Reinforcement',
    agency: 'Kuttanad Water Authority',
    sectorLocation: 'Champakulam Lowland Block',
    priority: 'SOS Urgent',
    requiredSkills: ['General Civil Labor', 'Roofing'],
    requiredCount: 20,
    assignedCount: 0,
    dailyWage: 850,
    hardshipAllowance: 150,
    durationWeeks: 4,
    startDate: 'Immediate',
    status: 'Open',
    districtId: 'KL-ALP-2024',
    districtName: 'Alappuzha'
  }
];

const INITIAL_WAGES: WageEntry[] = [];

export const INITIAL_DISTRICTS: DistrictTenant[] = [
  {
    districtCode: 'KL-WYD-2024',
    districtName: 'Wayanad (Chooralmala Landslide)',
    stateName: 'Kerala',
    calamitySeverity: 'Extreme Tier-1',
    activeIntake: 4120,
    placedWorkers: 0,
    openRequisitions: 2,
    skillShortageIndex: 25,
    rlsEnforced: true,
    postGisShard: 'shard_kl_wyd_01',
    latencyMs: 18,
    partnerNgosCount: 24
  },
  {
    districtCode: 'KL-KKD-2024',
    districtName: 'Kozhikode (Chaliyar Basin Deluge)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 2450,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 18,
    rlsEnforced: true,
    postGisShard: 'shard_kl_kkd_02',
    latencyMs: 22,
    partnerNgosCount: 16
  },
  {
    districtCode: 'KL-IDK-2024',
    districtName: 'Idukki (Devikulam Mudslides)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 1890,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 22,
    rlsEnforced: true,
    postGisShard: 'shard_kl_idk_03',
    latencyMs: 25,
    partnerNgosCount: 19
  },
  {
    districtCode: 'KL-ALP-2024',
    districtName: 'Alappuzha (Kuttanad Inundation)',
    stateName: 'Kerala',
    calamitySeverity: 'Extreme Tier-1',
    activeIntake: 6200,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 30,
    rlsEnforced: true,
    postGisShard: 'shard_kl_alp_04',
    latencyMs: 20,
    partnerNgosCount: 32
  },
  {
    districtCode: 'KL-EKM-2024',
    districtName: 'Ernakulam (Periyar River Flood)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 2100,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 15,
    rlsEnforced: true,
    postGisShard: 'shard_kl_ekm_05',
    latencyMs: 16,
    partnerNgosCount: 14
  },
  {
    districtCode: 'KL-TCR-2024',
    districtName: 'Thrissur (Chalakudy River Surge)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 2800,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 20,
    rlsEnforced: true,
    postGisShard: 'shard_kl_tcr_06',
    latencyMs: 19,
    partnerNgosCount: 18
  },
  {
    districtCode: 'KL-PLK-2024',
    districtName: 'Palakkad (Attappadi Hill Torrents)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 1350,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 28,
    rlsEnforced: true,
    postGisShard: 'shard_kl_plk_07',
    latencyMs: 24,
    partnerNgosCount: 11
  },
  {
    districtCode: 'KL-MPM-2024',
    districtName: 'Malappuram (Nilambur Deluge)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 3400,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 26,
    rlsEnforced: true,
    postGisShard: 'shard_kl_mpm_08',
    latencyMs: 21,
    partnerNgosCount: 21
  },
  {
    districtCode: 'KL-KNR-2024',
    districtName: 'Kannur (Iritty Flash Floods)',
    stateName: 'Kerala',
    calamitySeverity: 'Moderate Tier-3',
    activeIntake: 980,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 12,
    rlsEnforced: true,
    postGisShard: 'shard_kl_knr_09',
    latencyMs: 23,
    partnerNgosCount: 9
  },
  {
    districtCode: 'KL-KSD-2024',
    districtName: 'Kasaragod (Chandragiri Surge)',
    stateName: 'Kerala',
    calamitySeverity: 'Moderate Tier-3',
    activeIntake: 790,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 14,
    rlsEnforced: true,
    postGisShard: 'shard_kl_ksd_10',
    latencyMs: 26,
    partnerNgosCount: 8
  },
  {
    districtCode: 'KL-KTM-2024',
    districtName: 'Kottayam (Meenachil River Flood)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 2150,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 16,
    rlsEnforced: true,
    postGisShard: 'shard_kl_ktm_11',
    latencyMs: 19,
    partnerNgosCount: 15
  },
  {
    districtCode: 'KL-PTA-2024',
    districtName: 'Pathanamthitta (Pampa River Floods)',
    stateName: 'Kerala',
    calamitySeverity: 'High Tier-2',
    activeIntake: 2600,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 22,
    rlsEnforced: true,
    postGisShard: 'shard_kl_pta_12',
    latencyMs: 22,
    partnerNgosCount: 17
  },
  {
    districtCode: 'KL-KLM-2024',
    districtName: 'Kollam (Ashtamudi Estuary Overflow)',
    stateName: 'Kerala',
    calamitySeverity: 'Moderate Tier-3',
    activeIntake: 1120,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 15,
    rlsEnforced: true,
    postGisShard: 'shard_kl_klm_13',
    latencyMs: 20,
    partnerNgosCount: 10
  },
  {
    districtCode: 'KL-TVM-2024',
    districtName: 'Thiruvananthapuram (Coastal Erosion Surge)',
    stateName: 'Kerala',
    calamitySeverity: 'Moderate Tier-3',
    activeIntake: 1430,
    placedWorkers: 0,
    openRequisitions: 1,
    skillShortageIndex: 10,
    rlsEnforced: true,
    postGisShard: 'shard_kl_tvm_14',
    latencyMs: 15,
    partnerNgosCount: 12
  }
];

// Local storage key for offline persistent beneficiaries
const LOCAL_STORAGE_KEY = BENEFICIARIES_STORAGE_KEY;
const loadStoredBeneficiaries = (): Beneficiary[] => {
  if (typeof window === 'undefined') return [];
  try {
    const isPurged = localStorage.getItem('sahayasetu_purged_fresh_start_v3');
    if (!isPurged) {
      purgeAllUserData();
      return [];
    }
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

/**
 * URL-based routing detector:
 * - /superadmin or #/superadmin -> Super Admin Command
 * - /regional-admin or #/regional-admin -> Regional Admin Scoped Roster (requires active login)
 * - Default root / -> Citizen User Registration & Tracking
 */
const getRouteConfig = (): { role: UserRole; tab: NavigationTab } => {
  if (typeof window === 'undefined') {
    return { role: 'citizen-user', tab: 'registration' };
  }
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path.includes('superadmin') || hash.includes('superadmin')) {
    return { role: 'super-admin', tab: 'super-admin' };
  }
  if (
    path.includes('regional-admin') || 
    path.includes('regionaladmin') || 
    hash.includes('regional-admin') || 
    hash.includes('regionaladmin')
  ) {
    return { role: 'regional-admin', tab: 'beneficiary-intake' };
  }
  return { role: 'citizen-user', tab: 'registration' };
};

export const App: React.FC = () => {
  // --------------------------------------------------------------------------
  // TOP APPLICATION STATE & URL ROUTING
  // Enforces URL-driven routing for Super Admin and Regional Admin
  // --------------------------------------------------------------------------
  const initialRoute = getRouteConfig();
  const [activeTab, setActiveTab] = useState<NavigationTab>(initialRoute.tab);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRoute.role);
  const [activeRegionalAdmin, setActiveRegionalAdminState] = useState<RegionalAdminAccount | null>(() => {
    return getActiveRegionalAdmin();
  });
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    return isSuperAdminLoggedIn();
  });
  const [isRegionalAdminLoginModalOpen, setIsRegionalAdminLoginModalOpen] = useState<boolean>(false);
  const [isEditCredentialsModalOpen, setIsEditCredentialsModalOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [superAdminSubTab, setSuperAdminSubTab] = useState<SuperAdminTab>('admin-management');

  // Authenticated user from Supabase Google Auth Context
  const { user, isAuthenticated } = useAuth();
  const { isLanguageModalOpen, setIsLanguageModalOpen } = useLanguage();

  // Core Entity State (fresh and clean)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(loadStoredBeneficiaries);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [districts, setDistricts] = useState<DistrictTenant[]>(INITIAL_DISTRICTS);
  const [wages] = useState<WageEntry[]>(INITIAL_WAGES);

  // --------------------------------------------------------------------------
  // USER APPLICATION TRACKING FILTER (MULTIPLE APPLICATIONS SUPPORT)
  // A signed-in user can submit multiple applications and switch between them
  // --------------------------------------------------------------------------
  const myBeneficiaries = useMemo(() => {
    if (!user) return [];
    return beneficiaries.filter(b => 
      (b.authUserId && user.id && b.authUserId === user.id) ||
      (b.authEmail && user.email && b.authEmail.trim().toLowerCase() === user.email.trim().toLowerCase())
    );
  }, [beneficiaries, user]);

  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  const activeBeneficiary = useMemo(() => {
    if (myBeneficiaries.length === 0) return null;
    if (selectedBeneficiaryId) {
      const found = myBeneficiaries.find(b => b.id === selectedBeneficiaryId);
      if (found) return found;
    }
    return myBeneficiaries[0];
  }, [myBeneficiaries, selectedBeneficiaryId]);

  // Prompt language selection modal on first sign-in of session
  useEffect(() => {
    if (isAuthenticated && !sessionStorage.getItem('sahayasetu_lang_prompted')) {
      setIsLanguageModalOpen(true);
    }
  }, [isAuthenticated]);

  // Synchronize route when URL pathname or hash changes and normalize URL
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('superadmin') || hash.includes('superadmin')) {
        setCurrentRole('super-admin');
        setActiveTab('super-admin');
        return;
      }

      if (
        path.includes('regional-admin') || 
        path.includes('regionaladmin') || 
        hash.includes('regional-admin') || 
        hash.includes('regionaladmin')
      ) {
        const activeAdmin = getActiveRegionalAdmin();
        setActiveRegionalAdminState(activeAdmin);
        setCurrentRole('regional-admin');
        setActiveTab('beneficiary-intake');
        return;
      }

      const route = getRouteConfig();
      setCurrentRole(route.role);
      setActiveTab(route.tab);
    };

    // Run initial URL normalization
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Listen for admin session changes, status updates (suspension/revocation), and user data purges
  useEffect(() => {
    const handleAdminSync = () => {
      const validation = validateActiveRegionalAdminSession();
      if (!validation.isValid) {
        setActiveRegionalAdminState(null);
        if (currentRole === 'regional-admin' && validation.reason) {
          showToast(
            'Session Terminated',
            validation.reason === 'suspended'
              ? 'Your regional administrator credentials have been SUSPENDED by the Super Admin. You have been logged out and cannot log in until re-activated.'
              : 'Your regional administrator account has been deleted by the Super Admin. You have been logged out.',
            'error'
          );
        }
      } else {
        setActiveRegionalAdminState(validation.admin);
      }
    };

    const handleDataPurgeSync = () => {
      setBeneficiaries([]);
    };

    window.addEventListener('sahayasetu_active_admin_updated', handleAdminSync);
    window.addEventListener('sahayasetu_admins_updated', handleAdminSync);
    window.addEventListener('storage', handleAdminSync);
    window.addEventListener('sahayasetu_data_purged', handleDataPurgeSync);

    return () => {
      window.removeEventListener('sahayasetu_active_admin_updated', handleAdminSync);
      window.removeEventListener('sahayasetu_admins_updated', handleAdminSync);
      window.removeEventListener('storage', handleAdminSync);
      window.removeEventListener('sahayasetu_data_purged', handleDataPurgeSync);
    };
  }, [currentRole]);

  // Real-time synchronization of regional admins from Supabase database
  useEffect(() => {
    const unsubscribe = subscribeToRegionalAdminsRealtime(async () => {
      const liveAdmins = await fetchRegionalAdminsFromDb();
      if (liveAdmins && liveAdmins.length > 0) {
        saveStoredRegionalAdmins(liveAdmins);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // One-time fresh start purge on startup if unpurged
  useEffect(() => {
    const isPurged = localStorage.getItem('sahayasetu_purged_fresh_start_v3');
    if (!isPurged) {
      purgeAllUserData();
      setBeneficiaries([]);
    }
  }, []);

  // --------------------------------------------------------------------------
  // TOAST FEEDBACK DISPATCHER
  // Shows animated status toasts with auto-dismiss
  // --------------------------------------------------------------------------
  const showToast = (
    title: string, 
    message: string, 
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    smsCode?: string
  ) => {
    setToast({
      id: String(Date.now()),
      title,
      message,
      type,
      smsCode
    });
  };

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // --------------------------------------------------------------------------
  // SUPABASE CLOUD SYNCHRONIZATION & REALTIME RECONCILIATION
  // Guarantees Supabase is the single source of truth across all 4 tables:
  // 1. users
  // 2. regional_admins
  // 3. job_posts
  // 4. disaster_details
  // --------------------------------------------------------------------------
  const syncWithSupabase = useCallback(async (silent: boolean = false) => {
    if (!isSupabaseConfigured) return;
    setIsCloudSyncing(true);
    try {
      // 1. Fetch live beneficiaries (users table)
      const liveBeneficiaries = await fetchAllBeneficiaries();
      setBeneficiaries(liveBeneficiaries);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(liveBeneficiaries));
      } catch {}

      // 2. Fetch live disasters (disaster_details table for 14 Kerala districts)
      const liveDisasters = await fetchDisasterDetailsFromDb();
      if (liveDisasters && liveDisasters.length > 0) {
        setDistricts(liveDisasters);
      }

      // 3. Fetch live job posts (job_posts table)
      const liveJobs = await fetchJobPostsFromDb();
      if (liveJobs && liveJobs.length > 0) {
        setRequisitions(liveJobs);
      }

      // 4. Fetch live regional admins (regional_admins table for 14 district officers)
      const liveAdmins = await fetchRegionalAdminsFromDb();
      if (liveAdmins && liveAdmins.length > 0) {
        saveStoredRegionalAdmins(liveAdmins);
      }

      if (!silent) {
        if (liveBeneficiaries.length === 0) {
          showToast('Cloud Synchronized', 'Supabase database is connected and active. User table clean.', 'info');
        } else {
          showToast('Cloud Synchronized', `${liveBeneficiaries.length} beneficiary record(s) loaded from Supabase.`, 'success');
        }
      }
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  // 1. Initial live synchronization on mount
  useEffect(() => {
    syncWithSupabase(true);
  }, [syncWithSupabase]);

  // 2. Re-synchronize automatically when switching back to this tab or reconnecting
  useEffect(() => {
    const handleRecheck = () => {
      if (document.visibilityState === 'visible' && !isOfflineMode) {
        syncWithSupabase(true);
      }
    };
    window.addEventListener('visibilitychange', handleRecheck);
    window.addEventListener('focus', handleRecheck);
    window.addEventListener('online', handleRecheck);
    return () => {
      window.removeEventListener('visibilitychange', handleRecheck);
      window.removeEventListener('focus', handleRecheck);
      window.removeEventListener('online', handleRecheck);
    };
  }, [syncWithSupabase, isOfflineMode]);

  // 3. Supabase Realtime channel subscription: instantly update UI when records change across any of the 4 tables
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const unsubscribe = subscribeToAllEntitiesRealtime((table, eventType, payload) => {
      if (table === 'users' && eventType === 'DELETE') {
        const deletedId = (payload.old as any)?.id;
        if (deletedId) {
          setBeneficiaries(prev => {
            const next = prev.filter(b => b.id !== deletedId);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
            } catch {}
            return next;
          });
          showToast('Record Removed', 'User record deleted in Supabase. Updated in real time.', 'info');
        } else {
          syncWithSupabase(true);
        }
      } else {
        // Realtime insert, update, or delete on users, regional_admins, job_posts, or disaster_details
        syncWithSupabase(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [syncWithSupabase]);

  // --------------------------------------------------------------------------
  // ROLE PERSPECTIVE SWITCHER SYNCHRONIZATION
  // Enforces strict role scoping and automatic tab redirection:
  // - Regional Admin: Only has function to view registered users details in KL-WYD-2024 (Wayanad)
  // - Super Admin: Full statewide access to all modules and regional shards
  // - Citizen User: Has only the option to register with necessary details and track application
  // --------------------------------------------------------------------------
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'super-admin') {
      setActiveTab('super-admin');
      showToast('Super Admin Access Granted', 'Full statewide oversight active across all 4 sharded districts.', 'info');
    } else if (role === 'citizen-user') {
      setActiveTab('registration');
      showToast('Citizen User Mode', 'You have only the option to register with necessary details and track your application.', 'info');
    } else {
      setActiveTab('beneficiary-intake');
      showToast('Regional Admin Mode Active', 'Strict Scoping: You only have the function to view registered users details in KL-WYD-2024 (Wayanad).', 'info');
    }
  };

  // --------------------------------------------------------------------------
  // ENTITY ACTIONS
  // Interactive operations connecting components
  // --------------------------------------------------------------------------
  // Add or update beneficiary from intake drawer or registration
  const handleAddBeneficiary = (newBen: Beneficiary) => {
    setBeneficiaries(prev => {
      const exists = prev.some(b => b.id === newBen.id);
      const updated = exists 
        ? prev.map(b => b.id === newBen.id ? newBen : b)
        : [newBen, ...prev];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSelectedBeneficiaryId(newBen.id);
    // Persist to Supabase with all verification data & audit logs
    persistBeneficiary(newBen, newBen.authUserId);
  };

  // Delete beneficiary from Supabase and local state
  const handleDeleteBeneficiary = async (beneficiaryId: string) => {
    // Delete from Supabase
    await deleteBeneficiaryFromDb(beneficiaryId);
    // Immediately update local state & local storage
    setBeneficiaries(prev => {
      const updated = prev.filter(b => b.id !== beneficiaryId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedBeneficiaryId === beneficiaryId) {
      setSelectedBeneficiaryId(null);
    }
    showToast('Record Deleted', `Beneficiary ${beneficiaryId} deleted from Supabase & site.`, 'info');
  };

  // Add new requisition
  const handleAddRequisition = (newReq: JobRequisition) => {
    setRequisitions([newReq, ...requisitions]);
    persistJobPost(newReq);
  };

  // Update existing requisition
  const handleUpdateRequisition = (updatedReq: JobRequisition) => {
    setRequisitions(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
    persistJobPost(updatedReq);
    showToast('Job Requisition Updated', `Requisition "${updatedReq.title}" has been updated.`, 'success');
  };

  // Dispatch candidate to requisition
  const handleDispatchCandidate = (reqId: string, beneficiaryId: string) => {
    const matchedReq = requisitions.find(r => r.id === reqId);
    const matchedBen = beneficiaries.find(b => b.id === beneficiaryId);

    if (!matchedReq || !matchedBen) return;

    // STRICT JURISDICTION ENFORCEMENT: Cross-regional candidate dispatch is strictly blocked
    if (!isSameJurisdiction(matchedBen, matchedReq)) {
      showToast(
        'Cross-Regional Dispatch Blocked',
        `Jurisdiction Rule Enforced: Citizen ${matchedBen.name} (${getDistrictDisplayName(matchedBen.districtId || matchedBen.district)}) cannot be assigned to worksites in ${getDistrictDisplayName(matchedReq.districtId || matchedReq.districtName)}. Displaced citizens may only work in their home jurisdiction.`,
        'warning'
      );
      return;
    }

    // Update requisition assigned headcount
    setRequisitions(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          assignedCount: r.assignedCount + 1,
          status: r.assignedCount + 1 >= r.requiredCount ? 'Completed' : 'Open'
        };
      }
      return r;
    }));

    // Update candidate placement status
    setBeneficiaries(prev => {
      const updated = prev.map(b => {
        if (b.id === beneficiaryId) {
          return {
            ...b,
            placementStatus: 'Assigned' as const,
            assignedProjectId: matchedReq?.title || reqId,
            assignedWorksite: matchedReq?.sectorLocation || matchedReq?.worksite
          };
        }
        return b;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (matchedBen) {
      persistBeneficiary({
        ...matchedBen,
        placementStatus: 'Assigned',
        assignedProjectId: matchedReq?.title || reqId,
        assignedWorksite: matchedReq?.sectorLocation || matchedReq?.worksite
      }, matchedBen.authUserId);
    }

    // Persist job approval and audit trail
    persistJobApproval(reqId, beneficiaryId);
  };

  // Revert/Undo candidate dispatch (restore to Available, decrement requisition count, clear assignment, delete notification)
  const handleRevertDispatch = (arg1: string, arg2?: string) => {
    // Gracefully handle either (beneficiaryId, reqId) or (reqId, beneficiaryId)
    let beneficiaryId = arg1;
    let reqId = arg2;

    if (arg2 && beneficiaries.some(b => b.id === arg2)) {
      beneficiaryId = arg2;
      reqId = arg1;
    }

    const benToRevert = beneficiaries.find(b => b.id === beneficiaryId);
    if (!benToRevert) return;

    // Find the associated requisition either by reqId or by matching assignedProjectId
    const targetReq = requisitions.find(r => 
      (reqId && r.id === reqId) || 
      r.id === benToRevert.assignedProjectId || 
      r.title === benToRevert.assignedProjectId
    );

    // 1. Decrement requisition assigned headcount and re-open if needed
    if (targetReq) {
      const updatedReq: JobRequisition = {
        ...targetReq,
        assignedCount: Math.max(0, targetReq.assignedCount - 1),
        status: 'Open'
      };
      setRequisitions(prev => prev.map(r => r.id === targetReq.id ? updatedReq : r));
      persistJobPost(updatedReq);
    }

    // 2. Restore candidate placement status to Available and clear project assignment
    const updatedBen: Beneficiary = {
      ...benToRevert,
      placementStatus: 'Available',
      assignedProjectId: undefined,
      assignedWorksite: undefined
    };

    setBeneficiaries(prev => {
      const updated = prev.map(b => b.id === beneficiaryId ? updatedBen : b);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 3. Persist updated beneficiary to Supabase
    persistBeneficiary(updatedBen, updatedBen.authUserId);

    // 4. Clean up active job assignment notification in citizen portal & localStorage
    revertCitizenJobAssignment(beneficiaryId);

    // 5. User feedback
    showToast(
      'Dispatch Assignment Reverted',
      `Job assignment for ${benToRevert.name} has been undone. Candidate returned to the Available pool.`,
      'info'
    );
  };

  // Deploy beneficiary from intake table
  const handleDeployBeneficiary = (beneficiaryId: string) => {
    const ben = beneficiaries.find(b => b.id === beneficiaryId);
    if (!ben) return;

    // Strictly find an open requisition in the candidate's OWN jurisdiction
    const matchingReq = requisitions.find(r => 
      isSameJurisdiction(ben, r) && 
      r.status !== 'Completed' && 
      r.assignedCount < r.requiredCount
    ) || requisitions.find(r => isSameJurisdiction(ben, r) && r.status !== 'Completed');

    if (!matchingReq) {
      showToast(
        'No Open Worksites in Jurisdiction',
        `Cannot deploy ${ben.name}: No available reconstruction projects exist in ${getDistrictDisplayName(ben.districtId || ben.district)}. Cross-regional dispatch is prohibited by state disaster protocol.`,
        'warning'
      );
      return;
    }

    handleDispatchCandidate(matchingReq.id, beneficiaryId);
    showToast(
      'Beneficiary Dispatched',
      `${ben.name} assigned to ${matchingReq.title} within ${getDistrictDisplayName(ben.districtId || ben.district)}.`,
      'success',
      'Automated Malayalam SMS SMS_REQD_09 Dispatched'
    );
  };

  // Add new district tenant
  const handleAddDistrict = (newTenant: DistrictTenant) => {
    setDistricts([...districts, newTenant]);
  };

  // Update existing district tenant
  const handleUpdateDistrict = (updatedDistrict: DistrictTenant) => {
    setDistricts(prev => prev.map(d => d.districtCode === updatedDistrict.districtCode ? updatedDistrict : d));
  };

  // Update beneficiary status/verification across application
  const handleUpdateBeneficiary = (updatedBen: Beneficiary) => {
    setBeneficiaries(prev => {
      const updated = prev.map(b => b.id === updatedBen.id ? updatedBen : b);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Persist updates to Supabase
    persistBeneficiary(updatedBen, updatedBen.authUserId);
  };

  // Toggle simulated offline mode
  const handleToggleOffline = () => {
    const nextState = !isOfflineMode;
    setIsOfflineMode(nextState);
    if (nextState) {
      showToast(
        'Simulated Offline Mode Enabled',
        'Satellite VSAT link disconnected. All operations caching locally via AES-256 GCM.',
        'warning'
      );
    } else {
      showToast(
        'Satellite VSAT Reconnected',
        'Direct microwave link restored. 14 local transactions synchronized to PostGIS cloud.',
        'success'
      );
    }
  };

  // Regional Admin login handler
  const handleRegionalAdminLogin = (admin: RegionalAdminAccount) => {
    setActiveRegionalAdminState(admin);
    setActiveRegionalAdmin(admin);
    setCurrentRole('regional-admin');
    setActiveTab('beneficiary-intake');
    window.history.replaceState({}, '', '/regionaladmin');
  };

  // Regional Admin logout handler
  const handleRegionalAdminLogout = () => {
    setActiveRegionalAdminState(null);
    setActiveRegionalAdmin(null);
    setCurrentRole('regional-admin');
    window.history.replaceState({}, '', '/regionaladmin');
    showToast('Logged Out', 'Regional Administrator session ended.', 'info');
  };

  // Super Admin login handler
  const handleSuperAdminLogin = () => {
    setIsSuperAdminAuthenticated(true);
    setSuperAdminLoggedIn(true);
    setCurrentRole('super-admin');
    setActiveTab('super-admin');
    window.history.replaceState({}, '', '/superadmin');
  };

  // Super Admin logout handler
  const handleSuperAdminLogout = () => {
    setIsSuperAdminAuthenticated(false);
    setSuperAdminLoggedIn(false);
    setCurrentRole('super-admin');
    window.history.replaceState({}, '', '/superadmin');
    showToast('Logged Out', 'Super Administrator session ended.', 'info');
  };

  // Regional Admin credentials update handler
  const handleCredentialsUpdated = (updatedAdmin: RegionalAdminAccount) => {
    setActiveRegionalAdminState(updatedAdmin);
    showToast(
      'Credentials Updated',
      `Login credentials updated for ${updatedAdmin.name} (${updatedAdmin.districtName}).`,
      'success'
    );
  };

  // Complete User Data Wipe (Fresh Start)
  const handlePurgeAllBeneficiaries = async () => {
    purgeAllUserData();
    await purgeAllUsersFromDb();
    setBeneficiaries([]);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } catch {}
    showToast(
      'Fresh Start Complete',
      'All user data and applications have been wiped completely.',
      'success'
    );
  };

  // Trigger Helpline SOS
  const handleTriggerSos = () => {
    showToast(
      'Emergency SOS Triggered',
      'Dialing 24/7 State Disaster Control Room (1077). Satellite priority channel open.',
      'error'
    );
  };

  return (
    <div className="app-shell">
      {/* ----------------------------------------------------------------------
       * 1. TOP GLOBAL MISSION COMMAND HEADER
       * ---------------------------------------------------------------------- */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        onTriggerSos={handleTriggerSos}
        isOfflineMode={isOfflineMode}
        onToggleOffline={handleToggleOffline}
        activeRegionalAdmin={activeRegionalAdmin}
        onOpenRegionalAdminLogin={() => setIsRegionalAdminLoginModalOpen(true)}
        onOpenEditCredentials={() => setIsEditCredentialsModalOpen(true)}
        onRegionalAdminLogout={handleRegionalAdminLogout}
        onRefreshCloud={() => syncWithSupabase(false)}
        isCloudSyncing={isCloudSyncing}
        isSuperAdminAuthenticated={isSuperAdminAuthenticated}
        onSuperAdminLogout={handleSuperAdminLogout}
      />

      {/* ----------------------------------------------------------------------
       * 2. MAIN LAYOUT (Sidebar + Content Workspace)
       * ---------------------------------------------------------------------- */}
      <div className="main-layout">
        {/* Left Navigation Rail */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOfflineMode={isOfflineMode}
          currentRole={currentRole}
          activeRegionalAdmin={activeRegionalAdmin}
          onOpenEditCredentials={() => setIsEditCredentialsModalOpen(true)}
          onRegionalAdminLogout={handleRegionalAdminLogout}
          isSuperAdminAuthenticated={isSuperAdminAuthenticated}
          onSuperAdminLogout={handleSuperAdminLogout}
          superAdminSubTab={superAdminSubTab}
          onSelectSuperAdminSubTab={(subTab) => {
            setActiveTab('super-admin');
            setSuperAdminSubTab(subTab);
          }}
        />

        {/* Main Workstation Workspace Area */}
        <main className="content-area">
          <div className="container-fluid">
            {/* ----------------------------------------------------------------
             * ROLE-BASED ACCESS CONTROL (RBAC) VIEW ROUTING:
             * - Regional Admin: Strictly restricted to viewing registered users in their assigned district
             * - Super Admin: Has ALL access across all views and districts
             * - Citizen User: Has only option to register with details and track application
             * ---------------------------------------------------------------- */}

            {/* 1. Regional Admin Perspective: Show dedicated login form if unauthenticated */}
            {currentRole === 'regional-admin' && (
              <>
                {!activeRegionalAdmin ? (
                  <RegionalAdminLoginView
                    onLoginSuccess={handleRegionalAdminLogin}
                    onShowToast={showToast}
                  />
                ) : (
                  <>
                    {activeTab === 'skill-matching' ? (
                      <SkillMatchingView
                        requisitions={requisitions}
                        beneficiaries={beneficiaries}
                        onAddRequisition={handleAddRequisition}
                        onUpdateRequisition={handleUpdateRequisition}
                        onDispatchCandidate={handleDispatchCandidate}
                        onRevertDispatch={handleRevertDispatch}
                        onShowToast={showToast}
                        currentRole={currentRole}
                        activeRegionalAdmin={activeRegionalAdmin}
                      />
                    ) : (
                      <BeneficiaryIntakeView
                        beneficiaries={beneficiaries}
                        onAddBeneficiary={handleAddBeneficiary}
                        onDeployBeneficiary={handleDeployBeneficiary}
                        onDeleteBeneficiary={handleDeleteBeneficiary}
                        onRevertDispatch={handleRevertDispatch}
                        onShowToast={showToast}
                        isOfflineMode={isOfflineMode}
                        currentRole={currentRole}
                        activeRegionalAdmin={activeRegionalAdmin}
                        onOpenEditCredentials={() => setIsEditCredentialsModalOpen(true)}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* 2. Citizen User Perspective: Ask for Google Sign-In first, then show Application Form and Tracking */}
            {currentRole === 'citizen-user' && (
              <>
                {!isAuthenticated ? (
                  <GoogleSignInView
                    onShowToast={showToast}
                    onSignedIn={() => setActiveTab('registration')}
                  />
                ) : (
                  <>
                    {activeTab === 'registration' ? (
                      <UserRegistrationView
                        existingBeneficiary={activeBeneficiary}
                        onRegisterCitizen={handleAddBeneficiary}
                        onShowToast={showToast}
                        onNavigateToPortal={() => setActiveTab('self-portal')}
                      />
                    ) : (
                      <BeneficiarySelfPortalView
                        beneficiary={activeBeneficiary}
                        wages={wages}
                        onShowToast={showToast}
                        onNavigateToRegister={() => setActiveTab('registration')}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* 3. Super Admin Perspective: Protected behind master credentials */}
            {currentRole === 'super-admin' && (
              <>
                {!isSuperAdminAuthenticated ? (
                  <SuperAdminLoginView
                    onLoginSuccess={handleSuperAdminLogin}
                    onShowToast={showToast}
                  />
                ) : (
                  <>
                    {/* View 1: Statewide Command Center & Region-Wise Data Analysis */}
                    {(activeTab === 'super-admin' || activeTab === 'region-analysis') && (
                      <SuperAdminCommandView
                        districts={districts}
                        beneficiaries={beneficiaries}
                        activeTabProp={activeTab === 'region-analysis' ? 'region-analysis' : superAdminSubTab}
                        onTabChange={(tab) => {
                          if (tab === 'region-analysis') {
                            setActiveTab('region-analysis');
                          } else {
                            setActiveTab('super-admin');
                            setSuperAdminSubTab(tab);
                          }
                        }}
                        onAddDistrict={handleAddDistrict}
                        onUpdateDistrict={handleUpdateDistrict}
                        onUpdateBeneficiary={handleUpdateBeneficiary}
                        onPurgeAllBeneficiaries={handlePurgeAllBeneficiaries}
                        onDeleteBeneficiary={handleDeleteBeneficiary}
                        onShowToast={showToast}
                      />
                    )}

                    {/* View 2: Global Roster across all districts */}
                    {activeTab === 'beneficiary-intake' && (
                      <BeneficiaryIntakeView
                        beneficiaries={beneficiaries}
                        onAddBeneficiary={handleAddBeneficiary}
                        onDeployBeneficiary={handleDeployBeneficiary}
                        onDeleteBeneficiary={handleDeleteBeneficiary}
                        onRevertDispatch={handleRevertDispatch}
                        onShowToast={showToast}
                        isOfflineMode={isOfflineMode}
                        currentRole={currentRole}
                        activeRegionalAdmin={activeRegionalAdmin}
                        onOpenEditCredentials={() => setIsEditCredentialsModalOpen(true)}
                      />
                    )}

                    {/* View 3: Statewide Dispatch & Skill Matching */}
                    {activeTab === 'skill-matching' && (
                      <SkillMatchingView
                        requisitions={requisitions}
                        beneficiaries={beneficiaries}
                        onAddRequisition={handleAddRequisition}
                        onUpdateRequisition={handleUpdateRequisition}
                        onDispatchCandidate={handleDispatchCandidate}
                        onRevertDispatch={handleRevertDispatch}
                        onShowToast={showToast}
                        currentRole={currentRole}
                        activeRegionalAdmin={activeRegionalAdmin}
                      />
                    )}

                    {/* View 5: Citizen Registration Form */}
                    {activeTab === 'registration' && (
                      <UserRegistrationView
                        onRegisterCitizen={handleAddBeneficiary}
                        onShowToast={showToast}
                        onNavigateToPortal={() => setActiveTab('self-portal')}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => {
          setIsLanguageModalOpen(false);
          sessionStorage.setItem('sahayasetu_lang_prompted', 'true');
        }}
        onSelectLanguage={() => {
          sessionStorage.setItem('sahayasetu_lang_prompted', 'true');
          showToast('Language Selected', `Interface language updated.`, 'success');
        }}
      />

      {/* Regional Admin Login Modal */}
      <RegionalAdminLoginModal
        isOpen={isRegionalAdminLoginModalOpen}
        onClose={() => setIsRegionalAdminLoginModalOpen(false)}
        onLoginSuccess={handleRegionalAdminLogin}
        onShowToast={showToast}
      />

      {/* Edit Regional Admin Credentials Modal */}
      {activeRegionalAdmin && (
        <EditRegionalAdminCredentialsModal
          isOpen={isEditCredentialsModalOpen}
          admin={activeRegionalAdmin}
          onClose={() => setIsEditCredentialsModalOpen(false)}
          onCredentialsUpdated={handleCredentialsUpdated}
          onShowToast={showToast}
        />
      )}

      {/* ----------------------------------------------------------------------
       * 3. FLASH FEEDBACK TOASTS
       * ---------------------------------------------------------------------- */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
};
