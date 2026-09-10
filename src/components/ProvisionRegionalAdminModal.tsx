/**
 * ============================================================================
 * SAHAYASETU PROVISION REGIONAL ADMIN LOGIN MODAL (SUPER ADMIN EXCLUSIVE)
 * ============================================================================
 * 
 * Purpose:
 * Enforces the architectural rule that Regional Admin logins can ONLY be 
 * created and credentialed by the statewide Super Admin. Public users cannot 
 * self-register as NGO or Regional Admin.
 * 
 * Capabilities:
 * 1. Officer Credentialing: Requires official name, SDMA Officer ID, and govt email.
 * 2. District Jurisdiction Binding: Assigns strict Row-Level Security (RLS) to one district.
 * 3. Scope Clarification: Confirms regional admin only has view-access for that district.
 */

import React, { useState } from 'react';
import { DistrictTenant, RegionalAdminAccount } from '../types';

interface ProvisionRegionalAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: DistrictTenant[];
  onProvisionAdmin: (admin: RegionalAdminAccount) => void;
}

export const ProvisionRegionalAdminModal: React.FC<ProvisionRegionalAdminModalProps> = ({
  isOpen,
  onClose,
  districts,
  onProvisionAdmin
}) => {
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [sdmaOfficerId, setSdmaOfficerId] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(districts[0]?.districtCode || 'KL-WYD-2024');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !email.trim()) return;

    const matchedDistrict = districts.find(d => d.districtCode === selectedDistrictCode);

    const newAdmin: RegionalAdminAccount = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: adminName.trim(),
      email: email.trim(),
      sdmaOfficerId: sdmaOfficerId.trim() || `SDMA-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
      districtId: selectedDistrictCode,
      districtName: matchedDistrict?.districtName || 'Wayanad Relief Zone',
      dateProvisioned: 'Today (09 Sep 2026)',
      status: 'Active'
    };

    onProvisionAdmin(newAdmin);
    setAdminName('');
    setEmail('');
    setSdmaOfficerId('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
              admin_panel_settings
            </span>
            <div>
              <span className="badge badge-rls">Super Admin Governance Authority</span>
              <h2 style={{ fontSize: '1.25rem', marginTop: '2px', color: 'var(--color-primary)' }}>
                Create Regional Admin Login
              </h2>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ minHeight: '36px', width: '36px', padding: 0 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#eff6ff',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #bfdbfe',
              fontSize: '12px',
              color: '#1e3a8a',
              lineHeight: 1.4
            }}>
              <strong>Access Policy:</strong> Regional Admin logins can only be created by Super Admin. 
              The provisioned regional admin will strictly only have the function to view registered users details in their assigned district.
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Administrator Full Legal Name *
              </label>
              <input
                className="input-field"
                placeholder="e.g., Priya Sharma or K. Ramanathan"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Official Government / SDMA Email *
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="e.g., priya.sharma@ksdma.kerala.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  SDMA Officer Credential ID
                </label>
                <input
                  className="input-field font-mono"
                  placeholder="e.g., SDMA-KL-WYD-042"
                  value={sdmaOfficerId}
                  onChange={(e) => setSdmaOfficerId(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Assigned Region / District *
                </label>
                <select
                  className="input-field"
                  value={selectedDistrictCode}
                  onChange={(e) => setSelectedDistrictCode(e.target.value)}
                >
                  {districts.map(d => (
                    <option key={d.districtCode} value={d.districtCode}>
                      {d.districtCode} ({d.districtName.split('(')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="card-inset" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                <span>Enforced Scope:</span>
              </div>
              <p style={{ marginTop: '2px', fontSize: '11px' }}>
                User will be granted login access to <strong>{selectedDistrictCode}</strong> only. 
                They will have view-only access to registered users details in that region.
              </p>
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', padding: 'var(--space-md) var(--space-lg)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-symbols-outlined">key</span>
              <span>Generate Regional Admin Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
