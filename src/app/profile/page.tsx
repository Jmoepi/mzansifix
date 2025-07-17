
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';


export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto max-w-lg p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
          <CardTitle className="font-headline text-3xl">{user.displayName}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <Button variant="outline">Edit Profile</Button>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
}
