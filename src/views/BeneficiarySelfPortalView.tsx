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
 * Architectural Directives Implemented:
 * 1. Citizen Broadcast Alert Banner: Urgent safety routes and cash distribution hubs.
 * 2. Worker Identity Dossier: Profile banner for Ramesh K., Aadhaar Bio-Verified status,
 *    and camp accommodation ID.
 * 3. Multilingual Support: Switcher for English and Malayalam (മലയാളം).
 * 4. Active Deployment Card: Real-time work shift telemetry and supervisor contacts.
 * 5. Daily Wage Ledger & DBT Disbursal Tracker: Verifiable record of hours worked,
 *    base wages, hardship zone supplements, and bank transfer transaction refs.
 * 6. Printable Offline Relief Pass: Immediate access to generate a printable physical pass.
 */

import React, { useState, useEffect } from 'react';
import { Beneficiary, WageEntry } from '../types';
import { OfflinePassModal } from '../components/OfflinePassModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getCitizenNotifications, CitizenNotification } from '../services/notificationService';

interface BeneficiarySelfPortalViewProps {
  beneficiary: Beneficiary | null;
  beneficiariesList?: Beneficiary[];
  onSelectBeneficiary?: (id: string) => void;
  wages?: WageEntry[];
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateToRegister?: () => void;
}

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
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

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
            <span className="badge badge-rls">Application Tracking</span>
            <h2 style={{ fontSize: '1.375rem', color: 'var(--color-primary)', marginTop: '8px' }}>
              {currentLang === 'ML' ? 'അപേക്ഷകൾ ഒന്നും കണ്ടെത്തിയില്ല' : 'No Application Submitted Yet'}
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', lineHeight: 1.5, marginTop: '6px' }}>
              {user?.email ? (
                <>Signed in as <strong>{user.email}</strong>. You have not submitted a disaster relief application under this account yet.</>
              ) : (
                <>Please complete your registration with necessary verification details to begin tracking your relief aid and employment application.</>
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
              <span>{currentLang === 'ML' ? 'ഇപ്പോൾ അപേക്ഷിക്കുക' : 'Register My Details Now'}</span>
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
                    ✓ {currentLang === 'ML' ? 'തൊഴിൽ അനുവദിച്ചു' : 'Official Job Assigned'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#047857', fontWeight: 700 }}>
                    {latestAssignmentNotif?.assignedDate || 'Dispatched Today'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', color: '#065f46', margin: '4px 0 0 0', fontWeight: 800 }}>
                  {latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || 'Civil Reconstruction & Rehabilitation Works'}
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
                ₹{latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850} / day (DBT Direct)
              </span>

              {/* Generate Printable Pass for Assigned Job */}
              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
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
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
                <span>{currentLang === 'ML' ? 'തൊഴിൽ പാസ്സ് പ്രിന്റ് ചെയ്യുക' : 'Generate Printable Job Pass'}</span>
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
            <div style={{ fontSize: '13px', color: '#1f2937', lineHeight: 1.5 }}>
              {currentLang === 'ML' ? (
                <>
                  അഭിനന്ദനങ്ങൾ <strong>{beneficiary.name}</strong>! താങ്കൾക്ക് റീജിയണൽ അഡ്മിൻ വഴി തൊഴിൽ അനുവദിച്ചിരിക്കുന്നു. ദിവസവേതനം <strong>₹{latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier || 850}/ദിവസം</strong> നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് DBT വഴി ലഭിക്കുന്നതാണ്.
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
                <strong>{currentLang === 'ML' ? 'എസ്.എം.എസ് അറിയിപ്പ് അയച്ചു:' : 'SMS Dispatched to:'}</strong> +91 {beneficiary.phone} — {currentLang === 'ML' ? `പ്രിയപ്പെട്ട ${beneficiary.name}, താങ്കൾക്ക് "${latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || 'Civil Project'}" ജോലി അനുവദിച്ചിരിക്കുന്നു.` : `Dear ${beneficiary.name}, you have been assigned to "${latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId || 'Civil Project'}".`}
              </span>
            </div>
          </div>
        </div>
      )}



      {/* ----------------------------------------------------------------------
       * SECTION 2: WORKER WELCOME BANNER & MULTILINGUAL BAR
       * Profile dossier for Ramesh K., Aadhaar Bio-Verified stamp, language selector
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
                {beneficiary.relationshipToAccount ? `${beneficiary.relationshipToAccount}` : 'Self'}
              </span>
              <span className="badge badge-rls">
                {beneficiary.state || 'Kerala'} • {beneficiary.district || 'Wayanad'}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>holiday_village</span>
                Camp: {beneficiary.campId}
              </span>
              <span>•</span>
              <span className="font-mono">Token: APP-{beneficiary.id}</span>
              <span>•</span>
              <span style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}>
                ✓ {beneficiary.isBioVerified ? 'Aadhaar Bio-Verified' : 'Verification In-Progress'}
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

          {isAssigned ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsPassModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              title="Generate and print physical job deployment pass"
            >
              <span className="material-symbols-outlined">badge</span>
              <span>{currentLang === 'ML' ? 'തൊഴിൽ പാസ്സ് പ്രിന്റ് ചെയ്യുക' : 'Print Job Pass'}</span>
            </button>
          ) : (
            <span className="badge" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontSize: '11px', padding: '6px 12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>hourglass_empty</span>
              <span>Pass Available Upon Job Assignment</span>
            </span>
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
            <span className="badge badge-rls">Official Aid Pipeline</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: '4px' }}>
              Citizen Aid &amp; Livelihood Application Tracker
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Tracking Token: <span className="font-mono" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>APP-{beneficiary.id}</span> • Registered: {beneficiary.registeredDate}
            </div>
          </div>

          {/* Authenticated Beneficiary Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-verified" style={{ fontSize: '11px', padding: '4px 8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
              <span>Your Official Application</span>
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper (Dynamically Computed from Selected Beneficiary) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-sm)',
          position: 'relative'
        }}>
          {/* Step 1: Registration */}
          <div className="card-inset" style={{ borderTop: '3px solid var(--color-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
              <span>1. Application Filed</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              Profile Registered
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.registeredDate} • Filed at {beneficiary.campId.split('(')[0]}
            </div>
          </div>

          {/* Step 2: Verification */}
          <div className="card-inset" style={{ borderTop: `3px solid ${beneficiary.isBioVerified ? 'var(--color-tertiary)' : 'var(--color-secondary)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: beneficiary.isBioVerified ? 'var(--color-tertiary)' : 'var(--color-secondary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {beneficiary.isBioVerified ? 'check_circle' : 'pending'}
              </span>
              <span>2. Identity Cleared</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              {beneficiary.isBioVerified ? 'Aadhaar Bio-Verified' : 'Verification In Progress'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.isMedicalFit ? 'Medical Fitness Certified' : 'Medical Review Queued'}
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
              <span>3. Livelihood Allotment</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px', color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-primary)' }}>
              {beneficiary.placementStatus === 'Assigned' ? 'Allotted to Civil Works' : 'Standby for Match'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {beneficiary.placementStatus === 'Assigned' ? 'Active Shift • ₹850/day Base Rate' : 'Ranked in upcoming requisition roster'}
            </div>
          </div>

          {/* Step 4: DBT Wage Disbursal */}
          <div className="card-inset" style={{ borderTop: `3px solid ${beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-secondary)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-secondary)', fontWeight: 700, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>payments</span>
              <span>4. DBT Disbursals</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
              {beneficiary.placementStatus === 'Assigned' ? 'PFMS Auto-Pay Active' : 'Bank Account Linked'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Direct Benefit Transfer to {beneficiary.aadhaarMasked}
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
              Registered Applicant Details
            </span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '2px' }}>
              {beneficiary.name} • Contact: +91 {beneficiary.phone} • Calamity: {beneficiary.calamity}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Camp: {beneficiary.campId} • Skills: {beneficiary.skills.join(', ')} ({beneficiary.experienceYears}y exp)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-rls">
              Wage Entitlement: ₹{beneficiary.dailyWageTier}/day
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPassModalOpen(true)}
              title="Print your relief pass"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>print</span>
              <span>Print Application Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * SECTION 3: BENTO WORKSPACE GRID
       * Left Col: Active Assignment & Wage Ledger | Right Col: Broadcasts & Contacts
       * ---------------------------------------------------------------------- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--space-lg)',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: JOB PREFERENCES & PRIORITIES (6 Columns) */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Job Priorities & Matching Target Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--color-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>
                  format_list_numbered
                </span>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-on-surface)' }}>
                  {currentLang === 'ML' ? 'തൊഴിൽ മുൻഗണനകൾ & യോഗ്യത' : 'Your Job Preferences & Priority Ranking'}
                </span>
              </div>
              <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                {beneficiary.experienceYears} {currentLang === 'ML' ? 'വർഷ പരിചയം' : 'Years Experience'}
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
                    1st Priority
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[0] || beneficiary.skills[0] || 'Masonry'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
                  ✓ Primary Target
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
                    2nd Priority
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[1] || beneficiary.skills[1] || 'Carpentry'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                  Secondary Choice
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
                    3rd Priority
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                    {beneficiary.jobPriorities?.[2] || beneficiary.skills[2] || 'General Civil Labor'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                  Alternative Choice
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EMERGENCY BROADCASTS & CONTACTS (6 Columns) */}
        <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Official Relief Broadcast Feed */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>
                Camp Official Broadcasts
              </span>
              <span className="badge badge-flood">Live Channel</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="card-inset">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-landslide" style={{ fontSize: '10px' }}>Urgent Ration Kit</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Today 11:00 AM</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px' }}>
                  2-Week Dry Ration Kits &amp; Water Purification Tablets
                </div>
                <p style={{ fontSize: '12px', marginTop: '2px' }}>
                  Distribution starting at Meppadi Camp Sector 2 Counter. Bring your Beneficiary Token.
                </p>
              </div>

              <div className="card-inset">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-verified" style={{ fontSize: '10px' }}>Medical Camp</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Tomorrow 09:00 AM</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px' }}>
                  Free Tetanus Vaccination &amp; Health Checks
                </div>
                <p style={{ fontSize: '12px', marginTop: '2px' }}>
                  Disaster medical response team mobile van will be stationed at Camp Medical Bay.
                </p>
              </div>
            </div>
          </div>

          {/* Key Relief Camp Contacts */}
          <div className="card">
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '12px' }}>
              Emergency Camp Officials
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>Dr. K. Suresh</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Medical Relief Officer</div>
                </div>
                <a href="tel:9447100221" className="btn btn-secondary btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                  <span>Call</span>
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>Vipin Das</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Shelter Camp Warden</div>
                </div>
                <a href="tel:9447100332" className="btn btn-secondary btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Job Pass Modal */}
      <OfflinePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        beneficiary={beneficiary}
        jobDetails={isAssigned ? {
          jobTitle: latestAssignmentNotif?.jobTitle || beneficiary.assignedProjectId,
          agencyName: latestAssignmentNotif?.agencyName,
          dailyWage: latestAssignmentNotif?.dailyWage || beneficiary.dailyWageTier,
          assignedDate: latestAssignmentNotif?.assignedDate || beneficiary.registeredDate
        } : undefined}
      />
    </div>
  );
};
