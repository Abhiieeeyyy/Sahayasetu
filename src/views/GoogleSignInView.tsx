/**
 * ============================================================================
 * SAHAYASETU DEDICATED GOOGLE SIGN-IN GATE VIEW
 * ============================================================================
 * 
 * Purpose:
 * Prominently presents the official Google Sign-In gate for citizen users.
 * Application Form and Application Tracking are ONLY revealed after successful
 * Google authentication.
 */

import React, { useState } from 'react';
import { RegistrationLanguage } from '../types';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface GoogleSignInViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  onSignedIn?: () => void;
}

const TRANSLATIONS: Record<RegistrationLanguage, {
  languageLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  cardTitle: string;
  cardDesc: string;
  googleBtn: string;
  securityNotice: string;
  unlockedFeaturesHeader: string;
  feature1: string;
  feature2: string;
  customPrompt: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  cancelBtn: string;
  continueBtn: string;
}> = {
  EN: {
    languageLabel: 'Select Language / ഭാഷ / மொழி:',
    badge: 'Official Disaster Relief Identity Gateway',
    title: 'SahayaSetu Citizen Assistance Portal',
    subtitle: 'Sign in with your Google account to access disaster relief registration and live application tracking.',
    cardTitle: 'Google Sign-In Required',
    cardDesc: 'To protect displaced citizens, prevent unauthorized duplicate claims, and securely link Direct Benefit Transfer (DBT) wage accounts, please sign in with your Google account.',
    googleBtn: 'Continue with Google',
    securityNotice: 'Encrypted via Supabase Google OAuth 2.0 • Disaster Response Security Standard',
    unlockedFeaturesHeader: 'Available immediately after Google Sign-In:',
    feature1: '1. Complete relief & vocational rehabilitation application form',
    feature2: '2. Track application verification status, work deployment & DBT daily wages',
    customPrompt: 'Enter your Google account details to authenticate:',
    namePlaceholder: 'Your Full Name (e.g., Ananya Nair)',
    emailPlaceholder: 'your.email@gmail.com',
    cancelBtn: 'Cancel',
    continueBtn: 'Sign In with Account'
  },
  ML: {
    languageLabel: 'ഭാഷ തിരഞ്ഞെടുക്കുക / Select Language:',
    badge: 'ഔദ്യോഗിക ദുരിതാശ്വാസ ഐഡന്റിറ്റി ഗേറ്റ്‌വേ',
    title: 'സഹായസേതു പൗര സേവന പോർട്ടൽ',
    subtitle: 'ദുരിതാശ്വാസ രജിസ്ട്രേഷനും അപേക്ഷാ ട്രാക്കിംഗും ആരംഭിക്കാൻ നിങ്ങളുടെ ഗൂഗിൾ അക്കൗണ്ട് ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.',
    cardTitle: 'തുടരാൻ ഗൂഗിൾ സൈൻ-ഇൻ ആവശ്യമാണ്',
    cardDesc: 'ദുരിതബാധിതർക്കുള്ള സാമ്പത്തിക സഹായവും പുനരധിവാസ തൊഴിൽ വേതനവും സുരക്ഷിതമായി നൽകുന്നതിനായി ഗൂഗിൾ അക്കൗണ്ട് ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യുക.',
    googleBtn: 'ഗൂഗിൾ വഴി ലോഗിൻ ചെയ്യുക',
    securityNotice: 'സുരക്ഷിതമായ Supabase OAuth 2.0 • ഡിസാസ്റ്റർ റെസ്‌പോൺസ് പ്രോട്ടോക്കോൾ',
    unlockedFeaturesHeader: 'ഗൂഗിൾ സൈൻ-ഇൻ പൂർത്തിയാക്കിയ ശേഷം ലഭ്യമാകുന്നവ:',
    feature1: '1. ദുരിതാശ്വാസ & പുനരധിവാസ അപേക്ഷാ ഫോറം പൂരിപ്പിക്കുക',
    feature2: '2. അപേക്ഷാ സ്ഥിതിയും തൊഴിൽ അസൈൻമെന്റും ദിവസവേതനവും ട്രാക്ക് ചെയ്യുക',
    customPrompt: 'ലോഗിൻ ചെയ്യാനായി നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക:',
    namePlaceholder: 'നിങ്ങളുടെ പേര്',
    emailPlaceholder: 'നിങ്ങളുടെ.ഇമെയിൽ@gmail.com',
    cancelBtn: 'റദ്ദാക്കുക',
    continueBtn: 'സൈൻ ഇൻ ചെയ്യുക'
  }
};

