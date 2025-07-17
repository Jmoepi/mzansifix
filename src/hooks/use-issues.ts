// src/hooks/use-issues.ts
'use client';

import { useState, useCallback } from 'react';
import { mockIssues } from '@/lib/data';
import type { Issue, IssueStatus, IssueCategory } from '@/lib/types';
import { create } from 'zustand';

interface NewIssueData {
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  imageUrl?: string;
}

interface IssueStore {
    issues: Issue[];
    addIssue: (newIssueData: NewIssueData) => void;
    updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
}


// Using Zustand for state management to avoid prop drilling and simplify state sharing
// This also persists state across component unmounts.
const useIssueStore = create<IssueStore>((set) => ({
  issues: mockIssues,
  addIssue: (newIssueData) => {
    const newIssue: Issue = {
        id: (Math.random() * 100000).toString(), // temporary unique ID
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reporter: {
            name: 'Current User', // Placeholder
            avatarUrl: 'https://placehold.co/40x40.png',
        },
        votes: 0,
        comments: 0,
        ...newIssueData,
    };
    set((state) => ({ issues: [newIssue, ...state.issues] }));
  },
  updateIssueStatus: (issueId, newStatus) => {
    set((state) => ({
        issues: state.issues.map((issue) =>
            issue.id === issueId ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() } : issue
        )
    }));
    // In a real app, you would also make an API call here to update the backend.
    console.log(`Updated issue ${issueId} to status ${newStatus}`);
  },
}));


// Custom hook that provides a simplified interface to the store
export function useIssues() {
  const issues = useIssueStore((state) => state.issues);
  const addIssue = useIssueStore((state) => state.addIssue);
  const updateIssueStatus = useIssueStore((state) => state.updateIssueStatus);
  
  return { issues, addIssue, updateIssueStatus };
}
