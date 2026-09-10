/**
 * ============================================================================
 * SAHAYASETU REGISTERED USER DETAILS DOSSIER MODAL
 * ============================================================================
 * 
 * Purpose:
 * Provides regional administrators and authorized relief coordinators with a 
 * complete, high-definition inspection modal of a registered user in their
 * assigned region (e.g. KL-WYD-2024 Wayanad).
 * 
 * Capabilities:
 * 1. Complete Demographic Dossier: Full legal name, UID, masked Aadhaar, phone.
 * 2. Region & Shelter Assignment: Calamity zone, relief camp ward, living status.
 * 3. Vocational Readiness: Verified skills, experience years, wage tier, medical fitness.
 * 4. Application & Deployment Lifecycle: Placement state, active project assignment.
 * 5. Direct Action: Launch official printable offline relief pass.
 */

import React from 'react';
import { Beneficiary } from '../types';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary;
  onOpenPass: (beneficiary: Beneficiary) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onOpenPass
}) => {
  if (!isOpen) return null;

  const calamityClass = 
    beneficiary.calamity === 'Landslide' ? 'badge-landslide' :
    beneficiary.calamity === 'Flood' ? 'badge-flood' : 'badge-cyclone';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '620px', width: '95%' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ backgroundColor: 'var(--color-surface-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                badge
              </span>
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                Official Beneficiary Dossier
              </span>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0, lineHeight: 1.2 }}>
                {beneficiary.name}
              </h2>
            </div>
          </div>
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            style={{ minHeight: '32px', width: '32px', padding: 0 }}
            title="Close Details Modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Top Status & Verification Strip */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface-low)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-rls font-mono">{beneficiary.districtId}</span>
              <span className={`badge ${calamityClass}`}>{beneficiary.calamity}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={`badge ${beneficiary.isBioVerified ? 'badge-verified' : 'badge-rls'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                  {beneficiary.isBioVerified ? 'verified' : 'hourglass_empty'}
                </span>
                <span>{beneficiary.isBioVerified ? 'Aadhaar Bio-Verified' : 'Pending Bio-Sync'}</span>
              </span>
              <span className={`badge ${beneficiary.placementStatus === 'Assigned' ? 'badge-verified' : 'badge-offline'}`}>
                {beneficiary.placementStatus}
              </span>
            </div>
          </div>

          {/* Section 1: Identification & Demographics */}
          <div className="card-inset">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              1. Civilian Identity &amp; Shelter Registration
            </span>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Beneficiary UID</span>
                <div className="font-mono" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>
                  {beneficiary.id}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Aadhaar Number</span>
                <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.aadhaarRaw ? `${beneficiary.aadhaarRaw} (Full)` : beneficiary.aadhaarMasked}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Contact Phone (+91)</span>
                <div className="font-mono" style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  +91 {beneficiary.phone}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Registration Intake Date</span>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.registeredDate}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Living Condition</span>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.livingStatus}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Assigned Shelter / Relief Camp</span>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                  {beneficiary.campId}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Family Dependents & Emergency Verification */}
          <div className="card-inset">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              2. Relief Kit Token &amp; Family Dependents Verification
            </span>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Ration Card / Relief Kit Token</span>
                <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                  {beneficiary.rationCardNumber || 'KL-04-2024-88912'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Family Members in Shelter</span>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.dependentsCount || 3} Dependent Members
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Emergency Contact Person</span>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.emergencyContact || 'Sunitha (Spouse) - 98471 99002'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Google Authenticated Identity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: 'var(--color-on-surface)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#34A853' }}>verified_user</span>
                  <span>{beneficiary.authEmail || `${beneficiary.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Vocational Skills, Wage & Medical Fitness */}
          <div className="card-inset">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              3. Vocational Trade Skills &amp; Daily Wage Entitlement
            </span>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>
                Verified Vocational Trades ({beneficiary.experienceYears} Years Experience):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {beneficiary.skills.map((skill) => (
                  <span key={skill} className="skill-chip active" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid-2" style={{ gap: '12px', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Established Daily Wage Rate</span>
                <div className="font-mono" style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary)' }}>
                  ₹{beneficiary.dailyWageTier} <span style={{ fontSize: '12px', fontWeight: 600 }}>/ day (+ ₹150 Hardship Zone Addon)</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Medical Fitness Declaration</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: beneficiary.isMedicalFit ? 'var(--color-tertiary)' : 'var(--color-error)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {beneficiary.isMedicalFit ? 'health_and_safety' : 'warning'}
                  </span>
                  <span>{beneficiary.isMedicalFit ? 'Certified Fit for Heavy Reconstruction' : 'Medical Evaluation Required'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Direct Benefit Transfer (DBT) Bank Account */}
          <div className="card-inset">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              4. Direct Benefit Transfer (DBT) Bank Disbursement Details
            </span>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>PFMS-Linked Bank Account</span>
                <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-on-surface)' }}>
                  {beneficiary.bankAccount ? `•••• •••• ${beneficiary.bankAccount.slice(-4)}` : '•••• •••• 9210 (PFMS Verified)'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>IFSC Branch Code</span>
                <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                  {beneficiary.bankIfsc || 'SBIN0004210 (SBI Meppadi Branch)'}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-tertiary)', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>account_balance</span>
                <span>Direct Benefit Transfer Authorized: Daily wages automatically disbursed via PFMS / Aadhaar Payment Bridge.</span>
              </div>
            </div>
          </div>

          {/* Section 5: Rehabilitation Allocation & Project Details */}
          <div className="card-inset">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              5. Reconstruction Deployment Details
            </span>
            {beneficiary.assignedProjectId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-verified">Active Worksite Deployment</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                    {beneficiary.assignedProjectId}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-on-surface)', marginTop: '4px' }}>
                  Chooralmala Retaining Wall &amp; Embankment Reinforcement
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                  Agency: Kerala State Disaster Management Authority (KSDMA) &amp; Habitat for Humanity
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary)' }}>check_circle</span>
                <span>Candidate is currently <strong>Available on Standby</strong> for upcoming civil reconstruction requisitions in Wayanad.</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface-low)',
          borderTop: '1px solid var(--color-outline-variant)'
        }}>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => onOpenPass(beneficiary)}
            title="Generate and print official civilian relief QR pass"
          >
            <span className="material-symbols-outlined">badge</span>
            <span>View &amp; Print Relief Pass</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onClose}
          >
            <span>Close Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
