import Link from 'next/link';
import Image from 'next/image';
import type { FC } from 'react';
import type { Issue } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, MoreHorizontal, Send, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const statusColors = {
  Open: 'bg-red-500/20 text-red-400 border-red-500/30',
  Acknowledged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
};


const IssueCard: FC<IssueCardProps> = ({ issue }) => {
  const timeAgo = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😠'];

  return (
      <Card className="w-full border-0 sm:border rounded-none sm:rounded-2xl shadow-none sm:shadow-lg bg-transparent sm:bg-card">
        <CardHeader className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={issue.reporter.avatarUrl} alt={issue.reporter.name} />
                <AvatarFallback>{issue.reporter.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{issue.reporter.name}</p>
                <p className="text-xs text-muted-foreground">{issue.location}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        {issue.imageUrl && (
            <div className="relative w-full aspect-video">
              <Link href={`/issues/${issue.id}`} className="block w-full h-full" prefetch={false}>
                <Image
                    src={issue.imageUrl}
                    alt={issue.title}
                    data-ai-hint={issue.aiHint}
                    fill
                    className="object-cover"
                />
              </Link>
            </div>
        )}

        <CardContent className="p-3 sm:p-4">
             <div className="flex gap-2 mb-2">
                <Badge className={`whitespace-nowrap ${statusColors[issue.status]}`}>{issue.status}</Badge>
                <Badge variant="secondary">{issue.category}</Badge>
             </div>
            <Link href={`/issues/${issue.id}`} prefetch={false}>
                <h2 className="font-bold text-lg leading-tight hover:text-primary transition-colors">{issue.title}</h2>
            </Link>
             <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
               {issue.description}
            </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-3 sm:p-4">
           <div className="flex items-center gap-4 text-sm">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary p-1 h-auto">
                            <Smile className="h-5 w-5" />
                            <span>{issue.votes}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1">
                        <div className="flex gap-1">
                        {emojis.map((emoji) => (
                            <Button key={emoji} variant="ghost" size="icon" className="text-xl rounded-full">
                                {emoji}
                            </Button>
                        ))}
                        </div>
                    </PopoverContent>
                </Popover>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary p-1 h-auto">
                    <MessageSquare className="h-5 w-5" />
                    <span>{issue.comments}</span>
                </Button>
                 <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary p-1 h-auto">
                    <Send className="h-5 w-5" />
                    <span>Share</span>
                </Button>
           </div>
            <p className="text-xs text-muted-foreground/80">{timeAgo}</p>
        </CardFooter>
      </Card>
  );
};

export default IssueCard;
