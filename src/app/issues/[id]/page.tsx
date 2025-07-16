import { mockIssues } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import IssueStatusTimeline from '@/components/issue-status-timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const issue = mockIssues.find((i) => i.id === params.id);

  if (!issue) {
    notFound();
  }
  
  const statusColors = {
    Open: 'bg-red-500',
    Acknowledged: 'bg-yellow-500',
    'In Progress': 'bg-blue-500',
    Resolved: 'bg-green-500',
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                 <div>
                    <Badge variant="secondary" className="mb-2">{issue.category}</Badge>
                    <CardTitle className="font-headline text-3xl">{issue.title}</CardTitle>
                 </div>
                 <Badge className={`mt-1 text-primary-foreground text-sm ${statusColors[issue.status]}`}>{issue.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{issue.location}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Reported on {format(new Date(issue.createdAt), 'PPP')}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {issue.imageUrl && (
                <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg border">
                  <Image
                    src={issue.imageUrl}
                    alt={issue.title}
                    data-ai-hint={issue.aiHint}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="prose prose-stone dark:prose-invert max-w-none text-foreground">
                 <p>{issue.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Comments ({issue.comments})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                            <Textarea placeholder="Add your comment..." />
                            <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">Post Comment</Button>
                        </div>
                    </div>
                     <p className="text-center text-sm text-muted-foreground pt-4">No comments yet. Be the first to say something!</p>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-2xl">
                 <CardHeader>
                     <CardTitle className="font-headline text-xl">Status History</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <IssueStatusTimeline currentStatus={issue.status} />
                 </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Reported By</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={issue.reporter.avatarUrl} alt={issue.reporter.name} />
                        <AvatarFallback>{issue.reporter.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{issue.reporter.name}</p>
                        <p className="text-sm text-muted-foreground">Community Member</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Community Actions</CardTitle>
                </CardHeader>
                 <CardContent className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ThumbsUp className="h-4 w-4" /> Vote to escalate ({issue.votes})
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ExternalLink className="h-4 w-4" /> Share Issue
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
