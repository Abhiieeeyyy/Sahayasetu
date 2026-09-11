/**
 * ============================================================================
 * SAHAYASETU EDIT CIVIL REQUISITION MODAL (EditJobModal.tsx)
 * ============================================================================
 * 
 * Purpose:
 * Enables Regional Administrators to modify and update active or posted
 * emergency civil reconstruction job postings within their assigned district.
 * 
 * Capabilities:
 * - Update project title, agency, worksite location/sector
 * - Adjust urgency priority level
 * - Modify required trade/skill requirements
 * - Adjust quota (workers needed), daily wage rate, and hardship allowance
 * - Change status ('Open', 'Fulfilling', 'Completed')
 */

import React, { useState, useEffect } from 'react';
import { JobRequisition, ProjectPriority, VocationalSkill } from '../types';

interface EditJobModalProps {
  isOpen: boolean;
  requisition: JobRequisition | null;
  onClose: () => void;
  onSave: (updatedRequisition: JobRequisition) => void;
}

const AVAILABLE_SKILLS: VocationalSkill[] = [
  'Masonry',
  'Carpentry',
  'Electrical',
  'Plumbing',
  'Heavy Machinery',
  'General Civil Labor',
  'Steel Fixing',
  'Roofing'
];

export const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  requisition,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('');
  const [sectorLocation, setSectorLocation] = useState('');
  const [priority, setPriority] = useState<ProjectPriority>('SOS Urgent');
  const [requiredSkill, setRequiredSkill] = useState<VocationalSkill>('Masonry');
  const [requiredCount, setRequiredCount] = useState<number>(5);
  const [dailyWage, setDailyWage] = useState<number>(850);
  const [hardshipAllowance, setHardshipAllowance] = useState<number>(150);
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [status, setStatus] = useState<JobRequisition['status']>('Open');

  useEffect(() => {
    if (requisition) {
      setTitle(requisition.title || '');
      setAgency(requisition.agency || '');
      setSectorLocation(requisition.sectorLocation || requisition.worksite || '');
      setPriority(requisition.priority || 'SOS Urgent');
      setRequiredSkill(requisition.requiredSkills?.[0] || 'Masonry');
      setRequiredCount(requisition.requiredCount || 1);
      setDailyWage(requisition.dailyWage || 850);
      setHardshipAllowance(requisition.hardshipAllowance || 150);
      setDurationWeeks(requisition.durationWeeks || 4);
      setStatus(requisition.status || 'Open');
    }
  }, [requisition, isOpen]);

  if (!isOpen || !requisition) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: JobRequisition = {
      ...requisition,
      title: title.trim(),
      agency: agency.trim(),
      sectorLocation: sectorLocation.trim(),
      worksite: sectorLocation.trim(),
      priority,
      requiredSkills: [requiredSkill],
      requiredCount: Number(requiredCount) || 1,
      dailyWage: Number(dailyWage) || 800,
      hardshipAllowance: Number(hardshipAllowance) || 0,
      durationWeeks: Number(durationWeeks) || 1,
      status
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-rls font-mono">{requisition.id}</span>
              <span className="badge badge-landslide">Regional Admin Portal</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '6px', color: 'var(--color-primary)' }}>
              Edit Posted Job Requisition
            </h2>
          </div>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={onClose} 
            style={{ minHeight: '36px', width: '36px', padding: 0 }}
          >
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

            {/* Contracting Agency & Worksite Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Contracting Agency / NGO *
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

            {/* Urgency Priority & Primary Trade Skill */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Urgency Priority *
                </label>
                <select
                  className="input-field"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                >
                  <option value="SOS Urgent">SOS Urgent (Immediate Hazard)</option>
                  <option value="High Priority">High Priority (Infrastructure)</option>
                  <option value="Medium Standard">Medium Standard (Secondary)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Primary Trade Required *
                </label>
                <select
                  className="input-field"
                  value={requiredSkill}
                  onChange={(e) => setRequiredSkill(e.target.value as VocationalSkill)}
                >
                  {AVAILABLE_SKILLS.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Workers Needed, Daily Wage, Hardship Allowance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Workers Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="input-field tabular-nums"
                  value={requiredCount}
                  onChange={(e) => setRequiredCount(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Daily Wage (₹) *
                </label>
                <input
                  type="number"
                  min="300"
                  step="25"
                  className="input-field tabular-nums"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Hardship Allow. (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="25"
                  className="input-field tabular-nums"
                  value={hardshipAllowance}
                  onChange={(e) => setHardshipAllowance(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Duration Weeks & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Duration (Weeks) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  className="input-field tabular-nums"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                  Requisition Status *
                </label>
                <select
                  className="input-field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobRequisition['status'])}
                >
                  <option value="Open">Open (Accepting Matches)</option>
                  <option value="Fulfilling">Fulfilling (Partially Dispatched)</option>
                  <option value="Completed">Completed (Quota Reached)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-symbols-outlined">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
