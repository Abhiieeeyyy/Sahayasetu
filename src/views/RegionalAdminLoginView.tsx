/**
 * ============================================================================
 * REGIONAL ADMIN DEDICATED LOGIN VIEW (RegionalAdminLoginView.tsx)
 * ============================================================================
 * 
 * Purpose:
 * Dedicated full-screen authentication workstation for Kerala District Relief
 * Officers. Citizens and Regional Admins are completely decoupled.
 * 
 * Authentication Requirements:
 * - Officer Credential ID (e.g., OFF-KL-WYD-401 or SDMA ID)
 * - Passcode / Password (e.g., KRC-WYD-9941)
 * 
 * When logged out, returning to #/regionaladmin strictly displays this login view.
 */

import React, { useState } from 'react';
import { RegionalAdminAccount } from '../types';
import { authenticateRegionalAdmin, getStoredRegionalAdmins } from '../services/regionalAdminService';

interface RegionalAdminLoginViewProps {
  onLoginSuccess: (admin: RegionalAdminAccount) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const RegionalAdminLoginView: React.FC<RegionalAdminLoginViewProps> = ({
  onLoginSuccess,
  onShowToast
}) => {
  const [identifier, setIdentifier] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');

  const [adminsList, setAdminsList] = useState<RegionalAdminAccount[]>(() => getStoredRegionalAdmins());

  React.useEffect(() => {
    const handleUpdate = () => {
      setAdminsList(getStoredRegionalAdmins());
    };
    window.addEventListener('sahayasetu_admins_updated', handleUpdate);
    return () => window.removeEventListener('sahayasetu_admins_updated', handleUpdate);
  }, []);

  const activeAdmins = adminsList.filter(a => a.status === 'Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = authenticateRegionalAdmin(identifier, passcode);
    setIsSubmitting(false);

    if (!result.success || !result.admin) {
      setErrorMsg(result.error || 'Authentication failed. Please verify your Officer ID and Passcode.');
      onShowToast('Login Failed', result.error || 'Invalid credentials.', 'error');
      return;
    }

    onShowToast(
      'Regional Admin Verified',
      `Welcome, ${result.admin.name}! Scoped to ${result.admin.districtName}.`,
      'success'
    );
    onLoginSuccess(result.admin);
  };

  const handleQuickFill = (admin: RegionalAdminAccount) => {
    setSelectedAdminId(admin.id);
    setIdentifier(admin.officerCredentialId || admin.sdmaOfficerId || admin.email);
    setPasscode(admin.password || admin.accessKey || '');
    setErrorMsg(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: 'var(--space-md) var(--space-sm) var(--space-2xl) var(--space-sm)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '560px',
        padding: 'var(--space-2xl) var(--space-xl)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        border: '1px solid var(--color-outline-variant)',
        borderTop: '5px solid var(--color-secondary)',
        position: 'relative'
      }}>
        {/* Official Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            border: '2px solid #bfdbfe',
            color: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.08)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>badge</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge badge-rls" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Relief Station
            </span>
            <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', fontSize: '10px' }}>
              RLS Scoped
            </span>
          </div>

          <h1 style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            color: 'var(--color-secondary)',
            margin: '4px 0 6px 0',
            letterSpacing: '-0.01em'
          }}>
            Regional Administrator Login
          </h1>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-on-surface-variant)',
            lineHeight: 1.5,
            margin: 0,
            maxWidth: '460px',
            marginInline: 'auto'
          }}>
            Enter your official <strong>Officer Credential ID</strong> and <strong>Passcode</strong> provisioned by State Command to access your district intake roster and relief dispatches.
          </p>
        </div>

        {/* Security / Decoupling Notice */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: 'var(--space-md)',
          fontSize: '12px',
          color: '#1e3a8a',
          lineHeight: 1.45,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }}>
            security
          </span>
          <div>
            <strong>Dedicated Official Workstation:</strong> Regional administrative authentication is completely isolated from citizen logins. Access is strictly scoped to your authorized Kerala district.
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            color: '#b91c1c',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0 }}>error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Field 1: Officer ID */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                Officer Credential ID *
              </label>
              <span className="badge" style={{ fontSize: '10px', backgroundColor: 'var(--color-surface-container)' }}>
                District ID
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field font-mono"
                placeholder="e.g. OFF-KL-WYD-401"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
                style={{ fontWeight: 600, paddingLeft: '38px', height: '44px' }}
              />
              <span className="material-symbols-outlined" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                color: 'var(--color-on-surface-variant)',
                pointerEvents: 'none'
              }}>
                badge
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              Unique officer credential ID assigned to your district NGO relief unit.
            </div>
          </div>

          {/* Field 2: Passcode */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                Officer Passcode / Password *
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPassword(!showPassword)}
                style={{ fontSize: '11px', padding: '2px 6px', minHeight: 'auto' }}
              >
                {showPassword ? 'Hide Passcode' : 'Show Passcode'}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field font-mono"
                placeholder="Enter your officer passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                style={{ fontWeight: 600, paddingLeft: '38px', height: '44px' }}
              />
              <span className="material-symbols-outlined" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                color: 'var(--color-on-surface-variant)',
                pointerEvents: 'none'
              }}>
                lock
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              District security key (e.g. KRC-WYD-9941).
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-secondary btn-touch"
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to District Workstation'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Helper for All 14 Districts */}
        {activeAdmins.length > 0 && (
          <div style={{
            marginTop: '20px',
            backgroundColor: 'var(--color-surface-low)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-on-surface)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>bolt</span>
                <span>Select District Officer (14 Kerala Districts):</span>
              </span>
              <span className="badge" style={{ fontSize: '10px', backgroundColor: '#eff6ff', color: '#1e3a8a' }}>
                {activeAdmins.length} Officers Provisioned
              </span>
            </div>

            {/* Dropdown Quick Select */}
            <select
              className="select-field"
              value={selectedAdminId}
              onChange={(e) => {
                const found = activeAdmins.find(a => a.id === e.target.value);
                if (found) handleQuickFill(found);
              }}
              style={{
                width: '100%',
                marginBottom: '10px',
                fontSize: '12px',
                height: '38px',
                backgroundColor: 'var(--color-surface-lowest)',
                fontWeight: 600
              }}
            >
              <option value="">-- Choose Any District Officer to Auto-Fill --</option>
              {activeAdmins.map(adm => {
                const offId = adm.officerCredentialId || adm.sdmaOfficerId;
                const pass = adm.password || adm.accessKey || '';
                return (
                  <option key={adm.id} value={adm.id}>
                    {adm.districtName} — {offId} (Pass: {pass}) — {adm.name}
                  </option>
                );
              })}
            </select>

            {/* Quick Pills for Fast Clicking */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '6px',
              maxHeight: '180px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {activeAdmins.map(adm => {
                const offId = adm.officerCredentialId || adm.sdmaOfficerId;
                const pass = adm.password || adm.accessKey || '';
                const isSelected = selectedAdminId === adm.id;
                return (
                  <button
                    key={adm.id}
                    type="button"
                    onClick={() => handleQuickFill(adm)}
                    className="btn btn-sm btn-ghost"
                    style={{
                      fontSize: '11px',
                      padding: '5px 8px',
                      backgroundColor: isSelected ? '#eff6ff' : 'var(--color-surface-lowest)',
                      border: isSelected ? '1px solid var(--color-secondary)' : '1px solid var(--color-outline-variant)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    title={`Click to fill: ${adm.name} (${adm.districtName})`}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>{adm.districtName.split('(')[0].trim()}</strong>: <span className="font-mono">{offId}</span>
                    </span>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-secondary)', marginLeft: '4px', flexShrink: 0 }}>
                      {pass}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
