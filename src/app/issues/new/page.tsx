import IssueForm from '@/components/issue-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewIssuePage() {
  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Report a New Issue</CardTitle>
          <CardDescription>
            Help improve your community by reporting an issue. Provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IssueForm />
        </CardContent>
      </Card>
    </div>
  );
}
