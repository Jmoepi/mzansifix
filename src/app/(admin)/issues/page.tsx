// src/app/(admin)/issues/page.tsx
'use client';

import { useIssues } from '@/hooks/use-issues';
import { IssueDataTable } from '@/components/issue-data-table';
import { columns as createColumns } from '@/components/issue-table-columns';
import { useEffect, useState } from 'react';
import type { Issue } from '@/lib/types';

export default function AdminIssuesPage() {
  const { issues, updateIssueStatus } = useIssues();
  // To prevent hydration mismatches, we ensure the data is only loaded on the client
  const [clientIssues, setClientIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setClientIssues(issues);
  }, [issues]);


  // We need to pass the update function to the columns
  const columns = createColumns({ updateIssueStatus });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
       <p className="text-muted-foreground">
          Manage all reported issues from the community.
       </p>
       <IssueDataTable columns={columns} data={clientIssues} />
    </div>
  );
}
