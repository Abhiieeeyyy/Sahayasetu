/**
 * ============================================================================
 * SAHAYASETU SUPABASE CLIENT & GOOGLE AUTHENTICATION SERVICE
 * ============================================================================
 * 
 * Purpose:
 * Core backend interface managing Supabase database queries and enforcing
 * Google Sign-In as the EXCLUSIVE authentication provider.
 * 
 * Capabilities:
 * 1. Supabase Client Initialization: Configured from Vite environment variables.
 * 2. Google OAuth Integration: signInWithOAuth({ provider: 'google' }).
 * 3. Session Persistence: Keeps user logged in across page reloads.
 * 4. Fallback Demo Support: Provides realistic Google sign-in simulation when
 *    live Supabase URL / API key are not yet configured in .env.
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const SUPABASE_URL = 
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 
  'https://lftospgdzrwkvhbalkti.supabase.co';

const SUPABASE_ANON_KEY = 
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 
  ((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string) || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdG9zcGdkenJ3a3ZoYmFsa3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzEzNzUsImV4cCI6MjEwNDUwNzM3NX0.WxodujO6OixJlZTTGl6l_FlbJkKCm-3HuNq5gJ265B8';

// Verify if live Supabase credentials are configured
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('demo-placeholder')
);

// Instantiate Supabase client
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
);

export interface GoogleUserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  provider: 'google';
}

export const LOCAL_STORAGE_USER_KEY = 'sahayasetu_google_user';

/**
 * Initiates genuine Google OAuth Sign-In via Supabase.
 * Navigates directly to the Google account chooser without creating premature local sessions.
 */
export const signInWithGoogle = async (): Promise<void> => {
  if (isSupabaseConfigured) {
    const redirectUrl = window.location.origin;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });
    if (error) {
      console.error('Supabase Google OAuth initialization error:', error);
      throw error;
    }
    if (data?.url) {
      window.location.assign(data.url);
    }
    return;
  }
  throw new Error('Supabase authentication is not configured.');
};

/**
 * Sign in with a custom Google profile in demo mode (for offline/testing fallback only)
 */
export const signInWithCustomGoogle = async (name: string, email: string): Promise<GoogleUserProfile> => {
  const cleanEmail = email.trim() || 'abhinavparayanchola136@gmail.com';
  const cleanName = name.trim() || 'Abhinav P';
  const isAbhinav = cleanEmail.toLowerCase().includes('abhinav');

  const profile: GoogleUserProfile = {
    id: isAbhinav ? '8a0583cb-fd3f-4307-969b-bd23a62f2883' : `google-uid-${Math.floor(100000 + Math.random() * 900000)}`,
    email: cleanEmail,
    fullName: cleanName,
    avatarUrl: isAbhinav 
      ? 'https://lh3.googleusercontent.com/a/ACg8ocIgrTmUtAY6ZDJF_bviv5dlhpNS9AQF48dDYWiOm0sTe_UWXj4g=s96-c' 
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    provider: 'google'
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  return profile;
};

/**
 * Signs out the current user and clears session state.
 */
export const signOutGoogle = async (): Promise<void> => {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
};

/**
 * Gets currently authenticated user from session.
 */
export const getActiveGoogleUser = (): GoogleUserProfile | null => {
  const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as GoogleUserProfile;
    // Purge any temporary redirecting or legacy placeholder records
    if (
      !parsed ||
      parsed.id === 'redirecting' ||
      parsed.fullName?.toLowerCase().includes('ramesh') || 
      parsed.email?.toLowerCase().includes('ramesh')
    ) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};


