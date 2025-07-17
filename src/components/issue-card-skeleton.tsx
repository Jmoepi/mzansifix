
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

export default function IssueCardSkeleton() {
  return (
    <Card className="w-full border-0 sm:border rounded-none sm:rounded-2xl shadow-none sm:shadow-lg bg-transparent sm:bg-card">
        <CardHeader className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className='space-y-2'>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        
        <Skeleton className="relative w-full aspect-video" />

        <CardContent className="p-3 sm:p-4 space-y-2">
             <div className="flex gap-2 mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
             </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-3 sm:p-4">
           <div className="flex items-center gap-4 text-sm">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-16" />
           </div>
            <Skeleton className="h-4 w-28" />
        </CardFooter>
      </Card>
  );
};
