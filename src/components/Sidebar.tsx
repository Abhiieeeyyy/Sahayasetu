/**
 * ============================================================================
 * SAHAYASETU FIELD OPERATIONS SIDEBAR NAVIGATION
 * ============================================================================
 * 
 * Purpose:
 * Fixed left navigation rail dedicated to rapid operational workflow transitions
 * during disaster management operations.
 * 
 * Key Capabilities:
 * 1. Category Sections: 'Field Operations' and 'Citizen Livelihood'.
 * 2. Active Tab Indication: High-contrast teal highlight indicating the active view.
 * 3. Local-First Database Sync Gauge: Visual telemetry demonstrating offline AES-256
 *    caching and satellite relay queue readiness.
 */

import React from 'react';
import { NavigationTab, UserRole, RegionalAdminAccount } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOfflineMode?: boolean;
  currentRole: UserRole;
  activeRegionalAdmin?: RegionalAdminAccount | null;
  onOpenEditCredentials?: () => void;
  onRegionalAdminLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  activeRegionalAdmin,
  onOpenEditCredentials,
  onRegionalAdminLogout
}) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: '80px',
      bottom: 0,
      width: '260px',
      backgroundColor: 'var(--color-surface-lowest)',
      borderRight: '1px solid var(--color-outline-variant)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--space-md)',
      zIndex: 40,
      overflowY: 'auto'
    }}>
      {/* ----------------------------------------------------------------------
       * SECTION 1: PRIMARY OPERATIONAL NAVIGATION LINKS (ROLE SCOPED)
       * Regional Admin: View registered users details in Wayanad
       * Super Admin: Statewide multi-tenant command and all access
       * Citizen User: Gated strictly behind Google Sign-In
       * ---------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {/* REGIONAL ADMIN SIDEBAR: View registered users details in that region only */}
        {currentRole === 'regional-admin' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              paddingLeft: '8px',
              marginBottom: '8px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>lock</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-secondary)'
              }}>
                {activeRegionalAdmin ? `${activeRegionalAdmin.districtName.split('(')[0]} Admin` : 'Regional Admin'}
              </span>
            </div>
            
            {!activeRegionalAdmin ? (
              <div style={{
                padding: '16px 12px',
                backgroundColor: 'var(--color-surface-low)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px auto',
                  color: 'var(--color-secondary)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>badge</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
                  Sign-In Required
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>
                  Please enter your Officer Credential ID and Passcode to access your district roster.
                </div>
              </div>
            ) : (
              <div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => onSelectTab('beneficiary-intake')}
                    className={`btn ${activeTab === 'beneficiary-intake' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
                    <span>Registered Users ({activeRegionalAdmin.districtId.split('-')[1] || 'District'})</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('skill-matching')}
                    className={`btn ${activeTab === 'skill-matching' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>engineering</span>
                    <span>Post Jobs &amp; Match Users</span>
                  </button>

                  {onOpenEditCredentials && (
                    <button
                      type="button"
                      onClick={onOpenEditCredentials}
                      className="btn btn-ghost"
                      style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '13px' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>key</span>
                      <span>Edit My Credentials</span>
                    </button>
                  )}

                  {onRegionalAdminLogout && (
                    <button
                      type="button"
                      onClick={onRegionalAdminLogout}
                      className="btn btn-ghost"
                      style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '13px', color: '#b91c1c' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b91c1c' }}>logout</span>
                      <span>Officer Logout</span>
                    </button>
                  )}
                </nav>

                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  color: '#1e3a8a',
                  lineHeight: 1.4
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, marginBottom: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>security</span>
                    <span>Regional Admin Scope:</span>
                  </div>
                  Logged in: <strong>{activeRegionalAdmin.name}</strong>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#1e40af', marginTop: '2px', fontWeight: 700 }}>
                    Officer ID: {activeRegionalAdmin.officerCredentialId || activeRegionalAdmin.sdmaOfficerId}
                  </div>
                  <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '2px' }}>
                    {activeRegionalAdmin.ngoName || 'Accredited Relief NGO'}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    Access restricted to <strong>{activeRegionalAdmin.districtName}</strong>.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUPER ADMIN SIDEBAR: Has ALL the access */}
        {currentRole === 'super-admin' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              paddingLeft: '8px',
              marginBottom: '8px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>vpn_key</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-primary)'
              }}>
                Statewide Governance
              </span>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => onSelectTab('super-admin')}
                className={`btn ${activeTab === 'super-admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>admin_panel_settings</span>
                <span>Command Center</span>
              </button>

              <button
                onClick={() => onSelectTab('beneficiary-intake')}
                className={`btn ${activeTab === 'beneficiary-intake' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_reg</span>
                <span>All Districts Roster</span>
              </button>

              <button
                onClick={() => onSelectTab('skill-matching')}
                className={`btn ${activeTab === 'skill-matching' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>hub</span>
                <span>Statewide Dispatch</span>
              </button>
            </nav>
          </div>
        )}

        {/* CITIZEN USER SIDEBAR: Only show Application Form and Application Tracking AFTER Google Sign-In */}
        {currentRole === 'citizen-user' && (
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-on-surface-variant)',
              paddingLeft: '8px',
              display: 'block',
              marginBottom: '8px'
            }}>
              Citizen Portal
            </span>
            
            {!isAuthenticated ? (
              /* Before Google Sign-In: Do NOT show application form or application tracking */
              <div style={{
                padding: '16px 12px',
                backgroundColor: 'var(--color-surface-low)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px auto',
                  color: 'var(--color-on-surface-variant)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
                  Sign-In Required
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>
                  Please sign in with your Google account to access the Application Form and Application Tracking.
                </div>
              </div>
            ) : (
              /* After Google Sign-In: Reveal Application Form and Application Tracking */
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => onSelectTab('registration')}
                  className={`btn ${activeTab === 'registration' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>assignment_ind</span>
                  <span>
                    {language === 'ML' ? '1. അപേക്ഷാ ഫോറം' : '1. Application Form'}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('self-portal')}
                  className={`btn ${activeTab === 'self-portal' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>track_changes</span>
                  <span>
                    {language === 'ML' ? '2. അപേക്ഷാ ട്രാക്കിംഗ്' : '2. Application Tracking'}
                  </span>
                </button>
              </nav>
            )}

            {/* Quick Links to Official Admin Portals */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--color-outline-variant)'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-on-surface-variant)',
                paddingLeft: '8px',
                display: 'block',
                marginBottom: '6px'
              }}>
                Official Portals
              </span>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <a
                  href="/regionaladmin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/regionaladmin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '12px', padding: '6px 10px', textDecoration: 'none' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>badge</span>
                  <span>Regional Admin Portal</span>
                </a>
                <a
                  href="/superadmin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/superadmin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', fontSize: '12px', padding: '6px 10px', textDecoration: 'none' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>admin_panel_settings</span>
                  <span>Super Admin Command</span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Operational Telemetry Footer */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid var(--color-outline-variant)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        color: 'var(--color-on-surface-variant)'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#16a34a' }}>wifi_tethering</span>
        <span>KSDMA Relief Network v2.4</span>
      </div>
    </aside>
  );
};
