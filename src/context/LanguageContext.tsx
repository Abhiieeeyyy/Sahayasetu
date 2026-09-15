/**
 * ============================================================================
 * SAHAYASETU GLOBAL LANGUAGE CONTEXT
 * ============================================================================
 * 
 * Purpose:
 * Enforces session-wide language preference (English, Malayalam)
 * selected after Google Sign-In.
 */

import React, { createContext, useContext, useState } from 'react';
import { RegistrationLanguage } from '../types';

interface LanguageContextType {
  language: RegistrationLanguage;
  setLanguage: (lang: RegistrationLanguage) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  promptLanguageSelection: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SESSION_LANG_KEY = 'sahayasetu_session_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read existing session or local storage preference, defaulting to 'EN'
  const [language, setLanguageState] = useState<RegistrationLanguage>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_LANG_KEY) || localStorage.getItem(SESSION_LANG_KEY);
      if (stored === 'EN' || stored === 'ML') {
        return stored;
      }
    } catch {}
    return 'EN';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  const setLanguage = (lang: RegistrationLanguage) => {
    setLanguageState(lang);
    try {
      sessionStorage.setItem(SESSION_LANG_KEY, lang);
      localStorage.setItem(SESSION_LANG_KEY, lang);
    } catch {}
  };

  const promptLanguageSelection = () => {
    setIsLanguageModalOpen(true);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        promptLanguageSelection
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
