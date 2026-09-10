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

  // If this signed-in user already has submitted an application for himself, enforce single-application limit
  if (existingBeneficiary) {
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
            {language === 'ML' ? 'അപേക്ഷ രജിസ്റ്റർ ചെയ്തു കഴിഞ്ഞു' : 'Application Already Registered'}
          </span>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginTop: '10px', fontWeight: 800 }}>
            {language === 'ML' ? 'താങ്കൾ ഇതിനകം അപേക്ഷ സമർപ്പിച്ചിട്ടുണ്ട്' : 'You Have Already Submitted Your Application'}
          </h2>

          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', marginTop: '6px', lineHeight: 1.5 }}>
            {language === 'ML' ? (
              <>ലോഗിൻ ചെയ്തിരിക്കുന്ന അക്കൗണ്ട്: <strong>{user?.email}</strong>. ഒരു അക്കൗണ്ടിൽ നിന്ന് ഒരാൾക്ക് മാത്രമേ അപേക്ഷിക്കാൻ സാധിക്കുകയുള്ളൂ.</>
            ) : (
              <>Signed in as <strong>{user?.email}</strong>. Each signed-in citizen is permitted exactly one application for themselves.</>
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

          <button
            type="button"
            onClick={onNavigateToPortal}
            className="btn btn-primary btn-touch"
            style={{ width: '100%', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', padding: '14px', borderRadius: 'var(--radius-md)' }}
          >
            <span className="material-symbols-outlined">track_changes</span>
            <span>{language === 'ML' ? 'അപേക്ഷാ സ്ഥിതി ട്രാക്ക് ചെയ്യുക' : 'Track My Application Status'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Essential Form States
  const [legalName, setLegalName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  
  // State & District (Kerala only)
  const selectedState = 'Kerala';
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Wayanad');

  // Camp name starts completely blank as requested
  const [campName, setCampName] = useState('');

  // Disasters uploaded and declared by Super Admin
  const [disastersList, setDisastersList] = useState<RegionDisaster[]>(getStoredDisasters);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(() => {
    const initial = getStoredDisasters();
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
  const [priority1, setPriority1] = useState<VocationalSkill>('Masonry');
  const [priority2, setPriority2] = useState<VocationalSkill>('Carpentry');
  const [priority3, setPriority3] = useState<VocationalSkill>('General Civil Labor');
  const [experienceYears, setExperienceYears] = useState<number>(5);

  // Bank & Emergency Contact
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Auto-fill applicant name from Google user on first load
  useEffect(() => {
    if (user && !legalName) {
      setLegalName(user.fullName || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onShowToast('Authentication Required', 'Please sign in with Google.', 'warning');
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
      skills: Array.from(new Set([priority1, priority2, priority3])),
      jobPriorities: [priority1, priority2, priority3],
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
              <span className="material-symbols-outlined">how_to_reg</span>
              <span>{t.submitBtn}</span>
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
