import Link from 'next/link';
import Image from 'next/image';
import type { FC } from 'react';
import type { Issue } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
}

const statusColors = {
  Open: 'bg-red-500 hover:bg-red-600',
  Acknowledged: 'bg-yellow-500 hover:bg-yellow-600',
  'In Progress': 'bg-blue-500 hover:bg-blue-600',
  Resolved: 'bg-green-500 hover:bg-green-600',
};

const IssueCard: FC<IssueCardProps> = ({ issue }) => {
  const timeAgo = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/issues/${issue.id}`} className="group block" prefetch={false}>
      <Card className="h-full transform transition-all duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-xl">
        <CardHeader>
          {issue.imageUrl && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={issue.imageUrl}
                alt={issue.title}
                data-ai-hint={issue.aiHint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-lg leading-tight group-hover:text-primary">
              {issue.title}
            </CardTitle>
            <Badge
              className={`whitespace-nowrap text-primary-foreground ${
                statusColors[issue.status]
              }`}
            >
              {issue.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary">{issue.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{issue.location}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.reporter.avatarUrl} alt={issue.reporter.name} />
              <AvatarFallback>{issue.reporter.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{issue.reporter.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {issue.votes}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {issue.comments}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default IssueCard;
