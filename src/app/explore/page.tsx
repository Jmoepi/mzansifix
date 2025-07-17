// src/app/explore/page.tsx
'use client';

import { useIssues } from '@/hooks/use-issues';
import IssueCard from '@/components/issue-card';
import IssueCardSkeleton from '@/components/issue-card-skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import type { Issue, IssueCategory, IssueStatus } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const issueCategories: IssueCategory[] = [
  'Road Maintenance',
  'Water and Sanitation',
  'Electricity',
  'Waste Management',
  'Public Safety',
  'Other',
];

const issueStatuses: IssueStatus[] = ['Open', 'Acknowledged', 'In Progress', 'Resolved'];

type SortOption = 'newest' | 'oldest' | 'mostVotes' | 'mostComments';

export default function ExplorePage() {
  const { issues, isLoading } = useIssues();
  
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = [...issues];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }
    
    if (selectedStatus !== 'all') {
        filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    switch (sortOption) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        case 'mostVotes':
            filtered.sort((a, b) => b.votes - a.votes);
            break;
        case 'mostComments':
            filtered.sort((a, b) => b.comments - a.comments);
            break;
    }

    return filtered;
  }, [issues, selectedCategory, selectedStatus, sortOption]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary md:text-6xl">
          Explore Issues
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Find and filter through all reported community issues.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                 <Label className="text-base font-semibold">Sort By</Label>
                 <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Sort issues" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="mostVotes">Most Votes</SelectItem>
                        <SelectItem value="mostComments">Most Comments</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <Separator />
               <div>
                  <Label className="text-base font-semibold">Category</Label>
                   <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as IssueCategory | 'all')}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {issueCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
               </div>
               <Separator />
                <div>
                  <Label className="text-base font-semibold">Status</Label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as IssueStatus | 'all')}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {issueStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
               </div>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">
            <div className="flex flex-col gap-8">
            {isLoading ? (
            <>
                <IssueCardSkeleton />
                <IssueCardSkeleton />
                <IssueCardSkeleton />
            </>
            ) : filteredAndSortedIssues.length > 0 ? (
                filteredAndSortedIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))
            ) : (
                <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No issues match the current filters.</p>
                </Card>
            )}
            </div>
        </main>
      </div>
    </div>
  );
}
