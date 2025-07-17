
// src/hooks/use-issues.ts
'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import type { Issue, IssueStatus, IssueCategory } from '@/lib/types';
import { useAuth } from './use-auth';

interface NewIssueData {
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  imageUrl?: string;
  aiHint?: string;
}

interface IssueStore {
  issues: Issue[];
  isLoading: boolean;
  addIssue: (newIssueData: NewIssueData) => Promise<void>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => Promise<void>;
  fetchIssues: (set: (fn: (state: IssueStore) => Partial<IssueStore>) => void) => () => void;
  unsubscribe: (() => void) | null;
  setUnsubscribe: (unsubscribe: (() => void) | null) => void;
}

// Using Zustand for state management
const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  isLoading: true,
  unsubscribe: null,
  setUnsubscribe: (unsubscribe) => set({ unsubscribe }),
  
  fetchIssues: (set) => {
    // Only fetch issues if Firestore is initialized (i.e., we are on the client side)
    if (!db.app) {
        set({ isLoading: false, issues: [] });
        return () => {};
    }
      
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        set({ isLoading: true });
        const issuesPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          
          let reporter = {
            name: 'Anonymous',
            avatarUrl: 'https://placehold.co/40x40.png',
          };

          if (data.reporterId) {
            try {
                const userDoc = await getDoc(doc(db, 'users', data.reporterId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  reporter = {
                    name: userData.displayName || 'Anonymous',
                    avatarUrl: userData.photoURL || 'https://placehold.co/40x40.png',
                  };
                }
            } catch (error) {
                console.warn(`Could not fetch reporter info for issue ${doc.id}:`, error);
                // If offline and the user doc isn't cached, it might fail. We'll just use the fallback.
            }
          }
          
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
            reporter,
          } as Issue;
        });

        const issues = await Promise.all(issuesPromises);
        set({ issues, isLoading: false });
      },
      (error) => {
        console.error('Error fetching issues:', error);
        set({ isLoading: false });
      }
    );
    
    // Return the unsubscribe function
    return unsubscribe;
  },

  addIssue: async (newIssueData) => {
    const { user } = useAuth.getState();
    if (!user) throw new Error('User not authenticated');

    const newIssue = {
      ...newIssueData,
      reporterId: user.uid,
      status: 'Open' as IssueStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      votes: 0,
      comments: 0,
    };
    await addDoc(collection(db, 'issues'), newIssue);
  },

  updateIssueStatus: async (issueId, newStatus) => {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  },
}));

// Custom hook that provides a simplified interface to the store
export function useIssues() {
  const { issues, isLoading, addIssue, updateIssueStatus, fetchIssues, unsubscribe, setUnsubscribe } = useIssueStore();
  const { user } = useAuth();

  useEffect(() => {
    let unsub: (()=>void) | null = null;
    
    // Only subscribe if the user is logged in and there is no active subscription.
    if (user && !unsubscribe) {
       unsub = fetchIssues(useIssueStore.setState);
       setUnsubscribe(unsub);
    }
    
    // Cleanup subscription on component unmount or when user logs out
    return () => {
      if (unsub) {
        unsub();
        setUnsubscribe(null);
      }
    };
  }, [user, unsubscribe, fetchIssues, setUnsubscribe]);

  return { issues, isLoading, addIssue, updateIssueStatus };
}
