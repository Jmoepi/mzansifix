
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Issue, IssueStatus } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowUpDown, MoreHorizontal, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const statusColors = {
    Open: 'bg-red-500/20 text-red-400 border-red-500/30',
    Acknowledged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const availableStatuses: IssueStatus[] = ['Open', 'Acknowledged', 'In Progress', 'Resolved'];

// We are turning columns into a function that accepts props
// This allows us to pass down functions like `updateIssueStatus`
export const columns = ({ updateIssueStatus }: { updateIssueStatus: (issueId: string, status: IssueStatus) => void }): ColumnDef<Issue>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium line-clamp-2">{row.getValue('title')}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const status = row.getValue('status') as Issue['status'];
        return <Badge className={cn('whitespace-nowrap', statusColors[status])}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'reporter.name',
    header: 'Reporter',
    cell: ({ row }) => {
        const reporter = row.original.reporter;
        return <div>{reporter.name}</div>
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Reported On',
    cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div>{format(date, 'PPP')}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const issue = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(issue.id)}
            >
              Copy issue ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/issues/${issue.id}`}>View issue details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Update status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>Set status to</DropdownMenuLabel>
                  {availableStatuses.map((status) => (
                     <DropdownMenuItem 
                        key={status}
                        onClick={() => updateIssueStatus(issue.id, status)}
                        className="flex justify-between"
                      >
                       <span>{status}</span>
                       {issue.status === status && <Check className="h-4 w-4" />}
                     </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
