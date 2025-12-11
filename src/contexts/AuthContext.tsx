import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Recruiter {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
}

interface AuthContextType {
  user: User | null;
  recruiter: Recruiter | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, companyName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadRecruiter(session.user.id);
        }
        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadRecruiter(session.user.id);
        } else {
          setRecruiter(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRecruiter = async (userId: string) => {
    const { data, error } = await supabase
      .from('recruiters')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading recruiter:', error);
      return;
    }

    if (data) {
      setRecruiter(data);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, companyName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('recruiters')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          company_name: companyName || null,
        });

      if (profileError) throw profileError;

      await loadRecruiter(data.user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRecruiter(null);
  };

  const value = {
    user,
    recruiter,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
