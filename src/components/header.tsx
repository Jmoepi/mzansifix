'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, Wrench, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2" prefetch={false}>
    <div className="flex items-center justify-center rounded-md bg-primary p-2">
      <Wrench className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="font-headline text-xl font-bold tracking-tight">
      MzansiFix
    </span>
  </Link>
);

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    <Link
      href="/"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      prefetch={false}
    >
      Browse Issues
    </Link>
    <Link
      href="/#faq"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      prefetch={false}
    >
      FAQ
    </Link>
    <Link
      href="/#contact"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      prefetch={false}
    >
      Contact
    </Link>
  </nav>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <Logo />
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <NavLinks className="flex flex-col gap-4" />
                <div className="mt-4 flex flex-col gap-2">
                   <Button asChild variant="outline">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add a search bar here if needed */}
          </div>
          <NavLinks className="hidden items-center gap-6 text-sm md:flex" />
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/issues/new">Report an Issue</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
