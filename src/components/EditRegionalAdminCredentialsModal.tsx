/**
 * ============================================================================
 * REGIONAL ADMIN CREDENTIALS EDIT MODAL
 * ============================================================================
 * 
 * Purpose:
 * Enables the logged-in Regional Administrator to update or change their login
 * credentials (Access Key/Password, Name, Phone, Email) at any time.
 * All updates remain fully visible to the Super Admin for statewide oversight.
 */

import React, { useState } from 'react';
import { RegionalAdminAccount } from '../types';
import { updateRegionalAdminSelfCredentials } from '../services/regionalAdminService';

interface EditRegionalAdminCredentialsModalProps {
  isOpen: boolean;
  admin: RegionalAdminAccount;
  onClose: () => void;
  onCredentialsUpdated: (updatedAdmin: RegionalAdminAccount) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const EditRegionalAdminCredentialsModal: React.FC<EditRegionalAdminCredentialsModalProps> = ({
  isOpen,
  admin,
  onClose,
  onCredentialsUpdated,
  onShowToast
}) => {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone || '');
  const [accessKey, setAccessKey] = useState(admin.password || admin.accessKey || '');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !accessKey.trim()) {
      onShowToast('Validation Incomplete', 'Name, Email, and Access Key cannot be blank.', 'warning');
      return;
    }

    const result = updateRegionalAdminSelfCredentials(admin.id, {
      name,
      email,
      phone,
      accessKey
    });

    if (!result.success || !result.updatedAdmin) {
      onShowToast('Update Failed', result.error || 'Unable to update credentials.', 'error');
      return;
    }

    onShowToast(
      'Credentials Updated',
      'Your regional login credentials have been updated successfully.',
      'success'
    );
    onCredentialsUpdated(result.updatedAdmin);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="card modal-surface" 
        style={{ 
          maxWidth: '540px', 
          width: '95%',
          borderTop: '4px solid var(--color-primary)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>key</span>
            </div>
            <div>
              <span className="badge badge-verified">District Administrator Profile</span>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: '2px 0 0 0' }}>
                Edit My Regional Credentials
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ padding: '4px', minHeight: 'auto' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: '12px',
          color: '#1e3a8a',
          marginBottom: 'var(--space-md)',
          lineHeight: 1.5
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <div>
              District Jurisdiction: <strong>{admin.districtName} ({admin.districtId})</strong>
            </div>
            <span className="badge badge-rls">Jurisdiction Locked</span>
          </div>
          <div style={{ marginTop: '4px' }}>
            Officer Credential ID: <strong className="font-mono">{admin.officerCredentialId || admin.sdmaOfficerId}</strong> • Partner NGO: <strong>{admin.ngoName}</strong>
          </div>
          <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '6px' }}>
            * Your Officer Credential ID and district assignment are provisioned by the Super Admin. You can update your password and personal contact info below at any time.
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              Officer Credential ID (Generated by Super Admin)
            </label>
            <input
              type="text"
              className="input-field font-mono"
              value={admin.officerCredentialId || admin.sdmaOfficerId}
              disabled
              style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}
            />
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Your unique officer login identifier assigned by Super Admin.
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              Full Legal Name *
            </label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Official Email (Login ID) *
              </label>
              <input
                type="email"
                className="input-field font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Official Mobile Phone
              </label>
              <input
                type="tel"
                className="input-field font-mono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                New Password / Access Passcode *
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowKey(!showKey)}
                style={{ fontSize: '11px', padding: '2px 6px', minHeight: 'auto' }}
              >
                {showKey ? 'Hide' : 'Show'} Password
              </button>
            </div>
            <input
              type={showKey ? 'text' : 'password'}
              className="input-field font-mono"
              placeholder="Enter new secret access key or password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              required
              style={{ fontWeight: 700 }}
            />
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              This password will be required next time you log into your regional admin account.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'var(--space-xs)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-outline-variant)' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
