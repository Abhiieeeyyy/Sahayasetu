/**
 * ============================================================================
 * SAHAYASETU CITIZEN REGISTRATION VIEW (ESSENTIAL DETAILS & JOB PRIORITIES)
 * ============================================================================
 * 
 * Features:
 * 1. Streamlined to essential details needed for relief allocation & employment.
 * 2. Kerala Districts dropdown (14 districts).
 * 3. 1st, 2nd, and 3rd Priority ranking for available vocational trades.
 * 4. Relationship selector (Self, Spouse, Parent, Child, Dependent) enabling single users
 *    to register multiple family members.
 * 5. Uses session-wide language preference from LanguageContext.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Beneficiary, VocationalSkill, CalamityType, RegistrationLanguage } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getStoredDisasters, RegionDisaster } from '../services/disasterService';

interface UserRegistrationViewProps {
  existingBeneficiary?: Beneficiary | null;
  onRegisterCitizen: (beneficiary: Beneficiary) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateToPortal: () => void;
}

const ALL_SKILLS: VocationalSkill[] = [
  'Masonry',
  'Carpentry',
  'Electrical',
  'Plumbing',
  'Heavy Machinery',
  'General Civil Labor',
  'Steel Fixing',
  'Roofing'
];

export const KERALA_DISTRICTS = [
  'Wayanad',
  'Idukki',
  'Kozhikode',
  'Alappuzha',
  'Ernakulam',
  'Palakkad',
  'Thrissur',
  'Malappuram',
  'Kannur',
  'Kottayam',
  'Kollam',
  'Thiruvananthapuram',
  'Pathanamthitta',
  'Kasaragod'
];

export const KERALA_DISTRICT_CODES: Record<string, string> = {
  'Wayanad': 'KL-WYD-2024',
  'Idukki': 'KL-IDK-2024',
  'Kozhikode': 'KL-KKD-2024',
  'Alappuzha': 'KL-ALP-2024',
  'Ernakulam': 'KL-EKM-2024',
  'Palakkad': 'KL-PLK-2024',
  'Thrissur': 'KL-TCR-2024',
  'Malappuram': 'KL-MPM-2024',
  'Kannur': 'KL-KNR-2024',
  'Kottayam': 'KL-KTM-2024',
  'Kollam': 'KL-KLM-2024',
  'Thiruvananthapuram': 'KL-TVM-2024',
  'Pathanamthitta': 'KL-PTA-2024',
  'Kasaragod': 'KL-KSD-2024'
};

const TRANSLATIONS: Record<RegistrationLanguage, {
  languageLabel: string;
  title: string;
  subtitle: string;
  googleVerifiedBadge: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  stateLabel: string;
  districtLabel: string;
  campLabel: string;
  campPlaceholder: string;
  calamityLabel: string;
  jobPriorityHeader: string;
  jobPrioritySubtitle: string;
  priority1Label: string;
  priority2Label: string;
  priority3Label: string;
  skills: Record<VocationalSkill, string>;
  experienceLabel: string;
  wageLabel: string;
  bankDetailsHeader: string;
  bankAccountPlaceholder: string;
  bankIfscPlaceholder: string;
  emergencyContactLabel: string;
  emergencyContactPlaceholder: string;
  submitBtn: string;
  alreadyRegistered: string;
  trackLink: string;
}> = {
  EN: {
    languageLabel: 'Language / ഭാഷ:',
    title: 'Disaster Relief & Vocational Rehabilitation Form',
    subtitle: 'Provide your household and vocational details for relief entitlements, shelter allocation, and priority job assignments.',
    googleVerifiedBadge: 'Google Account Verified',
    nameLabel: 'Full Legal Name (as on Aadhaar) *',
    namePlaceholder: 'e.g., Sasi Kumar K.',
    phoneLabel: 'Mobile Phone Number (+91) *',
    phonePlaceholder: '98470 12345',
    aadhaarLabel: 'Aadhaar Number (12 Digits) *',
    aadhaarPlaceholder: '4589 1234 8821',
    stateLabel: 'State *',
    districtLabel: 'District *',
    campLabel: 'Relief Camp / Current Address *',
    campPlaceholder: 'Enter relief camp name, shelter sector, or current address',
    calamityLabel: 'Calamity Impact (Declared Disaster) *',
    jobPriorityHeader: 'Vocational Job Preferences & Priorities *',
    jobPrioritySubtitle: 'Rank your preferred jobs. Rehabilitation contractors will prioritize dispatching you to your highest ranked choice.',
    priority1Label: '1st Priority (Primary Job Choice) *',
    priority2Label: '2nd Priority (Secondary Choice) *',
    priority3Label: '3rd Priority (Alternative Choice) *',
    skills: {
      Masonry: 'Masonry & Stone Shoring',
      Carpentry: 'Carpentry & Framing',
      Electrical: 'Electrical Grid Works',
      Plumbing: 'Plumbing & Drainage',
      'Heavy Machinery': 'Heavy Machinery (JCB/Crane)',
      'General Civil Labor': 'General Civil Reconstruction',
      'Steel Fixing': 'Steel Fixing & Bar Bending',
      Roofing: 'Roofing & Truss Work'
    },
    experienceLabel: 'Years of Craft Experience:',
    wageLabel: 'Guaranteed Daily Wage: ₹850 / day + ₹150 Relief Allowance',
    bankDetailsHeader: 'Bank Account for Direct Benefit Transfer (DBT)',
    bankAccountPlaceholder: 'Bank Account Number',
    bankIfscPlaceholder: 'IFSC Code (e.g. SBIN0004210)',
    emergencyContactLabel: 'Emergency Contact Person & Phone *',
    emergencyContactPlaceholder: 'e.g., Sunitha (Spouse) - 98471 99002',
    submitBtn: 'Submit Application & Track Status',
    alreadyRegistered: 'Already submitted an application?',
    trackLink: 'Track Application'
  },
  ML: {
    languageLabel: 'ഭാഷ / Language:',
    title: 'ദുരിതാശ്വാസ & പുനരധിവാസ അപേക്ഷാ ഫോറം',
    subtitle: 'ദുരിതാശ്വാസ സഹായം, അഭയകേന്ദ്രം, മുൻഗണനാ തൊഴിൽ എന്നിവ ലഭിക്കുന്നതിന് വിവരങ്ങൾ നൽകുക.',
    googleVerifiedBadge: 'ഗൂഗിൾ അക്കൗണ്ട് സ്ഥിരീകരിച്ചു',
    nameLabel: 'പൂർണ്ണ പേര് (ആധാർ പ്രകാരം) *',
    namePlaceholder: 'ഉദാ: ശശികുമാർ കെ.',
    phoneLabel: 'മൊബൈൽ ഫോൺ നമ്പർ (+91) *',
    phonePlaceholder: '98470 12345',
    aadhaarLabel: 'ആധാർ നമ്പർ (12 അക്കങ്ങൾ) *',
    aadhaarPlaceholder: '4589 1234 8821',
    stateLabel: 'സംസ്ഥാനം *',
    districtLabel: 'ജില്ല *',
    campLabel: 'ക്യാമ്പ് / നിലവിലെ വിലാസം *',
    campPlaceholder: 'ക്യാമ്പ് പേര് അല്ലെങ്കിൽ നിലവിലെ വിലാസം നൽകുക',
    calamityLabel: 'ദുരന്ത ആഘാതം (പ്രഖ്യാപിച്ച ദുരന്തം) *',
    jobPriorityHeader: 'തൊഴിൽ മുൻഗണനകൾ *',
    jobPrioritySubtitle: 'നിങ്ങൾക്ക് ചെയ്യാൻ താല്പര്യമുള്ള തൊഴിലുകൾ മുൻഗണനാ ക്രമത്തിൽ തിരഞ്ഞെടുക്കുക.',
    priority1Label: 'ഒന്നാം മുൻഗണന (പ്രധാന തൊഴിൽ) *',
    priority2Label: 'രണ്ടാം മുൻഗണന (രണ്ടാമത്തെ ചോയ്‌സ്) *',
    priority3Label: 'മൂന്നാം മുൻഗണന (മറ്റൊരു ചോയ്‌സ്) *',
    skills: {
      Masonry: 'കൊത്തുപണി (മേസൻ)',
      Carpentry: 'മരപ്പണി (കാർപെന്റർ)',
      Electrical: 'ഇലക്ട്രിക്കൽ വയറിംഗ്',
      Plumbing: 'പ്ലംബിംഗ് ജോലികൾ',
      'Heavy Machinery': 'കനത്ത യന്ത്രങ്ങൾ (JCB/ക്രെയിൻ)',
      'General Civil Labor': 'നിർമ്മാണ തൊഴിലാളി',
      'Steel Fixing': 'കമ്പികെട്ട് (ബാർ ബെൻഡിംഗ്)',
      Roofing: 'മേൽക്കൂര നിർമ്മാണം'
    },
    experienceLabel: 'തൊഴിൽ പരിചയം (വർഷങ്ങൾ):',
    wageLabel: 'ഉറപ്പുള്ള പ്രതിദിന വേതനം: ₹850 / ദിവസം + ₹150 ദുരിതാശ്വാസ ബത്ത',
    bankDetailsHeader: 'വേതനം ലഭിക്കാനുള്ള ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ (DBT)',
    bankAccountPlaceholder: 'ബാങ്ക് അക്കൗണ്ട് നമ്പർ',
    bankIfscPlaceholder: 'IFSC കോഡ്',
    emergencyContactLabel: 'അടിയന്തര ഘട്ടത്തിൽ ബന്ധപ്പെടേണ്ട നമ്പർ *',
    emergencyContactPlaceholder: 'ഉദാ: സുനിത (ഭാര്യ) - 98471 99002',
    submitBtn: 'അപേക്ഷ സമർപ്പിക്കുക & ട്രാക്ക് ചെയ്യുക',
    alreadyRegistered: 'നേരത്തെ അപേക്ഷ നൽകിയിട്ടുണ്ടോ?',
    trackLink: 'അപേക്ഷ ട്രാക്ക് ചെയ്യുക'
  }
};

export const UserRegistrationView: React.FC<UserRegistrationViewProps> = ({
  existingBeneficiary,
  onRegisterCitizen,
  onShowToast,
  onNavigateToPortal
}) => {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = TRANSLATIONS[language];

  const [isEditing, setIsEditing] = useState(false);

  // Essential Form States
  const [legalName, setLegalName] = useState(() => existingBeneficiary?.name || '');
  const [phone, setPhone] = useState(() => existingBeneficiary?.phone || '');
  const [aadhaarNumber, setAadhaarNumber] = useState(() => existingBeneficiary?.aadhaarRaw || existingBeneficiary?.aadhaarMasked || '');
  
  // State & District (Kerala only)
  const selectedState = 'Kerala';
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => existingBeneficiary?.district || 'Wayanad');

  // Camp name
  const [campName, setCampName] = useState(() => existingBeneficiary?.campId || '');

  // Disasters uploaded and declared by Super Admin
  const [disastersList, setDisastersList] = useState<RegionDisaster[]>(getStoredDisasters);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(() => {
    const initial = getStoredDisasters();
    if (existingBeneficiary?.calamityTitle) {
      const match = initial.find(d => existingBeneficiary.calamityTitle?.includes(d.title));
      if (match) return match.id;
    }
    return initial[0]?.id || 'OTHER';
  });

  // Keep disasters in sync when Super Admin declares new disasters
  useEffect(() => {
    const syncDisasters = () => {
      const updated = getStoredDisasters();
      setDisastersList(updated);
    };
    window.addEventListener('sahayasetu_disasters_updated', syncDisasters);
    return () => window.removeEventListener('sahayasetu_disasters_updated', syncDisasters);
  }, []);

  // When selected district changes, auto-select the disaster matching that district if available
  useEffect(() => {
    const matched = disastersList.find(d => 
      d.regionName.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
      d.regionId.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
      d.affectedTaluks.toLowerCase().includes(selectedDistrict.toLowerCase())
    );
    if (matched) {
      setSelectedDisasterId(matched.id);
    }
  }, [selectedDistrict, disastersList]);

  // Job Priorities
  const [priority1, setPriority1] = useState<VocationalSkill>(() => 
    (existingBeneficiary?.jobPriorities?.[0] || existingBeneficiary?.skills?.[0] || 'Masonry') as VocationalSkill
  );
  const [priority2, setPriority2] = useState<VocationalSkill>(() => 
    (existingBeneficiary?.jobPriorities?.[1] || existingBeneficiary?.skills?.[1] || 'Carpentry') as VocationalSkill
  );
  const [priority3, setPriority3] = useState<VocationalSkill>(() => 
    (existingBeneficiary?.jobPriorities?.[2] || existingBeneficiary?.skills?.[2] || 'General Civil Labor') as VocationalSkill
  );
  const [experienceYears, setExperienceYears] = useState<number>(() => existingBeneficiary?.experienceYears ?? 5);

  // Bank & Emergency Contact
  const [bankAccount, setBankAccount] = useState(() => existingBeneficiary?.bankAccount || '');
  const [bankIfsc, setBankIfsc] = useState(() => existingBeneficiary?.bankIfsc || '');
  const [emergencyContact, setEmergencyContact] = useState(() => existingBeneficiary?.emergencyContact || '');

  // Custom / Unlisted Skills State
  const [customSkills, setCustomSkills] = useState<string[]>(() => {
    if (existingBeneficiary?.skills) {
      return (existingBeneficiary.skills as string[]).filter(s => !ALL_SKILLS.includes(s as any));
    }
    return [];
  });
  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (customSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSkillInput('');
      return;
    }
    setCustomSkills(prev => [...prev, trimmed]);
    setCustomSkillInput('');
  };

  const handleRemoveCustomSkill = (index: number) => {
    setCustomSkills(prev => prev.filter((_, i) => i !== index));
  };

  // Synchronize form with existingBeneficiary when it changes or when user logs in
  useEffect(() => {
    if (existingBeneficiary) {
      setLegalName(existingBeneficiary.name);
      setPhone(existingBeneficiary.phone);
      setAadhaarNumber(existingBeneficiary.aadhaarRaw || existingBeneficiary.aadhaarMasked || '');
      setSelectedDistrict(existingBeneficiary.district || 'Wayanad');
      setCampName(existingBeneficiary.campId || '');
      if (existingBeneficiary.jobPriorities?.[0]) setPriority1(existingBeneficiary.jobPriorities[0] as VocationalSkill);
      if (existingBeneficiary.jobPriorities?.[1]) setPriority2(existingBeneficiary.jobPriorities[1] as VocationalSkill);
      if (existingBeneficiary.jobPriorities?.[2]) setPriority3(existingBeneficiary.jobPriorities[2] as VocationalSkill);
      if (existingBeneficiary.skills) {
        const custom = (existingBeneficiary.skills as string[]).filter(s => !ALL_SKILLS.includes(s as any));
        setCustomSkills(custom);
      }
      if (existingBeneficiary.experienceYears !== undefined) setExperienceYears(existingBeneficiary.experienceYears);
      setBankAccount(existingBeneficiary.bankAccount || '');
      setBankIfsc(existingBeneficiary.bankIfsc || '');
      setEmergencyContact(existingBeneficiary.emergencyContact || '');
    } else if (user && !legalName) {
      setLegalName(user.fullName || '');
    }
  }, [existingBeneficiary, user]);

  // If user already has an application and is NOT in editing mode, show summary card with Edit option
  if (existingBeneficiary && !isEditing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl) var(--space-md)',
        minHeight: '65vh'
      }}>
        <div className="card" style={{
          maxWidth: '600px',
          width: '100%',
          padding: 'var(--space-2xl) var(--space-xl)',
          textAlign: 'center',
          border: '2px solid var(--color-outline-variant)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            border: '2px solid #a7f3d0'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>check_circle</span>
          </div>

          <span className="badge badge-verified" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {language === 'ML' ? 'അപേക്ഷ രജിസ്റ്റർ ചെയ്തു കഴിഞ്ഞു' : 'Application Active'}
          </span>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '10px', fontWeight: 800 }}>
            {language === 'ML' ? 'താങ്കളുടെ ദുരിതാശ്വാസ അപേക്ഷ' : 'Your Relief & Job Application'}
          </h2>

          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', marginTop: '6px', lineHeight: 1.5 }}>
            {language === 'ML' ? (
              <>ലോഗിൻ ചെയ്തിരിക്കുന്ന അക്കൗണ്ട്: <strong>{user?.email}</strong>. നിങ്ങൾക്ക് സമർപ്പിച്ച വിവരങ്ങൾ തിരുത്താനും പുതുക്കാനും സാധിക്കും.</>
            ) : (
              <>Signed in as <strong>{user?.email}</strong>. You can review your submitted details, edit any information, or track your live status.</>
            )}
          </p>

          {/* Dossier Snapshot */}
          <div style={{
            margin: '20px 0',
            padding: '16px',
            backgroundColor: 'var(--color-surface-low)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-on-surface)' }}>
                  {existingBeneficiary.name}
                </span>
                <span className="badge badge-verified" style={{ marginLeft: '8px', fontSize: '11px' }}>
                  Self
                </span>
              </div>
              <span className="badge badge-rls font-mono" style={{ fontWeight: 800 }}>
                APP-{existingBeneficiary.id}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>District:</strong> {existingBeneficiary.district || 'Kerala'} • <strong>Relief Camp / Address:</strong> {existingBeneficiary.campId}</div>
              <div><strong>Contact Mobile:</strong> +91 {existingBeneficiary.phone}</div>
              <div><strong>Vocational Priorities:</strong> {existingBeneficiary.skills.join(', ')} ({existingBeneficiary.experienceYears}y exp)</div>
              <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid var(--color-outline-variant)' }}>
                <strong>Status:</strong>{' '}
                <span style={{ color: existingBeneficiary.placementStatus === 'Assigned' ? '#059669' : 'var(--color-secondary)', fontWeight: 800 }}>
                  {existingBeneficiary.placementStatus === 'Assigned' ? '✓ Job Assigned by Regional Admin' : '• Under Review & Job Matching'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-touch"
              style={{ flex: 1, minWidth: '180px', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}
            >
              <span className="material-symbols-outlined">edit_document</span>
              <span>{language === 'ML' ? 'അപേക്ഷ തിരുത്തുക' : 'Edit Application'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToPortal}
              className="btn btn-secondary btn-touch"
              style={{ flex: 1, minWidth: '180px', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}
            >
              <span className="material-symbols-outlined">track_changes</span>
              <span>{language === 'ML' ? 'അപേക്ഷാ സ്ഥിതി ട്രാക്ക് ചെയ്യുക' : 'Track Status'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onShowToast('Authentication Required', 'Please sign in with Google or Test User.', 'warning');
      return;
    }

    if (!legalName.trim()) {
      onShowToast('Name Required', 'Please provide full legal name.', 'warning');
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      onShowToast('Mobile Required', 'Please provide a valid 10-digit phone number.', 'warning');
      return;
    }

    const chosenDisaster = disastersList.find(d => d.id === selectedDisasterId);
    const calamityType = chosenDisaster?.disasterType || 'Landslide';
    const calamityTitle = chosenDisaster ? `${chosenDisaster.regionName}: ${chosenDisaster.title}` : 'Kerala Flood/Landslide Relief';

    const combinedSkills = Array.from(new Set([priority1, priority2, priority3, ...customSkills])) as any;
    const combinedPriorities = Array.from(new Set([priority1, priority2, priority3, ...customSkills]));

    if (existingBeneficiary) {
      // UPDATE EXISTING BENEFICIARY APPLICATION
      const updatedBeneficiary: Beneficiary = {
        ...existingBeneficiary,
        name: legalName.trim(),
        phone: phone.trim(),
        aadhaarMasked: aadhaarNumber.length >= 4 
          ? `•••• •••• ${aadhaarNumber.replace(/\s+/g, '').slice(-4)}` 
          : existingBeneficiary.aadhaarMasked,
        aadhaarRaw: aadhaarNumber.trim(),
        district: selectedDistrict,
        districtId: KERALA_DISTRICT_CODES[selectedDistrict] || existingBeneficiary.districtId,
        campId: campName.trim() || existingBeneficiary.campId,
        calamity: calamityType,
        calamityTitle: calamityTitle,
        skills: combinedSkills,
        jobPriorities: combinedPriorities,
        experienceYears,
        emergencyContact: emergencyContact.trim() || existingBeneficiary.emergencyContact,
        bankAccount: bankAccount.trim() || existingBeneficiary.bankAccount,
        bankIfsc: bankIfsc.trim() || existingBeneficiary.bankIfsc
      };

      onRegisterCitizen(updatedBeneficiary);

      const message = language === 'ML'
        ? `${updatedBeneficiary.name} ൻ്റെ അപേക്ഷ വിജയകരമായി പുതുക്കി.`
        : `Application details for ${updatedBeneficiary.name} have been updated.`;

      onShowToast('Application Updated', message, 'success');
      setIsEditing(false);
      onNavigateToPortal();
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: `BEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: legalName.trim(),
      phone: phone.trim(),
      aadhaarMasked: aadhaarNumber.length >= 4 
        ? `•••• •••• ${aadhaarNumber.replace(/\s+/g, '').slice(-4)}` 
        : `•••• •••• ${phone.slice(-4)}`,
      state: 'Kerala',
      district: selectedDistrict,
      districtId: KERALA_DISTRICT_CODES[selectedDistrict] || 'KL-WYD-2024',
      campId: campName.trim() || `${selectedDistrict} Relief Shelter`,
      calamity: calamityType,
      calamityTitle: calamityTitle,
      skills: combinedSkills,
      jobPriorities: combinedPriorities,
      relationshipToAccount: 'Self',
      experienceYears,
      livingStatus: 'Relief Camp',
      dailyWageTier: 850,
      isMedicalFit: true,
      isBioVerified: true,
      placementStatus: 'Available',
      registeredDate: 'Today',
      aadhaarRaw: aadhaarNumber.trim(),
      dependentsCount: 0,
      emergencyContact: emergencyContact.trim() || undefined,
      bankAccount: bankAccount.trim() || undefined,
      bankIfsc: bankIfsc.trim() || undefined,
      dbtLinked: true,
      authUserId: user?.id,
      authEmail: user?.email,
      authAvatarUrl: user?.avatarUrl
    };

    onRegisterCitizen(newBeneficiary);

    const message = language === 'ML'
      ? `${newBeneficiary.name} നുള്ള അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു. ടോക്കൺ: APP-${newBeneficiary.id}`
      : `Application submitted for ${newBeneficiary.name}. Token: APP-${newBeneficiary.id}`;

    onShowToast('Application Submitted', message, 'success');
    onNavigateToPortal();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--space-sm) 0 var(--space-xl) 0'
    }}>
      {/* Language Switcher Bar */}
      <div style={{
        width: '100%',
        maxWidth: '720px',
        marginBottom: '16px',
        backgroundColor: 'var(--color-surface-lowest)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
            translate
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
            {t.languageLabel}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`btn btn-sm ${language === 'EN' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setLanguage('EN')}
            style={{ fontWeight: 700, minHeight: '32px' }}
          >
            English
          </button>
          <button
            type="button"
            className={`btn btn-sm ${language === 'ML' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setLanguage('ML')}
            style={{ fontWeight: 700, minHeight: '32px' }}
          >
            മലയാളം
          </button>
        </div>
      </div>

      {/* Main Application Form Card */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '720px',
        padding: 'var(--space-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Accent Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-primary)' }} />

        {/* If Editing Mode Banner */}
        {existingBeneficiary && isEditing && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#2563eb', fontSize: '24px' }}>edit_note</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-rls font-mono" style={{ fontWeight: 800 }}>
                    APP-{existingBeneficiary.id}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#1e40af' }}>
                    {language === 'ML' ? 'അപേക്ഷ എഡിറ്റ് ചെയ്യുന്നു' : 'Editing Submitted Application'}
                  </strong>
                </div>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#1d4ed8' }}>
                  {language === 'ML' ? 'വിവരങ്ങൾ തിരുത്തിയ ശേഷം താഴെയുള്ള ബട്ടൺ അമർത്തി സേവ് ചെയ്യുക.' : 'Update any personal or vocational information and save changes.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
              style={{ fontWeight: 700 }}
            >
              {language === 'ML' ? 'റദ്ദാക്കുക' : 'Cancel'}
            </button>
          </div>
        )}

        {/* User Account Info Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface-low)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline-variant)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt="User"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                {user?.fullName || 'Google Beneficiary'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <span className="badge badge-verified" style={{ fontSize: '11px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
            <span>{t.googleVerifiedBadge}</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          {t.title}
        </h1>
        <p style={{ margin: '6px 0 18px 0', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>
          {t.subtitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Section 1: Personal Identity */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              {t.nameLabel}
            </label>
            <input
              className="input-field"
              placeholder={t.namePlaceholder}
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.phoneLabel}
              </label>
              <input
                type="tel"
                className="input-field font-mono"
                placeholder={t.phonePlaceholder}
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.aadhaarLabel}
              </label>
              <input
                type="text"
                maxLength={14}
                className="input-field font-mono"
                placeholder={t.aadhaarPlaceholder}
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Section 2: State & District Dropdowns (Kerala Only) */}
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.stateLabel}
              </label>
              <select
                className="input-field"
                value={selectedState}
                disabled
                style={{ backgroundColor: 'var(--color-surface-low)', cursor: 'not-allowed' }}
              >
                <option value="Kerala">Kerala (കേരളം) - Statewide Scope</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.districtLabel}
              </label>
              <select
                className="input-field"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {KERALA_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Shelter Location & Calamity (From Super Admin) */}
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.campLabel}
              </label>
              <input
                className="input-field"
                placeholder={t.campPlaceholder}
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                {t.calamityLabel}
              </label>
              <select
                className="input-field"
                value={selectedDisasterId}
                onChange={(e) => setSelectedDisasterId(e.target.value)}
                required
              >
                {disastersList.map(dis => (
                  <option key={dis.id} value={dis.id}>
                    [{dis.regionName.split(' ')[0]}] {dis.title} ({dis.disasterType} - {dis.severity})
                  </option>
                ))}
                <option value="OTHER">
                  {language === 'ML' ? 'മറ്റു പ്രകൃതി ദുരന്തങ്ങൾ (ജനറൽ റിലീഫ്)' : 'Other Declared Calamity / General Disaster Relief'}
                </option>
              </select>
            </div>
          </div>

          {/* Section 4: Job Priorities (User can rank preferred jobs) */}
          <div style={{
            backgroundColor: 'var(--color-surface-low)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-primary)', marginBottom: '2px' }}>
              {t.jobPriorityHeader}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginBottom: '12px' }}>
              {t.jobPrioritySubtitle}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1st Priority */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className="badge badge-verified" style={{ fontSize: '10px', padding: '1px 6px' }}>1</span>
                  <span>{t.priority1Label}</span>
                </label>
                <select
                  className="input-field"
                  value={priority1}
                  onChange={(e) => setPriority1(e.target.value as VocationalSkill)}
                  style={{ fontWeight: 600 }}
                >
                  {ALL_SKILLS.map(skill => (
                    <option key={skill} value={skill}>{t.skills[skill]}</option>
                  ))}
                </select>
              </div>

              {/* 2nd Priority */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className="badge badge-rls" style={{ fontSize: '10px', padding: '1px 6px' }}>2</span>
                  <span>{t.priority2Label}</span>
                </label>
                <select
                  className="input-field"
                  value={priority2}
                  onChange={(e) => setPriority2(e.target.value as VocationalSkill)}
                  style={{ fontWeight: 600 }}
                >
                  {ALL_SKILLS.map(skill => (
                    <option key={skill} value={skill}>{t.skills[skill]}</option>
                  ))}
                </select>
              </div>

              {/* 3rd Priority */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className="badge" style={{ fontSize: '10px', padding: '1px 6px' }}>3</span>
                  <span>{t.priority3Label}</span>
                </label>
                <select
                  className="input-field"
                  value={priority3}
                  onChange={(e) => setPriority3(e.target.value as VocationalSkill)}
                  style={{ fontWeight: 600 }}
                >
                  {ALL_SKILLS.map(skill => (
                    <option key={skill} value={skill}>{t.skills[skill]}</option>
                  ))}
                </select>
              </div>

              {/* Custom / Unlisted Skills Entry Section */}
              <div style={{
                marginTop: '6px',
                paddingTop: '10px',
                borderTop: '1px dashed var(--color-outline-variant)'
              }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '2px' }}>
                  {language === 'ML' ? 'പട്ടികയിൽ ഇല്ലാത്ത മറ്റ് തൊഴിൽ നൈപുണ്യങ്ങൾ (Unlisted Custom Skills)' : 'Other Unlisted Vocational Skills & Specializations'}
                </label>
                <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginBottom: '8px' }}>
                  {language === 'ML'
                    ? 'മുകളിലെ മുൻഗണനാ പട്ടികയിൽ ഇല്ലാത്ത അധിക തൊഴിൽ പരിചയം രേഖപ്പെടുത്താം (ഉദാ: വെൽഡിംഗ്, ബോട്ട് ഓപ്പറേഷൻ, കാറ്ററിംഗ്...)'
                    : 'Enter any additional craft skills or trade specialties not listed in the options above:'}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={language === 'ML' ? 'ഉദാ: വെൽഡിംഗ്, തെങ്ങുകയറ്റം, ബോട്ട് ഓപ്പറേഷൻ...' : 'e.g., Arc Welding, Coconut Tree Climbing, Boat Operation, Catering, Tailoring...'}
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    style={{ fontSize: '12.5px', flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddCustomSkill}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 12px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    <span>{language === 'ML' ? 'ചേർക്കുക' : 'Add Skill'}</span>
                  </button>
                </div>

                {customSkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {customSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="badge"
                        style={{
                          backgroundColor: 'var(--color-primary-container)',
                          color: 'var(--color-on-primary-container)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSkill(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-on-primary-container)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            lineHeight: 1
                          }}
                          title="Remove skill"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience and Wage */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '6px',
                paddingTop: '10px',
                borderTop: '1px dashed var(--color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {t.experienceLabel}
                  </span>
                  <select
                    className="input-field font-mono"
                    style={{ width: '90px', padding: '3px 8px', height: '32px' }}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                  >
                    {[1, 2, 3, 5, 8, 10, 15, 20].map(y => (
                      <option key={y} value={y}>{y} yrs</option>
                    ))}
                  </select>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-tertiary)' }}>
                  {t.wageLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Bank & Emergency Details */}
          <div style={{
            backgroundColor: 'var(--color-surface-low)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '8px' }}>
              {t.bankDetailsHeader}
            </label>
            <div className="grid-2" style={{ gap: 'var(--space-sm)' }}>
              <input
                className="input-field font-mono"
                placeholder={t.bankAccountPlaceholder}
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
              <input
                className="input-field font-mono"
                placeholder={t.bankIfscPlaceholder}
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              {t.emergencyContactLabel}
            </label>
            <input
              className="input-field"
              placeholder={t.emergencyContactPlaceholder}
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-outline-variant)' }}>
            <button
              type="submit"
              className="btn btn-primary btn-touch"
              style={{ width: '100%', fontSize: '1.0625rem', padding: '14px 20px', fontWeight: 800 }}
            >
              <span className="material-symbols-outlined">
                {existingBeneficiary ? 'save' : 'how_to_reg'}
              </span>
              <span>
                {existingBeneficiary 
                  ? (language === 'ML' ? 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക & അപേക്ഷ പുതുക്കുക' : 'Save Changes & Update Application')
                  : t.submitBtn}
              </span>
            </button>
          </div>

          {/* Quick link to Application Tracking */}
          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            {t.alreadyRegistered}{' '}
            <button
              type="button"
              onClick={onNavigateToPortal}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              {t.trackLink}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
