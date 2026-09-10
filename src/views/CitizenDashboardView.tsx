/**
 * ============================================================================
 * SAHAYASETU CITIZEN LOGGED-IN WORKSPACE DASHBOARD
 * ============================================================================
 * 
 * Purpose:
 * Personal operating dashboard for verified displaced artisans and field workers
 * enabling them to inspect current deployment shifts, toggle availability/medical rest,
 * and track daily wage matrix accruals.
 * 
 * Architectural Directives Implemented:
 * 1. Field Readiness Status Switcher: Real-time toggle between "Available for Work"
 *    and "Medical Rest" with immediate feedback to district dispatch queue.
 * 2. 4 Metric Telemetry Cards: Displays active project, daily wage matrix with hardship
 *    zone add-on, pending PFMS transfer amount, and cumulative service days.
 * 3. Worksite Safety & Shift Protocols: Concrete briefings on equipment and relief muster.
 */

import React, { useState } from 'react';
import { Beneficiary } from '../types';

interface CitizenDashboardViewProps {
  beneficiary: Beneficiary;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  beneficiary,
  onShowToast
}) => {
  // --------------------------------------------------------------------------
  // READINESS TOGGLE STATE
  // Allows worker to declare physical readiness for heavy civil labor
  // --------------------------------------------------------------------------
  const [isAvailable, setIsAvailable] = useState(true);

  const handleToggleReadiness = (status: boolean) => {
    setIsAvailable(status);
    onShowToast(
      status ? 'Status: Available for Work' : 'Status: Medical Rest Active',
      status 
        ? 'Your profile is active in Chooralmala civil labor matching queue.'
        : 'Disaster command notified of temporary medical rest. Re-assignment paused.',
      status ? 'success' : 'warning'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* ----------------------------------------------------------------------
       * SECTION 1: PROFILE & READINESS HEADER
       * Identification dossier and active readiness switcher toggle
       * ---------------------------------------------------------------------- */}
      <div className="card" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-lg)'
        }}>
          {/* Identity Dossier */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-landslide">Wayanad Rehabilitation Grid</span>
              <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-primary)' }}>verified</span>
                Aadhaar Verified ({beneficiary.aadhaarMasked})
              </span>
              <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
              <span className="font-mono" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                KL-WYD-2024-C4
              </span>
            </div>

            <h1 style={{ fontSize: '1.875rem', color: 'var(--color-primary)' }}>
              Welcome back, {beneficiary.name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Field Responder &amp; Artisan • Camp: {beneficiary.campId}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAvailable ? 'var(--color-tertiary)' : 'var(--color-secondary)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Ready for Deployment: <strong style={{ color: 'var(--color-primary)' }}>Masonry &amp; Structural Shoring Tier-2</strong>
              </span>
            </div>
          </div>

          {/* Deployment State Switcher */}
          <div style={{
            backgroundColor: 'var(--color-surface-low)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-outline-variant)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
              Field Readiness Status
            </span>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-surface-lowest)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => handleToggleReadiness(true)}
                className={`btn btn-sm ${isAvailable ? 'btn-primary' : 'btn-ghost'}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                <span>Available for Work</span>
              </button>
              <button
                onClick={() => handleToggleReadiness(false)}
                className={`btn btn-sm ${!isAvailable ? 'btn-urgent' : 'btn-ghost'}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>bed</span>
                <span>Medical Rest</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * SECTION 2: 4 METRIC TELEMETRY CARDS
       * Assigned project, daily wage matrix, pending disbursals, service days
       * ---------------------------------------------------------------------- */}
      <div className="grid-4">
        {/* Metric 1: Assigned Project */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-on-surface-variant)' }}>
              <span className="kpi-title">Assigned Recovery Project</span>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>foundation</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '6px' }}>
              {beneficiary.assignedProjectId || 'Standby for Match'}
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: beneficiary.placementStatus === 'Assigned' ? 'var(--color-tertiary)' : 'var(--color-secondary)', fontWeight: 600 }}>
              {beneficiary.placementStatus === 'Assigned' ? 'Active Dispatch Shift' : 'Candidate Pool Active'}
            </span>
            <span style={{ color: 'var(--color-on-surface-variant)' }}>{beneficiary.district || 'District'} Sector</span>
          </div>
        </div>

        {/* Metric 2: Daily Wage Matrix */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-on-surface-variant)' }}>
              <span className="kpi-title">Daily Wage Matrix</span>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>payments</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>₹850</span>
              <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>/ day</span>
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>+ ₹150 Hardship Zone</span>
            <span style={{ color: 'var(--color-tertiary)', fontWeight: 700 }}>DBT Active</span>
          </div>
        </div>

        {/* Metric 3: Pending Disbursal */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-on-surface-variant)' }}>
              <span className="kpi-title">Pending Disbursal</span>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)' }}>account_balance</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-tertiary)', marginTop: '6px' }}>
              ₹4,250
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-on-surface-variant)' }}>PFMS Clearing</span>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Batch #09-WYD</span>
          </div>
        </div>

        {/* Metric 4: Completed Days */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-on-surface-variant)' }}>
              <span className="kpi-title">Certified Livelihood Days</span>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>calendar_month</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-on-surface)', marginTop: '6px' }}>
              18 Days
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--color-on-surface-variant)' }}>Shift Target</span>
            <span style={{ fontWeight: 700, color: 'var(--color-tertiary)' }}>60% Completed</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * SECTION 3: WORKSITE PROTOCOLS & RELIEF CAMP SUPPORT
       * Concrete guidelines for PPE, safety gear, and ration logistics
       * ---------------------------------------------------------------------- */}
      <div className="grid-2">
        {/* Safety Briefing */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>health_and_safety</span>
            <h3 style={{ fontSize: '1.125rem', color: 'var(--color-on-surface)' }}>
              Hazard Zone 2 Safety &amp; Gear Protocols
            </h3>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>High-visibility reflective jacket and steel-toe rubber boots mandatory at site.</li>
            <li>In case of sudden heavy rain (&gt;15mm/hr), immediately retreat to High Ground Muster Point B.</li>
            <li>Clean drinking water &amp; ORS packets are replenished hourly at Sector Logistics Tent.</li>
          </ul>
        </div>

        {/* Camp Support */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>support_agent</span>
            <h3 style={{ fontSize: '1.125rem', color: 'var(--color-on-surface)' }}>
              Relief Help &amp; Grievance Redressal
            </h3>
          </div>
          <p style={{ fontSize: '13px' }}>
            If your daily wage is delayed beyond 48 hours or you require medical aid for your family,
            contact the Camp Relief Desk directly:
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onShowToast('Ticket Created', 'Wage audit ticket logged with District Collectorate.', 'info')}
            >
              <span className="material-symbols-outlined">report_problem</span>
              <span>Report Wage Discrepancy</span>
            </button>
            <a href="tel:1077" className="btn btn-error btn-sm" style={{ textDecoration: 'none' }}>
              <span className="material-symbols-outlined">sos</span>
              <span>1077 Emergency SOS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
