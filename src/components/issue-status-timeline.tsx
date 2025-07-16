'use client';

import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/lib/types';
import { CheckCircle, Circle, Loader, CircleDot } from 'lucide-react';

interface IssueStatusTimelineProps {
  currentStatus: IssueStatus;
}

const statuses: IssueStatus[] = ['Open', 'Acknowledged', 'In Progress', 'Resolved'];

const getStatusIcon = (status: IssueStatus, isCompleted: boolean, isCurrent: boolean) => {
    if (isCurrent) {
        return <CircleDot className="h-5 w-5 text-primary" />;
    }
    if (isCompleted) {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground/50" />;
}

const IssueStatusTimeline: FC<IssueStatusTimelineProps> = ({ currentStatus }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="relative">
      <div
        className="absolute left-2.5 top-0 h-full w-0.5 bg-border -translate-x-1/2"
        aria-hidden="true"
      />
      <ul className="space-y-4">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <li key={status} className="flex items-center gap-3 relative">
              <div className={cn(
                  "z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background",
              )}>
                {getStatusIcon(status, isCompleted, isCurrent)}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  isFuture ? 'text-muted-foreground' : 'text-foreground',
                  isCurrent && 'text-primary font-bold'
                )}
              >
                {status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default IssueStatusTimeline;
