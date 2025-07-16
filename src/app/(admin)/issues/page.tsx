
import { mockIssues } from '@/lib/data';
import { IssueDataTable } from '@/components/issue-data-table';
import { columns } from '@/components/issue-table-columns';

export default function AdminIssuesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
       <p className="text-muted-foreground">
          Manage all reported issues from the community.
       </p>
       <IssueDataTable columns={columns} data={mockIssues} />
    </div>
  );
}
