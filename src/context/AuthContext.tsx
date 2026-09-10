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
      // Check active local or Supabase session
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile: GoogleUserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen Applicant',
            avatarUrl: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            provider: 'google'
          };
          setUser(profile);
          setIsLoading(false);
          return;
        }
      }

      // Check stored session
      const stored = getActiveGoogleUser();
      setUser(stored);
      setIsLoading(false);
    };

    initAuth();

    // Listen to live Supabase Auth state changes if live credentials are active
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: GoogleUserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen Applicant',
            avatarUrl: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            provider: 'google'
          };
          setUser(profile);
        } else {
          setUser(null);
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
