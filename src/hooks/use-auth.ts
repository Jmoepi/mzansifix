
'use client';

import {
  useEffect,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signup: (email: string, password: string, fullName: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  signup: async (email, password, fullName) => {
    set({ isLoading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName: fullName });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      console.error("Signup error:", error);
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      set({ user, isLoading: false });
      return user;
    } catch (error) {
       set({ isLoading: false });
       console.error("Login error:", error);
       throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Logout error:", error);
      throw error;
    }
  },
}));


/**
 * Custom hook to provide auth state and actions
 */
export const useAuth = () => {
    return useAuthStore();
};


/**
 * AuthProvider component to wrap the app
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
};
