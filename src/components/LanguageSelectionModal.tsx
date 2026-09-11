/**
 * ============================================================================
 * SAHAYASETU PREFERRED LANGUAGE SELECTION MODAL
 * ============================================================================
 * 
 * Purpose:
 * Displayed immediately after successful Google Sign-In to prompt the citizen
 * for their preferred language. The chosen language persists throughout the session.
 */

import React from 'react';
import { RegistrationLanguage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage?: (lang: RegistrationLanguage) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage
}) => {
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (lang: RegistrationLanguage) => {
    setLanguage(lang);
    if (onSelectLanguage) onSelectLanguage(lang);
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 100 }}>
      <div 
        className="modal-dialog" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '520px',
          padding: '0',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          padding: '24px 28px 20px 28px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#ffffff' }}>
              translate
            </span>
          </div>

          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
            Choose Preferred Language
          </h2>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
            ഭാഷ തിരഞ്ഞെടുക്കുക (Choose Language)
          </div>
        </div>

        {/* Modal Body: Language Option Cards */}
        <div style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'var(--color-surface-lowest)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', textAlign: 'center' }}>
            Select the language you want to use throughout your portal session:
          </div>

          {/* Option 1: English */}
          <button
            type="button"
            onClick={() => handleSelect('EN')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: language === 'EN' ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
              backgroundColor: language === 'EN' ? 'var(--color-surface-low)' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-container)',
                color: 'var(--color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                EN
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-on-surface)' }}>
                  English
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  Standard English for disaster relief forms and tracking
                </div>
              </div>
            </div>
            {language === 'EN' && (
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '22px' }}>
                check_circle
              </span>
            )}
          </button>

          {/* Option 2: Malayalam */}
          <button
            type="button"
            onClick={() => handleSelect('ML')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: language === 'ML' ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
              backgroundColor: language === 'ML' ? 'var(--color-surface-low)' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                മല
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-on-surface)' }}>
                  മലയാളം (Malayalam)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  കേരള ദുരിതാശ്വാസ സേവനങ്ങൾക്ക് മലയാളം തിരഞ്ഞെടുക്കുക
                </div>
              </div>
            </div>
            {language === 'ML' && (
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '22px' }}>
                check_circle
              </span>
            )}
          </button>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 28px 16px 28px',
          backgroundColor: 'var(--color-surface-low)',
          borderTop: '1px solid var(--color-outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            Saved for your entire session
          </span>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onClose}
          >
            Continue with {language === 'ML' ? 'മലയാളം' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
};
