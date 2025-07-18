// src/hooks/use-issues.ts
'use client';

import { create } from 'zustand';
import { getFirebase } from '@/lib/firebase';
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
import type { Issue, IssueStatus, IssueCategory, Reporter } from '@/lib/types';
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
}

let unsubscribeFromIssues: Unsubscribe | null = null;
const reporterCache = new Map<string, Reporter>();

const useIssueStore = create<IssueStore>()((set) => ({
  issues: [],
  isLoading: true,
  
  addIssue: async (newIssueData) => {
    const { user } = useAuth.getState();
    if (!user) throw new Error('User not authenticated');
    
    const { db } = await getFirebase();
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
    const { db } = await getFirebase();
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  },
}));

async function initializeIssueFetching() {
  // Ensure we don't create multiple listeners
  if (unsubscribeFromIssues) {
    return;
  }

  try {
    const { db } = await getFirebase();
        
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));

    unsubscribeFromIssues = onSnapshot(
      q,
      async (querySnapshot) => {
        useIssueStore.setState({ isLoading: true });
        const issuesPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          let reporter: Reporter = {
            name: 'Anonymous',
            avatarUrl: 'https://placehold.co/40x40.png',
          };

          if (data.reporterId) {
            if (reporterCache.has(data.reporterId)) {
                reporter = reporterCache.get(data.reporterId)!;
            } else {
                try {
                    const userDocRef = doc(db, 'users', data.reporterId);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                      const userData = userDoc.data();
                      reporter = {
                        name: userData.displayName || 'Anonymous',
                        avatarUrl: userData.photoURL || 'https://placehold.co/40x40.png',
                      };
                      reporterCache.set(data.reporterId, reporter);
                    }
                } catch (error) {
                    console.warn(`Could not fetch reporter info for issue ${docSnapshot.id}:`, error);
                }
            }
          }
          
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
            reporter,
          } as Issue;
        });

        const issues = await Promise.all(issuesPromises);
        useIssueStore.setState({ issues, isLoading: false });
      },
      (error) => {
        console.error('Error fetching issues:', error);
        useIssueStore.setState({ isLoading: false });
      }
    );
  } catch (error) {
    console.error("Failed to initialize issue fetching:", error);
    useIssueStore.setState({ isLoading: false });
  }
}

function stopIssueFetching() {
    if (unsubscribeFromIssues) {
        unsubscribeFromIssues();
        unsubscribeFromIssues = null;
    }
    reporterCache.clear();
}

// Subscribe to auth changes to start/stop fetching issues
useAuth.subscribe((state, prevState) => {
  // Start fetching only when user logs in
  if (state.user && !prevState.user) {
    initializeIssueFetching();
  } 
  // Stop fetching when user logs out
  else if (!state.user && prevState.user) {
    stopIssueFetching();
    useIssueStore.setState({ issues: [], isLoading: false });
  }
});

// Initial check in case user is already logged in on app load
if (typeof window !== 'undefined') {
  // We use a small timeout to allow firebase to initialize first
  setTimeout(() => {
    if (useAuth.getState().user) {
      initializeIssueFetching();
    } else {
      // If no user, set loading to false
      useIssueStore.setState({ isLoading: false });
    }
  }, 500);
}


// Custom hook that provides a simplified interface to the store
export function useIssues() {
  const { issues, isLoading, addIssue, updateIssueStatus } = useIssueStore();
  return { issues, isLoading, addIssue, updateIssueStatus };
}
