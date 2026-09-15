/**
 * ============================================================================
 * SAHAYASETU EMERGENCY CIVIL REQUISITION MODAL (POST NEED)
 * ============================================================================
 * 
 * Purpose:
 * Enables government disaster authorities (KSDMA, NDRF) and accredited NGOs
 * to register urgent civil reconstruction needs requiring local vocational talent.
 * 
 * Key Capabilities:
 * 1. Project Scoping: Captures project title, contracting department, and zone sector.
 * 2. Urgency Tiers: Supports 'SOS Urgent' (immediate hazard mitigation) to 'Medium Standard'.
 * 3. Skill & Labor Quota: Specifies trade category and target artisan headcount.
 * 4. Wage Specifications: Enforces fair daily living wages + hardship zone add-ons.
 */

import React, { useState, useEffect } from 'react';
import { JobRequisition, ProjectPriority, VocationalSkill, RegionalAdminAccount } from '../types';

interface PostNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requisition: JobRequisition) => void;
  activeRegionalAdmin?: RegionalAdminAccount | null;
}

export const PostNeedModal: React.FC<PostNeedModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activeRegionalAdmin
}) => {
  // --------------------------------------------------------------------------
  // FORM STATE
  // Manages field values for emergency reconstruction requisitions
  // --------------------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('KSDMA & Habitat for Humanity');
  const [sectorLocation, setSectorLocation] = useState('Chooralmala Sector 2 Riverbank');
  const [priority, setPriority] = useState<ProjectPriority>('SOS Urgent');
  const [requiredSkill, setRequiredSkill] = useState<VocationalSkill>('Masonry');
  const [requiredCount, setRequiredCount] = useState(12);
  const [dailyWage, setDailyWage] = useState(850);
  const hardshipAllowance = 150;
  const [durationWeeks, setDurationWeeks] = useState(4);

  // Prefill fields from active Regional Admin if available
  useEffect(() => {
    if (activeRegionalAdmin) {
      if (activeRegionalAdmin.ngoName) {
        setAgency(activeRegionalAdmin.ngoName);
      }
      const districtShort = activeRegionalAdmin.districtName.split('(')[0].trim();
      setSectorLocation(`${districtShort} Key Reconstruction Sector`);
    }
  }, [activeRegionalAdmin, isOpen]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // HANDLE REQUISITION SUBMIT
  // Assembles standard JobRequisition object
  // --------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const districtCode = activeRegionalAdmin?.districtId.split('-')[1] || 'WYD';
    const newReq: JobRequisition = {
      id: `REQ-${districtCode}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      agency,
      sectorLocation: sectorLocation.trim(),
      worksite: sectorLocation.trim(),
      priority,
      requiredSkills: [requiredSkill],
      requiredCount: Number(requiredCount) || 5,
      assignedCount: 0,
      dailyWage: Number(dailyWage) || 800,
      hardshipAllowance: Number(hardshipAllowance) || 100,
      durationWeeks: Number(durationWeeks) || 3,
      startDate: 'Immediate 08:00',
      status: 'Open',
      districtId: activeRegionalAdmin?.districtId || 'KL-WYD-2024',
      districtName: activeRegionalAdmin?.districtName || 'Wayanad',
      postedByAdminId: activeRegionalAdmin?.id,
      postedByAdminName: activeRegionalAdmin?.name
    };

    onSubmit(newReq);
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-landslide">Immediate Rebuilding Need</span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '4px', color: 'var(--color-primary)' }}>
              Post Emergency Civil Requisition
            </h2>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ minHeight: '36px', width: '36px', padding: 0 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Project Title */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Civil Works Project Title *
              </label>
              <input
                className="input-field"
                placeholder="e.g., Meppadi Culvert 4 Debris Clearance & Trench Shoring"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Contracting Agency & Sector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Contracting Agency / NGO
                </label>
                <input
                  className="input-field"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Worksite Location / Address *
                </label>
                <input
                  className="input-field"
                  placeholder="e.g., Chooralmala Sector 2 Riverbank Worksite"
                  value={sectorLocation}
                  onChange={(e) => setSectorLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Priority & Skill Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Urgency Priority
                </label>
                <select
                  className="input-field"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                >
                  <option value="SOS Urgent">SOS Urgent (Life Safety / Access Route)</option>
                  <option value="High Priority">High Priority (Infrastructure Repair)</option>
                  <option value="Medium Standard">Medium Standard (Secondary Rehabilitation)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Primary Trade Required
                </label>
                <select
                  className="input-field"
                  value={requiredSkill}
                  onChange={(e) => setRequiredSkill(e.target.value as VocationalSkill)}
                >
                  <option value="Masonry">Masonry &amp; Stone Work</option>
                  <option value="Carpentry">Carpentry &amp; Framework</option>
                  <option value="Electrical">Electrical Lines &amp; Generators</option>
                  <option value="Plumbing">Plumbing &amp; Water Pipeline</option>
                  <option value="Heavy Machinery">Heavy Excavator / Machinery</option>
                  <option value="General Civil Labor">General Civil Clearance</option>
                  <option value="Steel Fixing">Steel Fixing / Concrete</option>
                  <option value="Roofing">Roofing &amp; Waterproofing</option>
                </select>
              </div>
            </div>

            {/* Labor Headcount & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Workers Needed
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="input-field tabular-nums"
                  value={requiredCount}
                  onChange={(e) => setRequiredCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Daily Wage (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  className="input-field tabular-nums"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Duration (Weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  className="input-field tabular-nums"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-symbols-outlined">assignment_turned_in</span>
              <span>Publish Emergency Requisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
