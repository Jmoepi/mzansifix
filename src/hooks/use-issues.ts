// src/hooks/use-issues.ts
'use client';

import { useState } from 'react';
import { mockIssues } from '@/lib/data';
import type { Issue, IssueStatus } from '@/lib/types';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
    // In a real app, you would also make an API call here to update the backend.
    console.log(`Updated issue ${issueId} to status ${newStatus}`);
  };

  return { issues, updateIssueStatus };
}
