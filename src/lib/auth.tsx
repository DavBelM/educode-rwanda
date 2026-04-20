import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: 'student' | 'teacher' | 'self_learner';
  preferred_language: 'en' | 'kin' | 'both';
  xp_points: number;
  streak_days: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isRecoveryMode: boolean;
  signUp: (params: SignUpParams) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  userType: 'student' | 'teacher' | 'self_learner';
  preferredLanguage: 'en' | 'kin' | 'both';
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Fetch user profile from profiles table
  function buildProfileFromUser(user: import('@supabase/supabase-js').User): Profile {
    const m = user.user_metadata ?? {};
    return {
      id: user.id,
      full_name: m.full_name ?? '',
      email: user.email ?? '',
      user_type: m.user_type ?? 'student',
      preferred_language: m.preferred_language ?? 'en',
      xp_points: 0,
      streak_days: 0,
    };
  }

  useEffect(() => {
    // Safety timeout — never hang forever if Supabase is unreachable
    const timeout = setTimeout(() => setLoading(false), 5000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) setProfile(buildProfileFromUser(session.user));
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh, password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setProfile(buildProfileFromUser(session.user));
        } else {
          setProfile(null);
        }
        if (event === 'PASSWORD_RECOVERY') setIsRecoveryMode(true);
        else setIsRecoveryMode(false);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signUp({ email, password, fullName, userType, preferredLanguage }: SignUpParams) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
          preferred_language: preferredLanguage
        }
      }
    });

    if (error) return { error: error.message };
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    setIsRecoveryMode(false);
    return { error: null };
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, isRecoveryMode, signUp, signIn, signOut, requestPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
