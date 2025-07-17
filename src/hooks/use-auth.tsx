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
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';

interface UserProfile extends User {
  role?: 'user' | 'admin';
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signup: (email: string, password: string, fullName: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  signupWithGoogle: () => Promise<User | null>;
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
      
      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        createdAt: new Date().toISOString(),
        role: 'user', // Default role
      });
      
      set({ user: { ...user, role: 'user'}, isLoading: false });
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
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userProfile: UserProfile = {
          ...user,
          role: userDoc.exists() ? userDoc.data().role : 'user'
      };

      set({ user: userProfile, isLoading: false });
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
  signupWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userRole: 'user' | 'admin' = 'user';
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            createdAt: new Date().toISOString(),
            role: 'user',
        });
      } else {
        userRole = userDoc.data().role || 'user';
      }

      const userProfile: UserProfile = {
          ...user,
          role: userRole
      };

      set({ user: userProfile, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      console.error("Google signup error:", error);
      throw error;
    }
  },
}));

export const useAuth = useAuthStore;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userProfile: UserProfile = {
            ...user,
            role: userDoc.exists() ? userDoc.data().role : 'user'
        };
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
};
