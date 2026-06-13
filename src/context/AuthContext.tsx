import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/firebase';
import type { FirebaseUser } from '../services/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signUp: (email: string, password: string, displayName: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, bio: string, photoURL?: string) => Promise<FirebaseUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes (dual mode check)
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.signIn(email, password);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const res = await authService.signUp(email, password, displayName);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName: string, bio: string, photoURL?: string) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(displayName, bio, photoURL);
      setUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
