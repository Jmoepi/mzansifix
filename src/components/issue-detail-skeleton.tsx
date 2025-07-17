
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function IssueDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                 <div className="space-y-3 w-full">
                    <Skeleton className="h-6 w-32 rounded-md" />
                    <Skeleton className="h-9 w-4/5 rounded-md" />
                 </div>
                 <Skeleton className="h-7 w-24 rounded-full mt-1" />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm pt-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-5 w-48 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="relative mb-6 h-96 w-full rounded-lg" />
              <div className="space-y-3">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
                <Skeleton className="h-7 w-48 rounded-md" />
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-9 w-32" />
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-2xl">
                 <CardHeader>
                     <Skeleton className="h-7 w-32 rounded-md" />
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <Skeleton className="h-6 w-24" />
                     <Skeleton className="h-6 w-32" />
                     <Skeleton className="h-6 w-28" />
                     <Skeleton className="h-6 w-20" />
                 </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-7 w-40 rounded-md" />
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                     <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardContent>
            </Card>
            
            <Card className="rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-7 w-48 rounded-md" />
                </CardHeader>
                 <CardContent className="flex flex-col gap-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
