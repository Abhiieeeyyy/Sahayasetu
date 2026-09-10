/**
 * ============================================================================
 * SAHAYASETU REGIONAL DISASTERS SERVICE
 * ============================================================================
 * 
 * Purpose:
 * Central coordination of declared regional disasters uploaded and managed
 * by Statewide Super Admin. Synchronized across registration forms, telemetry,
 * and district response coordinators.
 */

import { RegionDisaster } from '../types';
export type { RegionDisaster };

export const DISASTERS_STORAGE_KEY = 'sahayasetu_regional_disasters_v2';

export const INITIAL_REGIONAL_DISASTERS: RegionDisaster[] = [
  {
    id: 'DIS-KL-WYD-01',
    regionId: 'KL-WYD-2024',
    regionName: 'Wayanad Hills (Meppadi / Chooralmala)',
    title: 'Chooralmala & Meppadi Massive Landslide',
    disasterType: 'Landslide',
    severity: 'Extreme Tier-1',
    declaredDate: '30 Jul 2026',
    affectedTaluks: 'Vythiri, Meppadi, Chooralmala, Mundakkai Sector 2',
    estimatedAffected: 4120,
    reliefCampsCount: 24,
    status: 'Active Emergency',
    emergencyDirectives: 'NDRF 4th Battalion mobilized. Bailey bridge transport corridor operational.'
  },
  {
    id: 'DIS-KL-KKD-02',
    regionId: 'KL-KKD-2024',
    regionName: 'Kozhikode Coastal Catchment',
    title: 'Chaliyar River Basin Deluge & Coastal Surge',
    disasterType: 'Flash Flood',
    severity: 'High Tier-2',
    declaredDate: '02 Aug 2026',
    affectedTaluks: 'Beypore, Feroke, Kadalundi, Mavoor',
    estimatedAffected: 2450,
    reliefCampsCount: 16,
    status: 'Relief & Rescue',
    emergencyDirectives: 'Kerala Fire & Rescue teams deployed with motor inflatable rescue boats.'
  },
  {
    id: 'DIS-KL-IDK-03',
    regionId: 'KL-IDK-2024',
    regionName: 'Idukki High Range Catchment',
    title: 'Devikulam & Munnar Hill Range Mudslides',
    disasterType: 'Landslide',
    severity: 'High Tier-2',
    declaredDate: '05 Aug 2026',
    affectedTaluks: 'Devikulam, Munnar, Peerumade, Udumbanchola',
    estimatedAffected: 1890,
    reliefCampsCount: 19,
    status: 'Rehabilitation',
    emergencyDirectives: 'PWD heavy excavator clearing National Highway 85.'
  },
  {
    id: 'DIS-KL-ALP-04',
    regionId: 'KL-ALP-2024',
    regionName: 'Alappuzha Coastal Kuttanad',
    title: 'Kuttanad Polder Breach & Deep Waterlogging',
    disasterType: 'Flood',
    severity: 'Extreme Tier-1',
    declaredDate: '01 Aug 2026',
    affectedTaluks: 'Kuttanad, Champakulam, Nedumudi, Edathua',
    estimatedAffected: 6200,
    reliefCampsCount: 32,
    status: 'Active Emergency',
    emergencyDirectives: 'Mobile medical boats operating across canals.'
  },
  {
    id: 'DIS-KL-EKM-05',
    regionId: 'KL-EKM-2024',
    regionName: 'Ernakulam Periyar Basin',
    title: 'Periyar River Overflow & Urban Lowland Inundation',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '03 Aug 2026',
    affectedTaluks: 'Aluva, Eloor, North Paravur, Kalamassery',
    estimatedAffected: 2100,
    reliefCampsCount: 14,
    status: 'Monitoring',
    emergencyDirectives: 'Barrage gate telemetry synchronized with naval water wing.'
  },
  {
    id: 'DIS-KL-TCR-06',
    regionId: 'KL-TCR-2024',
    regionName: 'Thrissur Kole Wetlands',
    title: 'Chalakudy River Catchment Surge & Kole Wetland Breach',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '04 Aug 2026',
    affectedTaluks: 'Chalakudy, Mala, Kodungallur, Peringalkuthu',
    estimatedAffected: 2800,
    reliefCampsCount: 18,
    status: 'Recovery Phase',
    emergencyDirectives: 'Pumping stations activated along kole wetland bunds.'
  },
  {
    id: 'DIS-KL-PLK-07',
    regionId: 'KL-PLK-2024',
    regionName: 'Palakkad Attappadi Hills',
    title: 'Attappadi Valley Hill Torrents & Bhavani River Flooding',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '06 Aug 2026',
    affectedTaluks: 'Attappadi, Agali, Sholayur, Mannarkkad',
    estimatedAffected: 1350,
    reliefCampsCount: 11,
    status: 'Recovery Phase',
    emergencyDirectives: 'Tribal relief coordinators dispensing emergency ration provisions.'
  },
  {
    id: 'DIS-KL-MPM-08',
    regionId: 'KL-MPM-2024',
    regionName: 'Malappuram Nilambur Basin',
    title: 'Nilambur Forest Foothill Deluge & Chaliyar Surge',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '02 Aug 2026',
    affectedTaluks: 'Nilambur, Mampad, Edavanna, Vazhakkad',
    estimatedAffected: 3400,
    reliefCampsCount: 21,
    status: 'Active Emergency',
    emergencyDirectives: 'Forest brigade conducting rescue along swollen jungle tributaries.'
  },
  {
    id: 'DIS-KL-KNR-09',
    regionId: 'KL-KNR-2024',
    regionName: 'Kannur Iritty Slopes',
    title: 'Iritty Mountain Stream Flash Flood & Mudslides',
    disasterType: 'Landslide',
    severity: 'Moderate Tier-3',
    declaredDate: '07 Aug 2026',
    affectedTaluks: 'Iritty, Sreekandapuram, Kelakam, Peravoor',
    estimatedAffected: 980,
    reliefCampsCount: 9,
    status: 'Monitoring',
    emergencyDirectives: 'Ghat road rock clearing units deployed on round-the-clock patrol.'
  },
  {
    id: 'DIS-KL-KSD-10',
    regionId: 'KL-KSD-2024',
    regionName: 'Kasaragod Chandragiri Basin',
    title: 'Chandragiri Basin Monsoon Surge & Soil Piping Erosion',
    disasterType: 'Flood',
    severity: 'Moderate Tier-3',
    declaredDate: '08 Aug 2026',
    affectedTaluks: 'Bekal Catchment, Vellarikundu, Hosdurg, Manjeshwar',
    estimatedAffected: 790,
    reliefCampsCount: 8,
    status: 'Monitoring',
    emergencyDirectives: 'Soil piping monitoring sensors checked by geological survey.'
  },
  {
    id: 'DIS-KL-KTM-11',
    regionId: 'KL-KTM-2024',
    regionName: 'Kottayam Meenachil Basin',
    title: 'Meenachil River Submersion & Pala Lowland Floods',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '04 Aug 2026',
    affectedTaluks: 'Pala, Erattupetta, Kumarakom, Vaikom',
    estimatedAffected: 2150,
    reliefCampsCount: 15,
    status: 'Recovery Phase',
    emergencyDirectives: 'Canal desiltation teams dredging silt near Kumarakom.'
  },
  {
    id: 'DIS-KL-PTA-12',
    regionId: 'KL-PTA-2024',
    regionName: 'Pathanamthitta Pampa Basin',
    title: 'Pampa & Achankovil River Overflow Flash Flooding',
    disasterType: 'Flood',
    severity: 'High Tier-2',
    declaredDate: '03 Aug 2026',
    affectedTaluks: 'Ranni, Kozhencherry, Pandalam, Mallappally',
    estimatedAffected: 2600,
    reliefCampsCount: 17,
    status: 'Recovery Phase',
    emergencyDirectives: 'Sabarimala transit routes cleared and culverts fortified.'
  },
  {
    id: 'DIS-KL-KLM-13',
    regionId: 'KL-KLM-2024',
    regionName: 'Kollam Ashtamudi Basin',
    title: 'Ashtamudi Estuary Overflow & Coastal Sea Surge',
    disasterType: 'Coastal Surge',
    severity: 'Moderate Tier-3',
    declaredDate: '06 Aug 2026',
    affectedTaluks: 'Mundakkal, Karunagappally, Paravur, Sasthamcotta',
    estimatedAffected: 1120,
    reliefCampsCount: 10,
    status: 'Monitoring',
    emergencyDirectives: 'Coastal seawall geo-tubes deployed along erosive beachfront.'
  },
  {
    id: 'DIS-KL-TVM-14',
    regionId: 'KL-TVM-2024',
    regionName: 'Thiruvananthapuram Coast',
    title: 'Vamanapuram River Breach & Coastal Erosion Surge',
    disasterType: 'Coastal Surge',
    severity: 'Moderate Tier-3',
    declaredDate: '05 Aug 2026',
    affectedTaluks: 'Valiathura, Vizhinjam, Nedumangad, Attingal',
    estimatedAffected: 1430,
    reliefCampsCount: 12,
    status: 'Monitoring',
    emergencyDirectives: 'Fishing harbor relief cell providing safety moorings for vessels.'
  }
];

/**
 * Loads all declared disasters from persistent storage or returns default seed.
 * Automatically upgrades stored disasters if fewer than 14 districts are found.
 */
export const getStoredDisasters = (): RegionDisaster[] => {
  if (typeof window === 'undefined') return INITIAL_REGIONAL_DISASTERS;
  try {
    const raw = localStorage.getItem(DISASTERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISASTERS_STORAGE_KEY, JSON.stringify(INITIAL_REGIONAL_DISASTERS));
      return INITIAL_REGIONAL_DISASTERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 14) {
      return parsed;
    }
    localStorage.setItem(DISASTERS_STORAGE_KEY, JSON.stringify(INITIAL_REGIONAL_DISASTERS));
    return INITIAL_REGIONAL_DISASTERS;
  } catch {
    return INITIAL_REGIONAL_DISASTERS;
  }
};

/**
 * Saves declared disasters to persistent storage and dispatches sync event.
 */
export const saveStoredDisasters = (disasters: RegionDisaster[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISASTERS_STORAGE_KEY, JSON.stringify(disasters));
    window.dispatchEvent(new Event('sahayasetu_disasters_updated'));
  } catch (err) {
    console.warn('Failed to save disasters to localStorage', err);
  }
};
