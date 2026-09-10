/**
 * ============================================================================
 * SAHAYASETU GLOBAL MISSION COMMAND HEADER COMPONENT
 * ============================================================================
 * 
 * Purpose:
 * The primary navigational and authoritative anchor across all screens.
 * 
 * Key Functional Capabilities:
 * 1. Brand Identity: Displays the official SahayaSetu emblem and platform title.
 * 2. Scoped Jurisdiction Context: Indicates strict Row-Level Security (RLS) active
 *    region (e.g. KL-WYD-2024 Wayanad) and Tenant Tier.
 * 3. Perspective / Role Switcher: Enables instant simulation of different user
 *    roles (Regional Relief Coordinator, Super Admin, Displaced Beneficiary, Public Applicant).
 * 4. Primary View Tabs: Quick links across core operational modules.
 * 5. Telemetry & Safety: Real-time VSAT connectivity status indicator and 24/7 SOS Helpline trigger.
 */

import React from 'react';
import { NavigationTab, UserRole, RegionalAdminAccount } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  currentRole: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onTriggerSos: () => void;
  isOfflineMode?: boolean;
  onToggleOffline?: () => void;
  activeRegionalAdmin?: RegionalAdminAccount | null;
  onOpenRegionalAdminLogin?: () => void;
  onOpenEditCredentials?: () => void;
  onRegionalAdminLogout?: () => void;
  onSwitchToRegionalAdmin?: () => void;
  onRefreshCloud?: () => void;
  isCloudSyncing?: boolean;
  isSuperAdminAuthenticated?: boolean;
  onSuperAdminLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onTriggerSos,
  activeRegionalAdmin,
  onOpenRegionalAdminLogin,
  onOpenEditCredentials,
  onRegionalAdminLogout,
  onSwitchToRegionalAdmin,
  onRefreshCloud,
  isCloudSyncing = false,
  isSuperAdminAuthenticated = false,
  onSuperAdminLogout
}) => {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header className="fixed-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      backgroundColor: 'var(--color-surface-lowest)',
      borderBottom: '1px solid var(--color-outline-variant)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-lg)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* ----------------------------------------------------------------------
       * SECTION 1: BRAND EMBLEM & SCOPED JURISDICTION
       * Displays official platform logo, name, and current district jurisdiction
       * ---------------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minWidth: '320px' }}>
        <img 
          src="/assets/emblem.svg" 
          alt="SahayaSetu Humanitarian Emblem" 
          style={{ width: '42px', height: '42px', objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span style={{ 
              fontFamily: 'var(--font-header)', 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              color: 'var(--color-primary)',
              letterSpacing: '-0.02em'
            }}>
              SahayaSetu
            </span>
            <span className="badge" style={{ 
              backgroundColor: 'var(--color-surface-container)', 
              color: 'var(--color-on-surface-variant)',
              fontSize: '10px'
            }}>
              Kerala Disaster Relief OS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '0.6875rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px', color: currentRole === 'super-admin' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
              {currentRole === 'super-admin' ? 'vpn_key' : 'lock'}
            </span>
            <span style={{ fontWeight: 600, color: currentRole === 'super-admin' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
              {currentRole === 'super-admin' 
                ? 'Super Admin: Statewide Access (All Kerala Districts)' 
                : currentRole === 'regional-admin'
                  ? (activeRegionalAdmin 
                      ? `Regional Admin: ${activeRegionalAdmin.name} (${activeRegionalAdmin.districtName.split('(')[0].trim()})`
                      : 'Regional Admin: Official Sign-In')
                  : 'Citizen User: Registration & Application Tracking'}
            </span>
            <span style={{ color: 'var(--color-outline-variant)' }}>|</span>
            <span style={{ color: 'var(--color-on-surface-variant)' }}>
              {currentRole === 'super-admin' 
                ? 'Kerala KSDMA Oversight' 
                : currentRole === 'regional-admin' 
                  ? (activeRegionalAdmin ? `District Scoped (${activeRegionalAdmin.districtId})` : 'Authentication Required') 
                  : 'Beneficiary Access'}
            </span>
          </div>
        </div>
      </div>

      {/* Center spacer */}
      <div style={{ flex: 1 }} />

      {/* ----------------------------------------------------------------------
       * SECTION 2: ACTIONS, SOS HELPLINE & USER PROFILE AT TOP RIGHT END
       * ---------------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>

        {/* Controls when in super admin mode */}
        {currentRole === 'super-admin' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSuperAdminAuthenticated ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-primary)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-primary)' }}>admin_panel_settings</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  Super Admin Active
                </span>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: '#fef2f2',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #fecaca',
                fontSize: '11px',
                color: '#b91c1c',
                fontWeight: 700
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                <span>Super Admin: Login Required</span>
              </div>
            )}
          </div>
        )}





        {/* Supabase Live Cloud Sync Button (Only visible for Admins, hidden for Citizen End-Users) */}
        {currentRole !== 'citizen-user' && onRefreshCloud && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onRefreshCloud}
            disabled={isCloudSyncing}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isCloudSyncing ? 'var(--color-primary)' : 'var(--color-on-surface)',
              backgroundColor: 'var(--color-surface-low)',
              border: '1px solid var(--color-outline-variant)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)'
            }}
            title="Synchronize live state with Supabase database"
          >
            <span 
              className="material-symbols-outlined" 
              style={{ 
                fontSize: '16px', 
                animation: isCloudSyncing ? 'spin 0.8s linear infinite' : 'none',
                color: isCloudSyncing ? 'var(--color-primary)' : '#16a34a'
              }}
            >
              {isCloudSyncing ? 'sync' : 'cloud_done'}
            </span>
            <span className="hidden-sm">
              {isCloudSyncing ? 'Syncing...' : 'Sync Cloud'}
            </span>
          </button>
        )}

        {/* SOS Emergency Call Button */}
        <button 
          className="btn btn-sm btn-error" 
          onClick={onTriggerSos}
          title="Emergency Disaster Relief Helpline (1077)"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sos</span>
          <span>Helpline 1077</span>
        </button>

        {/* Authenticated Citizen User Status Bar (ONLY for Citizen Role - Admin is NOT a User) */}
        {currentRole === 'citizen-user' && isAuthenticated && user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            backgroundColor: 'var(--color-surface-low)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--color-outline-variant)'
              }}
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                {user.fullName}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
                {user.email}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="btn btn-sm btn-ghost"
              style={{
                padding: '2px 6px',
                fontSize: '11px',
                color: 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                marginLeft: '4px'
              }}
              title="Sign out of Google Account"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
