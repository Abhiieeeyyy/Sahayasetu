/**
 * ============================================================================
 * SAHAYASETU SUPER ADMIN STATEWIDE COMMAND & GOVERNANCE VIEW
 * ============================================================================
 * 
 * Purpose:
 * Centralized governance suite for statewide disaster relief authorities (SDMA / NDMA).
 * Exclusively provides the 5 core management modules requested:
 * 
 * 1. NGO Regional Admin Creation
 * 2. Region-Wise Data Analysis
 * 3. Regional Admin Management
 * 4. Adding Disaster in Each Region
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DistrictTenant, 
  Beneficiary, 
  RegionalAdminAccount, 
  RegionDisaster 
} from '../types';
import { persistRegionalAdmin } from '../services/supabaseService';
import { 
  getStoredRegionalAdmins, 
  saveStoredRegionalAdmins, 
  purgeAllUserData 
} from '../services/regionalAdminService';
import {
  getStoredDisasters,
  saveStoredDisasters,
  DISASTERS_STORAGE_KEY
} from '../services/disasterService';

interface SuperAdminCommandViewProps {
  districts: DistrictTenant[];
  beneficiaries: Beneficiary[];
  onAddDistrict?: (district: DistrictTenant) => void;
  onUpdateDistrict?: (district: DistrictTenant) => void;
  onUpdateBeneficiary?: (beneficiary: Beneficiary) => void;
  onPurgeAllBeneficiaries?: () => void;
  onDeleteBeneficiary?: (beneficiaryId: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

type SuperAdminTab = 
  | 'ngo-creation' 
  | 'region-analysis' 
  | 'admin-management' 
  | 'add-disasters';

// ----------------------------------------------------------------------------
// LOCAL STORAGE KEYS & INITIAL SEED DATA
// ----------------------------------------------------------------------------
const ADMINS_STORAGE_KEY = 'sahayasetu_regional_admins_v2';

const INITIAL_REGIONAL_ADMINS: RegionalAdminAccount[] = [
  {
    id: 'ADM-101',
    name: 'Dr. Arunkumar Menon',
    email: 'arunkumar.menon@keralaredcross.org',
    phone: '+91 94471 28901',
    ngoName: 'Kerala Red Cross Disaster Society',
    ngoDarpanId: 'DARPAN-KL/2024/0912',
    accessKey: 'KRC-WYD-9941',
    sdmaOfficerId: 'SDMA-KL-WYD-401',
    districtId: 'KL-WYD-2024',
    districtName: 'Wayanad Hills (Meppadi / Chooralmala)',
    dateProvisioned: '01 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-102',
    name: 'Dr. Fathima Beevi',
    email: 'fathima.b@kozhikodecare.org',
    phone: '+91 94472 31094',
    ngoName: 'Kozhikode Coastal Care Foundation',
    ngoDarpanId: 'DARPAN-KL/2024/0788',
    accessKey: 'KCC-KKD-4412',
    sdmaOfficerId: 'SDMA-KL-KKD-208',
    districtId: 'KL-KKD-2024',
    districtName: 'Kozhikode Coastal Catchment',
    dateProvisioned: '05 Aug 2026',
    status: 'Active'
  },
  {
    id: 'ADM-103',
    name: 'Mathew Thomas',
    email: 'mathew.t@seedsidukki.org',
    phone: '+91 94460 77312',
    ngoName: 'SEEDS High-Range Relief Trust',
    ngoDarpanId: 'DARPAN-KL/2023/1149',
    accessKey: 'SHR-IDK-7721',
    sdmaOfficerId: 'SDMA-KL-IDK-512',
    districtId: 'KL-IDK-2024',
    districtName: 'Idukki High Range Catchment',
    dateProvisioned: '10 Aug 2026',
    status: 'Active'
  }
];

const INITIAL_REGIONAL_DISASTERS: RegionDisaster[] = [
  {
    id: 'DIS-WYD-01',
    regionId: 'KL-WYD-2024',
    regionName: 'Wayanad Hills (Meppadi / Chooralmala)',
    title: 'Chooralmala & Mundakkai Massive Landslides',
    disasterType: 'Landslide',
    severity: 'Extreme Tier-1',
    declaredDate: '30 Jul 2026',
    affectedTaluks: 'Vythiri, Meppadi, Chooralmala, Mundakkai Sector 2',
    estimatedAffected: 4200,
    reliefCampsCount: 18,
    status: 'Active Emergency',
    emergencyDirectives: 'NDRF 4th Battalion mobilized. Bailey bridge transport corridor operational.'
  },
  {
    id: 'DIS-KKD-02',
    regionId: 'KL-KKD-2024',
    regionName: 'Kozhikode Coastal Catchment',
    title: 'Chaliyar River Inundation & Coastal Surge',
    disasterType: 'Flash Flood',
    severity: 'High Tier-2',
    declaredDate: '02 Aug 2026',
    affectedTaluks: 'Kozhikode, Koyilandy, Vadakara',
    estimatedAffected: 1850,
    reliefCampsCount: 8,
    status: 'Relief & Rescue',
    emergencyDirectives: 'Kerala Fire & Rescue teams deployed with motor inflatable rescue boats.'
  },
  {
    id: 'DIS-IDK-03',
    regionId: 'KL-IDK-2024',
    regionName: 'Idukki High Range Catchment',
    title: 'Periyar Catchment Hill Slope Slips',
    disasterType: 'Landslide',
    severity: 'High Tier-2',
    declaredDate: '08 Aug 2026',
    affectedTaluks: 'Udumbanchola, Munnar Gap Road, Devikulam',
    estimatedAffected: 950,
    reliefCampsCount: 5,
    status: 'Rehabilitation',
    emergencyDirectives: 'PWD heavy excavator clearing National Highway 85.'
  },
  {
    id: 'DIS-ALP-04',
    regionId: 'KL-ALP-2024',
    regionName: 'Alappuzha Coastal Kuttanad',
    title: 'Kuttanad Lowland River Swell & Waterlogging',
    disasterType: 'Flood',
    severity: 'Moderate Tier-3',
    declaredDate: '12 Aug 2026',
    affectedTaluks: 'Kuttanad, Ambalappuzha, Champakulam',
    estimatedAffected: 1400,
    reliefCampsCount: 6,
    status: 'Rehabilitation',
    emergencyDirectives: 'Mobile medical boats operating across canals.'
  }
];

export const SuperAdminCommandView: React.FC<SuperAdminCommandViewProps> = ({
  districts,
  beneficiaries,
  onUpdateDistrict,
  onUpdateBeneficiary,
  onPurgeAllBeneficiaries,
  onDeleteBeneficiary,
  onShowToast
}) => {
  // --------------------------------------------------------------------------
  // ACTIVE MODULE TAB
  // --------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('ngo-creation');

  // --------------------------------------------------------------------------
  // PERSISTENT ENTITIES: REGIONAL ADMINS & DISASTERS
  // --------------------------------------------------------------------------
  const [regionalAdmins, setRegionalAdmins] = useState<RegionalAdminAccount[]>(getStoredRegionalAdmins);

  // Synchronize when regional admin updates self credentials or new admin created
  useEffect(() => {
    const handleAdminsUpdated = () => {
      setRegionalAdmins(getStoredRegionalAdmins());
    };
    window.addEventListener('sahayasetu_admins_updated', handleAdminsUpdated);
    return () => window.removeEventListener('sahayasetu_admins_updated', handleAdminsUpdated);
  }, []);

  const [disasters, setDisasters] = useState<RegionDisaster[]>(getStoredDisasters);

  // Synchronize with persistent storage
  useEffect(() => {
    saveStoredRegionalAdmins(regionalAdmins);
  }, [regionalAdmins]);

  useEffect(() => {
    saveStoredDisasters(disasters);
  }, [disasters]);

  const handleWipeAllUserData = () => {
    if (window.confirm('Are you sure you want to completely delete all registered users and applications? This will create a fresh start with 0 users across the site.')) {
      purgeAllUserData();
      if (onPurgeAllBeneficiaries) {
        onPurgeAllBeneficiaries();
      }
      onShowToast(
        'Fresh Start Complete',
        'All user records and applications have been wiped. Platform is now completely empty.',
        'success'
      );
    }
  };

  // --------------------------------------------------------------------------
  // MODULE 1: NGO REGIONAL ADMIN CREATION STATE
  // --------------------------------------------------------------------------
  const [ngoName, setNgoName] = useState('');
  const [ngoDarpanId, setNgoDarpanId] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(districts[0]?.districtCode || 'KL-WYD-2024');

  // Generator helpers for District Officer Credential ID and Password
  const makeOfficerId = (dCode: string) => {
    const code = dCode.split('-')[1] || 'REG';
    return `OFF-KL-${code}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const makePassword = (dCode: string) => {
    const code = dCode.split('-')[1] || 'REG';
    return `Pass@${code}${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const [officerCredentialId, setOfficerCredentialId] = useState(() => makeOfficerId('KL-WYD-2024'));
  const [generatedPassword, setGeneratedPassword] = useState(() => makePassword('KL-WYD-2024'));
  const [showCreatedPassword, setShowCreatedPassword] = useState(false);
  const [lastCreatedAdmin, setLastCreatedAdmin] = useState<RegionalAdminAccount | null>(null);

  const handleDistrictChange = (dCode: string) => {
    setSelectedDistrictCode(dCode);
    setOfficerCredentialId(makeOfficerId(dCode));
    setGeneratedPassword(makePassword(dCode));
  };

  const handleGenerateOfficerId = () => {
    setOfficerCredentialId(makeOfficerId(selectedDistrictCode));
  };

  const handleGeneratePassword = () => {
    setGeneratedPassword(makePassword(selectedDistrictCode));
  };

  const handleCreateNgoAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !ngoName.trim()) {
      onShowToast('Validation Incomplete', 'Please fill in NGO Name, Admin Name, and Official Email.', 'warning');
      return;
    }

    const matchedDistrict = districts.find(d => d.districtCode === selectedDistrictCode);
    const effectiveOfficerId = officerCredentialId.trim() || makeOfficerId(selectedDistrictCode);
    const effectivePassword = generatedPassword.trim() || makePassword(selectedDistrictCode);

    const newAdmin: RegionalAdminAccount = {
      id: `ADM-${Math.floor(200 + Math.random() * 800)}`,
      name: adminName.trim(),
      email: adminEmail.trim(),
      phone: adminPhone.trim() || '+91 94400 00000',
      ngoName: ngoName.trim(),
      ngoDarpanId: ngoDarpanId.trim() || `DARPAN-KL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      accessKey: effectivePassword,
      password: effectivePassword,
      sdmaOfficerId: effectiveOfficerId,
      officerCredentialId: effectiveOfficerId,
      districtId: selectedDistrictCode,
      districtName: matchedDistrict?.districtName || 'Disaster Relief Zone',
      dateProvisioned: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active'
    };

    setRegionalAdmins(prev => [newAdmin, ...prev]);
    persistRegionalAdmin(newAdmin);
    setLastCreatedAdmin(newAdmin);

    onShowToast(
      'Regional Admin Provisioned',
      `Officer ID ${effectiveOfficerId} created for ${newAdmin.districtName}.`,
      'success'
    );

    // Reset fields but refresh credentials for next provision
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
    setNgoName('');
    setNgoDarpanId('');
    setOfficerCredentialId(makeOfficerId(selectedDistrictCode));
    setGeneratedPassword(makePassword(selectedDistrictCode));
  };

  // --------------------------------------------------------------------------
  // MODULE 2: REGION-WISE DATA ANALYSIS STATE
  // --------------------------------------------------------------------------
  const [analysisRegionFilter, setAnalysisRegionFilter] = useState<string>('ALL');

  // Compute analytics dynamically based on live beneficiaries and districts
  const regionalMetrics = useMemo(() => {
    return districts.map(district => {
      const regBeneficiaries = beneficiaries.filter(b => b.districtId === district.districtCode);
      const totalIntake = regBeneficiaries.length;
      const placedCount = regBeneficiaries.filter(b => b.placementStatus === 'Assigned').length;
      const availableCount = regBeneficiaries.filter(b => b.placementStatus === 'Available').length;
      const inReviewCount = regBeneficiaries.filter(b => b.placementStatus === 'In-Review').length;
      const bioVerifiedCount = regBeneficiaries.filter(b => b.isBioVerified).length;
      const dbtLinkedCount = regBeneficiaries.filter(b => b.dbtLinked || b.bankAccount).length;
      const activeRegionalDisasters = disasters.filter(d => d.regionId === district.districtCode && d.status !== 'Resolved');
      
      // Skill counts
      const skillBreakdown: Record<string, number> = {};
      regBeneficiaries.forEach(b => {
        b.skills?.forEach(sk => {
          skillBreakdown[sk] = (skillBreakdown[sk] || 0) + 1;
        });
      });

      return {
        district,
        totalIntake,
        placedCount,
        availableCount,
        inReviewCount,
        bioVerifiedCount,
        dbtLinkedCount,
        placementRate: totalIntake > 0 ? Math.round((placedCount / totalIntake) * 100) : 0,
        activeDisasters: activeRegionalDisasters,
        skillBreakdown
      };
    });
  }, [districts, beneficiaries, disasters]);

  // Aggregate totals computed dynamically based on the selected region filter
  const aggregateMetrics = useMemo(() => {
    const isFiltered = analysisRegionFilter !== 'ALL';
    const targetBeneficiaries = isFiltered
      ? beneficiaries.filter(b => b.districtId === analysisRegionFilter)
      : beneficiaries;
    const targetDisasters = isFiltered
      ? disasters.filter(d => d.regionId === analysisRegionFilter)
      : disasters;

    const selectedDistrict = isFiltered
      ? districts.find(d => d.districtCode === analysisRegionFilter)
      : null;

    const totalIntake = targetBeneficiaries.length;
    const totalPlaced = targetBeneficiaries.filter(b => b.placementStatus === 'Assigned').length;
    const totalBioVerified = targetBeneficiaries.filter(b => b.isBioVerified).length;
    const totalDbtLinked = targetBeneficiaries.filter(b => b.dbtLinked || b.bankAccount).length;
    const activeDisastersTotal = targetDisasters.filter(d => d.status !== 'Resolved').length;
    const totalPlacementRate = totalIntake > 0 ? Math.round((totalPlaced / totalIntake) * 100) : 0;
    
    return {
      isFiltered,
      selectedDistrict,
      regionName: selectedDistrict ? selectedDistrict.districtName.split('(')[0].trim() : analysisRegionFilter,
      totalIntake,
      totalPlaced,
      totalBioVerified,
      totalDbtLinked,
      activeDisastersTotal,
      totalDisasters: targetDisasters.length,
      totalPlacementRate
    };
  }, [beneficiaries, disasters, analysisRegionFilter, districts]);

  // Filtered district metrics for Tab 2
  const displayedRegionalMetrics = useMemo(() => {
    if (analysisRegionFilter === 'ALL') return regionalMetrics;
    return regionalMetrics.filter(m => m.district.districtCode === analysisRegionFilter);
  }, [regionalMetrics, analysisRegionFilter]);

  // --------------------------------------------------------------------------
  // MODULE 3: REGIONAL ADMIN MANAGEMENT STATE
  // --------------------------------------------------------------------------
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminRegionFilter, setAdminRegionFilter] = useState('ALL');
  const [adminStatusFilter, setAdminStatusFilter] = useState('ALL');
  const [editingAdmin, setEditingAdmin] = useState<RegionalAdminAccount | null>(null);

  const filteredAdmins = useMemo(() => {
    return regionalAdmins.filter(admin => {
      const matchesSearch = 
        admin.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        (admin.ngoName && admin.ngoName.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
        admin.sdmaOfficerId.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        admin.id.toLowerCase().includes(adminSearchQuery.toLowerCase());
      
      const matchesRegion = adminRegionFilter === 'ALL' || admin.districtId === adminRegionFilter;
      const matchesStatus = adminStatusFilter === 'ALL' || admin.status === adminStatusFilter;

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [regionalAdmins, adminSearchQuery, adminRegionFilter, adminStatusFilter]);

  const handleToggleAdminStatus = (adminId: string) => {
    setRegionalAdmins(prev => prev.map(a => {
      if (a.id === adminId) {
        const nextStatus = a.status === 'Active' ? 'Suspended' : 'Active';
        onShowToast(
          'Admin Status Updated',
          `${a.name} is now ${nextStatus}.`,
          nextStatus === 'Active' ? 'success' : 'warning'
        );
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleResetAdminAccessKey = (adminId: string) => {
    const freshKey = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    setRegionalAdmins(prev => prev.map(a => {
      if (a.id === adminId) {
        onShowToast(
          'Access Key Reset',
          `New security passcode generated for ${a.name}: ${freshKey}`,
          'info'
        );
        return { ...a, accessKey: freshKey };
      }
      return a;
    }));
  };

  const handleDeleteAdmin = (adminId: string) => {
    const admin = regionalAdmins.find(a => a.id === adminId);
    if (!admin) return;
    if (window.confirm(`Revoke credentials and remove regional admin ${admin.name}?`)) {
      setRegionalAdmins(prev => prev.filter(a => a.id !== adminId));
      onShowToast('Regional Admin Revoked', `Credentials for ${admin.name} have been revoked.`, 'error');
    }
  };

  const handleSaveEditedAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setRegionalAdmins(prev => prev.map(a => a.id === editingAdmin.id ? editingAdmin : a));
    onShowToast('Admin Updated', `Changes to ${editingAdmin.name} saved successfully.`, 'success');
    setEditingAdmin(null);
  };



  // --------------------------------------------------------------------------
  // MODULE 5: ADDING & MANAGING DISASTERS STATE
  // --------------------------------------------------------------------------
  const [isAddDisasterModalOpen, setIsAddDisasterModalOpen] = useState(false);
  const [editingDisaster, setEditingDisaster] = useState<RegionDisaster | null>(null);
  const [disasterFilterRegion, setDisasterFilterRegion] = useState('ALL');

  // Form fields for new disaster
  const [disasterRegionId, setDisasterRegionId] = useState(districts[0]?.districtCode || 'KL-WYD-2024');
  const [disasterTitle, setDisasterTitle] = useState('');
  const [disasterType, setDisasterType] = useState<RegionDisaster['disasterType']>('Landslide');
  const [disasterSeverity, setDisasterSeverity] = useState<RegionDisaster['severity']>('Extreme Tier-1');
  const [disasterAffectedTaluks, setDisasterAffectedTaluks] = useState('');
  const [disasterEstAffected, setDisasterEstAffected] = useState<number>(1000);
  const [disasterCampsCount, setDisasterCampsCount] = useState<number>(5);
  const [disasterStatus, setDisasterStatus] = useState<RegionDisaster['status']>('Active Emergency');
  const [disasterDirectives, setDisasterDirectives] = useState('');

  const handleAddDisasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disasterTitle.trim()) {
      onShowToast('Validation Incomplete', 'Please provide a disaster title.', 'warning');
      return;
    }

    const matchedDistrict = districts.find(d => d.districtCode === disasterRegionId);
    const newDisaster: RegionDisaster = {
      id: `DIS-${disasterRegionId.split('-')[1] || 'REG'}-${Math.floor(10 + Math.random() * 90)}`,
      regionId: disasterRegionId,
      regionName: matchedDistrict?.districtName || disasterRegionId,
      title: disasterTitle.trim(),
      disasterType,
      severity: disasterSeverity,
      declaredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      affectedTaluks: disasterAffectedTaluks.trim() || 'Key Emergency Corridors',
      estimatedAffected: Number(disasterEstAffected) || 500,
      reliefCampsCount: Number(disasterCampsCount) || 1,
      status: disasterStatus,
      emergencyDirectives: disasterDirectives.trim() || 'NDRF and District Disaster Management Teams on alert.'
    };

    setDisasters(prev => [newDisaster, ...prev]);

    // Update district severity if onUpdateDistrict is provided
    if (onUpdateDistrict && matchedDistrict) {
      onUpdateDistrict({
        ...matchedDistrict,
        calamitySeverity: disasterSeverity
      });
    }

    onShowToast(
      'Disaster Declared & Logged',
      `"${newDisaster.title}" logged for ${newDisaster.regionName}.`,
      'error'
    );

    // Reset modal form
    setDisasterTitle('');
    setDisasterAffectedTaluks('');
    setDisasterDirectives('');
    setIsAddDisasterModalOpen(false);
  };

  const handleStartEditDisaster = (disaster: RegionDisaster) => {
    setEditingDisaster({ ...disaster });
  };

  const handleSaveEditedDisaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDisaster) return;

    if (!editingDisaster.title.trim()) {
      onShowToast('Validation Incomplete', 'Disaster incident title cannot be empty.', 'warning');
      return;
    }

    const matchedDistrict = districts.find(d => d.districtCode === editingDisaster.regionId);
    const updatedDisaster: RegionDisaster = {
      ...editingDisaster,
      title: editingDisaster.title.trim(),
      regionName: matchedDistrict?.districtName || editingDisaster.regionName,
      affectedTaluks: editingDisaster.affectedTaluks?.trim() || 'Key Emergency Corridors',
      estimatedAffected: Number(editingDisaster.estimatedAffected) || 0,
      reliefCampsCount: Number(editingDisaster.reliefCampsCount) || 0,
      emergencyDirectives: editingDisaster.emergencyDirectives?.trim() || ''
    };

    setDisasters(prev => prev.map(d => d.id === updatedDisaster.id ? updatedDisaster : d));

    if (onUpdateDistrict && matchedDistrict) {
      onUpdateDistrict({
        ...matchedDistrict,
        calamitySeverity: updatedDisaster.severity
      });
    }

    onShowToast('Disaster Updated', `Disaster record "${updatedDisaster.title}" updated successfully.`, 'success');
    setEditingDisaster(null);
  };

  const handleUpdateDisasterStatus = (disasterId: string, nextStatus: RegionDisaster['status']) => {
    setDisasters(prev => prev.map(d => {
      if (d.id === disasterId) {
        onShowToast('Disaster Status Updated', `"${d.title}" moved to ${nextStatus}.`, 'info');
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const handleDeleteDisaster = (disasterId: string) => {
    const dis = disasters.find(d => d.id === disasterId);
    if (!dis) return;
    if (window.confirm(`Delete disaster record "${dis.title}"?`)) {
      setDisasters(prev => prev.filter(d => d.id !== disasterId));
      onShowToast('Disaster Record Removed', `"${dis.title}" removed from active register.`, 'error');
    }
  };

  const filteredDisasters = useMemo(() => {
    if (disasterFilterRegion === 'ALL') return disasters;
    return disasters.filter(d => d.regionId === disasterFilterRegion);
  }, [disasters, disasterFilterRegion]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* ----------------------------------------------------------------------
       * TOP BANNER & 5-TAB GOVERNANCE SUITE NAVIGATION
       * ---------------------------------------------------------------------- */}
      <div style={{
        backgroundColor: 'var(--color-surface-lowest)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-lg)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>admin_panel_settings</span>
                <span>Super Administrator Authority</span>
              </span>
              <span className="badge badge-rls">
                Statewide Command &amp; Multi-Jurisdiction
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)' }}>
              Super Admin Statewide Disaster Control Suite
            </h1>
            <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              Manage accredited NGO regional admins, monitor live region-wise telemetry, and coordinate regional disasters.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-verified" style={{ fontSize: '11px', padding: '6px 12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-tertiary)' }} />
              <span>Full Cross-Region Access Active</span>
            </span>
          </div>
        </div>

        {/* 4-MODULE TAB NAVIGATION BAR */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--color-outline-variant)'
        }}>
          {/* Tab 1: NGO Regional Admin Creation */}
          <button
            onClick={() => setActiveTab('ngo-creation')}
            className={`btn ${activeTab === 'ngo-creation' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
            <span>1. NGO Regional Admin Creation</span>
          </button>

          {/* Tab 2: Region-Wise Data Analysis */}
          <button
            onClick={() => setActiveTab('region-analysis')}
            className={`btn ${activeTab === 'region-analysis' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>analytics</span>
            <span>2. Region Wise Data Analysis</span>
          </button>

          {/* Tab 3: Regional Admin Management */}
          <button
            onClick={() => setActiveTab('admin-management')}
            className={`btn ${activeTab === 'admin-management' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>manage_accounts</span>
            <span>3. Regional Admin Management</span>
            <span className="badge" style={{ 
              marginLeft: '4px', 
              backgroundColor: activeTab === 'admin-management' ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-container)',
              color: activeTab === 'admin-management' ? 'white' : 'var(--color-primary)',
              fontSize: '11px',
              padding: '2px 6px'
            }}>
              {regionalAdmins.length}
            </span>
          </button>

          {/* Tab 4: Adding Disaster in Each Region */}
          <button
            onClick={() => setActiveTab('add-disasters')}
            className={`btn ${activeTab === 'add-disasters' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '13px', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>crisis_alert</span>
            <span>4. Adding Disaster in Each Region</span>
            <span className="badge" style={{ 
              marginLeft: '4px', 
              backgroundColor: activeTab === 'add-disasters' ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-container)',
              color: activeTab === 'add-disasters' ? 'white' : 'var(--color-primary)',
              fontSize: '11px',
              padding: '2px 6px'
            }}>
              {disasters.length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================================
       * 1. NGO REGIONAL ADMIN CREATION
       * ====================================================================== */}
      {activeTab === 'ngo-creation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <div>
                <span className="badge badge-rls">Module 1 • Super Admin Credentialing</span>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                  NGO Regional Administrator Account Creation
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                  Provision official regional administrator logins for accredited non-governmental relief organizations. The created admin will be restricted strictly to their assigned district.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('admin-management')}
              >
                <span className="material-symbols-outlined">manage_accounts</span>
                <span>View Existing Admins ({regionalAdmins.length})</span>
              </button>
            </div>

            {/* Credentialing Form */}
            <form onSubmit={handleCreateNgoAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {/* Scope Notice */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#eff6ff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                fontSize: '12px',
                color: '#1e3a8a',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
                  security
                </span>
                <div>
                  <strong>Mandatory Security Protocol:</strong> Regional Admin logins can only be generated by Statewide Super Admin. The provisioned administrator will be granted <strong>strictly view and management access</strong> for citizens and relief operations within their assigned regional jurisdiction.
                </div>
              </div>

              {/* Section 1: NGO Organization Details */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-on-surface)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>domain</span>
                  <span>1. Accredited NGO Organization Information</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      Partner NGO Legal Name *
                    </label>
                    <input
                      className="input-field"
                      placeholder="e.g. Kerala Red Cross Relief Society, Habitat for Humanity"
                      value={ngoName}
                      onChange={(e) => setNgoName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      NGO Darpan Registration ID
                    </label>
                    <input
                      className="input-field font-mono"
                      placeholder="e.g. DARPAN-KL/2024/0912"
                      value={ngoDarpanId}
                      onChange={(e) => setNgoDarpanId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Regional Admin Officer Profile */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-on-surface)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>badge</span>
                  <span>2. Regional Administrator Officer Profile</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      Administrator Full Legal Name *
                    </label>
                    <input
                      className="input-field"
                      placeholder="e.g. Priya Sharma or Dr. K. Ramanathan"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      Official NGO / Government Email *
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="e.g. admin@keralaredcross.org or priya.sharma@ksdma.gov.in"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      Official Contact Phone / Mobile
                    </label>
                    <input
                      className="input-field"
                      placeholder="e.g. +91 94471 28901"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Regional Jurisdiction & Super Admin Generated Credentials */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-on-surface)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>key</span>
                  <span>3. District Jurisdiction &amp; Generated Login Credentials</span>
                </h3>

                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-outline-variant)',
                  fontSize: '12px',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: 'var(--space-md)'
                }}>
                  The <strong>Officer Credential ID</strong> and <strong>Password</strong> generated below must be provided to the district regional admin. They will use these exact credentials to log in.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                      Assigned District Jurisdiction *
                    </label>
                    <select
                      className="input-field"
                      value={selectedDistrictCode}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      required
                    >
                      {districts.map(d => (
                        <option key={d.districtCode} value={d.districtCode}>
                          {d.districtCode} — {d.districtName} ({d.stateName})
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                      Changing the district auto-formats credentials for that region.
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                        Officer Credential ID (Generated) *
                      </label>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={handleGenerateOfficerId}
                        style={{ fontSize: '11px', padding: '2px 6px', minHeight: 'auto' }}
                        title="Generate new Officer ID"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                        <span>Regenerate ID</span>
                      </button>
                    </div>
                    <input
                      className="input-field font-mono"
                      value={officerCredentialId}
                      onChange={(e) => setOfficerCredentialId(e.target.value)}
                      required
                      style={{ fontWeight: 700 }}
                      placeholder="e.g. OFF-KL-WYD-401"
                    />
                    <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                      Primary login identifier for this district administrator.
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                        District Login Password (Generated) *
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setShowCreatedPassword(!showCreatedPassword)}
                          style={{ fontSize: '11px', padding: '2px 6px', minHeight: 'auto' }}
                        >
                          {showCreatedPassword ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={handleGeneratePassword}
                          style={{ fontSize: '11px', padding: '2px 6px', minHeight: 'auto' }}
                          title="Generate new password"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                        </button>
                      </div>
                    </div>
                    <input
                      type={showCreatedPassword ? 'text' : 'password'}
                      className="input-field font-mono"
                      value={generatedPassword}
                      onChange={(e) => setGeneratedPassword(e.target.value)}
                      required
                      style={{ fontWeight: 700 }}
                      placeholder="e.g. Pass@WYD2026"
                    />
                    <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                      The regional admin can edit or change this password later in their portal.
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-outline-variant)' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setAdminName('');
                    setAdminEmail('');
                    setAdminPhone('');
                    setNgoName('');
                    setNgoDarpanId('');
                    handleDistrictChange(selectedDistrictCode);
                  }}
                >
                  Clear Form
                </button>

                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                  <span className="material-symbols-outlined">badge</span>
                  <span>Create Regional Admin Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recently Created Admin Credentials Card */}
          {lastCreatedAdmin && (
            <div className="card" style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac', padding: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#15803d',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>check_circle</span>
                  </div>
                  <div>
                    <span className="badge badge-verified" style={{ marginBottom: '4px' }}>District Credentials Active</span>
                    <h3 style={{ fontSize: '1.35rem', color: '#14532d', margin: '2px 0 6px 0' }}>
                      {lastCreatedAdmin.name} — {lastCreatedAdmin.districtName}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#166534' }}>
                      <span>NGO: <strong>{lastCreatedAdmin.ngoName}</strong></span>
                      <span>District Code: <strong>{lastCreatedAdmin.districtId}</strong></span>
                      <span>Email: <strong>{lastCreatedAdmin.email}</strong></span>
                    </div>

                    {/* Prominent Login Credentials Box */}
                    <div style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#15803d', fontWeight: 700 }}>
                          Officer Credential ID
                        </div>
                        <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#14532d' }}>
                          {lastCreatedAdmin.officerCredentialId || lastCreatedAdmin.sdmaOfficerId}
                        </div>
                      </div>

                      <div style={{ width: '1px', height: '32px', backgroundColor: '#bbf7d0' }} />

                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#15803d', fontWeight: 700 }}>
                          Generated Password
                        </div>
                        <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#14532d' }}>
                          {lastCreatedAdmin.password || lastCreatedAdmin.accessKey}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
                      const text = `SahayaSetu Regional Admin District Login Credentials:\nAssigned District: ${lastCreatedAdmin.districtName} (${lastCreatedAdmin.districtId})\nOfficer Credential ID: ${lastCreatedAdmin.officerCredentialId || lastCreatedAdmin.sdmaOfficerId}\nPassword: ${lastCreatedAdmin.password || lastCreatedAdmin.accessKey}\nLogin Portal: ${origin}/regionaladmin`;
                      navigator.clipboard.writeText(text);
                      onShowToast('Credentials Copied', 'Officer Credential ID and Password copied to clipboard.', 'success');
                    }}
                    style={{ fontWeight: 700, padding: '8px 14px' }}
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    <span>Copy Login Credentials</span>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab('admin-management')}
                    style={{ fontSize: '12px' }}
                  >
                    <span>View in Admins Directory &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
       * 2. REGION WISE DATA ANALYSIS
       * ====================================================================== */}
      {activeTab === 'region-analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Controls & Region Selector */}
          <div className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div>
                <span className="badge badge-rls">Module 2 • Statewide Telemetry</span>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                  Region-Wise Disaster &amp; Relief Telemetry Analysis
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
                  Filter Jurisdiction:
                </span>
                <select
                  className="input-field"
                  value={analysisRegionFilter}
                  onChange={(e) => setAnalysisRegionFilter(e.target.value)}
                  style={{ minWidth: '220px', padding: '6px 10px', fontSize: '13px' }}
                >
                  <option value="ALL">All Regions (Consolidated Telemetry)</option>
                  {districts.map(d => (
                    <option key={d.districtCode} value={d.districtCode}>
                      {d.districtCode} ({d.districtName.split('(')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Statewide Summary Cards */}
          <div className="grid-4">
            {/* Card 1: Displaced Population / Intake */}
            <div className="card">
              <span className="kpi-title">
                {aggregateMetrics.isFiltered
                  ? `${aggregateMetrics.regionName} Displaced`
                  : 'Total Registered Displaced'}
              </span>
              <div className="kpi-value tabular-nums">{aggregateMetrics.totalIntake.toLocaleString()}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                <span>
                  {aggregateMetrics.isFiltered
                    ? `${aggregateMetrics.regionName} Corridor`
                    : `Across ${districts.length} Regions`}
                </span>
                <span style={{ color: 'var(--color-tertiary)', fontWeight: 700 }}>Active Roster</span>
              </div>
            </div>

            {/* Card 2: Rebuilding Placements */}
            <div className="card">
              <span className="kpi-title">Rebuilding Placements</span>
              <div className="kpi-value tabular-nums" style={{ color: 'var(--color-tertiary)' }}>
                {aggregateMetrics.totalPlaced.toLocaleString()}
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--color-tertiary)' }}>
                  <span>{aggregateMetrics.isFiltered ? `${analysisRegionFilter} Placement Rate` : 'Statewide Placement Rate'}</span>
                  <span>{aggregateMetrics.totalPlacementRate}%</span>
                </div>
                <div className="kpi-meter" style={{ marginTop: '4px' }}>
                  <div className="kpi-meter-fill" style={{ width: `${aggregateMetrics.totalPlacementRate}%`, backgroundColor: 'var(--color-tertiary)' }} />
                </div>
              </div>
            </div>

            {/* Card 3: Biometric Verified */}
            <div className="card">
              <span className="kpi-title">Aadhaar Bio-Verified</span>
              <div className="kpi-value tabular-nums" style={{ color: 'var(--color-primary)' }}>
                {aggregateMetrics.totalBioVerified.toLocaleString()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                <span>Identity Cleared</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {aggregateMetrics.totalIntake > 0 ? Math.round((aggregateMetrics.totalBioVerified / aggregateMetrics.totalIntake) * 100) : 0}% Cleared
                </span>
              </div>
            </div>

            {/* Card 4: Active Calamities */}
            <div className="card">
              <span className="kpi-title">Active Calamity Corridors</span>
              <div className="kpi-value tabular-nums" style={{ color: 'var(--color-secondary)' }}>
                {aggregateMetrics.activeDisastersTotal} Active
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                  {aggregateMetrics.isFiltered ? (aggregateMetrics.selectedDistrict?.calamitySeverity || 'Jurisdiction Zone') : 'NDMA Response'}
                </span>
                <span>{aggregateMetrics.totalDisasters} Recorded</span>
              </div>
            </div>
          </div>

          {/* Region-by-Region Breakdown Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined">map</span>
              <span>Jurisdictional Breakdown &amp; Comparative Analysis</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-md)' }}>
              {displayedRegionalMetrics.map(({ district, totalIntake, placedCount, availableCount, placementRate, activeDisasters, skillBreakdown }) => (
                <div key={district.districtCode} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', borderTop: `4px solid ${
                  district.calamitySeverity === 'Extreme Tier-1' ? 'var(--color-error)' :
                  district.calamitySeverity === 'High Tier-2' ? 'var(--color-secondary)' : 'var(--color-tertiary)'
                }` }}>
                  {/* Region Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-rls font-mono">{district.districtCode}</span>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--color-on-surface)', marginTop: '4px' }}>
                        {district.districtName}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                        State: <strong>{district.stateName}</strong> • {district.partnerNgosCount} Accredited NGOs
                      </div>
                    </div>

                    <span className={`badge ${
                      district.calamitySeverity === 'Extreme Tier-1' ? 'badge-landslide' :
                      district.calamitySeverity === 'High Tier-2' ? 'badge-flood' : 'badge-rls'
                    }`}>
                      {district.calamitySeverity}
                    </span>
                  </div>

                  {/* Metrics Table */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    backgroundColor: 'var(--color-surface-low)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '8px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block' }}>Total Intake</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{totalIntake}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block' }}>Dispatched</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-tertiary)' }}>{placedCount}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block' }}>Available</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-on-surface)' }}>{availableCount}</strong>
                    </div>
                  </div>

                  {/* Placement Rate Meter */}
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                      <span>Rehabilitation Placement Progress</span>
                      <span style={{ color: 'var(--color-tertiary)' }}>{placementRate}%</span>
                    </div>
                    <div className="kpi-meter" style={{ marginTop: '3px' }}>
                      <div className="kpi-meter-fill" style={{ width: `${placementRate}%`, backgroundColor: 'var(--color-tertiary)' }} />
                    </div>
                  </div>

                  {/* Active Disasters in this Region */}
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)' }}>
                      Active Calamities in Region ({activeDisasters.length}):
                    </span>
                    {activeDisasters.length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'var(--color-tertiary)', marginTop: '4px', fontWeight: 600 }}>
                        ✓ No active high-alert emergency currently declared
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                        {activeDisasters.map(d => (
                          <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '4px 6px', backgroundColor: 'var(--color-surface-lowest)', borderRadius: 'var(--radius-sm)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{d.title}</span>
                            <span className="badge badge-landslide" style={{ fontSize: '10px' }}>{d.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top Skills Registered */}
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)' }}>
                      Registered Trade Skills:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {Object.keys(skillBreakdown).length === 0 ? (
                        <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>No registered trades yet</span>
                      ) : (
                        Object.entries(skillBreakdown).map(([skill, count]) => (
                          <span key={skill} className="badge" style={{ backgroundColor: 'var(--color-surface-low)', color: 'var(--color-on-surface)', fontSize: '10px' }}>
                            {skill}: {count}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
       * 3. REGIONAL ADMIN MANAGEMENT
       * ====================================================================== */}
      {activeTab === 'admin-management' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Top Bar with Filter & Search */}
          <div className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div>
                <span className="badge badge-rls">Module 3 • Directory &amp; Governance</span>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                  Regional Administrators Management
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                  Total Provisioned: <strong>{regionalAdmins.length}</strong> • Active: <strong>{regionalAdmins.filter(a => a.status === 'Active').length}</strong> • Suspended: <strong>{regionalAdmins.filter(a => a.status === 'Suspended').length}</strong>
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab('ngo-creation')}
              >
                <span className="material-symbols-outlined">person_add</span>
                <span>+ Create New Regional Admin</span>
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-outline-variant)' }}>
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px', backgroundColor: 'var(--color-surface-low)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-outline-variant)', padding: '0 8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-on-surface-variant)', marginRight: '6px' }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by Admin Name, NGO, Email, Officer ID..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', padding: '6px 0', fontSize: '13px', width: '100%' }}
                />
              </div>

              {/* Region Filter */}
              <select
                className="input-field"
                value={adminRegionFilter}
                onChange={(e) => setAdminRegionFilter(e.target.value)}
                style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
              >
                <option value="ALL">All Regions</option>
                {districts.map(d => (
                  <option key={d.districtCode} value={d.districtCode}>
                    {d.districtCode}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                className="input-field"
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value)}
                style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Regional Admins Table */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Administrator Profile</th>
                  <th>Accredited Partner NGO</th>
                  <th>Assigned Jurisdiction</th>
                  <th>Officer Credential ID</th>
                  <th>Contact Info</th>
                  <th>District Password</th>
                  <th>Status</th>
                  <th>Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--color-outline)', display: 'block', marginBottom: '8px' }}>
                        manage_accounts
                      </span>
                      <div style={{ fontWeight: 600 }}>No regional administrators found matching criteria</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "+ Create New Regional Admin" above to provision regional credentials.</div>
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: admin.status === 'Active' ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
                            color: admin.status === 'Active' ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}>
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{admin.name}</div>
                            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{admin.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                          {admin.ngoName || 'State Relief Partner'}
                        </div>
                        {admin.ngoDarpanId && (
                          <div className="font-mono" style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
                            {admin.ngoDarpanId}
                          </div>
                        )}
                      </td>

                      <td>
                        <span className="badge badge-rls font-mono">{admin.districtId}</span>
                        <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                          {admin.districtName.split('(')[0]}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {admin.officerCredentialId || admin.sdmaOfficerId}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              navigator.clipboard.writeText(admin.officerCredentialId || admin.sdmaOfficerId);
                              onShowToast('Copied', 'Officer Credential ID copied.', 'info');
                            }}
                            title="Copy Officer Credential ID"
                            style={{ minHeight: 'auto', padding: '2px 4px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                          </button>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '12px' }}>{admin.email}</div>
                        {admin.phone && (
                          <div className="font-mono" style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                            {admin.phone}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="font-mono" style={{ fontSize: '11px', backgroundColor: 'var(--color-surface-low)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                            {admin.password || admin.accessKey || 'Pass@2026'}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              navigator.clipboard.writeText(admin.password || admin.accessKey || 'Pass@2026');
                              onShowToast('Copied', 'Password copied.', 'info');
                            }}
                            title="Copy Password"
                            style={{ minHeight: 'auto', padding: '2px 4px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                          </button>
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${admin.status === 'Active' ? 'badge-verified' : 'badge-landslide'}`}>
                          {admin.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Suspend / Activate toggle */}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleAdminStatus(admin.id)}
                            title={admin.status === 'Active' ? 'Suspend admin access' : 'Activate admin access'}
                            style={{ minHeight: '30px', padding: '0 8px', fontSize: '11px' }}
                          >
                            {admin.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>

                          {/* Reset Password */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleResetAdminAccessKey(admin.id)}
                            title="Generate fresh district password"
                            style={{ minHeight: '30px', padding: '0 6px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>key</span>
                          </button>

                          {/* Edit Details */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingAdmin(admin)}
                            title="Edit admin credentials and details"
                            style={{ minHeight: '30px', padding: '0 6px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                          </button>

                          {/* Revoke / Delete */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            title="Revoke and delete admin account"
                            style={{ minHeight: '30px', padding: '0 6px', color: 'var(--color-error)' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Admin Modal */}
          {editingAdmin && (
            <div className="modal-backdrop" onClick={() => setEditingAdmin(null)}>
              <div className="modal-dialog" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                    Edit Regional Administrator Credentials
                  </h3>
                  <button className="btn btn-ghost" onClick={() => setEditingAdmin(null)} style={{ minHeight: '32px', width: '32px', padding: 0 }}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveEditedAdmin}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Officer Credential ID (Used for Login) *
                      </label>
                      <input
                        className="input-field font-mono"
                        value={editingAdmin.officerCredentialId || editingAdmin.sdmaOfficerId || ''}
                        onChange={(e) => setEditingAdmin({
                          ...editingAdmin,
                          officerCredentialId: e.target.value,
                          sdmaOfficerId: e.target.value
                        })}
                        required
                        style={{ fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        District Login Password *
                      </label>
                      <input
                        className="input-field font-mono"
                        value={editingAdmin.password || editingAdmin.accessKey || ''}
                        onChange={(e) => setEditingAdmin({
                          ...editingAdmin,
                          password: e.target.value,
                          accessKey: e.target.value
                        })}
                        required
                        style={{ fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Legal Name *</label>
                      <input
                        className="input-field"
                        value={editingAdmin.name}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Partner NGO Legal Name</label>
                      <input
                        className="input-field"
                        value={editingAdmin.ngoName || ''}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, ngoName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Official Email</label>
                      <input
                        type="email"
                        className="input-field"
                        value={editingAdmin.email}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phone Number</label>
                      <input
                        className="input-field"
                        value={editingAdmin.phone || ''}
                        onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Assigned District</label>
                      <select
                        className="input-field"
                        value={editingAdmin.districtId}
                        onChange={(e) => {
                          const code = e.target.value;
                          const found = districts.find(d => d.districtCode === code);
                          setEditingAdmin({
                            ...editingAdmin,
                            districtId: code,
                            districtName: found?.districtName || code
                          });
                        }}
                      >
                        {districts.map(d => (
                          <option key={d.districtCode} value={d.districtCode}>
                            {d.districtCode} ({d.districtName.split('(')[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setEditingAdmin(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
       * 4. ADDING THE DISASTER IN EACH REGION
       * ====================================================================== */}
      {activeTab === 'add-disasters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Header & Filter Controls */}
          <div className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div>
                <span className="badge badge-landslide">Module 4 • Disaster Response Declaration</span>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                  Regional Disaster Declaration &amp; Incident Management
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                  Total Declared Calamities: <strong>{disasters.length}</strong> • Active Emergency: <strong>{disasters.filter(d => d.status === 'Active Emergency').length}</strong> • In Rehabilitation: <strong>{disasters.filter(d => d.status === 'Rehabilitation').length}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  className="input-field"
                  value={disasterFilterRegion}
                  onChange={(e) => setDisasterFilterRegion(e.target.value)}
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="ALL">All Regions</option>
                  {districts.map(d => (
                    <option key={d.districtCode} value={d.districtCode}>
                      {d.districtCode}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddDisasterModalOpen(true)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  <span className="material-symbols-outlined">add_alert</span>
                  <span>+ Add Disaster in Region</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Disasters Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-md)' }}>
            {filteredDisasters.length === 0 ? (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)', display: 'block', marginBottom: '8px' }}>
                  check_circle
                </span>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>No disasters currently logged for this selection</div>
                <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                  Click "+ Add Disaster in Region" above to declare and track regional calamity events.
                </div>
              </div>
            ) : (
              filteredDisasters.map((disaster) => (
                <div key={disaster.id} className="card" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                  borderLeft: `5px solid ${
                    disaster.severity === 'Extreme Tier-1' ? 'var(--color-error)' :
                    disaster.severity === 'High Tier-2' ? 'var(--color-secondary)' : 'var(--color-tertiary)'
                  }`
                }}>
                  {/* Title & Severity */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-rls font-mono">{disaster.regionId}</span>
                        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{disaster.id}</span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--color-on-surface)', marginTop: '4px' }}>
                        {disaster.title}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                        {disaster.regionName}
                      </div>
                    </div>

                    <span className={`badge ${
                      disaster.severity === 'Extreme Tier-1' ? 'badge-landslide' :
                      disaster.severity === 'High Tier-2' ? 'badge-flood' : 'badge-rls'
                    }`}>
                      {disaster.severity}
                    </span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>warning</span>
                      <span>Type: {disaster.disasterType}</span>
                    </span>

                    <span className="badge" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>calendar_today</span>
                      <span>Declared: {disaster.declaredDate}</span>
                    </span>
                  </div>

                  {/* Impact Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    backgroundColor: 'var(--color-surface-low)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '4px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block' }}>Estimated Displaced</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-error)' }}>
                        {disaster.estimatedAffected.toLocaleString()} citizens
                      </strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block' }}>Active Relief Camps</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                        {disaster.reliefCampsCount} Camps
                      </strong>
                    </div>
                  </div>

                  {/* Affected Taluks & Directives */}
                  <div style={{ fontSize: '12px', color: 'var(--color-on-surface)' }}>
                    <strong>Affected Sectors:</strong> {disaster.affectedTaluks}
                  </div>

                  {disaster.emergencyDirectives && (
                    <div style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--color-surface-lowest)',
                      border: '1px solid var(--color-outline-variant)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-on-surface-variant)'
                    }}>
                      <strong>Directives:</strong> {disaster.emergencyDirectives}
                    </div>
                  )}

                  {/* Status & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Status:</span>
                      <select
                        className="input-field"
                        value={disaster.status}
                        onChange={(e) => handleUpdateDisasterStatus(disaster.id, e.target.value as RegionDisaster['status'])}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          fontWeight: 700,
                          width: 'auto'
                        }}
                      >
                        <option value="Active Emergency">Active Emergency</option>
                        <option value="Relief & Rescue">Relief & Rescue</option>
                        <option value="Rehabilitation">Rehabilitation</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleStartEditDisaster(disaster)}
                        title="Edit disaster details"
                        style={{
                          color: 'var(--color-primary)',
                          padding: '4px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'var(--color-surface-container)',
                          border: '1px solid var(--color-outline-variant)'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Edit</span>
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteDisaster(disaster.id)}
                        title="Remove disaster log"
                        style={{ color: 'var(--color-error)', padding: '4px 8px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ADD DISASTER MODAL */}
          {isAddDisasterModalOpen && (
            <div className="modal-backdrop" onClick={() => setIsAddDisasterModalOpen(false)}>
              <div className="modal-dialog" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-error)' }}>
                      crisis_alert
                    </span>
                    <div>
                      <span className="badge badge-landslide">Emergency Declaration</span>
                      <h3 style={{ fontSize: '1.25rem', marginTop: '2px', color: 'var(--color-primary)' }}>
                        Add / Declare Disaster in Region
                      </h3>
                    </div>
                  </div>

                  <button className="btn btn-ghost" onClick={() => setIsAddDisasterModalOpen(false)} style={{ minHeight: '32px', width: '32px', padding: 0 }}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddDisasterSubmit}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Target Region / District *
                      </label>
                      <select
                        className="input-field"
                        value={disasterRegionId}
                        onChange={(e) => setDisasterRegionId(e.target.value)}
                        required
                      >
                        {districts.map(d => (
                          <option key={d.districtCode} value={d.districtCode}>
                            {d.districtCode} — {d.districtName} ({d.stateName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Disaster Incident Title *
                      </label>
                      <input
                        className="input-field"
                        placeholder="e.g. Chooralmala Landslide & Flash Inundation"
                        value={disasterTitle}
                        onChange={(e) => setDisasterTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Calamity / Disaster Type *
                        </label>
                        <select
                          className="input-field"
                          value={disasterType}
                          onChange={(e) => setDisasterType(e.target.value as RegionDisaster['disasterType'])}
                        >
                          <option value="Landslide">Landslide</option>
                          <option value="Flood">Flood</option>
                          <option value="Flash Flood">Flash Flood</option>
                          <option value="Cyclone">Cyclone</option>
                          <option value="Cloudburst">Cloudburst</option>
                          <option value="Earthquake">Earthquake</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Severity Classification *
                        </label>
                        <select
                          className="input-field"
                          value={disasterSeverity}
                          onChange={(e) => setDisasterSeverity(e.target.value as RegionDisaster['severity'])}
                        >
                          <option value="Extreme Tier-1">Extreme Tier-1 (SOS Critical)</option>
                          <option value="High Tier-2">High Tier-2 (Orange Alert)</option>
                          <option value="Moderate Tier-3">Moderate Tier-3 (Yellow Alert)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Affected Taluks / Panchayats / Corridors *
                      </label>
                      <input
                        className="input-field"
                        placeholder="e.g. Meppadi, Chooralmala, Mundakkai Sector 2"
                        value={disasterAffectedTaluks}
                        onChange={(e) => setDisasterAffectedTaluks(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Estimated Displaced Population
                        </label>
                        <input
                          type="number"
                          className="input-field font-mono"
                          value={disasterEstAffected}
                          onChange={(e) => setDisasterEstAffected(Number(e.target.value))}
                          min={0}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Active Relief Camps Opened
                        </label>
                        <input
                          type="number"
                          className="input-field font-mono"
                          value={disasterCampsCount}
                          onChange={(e) => setDisasterCampsCount(Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Initial Operational Status
                      </label>
                      <select
                        className="input-field"
                        value={disasterStatus}
                        onChange={(e) => setDisasterStatus(e.target.value as RegionDisaster['status'])}
                      >
                        <option value="Active Emergency">Active Emergency</option>
                        <option value="Relief & Rescue">Relief & Rescue</option>
                        <option value="Rehabilitation">Rehabilitation</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Emergency Directives / NDRF Deployment Notes
                      </label>
                      <textarea
                        className="input-field"
                        placeholder="e.g. NDRF Sector 4 mobilized. Drone geo-mapping underway. Highway 85 transit restricted."
                        rows={3}
                        value={disasterDirectives}
                        onChange={(e) => setDisasterDirectives(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setIsAddDisasterModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <span className="material-symbols-outlined">add_alert</span>
                      <span>Declare &amp; Log Disaster</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* EDIT DISASTER MODAL */}
          {editingDisaster && (
            <div className="modal-backdrop" onClick={() => setEditingDisaster(null)}>
              <div className="modal-dialog" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
                      edit_note
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-rls font-mono">{editingDisaster.id}</span>
                        <span className="badge" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
                          Edit Disaster Record
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginTop: '2px', color: 'var(--color-primary)' }}>
                        Update Disaster Details
                      </h3>
                    </div>
                  </div>

                  <button className="btn btn-ghost" onClick={() => setEditingDisaster(null)} style={{ minHeight: '32px', width: '32px', padding: 0 }}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveEditedDisaster}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Target Region / District *
                      </label>
                      <select
                        className="input-field"
                        value={editingDisaster.regionId}
                        onChange={(e) => setEditingDisaster({ ...editingDisaster, regionId: e.target.value })}
                        required
                      >
                        {districts.map(d => (
                          <option key={d.districtCode} value={d.districtCode}>
                            {d.districtCode} — {d.districtName} ({d.stateName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Disaster Incident Title *
                      </label>
                      <input
                        className="input-field"
                        placeholder="e.g. Chooralmala Landslide & Flash Inundation"
                        value={editingDisaster.title}
                        onChange={(e) => setEditingDisaster({ ...editingDisaster, title: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Calamity / Disaster Type *
                        </label>
                        <select
                          className="input-field"
                          value={editingDisaster.disasterType}
                          onChange={(e) => setEditingDisaster({ ...editingDisaster, disasterType: e.target.value as RegionDisaster['disasterType'] })}
                        >
                          <option value="Landslide">Landslide</option>
                          <option value="Flood">Flood</option>
                          <option value="Flash Flood">Flash Flood</option>
                          <option value="Cyclone">Cyclone</option>
                          <option value="Cloudburst">Cloudburst</option>
                          <option value="Earthquake">Earthquake</option>
                          <option value="Coastal Surge">Coastal Surge</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Severity Classification *
                        </label>
                        <select
                          className="input-field"
                          value={editingDisaster.severity}
                          onChange={(e) => setEditingDisaster({ ...editingDisaster, severity: e.target.value as RegionDisaster['severity'] })}
                        >
                          <option value="Extreme Tier-1">Extreme Tier-1 (SOS Critical)</option>
                          <option value="High Tier-2">High Tier-2 (Orange Alert)</option>
                          <option value="Moderate Tier-3">Moderate Tier-3 (Yellow Alert)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Affected Taluks / Panchayats / Corridors *
                      </label>
                      <input
                        className="input-field"
                        placeholder="e.g. Meppadi, Chooralmala, Mundakkai Sector 2"
                        value={editingDisaster.affectedTaluks}
                        onChange={(e) => setEditingDisaster({ ...editingDisaster, affectedTaluks: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Estimated Displaced Population
                        </label>
                        <input
                          type="number"
                          className="input-field font-mono"
                          value={editingDisaster.estimatedAffected}
                          onChange={(e) => setEditingDisaster({ ...editingDisaster, estimatedAffected: Number(e.target.value) })}
                          min={0}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Active Relief Camps Opened
                        </label>
                        <input
                          type="number"
                          className="input-field font-mono"
                          value={editingDisaster.reliefCampsCount}
                          onChange={(e) => setEditingDisaster({ ...editingDisaster, reliefCampsCount: Number(e.target.value) })}
                          min={0}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Operational Status
                      </label>
                      <select
                        className="input-field"
                        value={editingDisaster.status}
                        onChange={(e) => setEditingDisaster({ ...editingDisaster, status: e.target.value as RegionDisaster['status'] })}
                      >
                        <option value="Active Emergency">Active Emergency</option>
                        <option value="Relief & Rescue">Relief & Rescue</option>
                        <option value="Rehabilitation">Rehabilitation</option>
                        <option value="Recovery Phase">Recovery Phase</option>
                        <option value="Monitoring">Monitoring</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Emergency Directives / NDRF Deployment Notes
                      </label>
                      <textarea
                        className="input-field"
                        placeholder="e.g. NDRF Sector 4 mobilized. Drone geo-mapping underway. Highway 85 transit restricted."
                        rows={3}
                        value={editingDisaster.emergencyDirectives || ''}
                        onChange={(e) => setEditingDisaster({ ...editingDisaster, emergencyDirectives: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setEditingDisaster(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <span className="material-symbols-outlined">save</span>
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
