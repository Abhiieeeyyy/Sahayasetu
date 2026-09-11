import React from 'react';
import { CandidateMatch, JobRequisition } from '../types';

interface DispatchApprovalModalProps {
  isOpen: boolean;
  match: CandidateMatch | null;
  requisition: JobRequisition | null;
  onClose: () => void;
  onConfirm: (match: CandidateMatch) => void;
}

export const DispatchApprovalModal: React.FC<DispatchApprovalModalProps> = ({
  isOpen,
  match,
  requisition,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !match || !requisition) return null;

  const { beneficiary, overlapScore, distanceKm } = match;

  return (
    <div className="modal-backdrop">
      <div 
        className="card modal-surface" 
        style={{ 
          maxWidth: '720px', 
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderTop: '5px solid var(--color-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          backgroundColor: 'var(--color-surface-low)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                Official Dispatch Review
              </span>
              <span className="badge badge-rls">
                Regional Authority Final Sign-Off
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
              Confirm Candidate Assignment &amp; Relief Pass
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: '4px 0 0 0' }}>
              Review the matched citizen profile and project scope before issuing automated SMS transit directives.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            title="Cancel and close review modal"
            style={{ minHeight: 'auto', padding: '4px' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Match Score & Telemetry Banner */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-tertiary-fixed)',
                color: 'var(--color-on-tertiary-fixed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px'
              }}>
                {overlapScore}%
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                  Algorithmic Compatibility Verified
                </div>
                <div style={{ fontSize: '11px', color: '#15803d' }}>
                  Trade Overlap (50%) + Proximity ~{distanceKm} km (25%) + Medical Fitness (25%)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                ✓ {beneficiary.isMedicalFit ? 'Medical Fit for Reconstruction' : 'Restricted Labor'}
              </span>
              <span className="badge badge-rls" style={{ fontSize: '11px' }}>
                {beneficiary.experienceYears} Yrs Experience
              </span>
            </div>
          </div>

          {/* 2-Column Grid: Candidate Details & Project Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
            
            {/* Column 1: Candidate Profile */}
            <div style={{
              backgroundColor: 'var(--color-surface-lowest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>person</span>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Artisan Candidate Dossier
                </span>
              </div>

              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                  {beneficiary.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  ID: <span className="font-mono">{beneficiary.id}</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Phone:</strong> +91 {beneficiary.phone}
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Aadhaar:</strong> {beneficiary.aadhaarMasked || '•••• •••• Verified'}
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Relief Shelter / Camp:</strong> {beneficiary.campId || 'Main District Camp'}
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Living Status:</strong> {beneficiary.livingStatus}
                </div>
                {beneficiary.rationCardNumber && (
                  <div>
                    <strong style={{ color: 'var(--color-on-surface-variant)' }}>Ration Card:</strong> {beneficiary.rationCardNumber}
                  </div>
                )}
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>DBT / Bank Account:</strong> {beneficiary.bankAccount ? `A/C ••••${beneficiary.bankAccount.slice(-4)} (${beneficiary.bankIfsc || 'DBT Linked'})` : 'Cash Voucher Dispatch'}
                </div>
              </div>

              <div style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>
                  Registered Skills &amp; Trades:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {beneficiary.skills?.map(sk => (
                    <span key={sk} className="skill-chip active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Emergency Job Requisition */}
            <div style={{
              backgroundColor: 'var(--color-surface-lowest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>engineering</span>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-secondary)' }}>
                  Assigned Project Details
                </span>
              </div>

              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {requisition.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  Agency: <strong>{requisition.agency}</strong> • ID: <span className="font-mono">{requisition.id}</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Worksite Location:</strong> {requisition.sectorLocation || requisition.worksite || 'Designated District Sector'}
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Priority Tier:</strong> <span className={`badge ${requisition.priority === 'SOS Urgent' ? 'badge-landslide' : 'badge-rls'}`} style={{ fontSize: '10px' }}>{requisition.priority}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Required Trade:</strong> {requisition.requiredSkills.join(', ')}
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Headcount:</strong> {requisition.assignedCount} / {requisition.requiredCount} Dispatched
                </div>
                <div>
                  <strong style={{ color: 'var(--color-on-surface-variant)' }}>Duration:</strong> {requisition.durationWeeks} Weeks
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface-low)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-outline-variant)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Guaranteed Daily Wage:</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>₹{requisition.dailyWage} / day</strong>
                </div>
                {requisition.hardshipAllowance > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', fontSize: '11px' }}>
                    <span style={{ color: 'var(--color-tertiary)' }}>Hardship Allowance:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-tertiary)' }}>+₹{requisition.hardshipAllowance} / day</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bilingual Automated SMS Dispatch Preview */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1e40af' }}>sms</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
                Outbound Automated SMS Pass Transmission Preview
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#1e3a8a', lineHeight: 1.5, fontFamily: 'sans-serif' }}>
              <strong>Malayalam:</strong> പ്രിയപ്പെട്ട {beneficiary.name}, താങ്കളെ &quot;{requisition.title}&quot; പ്രൊജക്റ്റിലേക്ക് നിയമിച്ചിരിക്കുന്നു. സ്ഥലം: {requisition.sectorLocation || requisition.worksite}. പ്രതിദിന വേതനം: ₹{requisition.dailyWage}. ദയവായി സൈറ്റിൽ റിപ്പോർട്ട് ചെയ്യുക.
            </div>
            <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>
              Target Mobile: <strong>+91 {beneficiary.phone}</strong> • Automated trigger upon confirmation
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-outline-variant)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--color-surface-low)'
        }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel / Back to Matching
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onConfirm(match);
              onClose();
            }}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
            <span>Confirm Dispatch &amp; Issue Relief Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
