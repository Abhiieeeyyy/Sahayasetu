/**
 * ============================================================================
 * SAHAYASETU APPLICATION ENTRYPOINT (main.tsx)
 * ============================================================================
 * 
 * Purpose:
 * Primary JavaScript/TypeScript entry point that mounts the React application tree
 * to the DOM root element in index.html.
 * 
 * Assets Imported:
 * 1. src/styles/global.css: Resets, typography hierarchies, and layout containers.
 * 2. src/styles/components.css: Buttons, cards, badges, chips, tables, and modal dialogs.
 * 3. src/App.tsx: Root component housing navigation, routing, and operational state.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './styles/global.css';
import './styles/components.css';

// Locate root DOM container
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Fatal: Failed to locate root DOM element "#root" in index.html.');
}

// Mount the React Application Tree in StrictMode with Supabase Auth & Language Contexts
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
