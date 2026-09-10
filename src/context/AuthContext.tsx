/**
 * ============================================================================
 * SAHAYASETU AUTHENTICATION CONTEXT (GOOGLE OAUTH ONLY)
 * ============================================================================
 * 
 * Purpose:
 * Provides global reactive authentication state enforcing Google Sign-In as 
 * the mandatory gate prior to citizen relief registration.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleUserProfile, 
  signInWithGoogle as apiSignInWithGoogle, 
  signInWithCustomGoogle as apiSignInWithCustomGoogle,
  signOutGoogle as apiSignOutGoogle, 
  getActiveGoogleUser,
  supabase,
  isSupabaseConfigured
} from '../lib/supabaseClient';

interface AuthContextType {
  user: GoogleUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCustomGoogle: (name: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          const stored = getActiveGoogleUser();
          setUser(stored);
          setIsLoading(false);
          return;
        }

        // 1. Check for hash tokens (#access_token=...&refresh_token=...)
        if (window.location.hash.includes('access_token=')) {
          const hashClean = window.location.hash.startsWith('#') 
            ? window.location.hash.substring(1) 
            : window.location.hash;
          const hashParams = new URLSearchParams(hashClean);
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              // Clean up the hash from the browser address bar
              window.history.replaceState({}, '', window.location.pathname);
              if (data?.session?.user) {
                const u = data.session.user;
                const profile: GoogleUserProfile = {
                  id: u.id,
                  email: u.email || '',
                  fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Citizen Applicant',
                  avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || 'CA')}`,
                  provider: 'google'
                };
                localStorage.setItem('sahayasetu_google_user', JSON.stringify(profile));
                setUser(profile);
                setIsLoading(false);
                return;
              }
            } catch (hashErr) {
              console.warn('Failed to set session from URL hash:', hashErr);
            }
          }
        }

        // 2. Check for OAuth callback code in URL search parameters (PKCE flow)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const errorDesc = searchParams.get('error_description') || searchParams.get('error');

        if (errorDesc) {
          console.warn('Google OAuth redirected with notice:', errorDesc);
          window.history.replaceState({}, '', window.location.pathname + window.location.hash);
        }

        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            // Clean up the URL search params so ?code= is removed from address bar
            window.history.replaceState({}, '', window.location.pathname + window.location.hash);
            if (data?.session?.user) {
              const u = data.session.user;
              const profile: GoogleUserProfile = {
                id: u.id,
                email: u.email || '',
                fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Citizen Applicant',
                avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || 'CA')}`,
                provider: 'google'
              };
              localStorage.setItem('sahayasetu_google_user', JSON.stringify(profile));
              setUser(profile);
              setIsLoading(false);
              return;
            }
          } catch (exchangeErr) {
            console.warn('OAuth code exchange notice:', exchangeErr);
          }
        }

        // 2. Check active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const profile: GoogleUserProfile = {
            id: u.id,
            email: u.email || '',
            fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Citizen Applicant',
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || 'CA')}`,
            provider: 'google'
          };
          localStorage.setItem('sahayasetu_google_user', JSON.stringify(profile));
          setUser(profile);
          setIsLoading(false);
          return;
        }

        // 3. Check stored local session
        const stored = getActiveGoogleUser();
        setUser(stored);
      } catch (err) {
        console.warn('Auth initialization warning:', err);
        const stored = getActiveGoogleUser();
        setUser(stored);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to live Supabase Auth state changes if live credentials are active
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          const profile: GoogleUserProfile = {
            id: u.id,
            email: u.email || '',
            fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Citizen Applicant',
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.email || 'CA')}`,
            provider: 'google'
          };
          localStorage.setItem('sahayasetu_google_user', JSON.stringify(profile));
          setUser(profile);
        } else if (_event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('sahayasetu_google_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await apiSignInWithGoogle();
      // Notice: Window redirects to Google accounts page. Session will be captured on return by onAuthStateChange.
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const handleSignInWithCustomGoogle = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      const profile = await apiSignInWithCustomGoogle(name, email);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await apiSignOutGoogle();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithCustomGoogle: handleSignInWithCustomGoogle,
        signOut: handleSignOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
