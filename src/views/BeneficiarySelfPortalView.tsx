/**
 * ============================================================================
 * SAHAYASETU BENEFICIARY SELF-PORTAL & WAGE VERIFICATION VIEW
 * ============================================================================
 * 
 * Purpose:
 * Citizen-facing portal empowering displaced artisans and workers to verify
 * their active civil reconstruction deployments, check guaranteed daily wage ledgers,
 * track Direct Benefit Transfer (DBT) disbursals, and access multilingual relief advisories.
 * 
 * Key Capabilities:
 * 1. Worker Identity Dossier: Profile banner for citizen, Aadhaar Bio-Verified status,
 *    and camp accommodation ID.
 * 2. Full Multilingual Support: Switcher for English and Malayalam (മലയാളം) that translates
 *    the entire user portal when Malayalam is selected.
 * 3. Active Deployment Banner: Real-time work shift telemetry, supervisor contacts, and worksite location.
 * 4. 4-Step Progress Stepper: Visual lifecycle tracking of relief & employment aid.
 * 5. Printable & PDF Downloadable Relief Pass: Immediate access to generate and download
 *    a physical credential pass with assigned worksite details.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Beneficiary, WageEntry, RegionalAdminAccount } from '../types';
import { OfflinePassModal } from '../components/OfflinePassModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getCitizenNotifications, CitizenNotification } from '../services/notificationService';
import { getStoredRegionalAdmins } from '../services/regionalAdminService';

interface BeneficiarySelfPortalViewProps {
  beneficiary: Beneficiary | null;
  beneficiariesList?: Beneficiary[];
  onSelectBeneficiary?: (id: string) => void;
  wages?: WageEntry[];
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateToRegister?: () => void;
}

const RELATION_LABELS_ML: Record<string, string> = {
  'Self': 'സ്വന്തം',
  'Spouse': 'ഭാര്യ / ഭർത്താവ്',
  'Parent': 'മാതാപിതാക്കൾ',
  'Child': 'മകൻ / മകൾ',
  'Dependent': 'ആശ്രിതർ'
};

export const BeneficiarySelfPortalView: React.FC<BeneficiarySelfPortalViewProps> = ({
  beneficiary,
  beneficiariesList = [],
  onSelectBeneficiary,
  wages = [],
  onShowToast,
  onNavigateToRegister
}) => {
  const { user } = useAuth();
  const { language: currentLang, setLanguage: setCurrentLang } = useLanguage();
  const isMalayalam = currentLang === 'ML';
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [autoDownloadPass, setAutoDownloadPass] = useState(false);

  // Synchronized Citizen Assignment Notifications
  const [notifications, setNotifications] = useState<CitizenNotification[]>(() =>
    beneficiary ? getCitizenNotifications(beneficiary.id) : []
  );

  useEffect(() => {
    if (beneficiary) {
      setNotifications(getCitizenNotifications(beneficiary.id));
    }
    const handleUpdate = () => {
      if (beneficiary) {
        setNotifications(getCitizenNotifications(beneficiary.id));
      }
    };
    window.addEventListener('sahayasetu_notifications_updated', handleUpdate);
    return () => window.removeEventListener('sahayasetu_notifications_updated', handleUpdate);
  }, [beneficiary]);

  const latestAssignmentNotif = notifications.find(n => n.type === 'JOB_ASSIGNMENT');
  const isAssigned = beneficiary?.placementStatus === 'Assigned' || !!latestAssignmentNotif;

  // Regional Admin for the citizen's assigned district
  const regionalAdmin = useMemo<RegionalAdminAccount | null>(() => {
    if (!beneficiary) return null;
    const allAdmins = getStoredRegionalAdmins();
    const targetDistrictCode = beneficiary.districtId || 'KL-WYD-2024';
    const targetDistrictName = (beneficiary.district || '').toLowerCase();

    const matched = allAdmins.find(adm => 
      adm.districtId === targetDistrictCode ||
      (targetDistrictName && adm.districtName.toLowerCase().includes(targetDistrictName)) ||
      (adm.districtId && targetDistrictCode && adm.districtId.split('-')[1] === targetDistrictCode.split('-')[1])
    );

    return matched || allAdmins[0] || null;
  }, [beneficiary]);

  // Assigned worksite determination
  const assignedWorksite = latestAssignmentNotif?.worksite || 
    beneficiary?.assignedWorksite || 
    beneficiary?.worksite || 
    (isMalayalam ? 'മേപ്പാടി സെക്ടർ 2 വർക്ക്സ് ഹബ്ബ്' : 'Meppadi Sector 2 Works Hub');

  // If user has not yet registered an application, show informative state
  if (!beneficiary) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '440px',
        padding: 'var(--space-2xl) var(--space-md)'
      }}>
        <div className="card" style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: 'var(--space-2xl) var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
          border: '1px solid var(--color-outline-variant)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-low)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              assignment_ind
            </span>
          </div>

          <div>
            <span className="badge badge-rls">
              {isMalayalam ? 'അപേക്ഷ ട്രാക്കിംഗ്' : 'Application Tracking'}
            </span>
            <h2 style={{ fontSize: '1.375rem', color: 'var(--color-primary)', marginTop: '8px' }}>
              {isMalayalam ? 'അപേക്ഷകൾ ഒന്നും കണ്ടെത്തിയില്ല' : 'No Application Submitted Yet'}
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', lineHeight: 1.5, marginTop: '6px' }}>
              {user?.email ? (
                isMalayalam ? (
                  <><strong>{user.email}</strong> എന്ന അക്കൗണ്ടിൽ ലോഗിൻ ചെയ്തിരിക്കുന്നു. ഈ അക്കൗണ്ടിൽ ഇതുവരെ ദുരിതാശ്വാസ അപേക്ഷ സമർപ്പിച്ചിട്ടില്ല.</>
                ) : (
                  <>Signed in as <strong>{user.email}</strong>. You have not submitted a disaster relief application under this account yet.</>
                )
              ) : (
                isMalayalam ? (
                  <>നിങ്ങളുടെ ദുരിതാശ്വാസ സഹായവും തൊഴിൽ അവസരങ്ങളും ട്രാക്ക് ചെയ്യുന്നതിന് ദയവായി രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക.</>
                ) : (
                  <>Please complete your registration with necessary verification details to begin tracking your relief aid and employment application.</>
                )
              )}
            </p>
          </div>

          {onNavigateToRegister && (
            <button
              type="button"
              className="btn btn-primary btn-touch"
              onClick={onNavigateToRegister}
              style={{ marginTop: '8px', padding: '12px 24px', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              <span>{isMalayalam ? 'ഇപ്പോൾ അപേക്ഷിക്കുക' : 'Register My Details Now'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* ----------------------------------------------------------------------
       * OFFICIAL JOB ASSIGNMENT ALERT NOTIFICATION (REGIONAL ADMIN ALLOTMENT)
       * Shows prominent notification banner when user is assigned to a job
       * ---------------------------------------------------------------------- */}
      {isAssigned && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '2px solid #10b981',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>celebration</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-verified" style={{ backgroundColor: '#059669', color: '#fff', fontWeight: 700 }}>
                    ✓ {isMalayalam ? 'തൊഴിൽ അനുവദിച്ചു' : 'Official Job Assigned'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#047857', fontWeight: 700 }}>
                    {latestAssignmentNotif?.assignedDate || (isMalayalam ? 'ഇന്ന് നിയോഗിക്കപ്പെട്ടു' : 'Dispatched Today')}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', color: '#065f46', margin: '4px 0 0 0', fontWeight: 800 }}>
                  {latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || (isMalayalam ? 'സിവിൽ പുനർനിർമ്മാണ & പുനരധിവാസ പദ്ധതി' : 'Civil Reconstruction & Rehabilitation Works')}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#ffffff',
                border: '1px solid #6ee7b7',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 800,
                color: '#065f46'
              }}>
                ₹{latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850} {isMalayalam ? '/ ദിവസം (DBT നേരിട്ട്)' : '/ day (DBT Direct)'}
              </span>

              {/* Generate Printable / PDF Pass for Assigned Job */}
              <button
                type="button"
                onClick={() => {
                  setAutoDownloadPass(true);
                  setIsPassModalOpen(true);
                }}
                className="btn btn-sm btn-touch"
                style={{
                  backgroundColor: '#047857',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 800,
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>badge</span>
                <span>{isMalayalam ? 'തൊഴിൽ പാസ്സ് ഡൗൺലോഡ് / പ്രിന്റ്' : 'Generate & Download Job Pass'}</span>
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            border: '1px solid #a7f3d0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Worksite Location Highlight */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#064e3b',
              backgroundColor: '#ecfdf5',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #a7f3d0'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#047857' }}>location_on</span>
              <span>
                <strong>{isMalayalam ? 'തൊഴിൽ സ്ഥലം (Worksite Location):' : 'Assigned Worksite Location:'}</strong> {assignedWorksite}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#1f2937', lineHeight: 1.5 }}>
              {isMalayalam ? (
                <>
                  അഭിനന്ദനങ്ങൾ <strong>{beneficiary.name}</strong>! താങ്കൾക്ക് റീജിയണൽ അഡ്മിൻ വഴി ഔദ്യോഗികമായി തൊഴിൽ അനുവദിച്ചിരിക്കുന്നു. ദിവസവേതനം <strong>₹{latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850}/ദിവസം</strong> നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് DBT വഴി ലഭിക്കുന്നതാണ്.
                </>
              ) : (
                <>
                  Congratulations <strong>{beneficiary.name}</strong>! You have been officially matched and assigned to this rehabilitation project by the Regional Admin. Your guaranteed daily wage of <strong>₹{latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850}/day</strong> is linked for direct DBT payment.
                </>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#059669',
              backgroundColor: '#f0fdf4',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sms</span>
              <span>
                <strong>{isMalayalam ? 'എസ്.എം.എസ് അറിയിപ്പ് അയച്ചു:' : 'SMS Dispatched to:'}</strong> +91 {beneficiary.phone} — {isMalayalam ? `പ്രിയപ്പെട്ട ${beneficiary.name}, താങ്കൾക്ക് "${latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || 'Civil Project'}" ജോലി അനുവദിച്ചിരിക്കുന്നു. സ്ഥലം: ${assignedWorksite}` : `Dear ${beneficiary.name}, you have been assigned to "${latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || 'Civil Project'}". Worksite: ${assignedWorksite}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
       * SECTION 2: WORKER WELCOME BANNER & MULTILINGUAL BAR
       * Profile dossier, Aadhaar Bio-Verified stamp, language selector
       * ---------------------------------------------------------------------- */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* Avatar with Verified Stamp */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--color-primary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--color-primary)' }}>
                engineering
              </span>
            </div>
            <span style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-tertiary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.375rem', color: 'var(--color-on-surface)' }}>
                {beneficiary.name}
              </h2>
              <span className="badge badge-verified">
                {beneficiary.relationshipToAccount 
                  ? (isMalayalam ? (RELATION_LABELS_ML[beneficiary.relationshipToAccount] || beneficiary.relationshipToAccount) : beneficiary.relationshipToAccount) 
                  : (isMalayalam ? 'സ്വന്തം' : 'Self')}
              </span>
              <span className="badge badge-rls">
                {beneficiary.state || 'Kerala'} • {beneficiary.district || 'Wayanad'}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>holiday_village</span>
                {isMalayalam ? 'ക്യാമ്പ്:' : 'Camp:'} {beneficiary.campId}
              </span>
              <span>•</span>
              <span className="font-mono">{isMalayalam ? 'ടോക്കൺ:' : 'Token:'} APP-{beneficiary.id}</span>
              <span>•</span>
              <span style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}>
                ✓ {beneficiary.isBioVerified 
                  ? (isMalayalam ? 'ആധാർ ബയോ-സ്ഥിരീകരിച്ചു' : 'Aadhaar Bio-Verified') 
                  : (isMalayalam ? 'പരിശോധന പുരോഗമിക്കുന്നു' : 'Verification In-Progress')}
              </span>
            </div>
          </div>
        </div>

        {/* Multilingual Selector & Print Pass Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{
            backgroundColor: 'var(--color-surface-low)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={() => setCurrentLang('EN')}
              className={`btn btn-sm ${currentLang === 'EN' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ minHeight: '32px' }}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLang('ML')}
              className={`btn btn-sm ${currentLang === 'ML' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ minHeight: '32px' }}
            >
              മലയാളം
            </button>
          </div>

          {onNavigateToRegister && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onNavigateToRegister}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              title={isMalayalam ? "അപേക്ഷാ വിവരങ്ങൾ മാറ്റുക" : "Edit your submitted application"}
            >
              <span className="material-symbols-outlined">edit_document</span>
              <span>{isMalayalam ? 'അപേക്ഷ തിരുത്തുക' : 'Edit Application'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * SECTION 2.5: CITIZEN APPLICATION STATUS & AID TRACKER
       * Allows displaced beneficiaries to track their aid registration lifecycle step-by-step
       * ---------------------------------------------------------------------- */}
      <div className="card" style={{
        border: '1px solid var(--color-outline-variant)',
        backgroundColor: 'var(--color-surface-lowest)',
        padding: 'var(--space-lg)'
      }}>
        {/* Tracker Header with Application Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
          <div>
            <span className="badge badge-rls">
              {isMalayalam ? 'ഔദ്യോഗിക ദുരിതാശ്വാസ ഘട്ടങ്ങൾ' : 'Official Aid Pipeline'}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '4px' }}>
              {isMalayalam ? 'പൗര ദുരിതാശ്വാസ & തൊഴിൽ അപേക്ഷാ ട്രാക്കർ' : 'Citizen Aid & Livelihood Application Tracker'}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {isMalayalam ? 'ട്രാക്കിംഗ് ടോക്കൺ:' : 'Tracking Token:'} <span className="font-mono" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>APP-{beneficiary.id}</span> • {isMalayalam ? 'രജിസ്റ്റർ ചെയ്ത തീയതി:' : 'Registered:'} {beneficiary.registeredDate}
            </div>
          </div>

          {/* Authenticated Beneficiary Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-verified" style={{ fontSize: '11px', padding: '4px 8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
              <span>{isMalayalam ? 'നിങ്ങളുടെ ഔദ്യോഗിക അപേക്ഷ' : 'Your Official Application'}</span>
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-sm)',
          position: 'relative'
        }}>
          {/* Step 1: Registration */}
          <div className="card-inset" style={{ borderTop: '3px solid var(--color-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
              <span>{isMalayalam ? '1. അപേക്ഷ സമർപ്പിച്ചു' : '1. Application Filed'}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              {isMalayalam ? 'പ്രൊഫൈൽ രജിസ്റ്റർ ചെയ്തു' : 'Profile Registered'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.registeredDate} • {isMalayalam ? 'ക്യാമ്പ്:' : 'Filed at'} {beneficiary.campId.split('(')[0]}
            </div>
          </div>

          {/* Step 2: Verification */}
          <div className="card-inset" style={{ borderTop: `3px solid ${beneficiary.isBioVerified ? 'var(--color-tertiary)' : 'var(--color-secondary)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: beneficiary.isBioVerified ? 'var(--color-tertiary)' : 'var(--color-secondary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {beneficiary.isBioVerified ? 'check_circle' : 'pending'}
              </span>
              <span>{isMalayalam ? '2. തിരിച്ചറിയൽ പൂർത്തിയായി' : '2. Identity Cleared'}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              {beneficiary.isBioVerified 
                ? (isMalayalam ? 'ആധാർ ബയോ-സ്ഥിരീകരിച്ചു' : 'Aadhaar Bio-Verified') 
                : (isMalayalam ? 'പരിശോധന പുരോഗമിക്കുന്നു' : 'Verification In Progress')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.isMedicalFit 
                ? (isMalayalam ? 'ആരോഗ്യ ഫിറ്റ്നസ് ഉറപ്പാക്കി' : 'Medical Fitness Certified') 
                : (isMalayalam ? 'മെഡിക്കൽ പരിശോധന കാത്തിരിക്കുന്നു' : 'Medical Review Queued')}
            </div>
          </div>

          {/* Step 3: Job / Rehabilitation Allotment */}
          <div className="card-inset" style={{ 
            borderTop: `3px solid ${beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-primary)'}`,
            backgroundColor: beneficiary.placementStatus === 'Assigned' ? '#f0fdf4' : '#f0f9ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {beneficiary.placementStatus === 'Assigned' ? 'task_alt' : 'engineering'}
              </span>
              <span>{isMalayalam ? '3. ഉപജീവന തൊഴിൽ അനുവദിക്കൽ' : '3. Livelihood Allotment'}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px', color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-primary)' }}>
              {beneficiary.placementStatus === 'Assigned' 
                ? (isMalayalam ? 'പുനർനിർമ്മാണ ജോലി ലഭിച്ചു' : 'Allotted to Civil Works') 
                : (isMalayalam ? 'തൊഴിൽ കണ്ടെത്തുന്നു' : 'Standby for Match')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.placementStatus === 'Assigned' 
                ? (isMalayalam ? `സ്ഥലം: ${assignedWorksite}` : `Worksite: ${assignedWorksite}`) 
                : (isMalayalam ? 'അടുത്ത തൊഴിൽ പട്ടികയിൽ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്' : 'Ranked in upcoming requisition roster')}
            </div>
          </div>

          {/* Step 4: DBT Wage Disbursal */}
          <div className="card-inset" style={{ borderTop: `3px solid ${beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-secondary)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-secondary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>payments</span>
              <span>{isMalayalam ? '4. നേരിട്ടുള്ള വേതന വിതരണം (DBT)' : '4. DBT Disbursals'}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              {beneficiary.placementStatus === 'Assigned' 
                ? (isMalayalam ? 'PFMS പേയ്മെന്റ് സജീവം' : 'PFMS Auto-Pay Active') 
                : (isMalayalam ? 'ബാങ്ക് അക്കൗണ്ട് ബന്ധിപ്പിച്ചു' : 'Bank Account Linked')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {isMalayalam ? 'വേതനം ആധാറിലേക്ക്:' : 'Direct Benefit Transfer to'} {beneficiary.aadhaarMasked}
            </div>
          </div>
        </div>

        {/* Application Registered Details Summary Strip */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--color-surface-low)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline-variant)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
              {isMalayalam ? 'രജിസ്റ്റർ ചെയ്ത അപേക്ഷകന്റെ വിവരങ്ങൾ' : 'Registered Applicant Details'}
            </span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '2px' }}>
              {beneficiary.name} • {isMalayalam ? 'ഫോൺ:' : 'Contact:'} +91 {beneficiary.phone} • {isMalayalam ? 'ദുരന്തം:' : 'Calamity:'} {beneficiary.calamity}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {isMalayalam ? 'ക്യാമ്പ്:' : 'Camp:'} {beneficiary.campId} • {isMalayalam ? 'നൈപുണ്യങ്ങൾ:' : 'Skills:'} {beneficiary.skills.join(', ')} ({beneficiary.experienceYears} {isMalayalam ? 'വർഷ പരിചയം' : 'y exp'})
              {assignedWorksite && (
                <> • {isMalayalam ? 'തൊഴിൽ സ്ഥലം:' : 'Worksite:'} <strong>{assignedWorksite}</strong></>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-rls">
              {isMalayalam ? `വേതനാവകാശം: ₹${beneficiary.dailyWageTier}/ദിവസം` : `Wage Entitlement: ₹${beneficiary.dailyWageTier}/day`}
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * SECTION 3: BENTO WORKSPACE GRID
       * Left Col: Job Preferences & Priorities | Right Col: Emergency Camp Officials
       * ---------------------------------------------------------------------- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--space-lg)',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: JOB PREFERENCES & PRIORITIES (6 Columns) */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--color-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>
                  format_list_numbered
                </span>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-on-surface)' }}>
                  {isMalayalam ? 'തൊഴിൽ മുൻഗണനകൾ & യോഗ്യത' : 'Your Job Preferences & Priority Ranking'}
                </span>
              </div>
              <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                {beneficiary.experienceYears} {isMalayalam ? 'വർഷ പരിചയം' : 'Years Experience'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 1st Priority */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--color-surface-low)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-verified" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 800 }}>
                    {isMalayalam ? 'ഒന്നാം മുൻഗണന' : '1st Priority'}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[0] || beneficiary.skills[0] || 'Masonry'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {isMalayalam ? '✓ മുഖ്യ തൊഴിൽ' : '✓ Primary Target'}
                </span>
              </div>

              {/* 2nd Priority */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                backgroundColor: 'var(--color-surface-low)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-rls" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 700 }}>
                    {isMalayalam ? 'രണ്ടാം മുൻഗണന' : '2nd Priority'}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[1] || beneficiary.skills[1] || 'Carpentry'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                  {isMalayalam ? 'രണ്ടാം ചോയ്സ്' : 'Secondary Choice'}
                </span>
              </div>

              {/* 3rd Priority */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                backgroundColor: 'var(--color-surface-low)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 700 }}>
                    {isMalayalam ? 'മൂന്നാം മുൻഗണന' : '3rd Priority'}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[2] || beneficiary.skills[2] || 'General Civil Labor'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                  {isMalayalam ? 'മൂന്നാം ചോയ്സ്' : 'Alternative Choice'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EMERGENCY CONTACTS (6 Columns) */}
        {/* Notice: Camp Official Broadcasts has been removed as per user instructions */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Key Relief Camp Contacts - Regional Admin Contact Info Only */}
          <div className="card">
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '12px' }}>
              {isMalayalam ? 'ക്യാമ്പ് അടിയന്തര ഉദ്യോഗസ്ഥൻ' : 'Emergency Camp Official'}
            </span>

            {regionalAdmin ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-on-surface)' }}>
                      {regionalAdmin.name}
                    </span>
                    <span className="badge badge-verified" style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {isMalayalam ? 'റീജിയണൽ അഡ്മിൻ' : 'Regional Admin'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                    {regionalAdmin.ngoName} • {regionalAdmin.districtName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="font-mono">ID: {regionalAdmin.officerCredentialId || regionalAdmin.sdmaOfficerId}</span>
                  </div>
                </div>

                <a 
                  href={`tel:${(regionalAdmin.phone || '+919447128901').replace(/[^0-9+]/g, '')}`} 
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, padding: '6px 14px', fontWeight: 700 }}
                  title={isMalayalam ? "റീജിയണൽ അഡ്മിനെ വിളിക്കുക" : "Call Regional Admin"}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>call</span>
                  <span>{isMalayalam ? 'വിളിക്കുക' : 'Call'}</span>
                </a>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                {isMalayalam ? 'റീജിയണൽ അഡ്മിൻ വിവരങ്ങൾ ലഭ്യമല്ല' : 'Regional Admin contact details not provisioned'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Job & Relief Pass Modal with PDF Download and Worksite Display */}
      <OfflinePassModal
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setAutoDownloadPass(false);
        }}
        autoDownload={autoDownloadPass}
        beneficiary={beneficiary}
        onShowToast={onShowToast}
        jobDetails={{
          jobTitle: latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || (isMalayalam ? 'സിവിൽ പുനർനിർമ്മാണ പദ്ധതി' : 'Civil Rehabilitation & Reconstruction'),
          agencyName: latestAssignmentNotif?.agencyName || (isMalayalam ? 'ജില്ലാ ദുരന്ത നിവാരണ അതോറിറ്റി (DDMA)' : 'District Disaster Management Authority (DDMA)'),
          dailyWage: latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850,
          assignedDate: latestAssignmentNotif?.assignedDate || beneficiary.registeredDate || (isMalayalam ? 'ഔദ്യോഗിക നിയോഗം' : 'Official Deployment'),
          worksite: assignedWorksite
        }}
      />
    </div>
  );
};
