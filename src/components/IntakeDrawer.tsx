/**
 * ============================================================================
 * SAHAYASETU RAPID BENEFICIARY INTAKE SLIDE-OVER DRAWER
 * ============================================================================
 * 
 * Purpose:
 * High-velocity field intake drawer allowing regional relief coordinators
 * and field intake volunteers to rapidly register displaced persons under harsh
 * conditions without disrupting their current live roster view.
 * 
 * Key Capabilities:
 * 1. Rapid Demographic & Identification: Legal name, masked Aadhaar ID, and phone number.
 * 2. Calamity Tagging: Categorizes the beneficiary under Landslide, Flood, or Cyclone.
 * 3. Vocational Skills Chips: Multi-select interactive toggles for trades (Masonry,
 *    Carpentry, Electrical, Plumbing, etc.).
 * 4. Medical Fitness & Biometric Status: Toggles certifying physical capability for
 *    civil recovery works.
 * 5. Immediate Local-First Queue: Validates and pushes to the roster immediately.
 */

import React, { useState } from 'react';
import { Beneficiary, CalamityType, VocationalSkill, LivingStatus, RegionalAdminAccount } from '../types';

interface IntakeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (beneficiary: Beneficiary) => void;
  activeRegionalAdmin?: RegionalAdminAccount | null;
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

export const IntakeDrawer: React.FC<IntakeDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activeRegionalAdmin
}) => {
  // --------------------------------------------------------------------------
  // FORM STATE MANAGEMENT
  // Controlled fields capturing beneficiary intake data
  // --------------------------------------------------------------------------
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [calamity, setCalamity] = useState<CalamityType>('Landslide');
  const [selectedSkills, setSelectedSkills] = useState<VocationalSkill[]>(['Masonry']);
  const [livingStatus, setLivingStatus] = useState<LivingStatus>('Relief Camp');
  const [campId, setCampId] = useState('WYD-CMP-042 (Meppadi Camp)');
  const [experienceYears, setExperienceYears] = useState(5);
  const [isMedicalFit, setIsMedicalFit] = useState(true);
  const [isBioVerified, setIsBioVerified] = useState(true);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // TOGGLE VOCATIONAL SKILL SELECTION
  // Allows selecting or deselecting verified artisan skills
  // --------------------------------------------------------------------------
  const handleToggleSkill = (skill: VocationalSkill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // --------------------------------------------------------------------------
  // SUBMIT BENEFICIARY INTAKE
  // Builds standard beneficiary object and invokes callback
  // --------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const adminDistrictId = activeRegionalAdmin?.districtId || 'KL-WYD-2024';
    const adminDistrictName = activeRegionalAdmin?.districtName?.split('(')[0]?.trim() || 'Wayanad';

    const newBeneficiary: Beneficiary = {
      id: `BEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      phone: phone || '98470 11223',
      aadhaarMasked: `•••• •••• ${aadhaarLast4 ? aadhaarLast4.padStart(4, '0') : '7721'}`,
      state: 'Kerala',
      district: adminDistrictName,
      districtId: adminDistrictId,
      campId: campId || `${adminDistrictName} Designated Relief Shelter`,
      calamity,
      skills: selectedSkills,
      experienceYears: Number(experienceYears) || 3,
      livingStatus,
      dailyWageTier: 850,
      isMedicalFit,
      isBioVerified,
      placementStatus: 'Available',
      registeredDate: 'Just now'
    };

    onSubmit(newBeneficiary);
    // Reset form
    setName('');
    setPhone('');
    setAadhaarLast4('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface-low)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-rls">KL-WYD-2024</span>
              <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
                Protocol BPI-v2
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '4px', color: 'var(--color-primary)' }}>
              Rapid Beneficiary Field Intake
            </h2>
          </div>
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            style={{ minHeight: '36px', width: '36px', padding: 0 }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drawer Body Form */}
        <form onSubmit={handleSubmit} style={{ 
          padding: 'var(--space-lg)', 
          flex: 1, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)'
        }}>
          {/* Field 1: Full Legal Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              Full Legal Name (as per SDMA relief log) *
            </label>
            <input
              className="input-field"
              placeholder="e.g., Haridas M."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Field 2: Phone & Aadhaar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Contact Phone (+91)
              </label>
              <input
                className="input-field tabular-nums"
                placeholder="98470 54321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Aadhaar Last 4 Digits
              </label>
              <input
                className="input-field tabular-nums"
                placeholder="8821"
                maxLength={4}
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value)}
              />
            </div>
          </div>

          {/* Field 3: Calamity Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              Calamity Impact Category
            </label>
            <select
              className="input-field"
              value={calamity}
              onChange={(e) => setCalamity(e.target.value as CalamityType)}
            >
              <option value="Landslide">Landslide (Chooralmala / Meppadi Sector)</option>
              <option value="Flood">Flood (Kabini Basin Inundation)</option>
              <option value="Cyclone">Cyclone (High Wind Damage)</option>
            </select>
          </div>

          {/* Field 4: Camp Accommodation & Living Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Living Arrangement
              </label>
              <select
                className="input-field"
                value={livingStatus}
                onChange={(e) => setLivingStatus(e.target.value as LivingStatus)}
              >
                <option value="Relief Camp">Relief Camp (Designated)</option>
                <option value="Makeshift">Makeshift Shelter</option>
                <option value="Host Family">Host Family Accommodation</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                Relief Camp Center
              </label>
              <input
                className="input-field"
                value={campId}
                onChange={(e) => setCampId(e.target.value)}
              />
            </div>
          </div>

          {/* Field 5: Verified Vocational Skills (Multi-Select Chips) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '6px' }}>
              Verified Trade / Vocational Skills (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`skill-chip ${isSelected ? 'active' : ''}`}
                    style={{ cursor: 'pointer', padding: '6px 12px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      {isSelected ? 'check_circle' : 'add'}
                    </span>
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 6: Experience & Daily Wage Expectation */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
              Years of Craft / Field Experience: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{experienceYears} Years</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Field 7: Safety & Biometrics Checkboxes */}
          <div style={{
            backgroundColor: 'var(--color-surface-low)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input 
                type="checkbox" 
                checked={isMedicalFit}
                onChange={(e) => setIsMedicalFit(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Medical Fitness Certified for Civil Construction
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input 
                type="checkbox" 
                checked={isBioVerified}
                onChange={(e) => setIsBioVerified(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Aadhaar Biometric / Document Matched
              </span>
            </label>
          </div>

          {/* Drawer Footer Buttons */}
          <div style={{
            marginTop: 'auto',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--color-outline-variant)',
            display: 'flex',
            gap: 'var(--space-sm)'
          }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              <span>Register &amp; Enlist Candidate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
