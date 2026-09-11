/**
 * ============================================================================
 * SAHAYASETU REGIONAL JURISDICTION UTILITY
 * ============================================================================
 * 
 * Enforces strict district/regional jurisdiction isolation for humanitarian
 * reconstruction worksites. Displaced citizens are strictly limited to
 * worksites within their home district. Cross-regional assignments are
 * strictly blocked.
 */

export const KERALA_DISTRICT_MAP: Record<string, { code: string; name: string; alias: string[] }> = {
  'KL-WYD-2024': { code: 'KL-WYD-2024', name: 'Wayanad', alias: ['wayanad', 'wyd', 'meppadi', 'chooralmala', 'mundakkai'] },
  'KL-IDK-2024': { code: 'KL-IDK-2024', name: 'Idukki', alias: ['idukki', 'idk', 'peerumade', 'munnar'] },
  'KL-KKD-2024': { code: 'KL-KKD-2024', name: 'Kozhikode', alias: ['kozhikode', 'kkd', 'calicut', 'chaliyar'] },
  'KL-ALP-2024': { code: 'KL-ALP-2024', name: 'Alappuzha', alias: ['alappuzha', 'alp', 'alleppey', 'kuttanad'] },
  'KL-EKM-2024': { code: 'KL-EKM-2024', name: 'Ernakulam', alias: ['ernakulam', 'ekm', 'kochi', 'cochin'] },
  'KL-PLK-2024': { code: 'KL-PLK-2024', name: 'Palakkad', alias: ['palakkad', 'plk', 'palghat'] },
  'KL-TCR-2024': { code: 'KL-TCR-2024', name: 'Thrissur', alias: ['thrissur', 'tcr', 'trichur'] },
  'KL-MPM-2024': { code: 'KL-MPM-2024', name: 'Malappuram', alias: ['malappuram', 'mpm', 'nilambur'] },
  'KL-KNR-2024': { code: 'KL-KNR-2024', name: 'Kannur', alias: ['kannur', 'knr', 'cannanore'] },
  'KL-KTM-2024': { code: 'KL-KTM-2024', name: 'Kottayam', alias: ['kottayam', 'ktm'] },
  'KL-KLM-2024': { code: 'KL-KLM-2024', name: 'Kollam', alias: ['kollam', 'klm', 'quilon'] },
  'KL-TVM-2024': { code: 'KL-TVM-2024', name: 'Thiruvananthapuram', alias: ['thiruvananthapuram', 'tvm', 'trivandrum'] },
  'KL-PTA-2024': { code: 'KL-PTA-2024', name: 'Pathanamthitta', alias: ['pathanamthitta', 'pta'] },
  'KL-KSD-2024': { code: 'KL-KSD-2024', name: 'Kasaragod', alias: ['kasaragod', 'ksd'] }
};

/**
 * Normalizes any district code, district name, or text string to canonical district code (e.g. 'KL-WYD-2024').
 */
export const normalizeDistrictCode = (raw?: string | null): string => {
  if (!raw) return '';
  const text = raw.trim();

  // 1. Direct match on standard code
  if (KERALA_DISTRICT_MAP[text]) {
    return text;
  }

  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 2. Search aliases and names
  for (const [code, info] of Object.entries(KERALA_DISTRICT_MAP)) {
    if (info.name.toLowerCase() === text.toLowerCase()) {
      return code;
    }
    const cleanName = info.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.includes(cleanName) || cleanName.includes(clean)) {
      return code;
    }
    for (const alias of info.alias) {
      if (clean === alias || clean.includes(alias)) {
        return code;
      }
    }
  }

  // 3. Fallback to extracting 3-letter abbreviation from KL-XXX-2024 format
  const match = text.match(/KL-([A-Z]{3})-\d{4}/i);
  if (match) {
    const code = `KL-${match[1].toUpperCase()}-2024`;
    if (KERALA_DISTRICT_MAP[code]) {
      return code;
    }
  }

  return text;
};

/**
 * Gets user-friendly district display name (e.g. "Wayanad").
 */
export const getDistrictDisplayName = (codeOrName?: string | null): string => {
  if (!codeOrName) return 'Local District';
  const norm = normalizeDistrictCode(codeOrName);
  if (KERALA_DISTRICT_MAP[norm]) {
    return KERALA_DISTRICT_MAP[norm].name;
  }
  return codeOrName;
};

/**
 * Strictly verifies whether a citizen and an emergency reconstruction requisition
 * share the exact same regional jurisdiction.
 * 
 * Returns true ONLY if both reside within the same district boundary.
 * Returns false if there is any mismatch or cross-regional boundary conflict.
 */
export const isSameJurisdiction = (
  beneficiary: { districtId?: string; district?: string; campId?: string } | null | undefined,
  requisition: { districtId?: string; districtName?: string; sectorLocation?: string; worksite?: string } | null | undefined
): boolean => {
  if (!beneficiary || !requisition) return false;

  // Resolve beneficiary district code
  const benCode = normalizeDistrictCode(beneficiary.districtId || beneficiary.district);
  
  // Resolve requisition district code
  const reqCode = normalizeDistrictCode(requisition.districtId || requisition.districtName || requisition.sectorLocation);

  // Both must be identifiable
  if (!benCode || !reqCode) {
    // If either lacks explicit code, perform fallback check on string tokens
    const bName = (beneficiary.district || '').toLowerCase().trim();
    const rName = (requisition.districtName || requisition.sectorLocation || '').toLowerCase().trim();
    if (bName && rName && (bName.includes(rName) || rName.includes(bName))) {
      return true;
    }
    return false;
  }

  return benCode === reqCode;
};
