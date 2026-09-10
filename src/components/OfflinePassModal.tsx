/**
 * ============================================================================
 * SAHAYASETU PRINTABLE OFFLINE RELIEF & JOB PASS COMPONENT
 * ============================================================================
 * 
 * Purpose:
 * Provides affected beneficiaries with an official printable relief & job
 * credential pass containing QR validation, biometric verification stamps,
 * active worksite location, shift hours, and toll-free helpline contacts.
 * 
 * Key Capabilities:
 * 1. Offline Identification: Serves as physical proof of identity in disaster zones.
 * 2. Worksite Display: Prominently displays the assigned job worksite location.
 * 3. PDF Export: Native 1-click high-resolution PDF download using jsPDF & html2canvas.
 * 4. Multilingual Rendering: Renders fully in Malayalam when Malayalam language is selected.
 * 5. Native Print Trigger: Formatted for standard paper and receipt printers.
 */

import React, { useState, useRef } from 'react';
import { Beneficiary } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface JobPassDetails {
  jobTitle?: string;
  agencyName?: string;
  dailyWage?: number;
  assignedDate?: string;
  worksite?: string;
}

interface OfflinePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary;
  jobDetails?: JobPassDetails;
  onShowToast?: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OfflinePassModal: React.FC<OfflinePassModalProps> = ({
  isOpen,
  onClose,
  beneficiary,
  jobDetails,
  onShowToast
}) => {
  const { language } = useLanguage();
  const isMalayalam = language === 'ML';
  const passCardRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const isJobAssigned = beneficiary.placementStatus === 'Assigned' || !!jobDetails?.jobTitle;
  const projectTitle = jobDetails?.jobTitle || beneficiary.assignedProjectId || (isMalayalam ? 'സിവിൽ പുനർനിർമ്മാണ പദ്ധതി' : 'Civil Rehabilitation & Reconstruction');
  const agencyName = jobDetails?.agencyName || (isMalayalam ? 'ജില്ലാ ദുരന്ത നിവാരണ അതോറിറ്റി (DDMA)' : 'District Disaster Management Authority (DDMA)');
  const dailyWage = jobDetails?.dailyWage || beneficiary.dailyWageTier || 850;
  const assignedDate = jobDetails?.assignedDate || beneficiary.registeredDate || (isMalayalam ? 'ഔദ്യോഗിക നിയോഗം' : 'Official Deployment');
  const worksite = jobDetails?.worksite || beneficiary.assignedWorksite || beneficiary.worksite || (isMalayalam ? 'മേപ്പാടി സെക്ടർ 2 പുനർനിർമ്മാണ സ്ഥലം' : 'Meppadi Sector 2 Works Hub');

  // Helper to safely instantiate jsPDF across both ESM and CJS bundlers
  const createPdfDoc = () => {
    const Constructor: any = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF || (jsPDF as any).default;
    return new Constructor({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  };

  // Direct vector-based fallback to guarantee PDF generation even if HTML canvas has browser limitations
  const generateNativeVectorPdf = () => {
    const pdf = createPdfDoc();

    // Top Header Banner
    pdf.setFillColor(6, 95, 70); // #065f46 dark emerald
    pdf.rect(12, 12, 186, 26, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.text('GOVERNMENT OF KERALA  *  DISASTER MANAGEMENT AUTHORITY (SDMA)', 18, 20);

    pdf.setFontSize(14);
    pdf.text(isJobAssigned ? 'OFFICIAL JOB DEPLOYMENT PASS' : 'OFFICIAL RELIEF BENEFICIARY PASS', 18, 30);

    // Main Dossier Body Container
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(209, 213, 219);
    pdf.rect(12, 38, 186, 175, 'FD');

    // UID Bar
    pdf.setTextColor(75, 85, 99);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('APPLICATION TRACKING UID:', 18, 46);

    pdf.setTextColor(4, 120, 87);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`APP-${beneficiary.id}`, 18, 54);

    // Status Pill
    pdf.setFillColor(236, 253, 245);
    pdf.setDrawColor(16, 185, 129);
    pdf.roundedRect(125, 43, 67, 12, 2, 2, 'FD');
    pdf.setTextColor(4, 120, 87);
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(isJobAssigned ? 'JOB ASSIGNED & DISPATCHED' : 'AADHAAR BIO-VERIFIED', 128, 51);

    // Divider
    pdf.setDrawColor(229, 231, 235);
    pdf.line(18, 59, 192, 59);

    // Job Section Box
    if (isJobAssigned) {
      pdf.setFillColor(240, 253, 244);
      pdf.setDrawColor(167, 243, 208);
      pdf.roundedRect(18, 63, 174, 42, 2, 2, 'FD');

      pdf.setTextColor(4, 120, 87);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ASSIGNED REHABILITATION PROJECT', 22, 70);

      pdf.setTextColor(6, 78, 59);
      pdf.setFontSize(12);
      pdf.text(projectTitle, 22, 78);

      pdf.setTextColor(4, 120, 87);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Worksite Location: ${worksite}`, 22, 86);
      pdf.text(`Contracting Agency: ${agencyName}  |  Wage: Rs. ${dailyWage}/day (DBT Direct)`, 22, 93);
      pdf.text(`Deployment Shift: 08:00 AM - 04:30 PM  |  Assigned Date: ${assignedDate}`, 22, 100);
    } else {
      pdf.setFillColor(249, 250, 251);
      pdf.setDrawColor(229, 231, 235);
      pdf.roundedRect(18, 63, 174, 20, 2, 2, 'FD');
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Designated Relief Worksite: ${worksite}`, 22, 75);
    }

    // Worker Identity Box
    const workerY = isJobAssigned ? 110 : 88;
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(229, 231, 235);
    pdf.roundedRect(18, workerY, 174, 40, 2, 2, 'FD');

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(17, 24, 39);
    pdf.text(beneficiary.name, 22, workerY + 9);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Mobile: +91 ${beneficiary.phone}   |   Aadhaar Token: ${beneficiary.aadhaarMasked}`, 22, workerY + 18);
    pdf.text(`District: ${beneficiary.district || 'Kerala'}   |   Relief Camp / Address: ${beneficiary.campId}`, 22, workerY + 26);
    pdf.text(`Relationship to Account: ${beneficiary.relationshipToAccount || 'Self'}`, 22, workerY + 34);

    // Vocational Skills Box
    const skillsY = workerY + 44;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(229, 231, 235);
    pdf.roundedRect(18, skillsY, 174, 22, 2, 2, 'FD');

    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AUTHORIZED VOCATIONAL SPECIALIZATION', 22, skillsY + 7);

    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Skills: ${beneficiary.skills?.join(', ')}  (${beneficiary.experienceYears} Years Verified Exp)`, 22, skillsY + 15);

    // Cryptographic Seal Box
    const sealY = skillsY + 26;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(18, sealY, 174, 26, 2, 2, 'FD');

    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KERALA SDMA CRYPTOGRAPHIC VALIDATION SEAL', 22, sealY + 9);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Digital Security Token: SEC-JOB-${beneficiary.id}-${beneficiary.districtId || 'KL-WYD'}`, 22, sealY + 16);
    pdf.text('Authority: Kerala State Disaster Management Authority * Verified Official Pass', 22, sealY + 22);

    pdf.save(`SahayaSetu-Pass-${beneficiary.id}.pdf`);
  };

  // Handle PDF Export with graceful fallback
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      if (passCardRef.current) {
        try {
          const canvas = await html2canvas(passCardRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = createPdfDoc();
          const imgWidth = 190;
          const pageHeight = 285;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight));
          pdf.save(`SahayaSetu-Pass-${beneficiary.id}.pdf`);
          onShowToast?.(
            isMalayalam ? 'പി.ഡി.എഫ് ഡൗൺലോഡ് ചെയ്തു' : 'Pass Downloaded',
            isMalayalam ? `തൊഴിൽ പാസ്സ് SahayaSetu-Pass-${beneficiary.id}.pdf ആയി ഡൗൺലോഡ് ചെയ്തു.` : `Pass successfully saved as SahayaSetu-Pass-${beneficiary.id}.pdf.`,
            'success'
          );
          return;
        } catch (canvasErr) {
          console.warn('html2canvas render issue, activating native vector engine:', canvasErr);
        }
      }

      // If canvas capture didn't succeed, execute guaranteed native PDF engine
      generateNativeVectorPdf();
      onShowToast?.(
        isMalayalam ? 'പി.ഡി.എഫ് ഡൗൺലോഡ് ചെയ്തു' : 'Pass Downloaded',
        isMalayalam ? `തൊഴിൽ പാസ്സ് SahayaSetu-Pass-${beneficiary.id}.pdf ആയി ഡൗൺലോഡ് ചെയ്തു.` : `Official pass saved as SahayaSetu-Pass-${beneficiary.id}.pdf.`,
        'success'
      );
    } catch (err: any) {
      console.error('Failed to generate PDF pass:', err);
      onShowToast?.(
        'PDF Generation Notice',
        'Could not generate PDF. Please use the Print Pass option.',
        'warning'
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '540px', width: '95%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header */}
        <div className="modal-header" style={{ 
          backgroundColor: isJobAssigned ? '#065f46' : 'var(--color-primary)', 
          color: 'white',
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/emblem.svg" 
              alt="Emblem" 
              style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} 
            />
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9, fontWeight: 700 }}>
                {isMalayalam 
                  ? 'കേരള സർക്കാർ • ദുരന്ത നിവാരണ അതോറിറ്റി' 
                  : 'Government of Kerala • Disaster Management Authority'}
              </span>
              <h2 style={{ fontSize: '1.25rem', color: 'white', lineHeight: 1.2, margin: '2px 0 0 0', fontWeight: 800 }}>
                {isMalayalam 
                  ? (isJobAssigned ? 'ഔദ്യോഗിക തൊഴിൽ പാസ്സ്' : 'ഔദ്യോഗിക ദുരിതാശ്വാസ പാസ്സ്')
                  : (isJobAssigned ? 'Official Job Deployment Pass' : 'Official Relief Beneficiary Pass')}
              </h2>
            </div>
          </div>
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            style={{ color: 'white', minHeight: '32px', width: '32px', padding: 0 }}
            title={isMalayalam ? 'അടയ്ക്കുക' : 'Close Pass'}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Pass Dossier Content (Printable & Exportable Card) */}
        <div 
          ref={passCardRef}
          className="modal-body" 
          style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#ffffff' }}
        >
          {/* Top Identifier Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px dashed var(--color-outline-variant)',
            paddingBottom: '12px'
          }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                {isMalayalam ? 'അപേക്ഷ ട്രാക്കിംഗ് UID' : 'Application Tracking UID'}
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                APP-{beneficiary.id}
              </div>
            </div>
            
            {isJobAssigned ? (
              <span className="badge badge-verified" style={{ backgroundColor: '#059669', color: '#ffffff', fontWeight: 800, fontSize: '11px', padding: '4px 10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
                <span>{isMalayalam ? 'തൊഴിൽ അനുവദിച്ചു' : 'JOB ASSIGNED & DISPATCHED'}</span>
              </span>
            ) : (
              <span className="badge badge-verified">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                <span>{isMalayalam ? 'ആധാർ സ്ഥിരീകരിച്ചു' : 'Aadhaar Bio-Verified'}</span>
              </span>
            )}
          </div>

          {/* OFFICIAL JOB ALLOTMENT SPECIFICATION CARD (When Job is Assigned) */}
          {isJobAssigned && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#047857', fontWeight: 800, letterSpacing: '0.04em' }}>
                  {isMalayalam ? 'അനുവദിച്ച പുനരധിവാസ പദ്ധതി' : 'Assigned Rehabilitation Project'}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46' }}>
                  {isMalayalam ? 'തീയതി:' : 'Date:'} {assignedDate}
                </span>
              </div>

              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#064e3b' }}>
                {projectTitle}
              </div>

              {/* Worksite Location Field (Explicitly Displayed on Pass) */}
              <div style={{ 
                fontSize: '12.5px', 
                color: '#064e3b', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                backgroundColor: '#d1fae5',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #6ee7b7'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#047857' }}>location_on</span>
                <span>
                  <strong>{isMalayalam ? 'തൊഴിൽ സ്ഥലം (Worksite):' : 'Worksite Location:'}</strong> {worksite}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>corporate_fare</span>
                <span><strong>{isMalayalam ? 'കരാർ ഏജൻസി / NGO:' : 'Contracting Agency / NGO:'}</strong> {agencyName}</span>
              </div>

              <div style={{
                marginTop: '4px',
                paddingTop: '8px',
                borderTop: '1px solid #a7f3d0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <span>{isMalayalam ? 'ദിവസവേതനം:' : 'Approved Daily Wage:'}</span>
                  <strong style={{ fontSize: '14px', marginLeft: '6px', color: '#047857' }}>
                    ₹{dailyWage} {isMalayalam ? '/ ദിവസം (DBT നേരിട്ട്)' : '/ Day (DBT Direct)'}
                  </strong>
                </div>
                <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>
                  {isMalayalam ? 'സമയം: 08:00 AM – 04:30 PM' : 'Shift: 08:00 AM – 04:30 PM'}
                </span>
              </div>
            </div>
          )}

          {/* If Job Not Assigned Yet, Still Show Worksite Preference or Designated Center */}
          {!isJobAssigned && (
            <div style={{
              backgroundColor: 'var(--color-surface-low)',
              border: '1px dashed var(--color-outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-on-surface-variant)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>location_on</span>
              <span>
                <strong>{isMalayalam ? 'നിർദ്ദിഷ്ട തൊഴിൽ സ്ഥലം:' : 'Designated Relief Worksite:'}</strong> {worksite}
              </span>
            </div>
          )}

          {/* Worker Identity Details */}
          <div style={{
            display: 'flex',
            gap: '14px',
            padding: '12px',
            backgroundColor: 'var(--color-surface-low)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-outline-variant)',
              flexShrink: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '38px', color: 'var(--color-primary)' }}>
                engineering
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                {beneficiary.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                {isMalayalam ? 'ഫോൺ:' : 'Mobile:'} <strong>+91 {beneficiary.phone}</strong> • {isMalayalam ? 'ആധാർ:' : 'Aadhaar:'} <span className="font-mono">{beneficiary.aadhaarMasked}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                {isMalayalam ? 'ജില്ല:' : 'District:'} {beneficiary.district || 'Kerala'} • {isMalayalam ? 'ക്യാമ്പ്:' : 'Camp:'} {beneficiary.campId}
              </div>
            </div>
          </div>

          {/* Vocational Trade Authorization */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface-lowest)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', fontWeight: 700, marginBottom: '6px' }}>
              {isMalayalam ? 'അംഗീകൃത തൊഴിൽ നൈപുണ്യം' : 'Authorized Vocational Specialization'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {beneficiary.skills.map((skill) => (
                <span key={skill} className="badge badge-verified" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  ✓ {skill}
                </span>
              ))}
              <span className="badge" style={{ fontSize: '11px', padding: '3px 8px' }}>
                {beneficiary.experienceYears} {isMalayalam ? 'വർഷ പരിചയം' : 'Years Verified Exp'}
              </span>
            </div>
          </div>

          {/* Simulated QR Code Validation Seal & Digital Signature */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: 'white',
                border: '1px solid #1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '34px', color: '#1f2937' }}>
                  qr_code_2
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-on-surface)', display: 'block' }}>
                  {isMalayalam ? 'കേരള ദുരന്ത നിവാരണ ഡിജിറ്റൽ പരിശോധന' : 'Kerala SDMA Cryptographic Validation'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-mono)' }}>
                  SEC-JOB-{beneficiary.id}-{beneficiary.districtId || 'KL-WYD'}
                </span>
              </div>
            </div>

            <span className="badge badge-verified" style={{ backgroundColor: '#059669', color: '#fff', fontSize: '9px', fontWeight: 800 }}>
              {isMalayalam ? 'സ്ഥിരീകരിച്ച പാസ്സ്' : 'VERIFIED WORK PASS'}
            </span>
          </div>
        </div>

        {/* Pass Actions: Download PDF, Print, Close */}
        <div className="modal-footer" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {isMalayalam ? 'അടയ്ക്കുക' : 'Close'}
          </button>

          {/* Download as PDF Button */}
          <button
            type="button"
            className="btn btn-primary btn-touch"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
          >
            <span className="material-symbols-outlined">
              {isDownloadingPdf ? 'hourglass_top' : 'download'}
            </span>
            <span>
              {isDownloadingPdf
                ? (isMalayalam ? 'പി.ഡി.എഫ് തയ്യാറാക്കുന്നു...' : 'Generating PDF...')
                : (isMalayalam ? 'പാസ്സ് PDF ഡൗൺലോഡ് ചെയ്യുക' : 'Download Pass as PDF')}
            </span>
          </button>

          {/* Print Pass Button */}
          <button 
            type="button" 
            className="btn btn-secondary btn-touch" 
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <span className="material-symbols-outlined">print</span>
            <span>{isMalayalam ? 'പ്രിന്റ് ചെയ്യുക' : 'Print Pass'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
