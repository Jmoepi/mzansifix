// src/hooks/use-issues.ts
'use client';

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
  getDoc,
  type Unsubscribe,
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
  // No longer exposing fetch/subscribe logic to the component
}

let unsubscribe: Unsubscribe | null = null;

const fetchIssues = (set: (fn: (state: IssueStore) => Partial<IssueStore>) => void) => {
  if (!db.app || unsubscribe) {
    return;
  }
      
  const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));

  unsubscribe = onSnapshot(
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
              const userDoc = await getDoc(collection(db, 'users').doc(data.reporterId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                reporter = {
                  name: userData.displayName || 'Anonymous',
                  avatarUrl: userData.photoURL || 'https://placehold.co/40x40.png',
                };
              }
          } catch (error) {
              console.warn(`Could not fetch reporter info for issue ${doc.id}:`, error);
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
};

const stopFetching = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
}

// Using Zustand for state management
const useIssueStore = create<IssueStore>()((set) => ({
  issues: [],
  isLoading: true,
  
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

// This part manages the subscription based on whether components are using the hook.
useAuth.subscribe((state) => {
  // If user logs in, start fetching. If they log out, stop.
  if (state.user) {
    fetchIssues(useIssueStore.setState);
  } else {
    stopFetching();
    useIssueStore.setState({ issues: [], isLoading: false });
  }
});

// Initialize fetch when the app loads if there's already a user
if (typeof window !== 'undefined') {
    if (useAuth.getState().user) {
        fetchIssues(useIssueStore.setState);
    }
}


// Custom hook that provides a simplified interface to the store
export function useIssues() {
  const { issues, isLoading, addIssue, updateIssueStatus } = useIssueStore();
  return { issues, isLoading, addIssue, updateIssueStatus };
}