export const GoogleSignInView: React.FC<GoogleSignInViewProps> = ({
  onShowToast,
  onSignedIn
}) => {
  const { signInWithGoogle, signInWithCustomGoogle, isLoading } = useAuth();
  const [currentLang, setCurrentLang] = useState<RegistrationLanguage>('EN');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const t = TRANSLATIONS[currentLang];

  const handleGoogleClick = async () => {
    setIsRedirecting(true);
    try {
      onShowToast('Connecting to Google', 'Opening Google account selection...', 'info');
      await signInWithGoogle();
      // Browser navigates to accounts.google.com for genuine account selection.
      // Notice: onSignedIn is NOT called here so that the application form does not flash or appear prematurely!
    } catch (err: any) {
      setIsRedirecting(false);
      onShowToast('Google Sign-In Error', err?.message || 'Could not connect to Google OAuth service.', 'error');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customName.trim() || 'Citizen Applicant';
    const finalEmail = customEmail.trim() || 'citizen.applicant@gmail.com';

    await signInWithCustomGoogle(finalName, finalEmail);
    setShowAccountModal(false);
    onShowToast('Account Authenticated', `Signed in as ${finalName} (${finalEmail})`, 'success');
    if (onSignedIn) onSignedIn();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'var(--space-md) 0 var(--space-2xl) 0',
      minHeight: '75vh',
      justifyContent: 'center'
    }}>
      {/* ----------------------------------------------------------------------
       * 1. LANGUAGE SWITCHER (EN, ML, TA)
       * ---------------------------------------------------------------------- */}
      <div style={{
        width: '100%',
        maxWidth: '680px',
        marginBottom: '20px',
        backgroundColor: 'var(--color-surface-lowest)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: 'var(--radius-lg)',
        padding: '10px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
            translate
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
            {t.languageLabel}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`btn btn-sm ${currentLang === 'EN' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCurrentLang('EN')}
            style={{ fontWeight: 700, minHeight: '32px' }}
          >
            English
          </button>
          <button
            type="button"
            className={`btn btn-sm ${currentLang === 'ML' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCurrentLang('ML')}
            style={{ fontWeight: 700, minHeight: '32px' }}
          >
            മലയാളം
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * 2. MAIN GOOGLE AUTHENTICATION CARD
       * ---------------------------------------------------------------------- */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '680px',
        padding: 'var(--space-2xl) var(--space-xl)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        border: '2px solid var(--color-outline-variant)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Accent Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%)'
        }} />

        {/* Google Emblem */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <svg width="36" height="36" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>

        <div>
          <span className="badge badge-rls" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.badge}
          </span>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginTop: '10px' }}>
            {t.title}
          </h1>
          <p style={{
            maxWidth: '540px',
            margin: '10px auto 0 auto',
            fontSize: '0.9375rem',
            color: 'var(--color-on-surface-variant)',
            lineHeight: 1.5
          }}>
            {t.cardDesc}
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '380px' }}>
          <button
            type="button"
            className="btn btn-touch"
            onClick={handleGoogleClick}
            disabled={isLoading}
            style={{
              backgroundColor: '#ffffff',
              color: '#1f2937',
              border: '1px solid #d1d5db',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontWeight: 700,
              fontSize: '1.0625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '14px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{isRedirecting ? 'Connecting to Google Accounts...' : t.googleBtn}</span>
          </button>

          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            {t.securityNotice}
          </span>
        </div>

        {/* Feature Preview Callout */}
        <div style={{
          width: '100%',
          backgroundColor: 'var(--color-surface-low)',
          border: '1px solid var(--color-outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock_open</span>
            <span>{t.unlockedFeaturesHeader}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-tertiary)' }}>check_circle</span>
              <span>{t.feature1}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-tertiary)' }}>check_circle</span>
              <span>{t.feature2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
       * 3. GOOGLE ACCOUNT CREDENTIALS DIALOG (FOR CLEAN DEMO/TESTING)
       * ---------------------------------------------------------------------- */}
      {showAccountModal && (
        <div className="modal-backdrop" onClick={() => setShowAccountModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>
                  Sign In with Google
                </h2>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAccountModal(false)}
                style={{ minHeight: '32px', width: '32px', padding: 0 }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCustomSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: 'var(--space-md)' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
                  {t.customPrompt}
                </p>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t.namePlaceholder}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)', display: 'block', marginBottom: '4px' }}>
                    Google Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder={t.emailPlaceholder}
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px var(--space-md)' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAccountModal(false)}
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
                  <span>{t.continueBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
