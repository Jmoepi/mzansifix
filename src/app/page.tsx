import { mockIssues } from '@/lib/data';
import IssueCard from '@/components/issue-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary md:text-6xl">
          Mzansi<span className="text-accent">Fix</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your daily feed of community action.
        </p>
      </header>
      
      <div className="flex justify-center mb-8">
         <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-lg transform hover:scale-105 transition-transform">
            <Link href="/issues/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                Report a New Issue
            </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {mockIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
