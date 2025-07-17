'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Compass, Home, User, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-sm md:sticky md:top-0 md:border-b md:border-t-0">
      <div className="container flex h-16 items-center justify-center md:justify-end">
        <nav className="flex w-full items-center justify-around gap-4 md:w-auto md:justify-end">
          <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-2 gap-1 text-muted-foreground hover:text-primary">
            <Link href="/">
              <Home className="h-5 w-5" />
              <span className="text-xs">Feed</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-2 gap-1 text-muted-foreground hover:text-primary">
            <Link href="/explore">
              <Compass className="h-5 w-5" />
              <span className="text-xs">Explore</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="flex flex-col h-auto p-2 gap-1 text-muted-foreground hover:text-primary">
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Link>
          </Button>
          <Button asChild className="hidden md:flex bg-accent text-accent-foreground hover:bg-accent/90">
             <Link href="/issues/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Report Issue
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
