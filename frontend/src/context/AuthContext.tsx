import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ user: User | null; session: Session | null; error: Error | null; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Derive profile info from user object or metadata
  const extractProfile = (currentUser: User | null): UserProfile | null => {
    if (!currentUser) return null;
    const meta = currentUser.user_metadata || {};
    const fullName = meta.full_name || meta.name || currentUser.email?.split('@')[0] || 'Educator';
    return {
      fullName,
      email: currentUser.email || '',
      role: meta.role || 'Educator / Advisor',
    };
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoadingAuth(false);
      return;
    }

    // 1. Recover existing session from local storage
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (error) {
          console.error('[Supabase Auth] Session fetch error:', error.message);
        }
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          setUserProfile(extractProfile(initialSession.user));
        }
        setIsLoadingAuth(false);
      })
      .catch((err) => {
        console.error('[Supabase Auth] Unexpected session error:', err);
        setIsLoadingAuth(false);
      });

    // 2. Subscribe to auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setUserProfile(extractProfile(currentUser));
      setIsLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      setSession(data.session);
      setUser(data.user);
      setUserProfile(extractProfile(data.user));
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Login failed') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:3000',
          data: {
            full_name: fullName.trim(),
            role: 'Educator',
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: new Error(error.message) };
      }

      const needsEmailConfirmation = Boolean(data.user && !data.session);
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setUserProfile(extractProfile(data.user));
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
        needsEmailConfirmation,
      };
    } catch (err: any) {
      return {
        user: null,
        session: null,
        error: new Error(err.message || 'Registration failed'),
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth] Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setUserProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isLoadingAuth,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
