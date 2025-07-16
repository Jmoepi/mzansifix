import Image from 'next/image';
import { mockIssues } from '@/lib/data';
import IssueCard from '@/components/issue-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { List, Map } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function Home() {
  const issueCategories = [
    'Road Maintenance',
    'Water and Sanitation',
    'Electricity',
    'Waste Management',
    'Public Safety',
    'Other',
  ];
  const issueStatuses = ['Open', 'Acknowledged', 'In Progress', 'Resolved'];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Community Issues
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse, track, and report issues in your area.
        </p>
      </header>

      <Tabs defaultValue="list" className="w-full">
        <Card className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="grid grid-cols-2 sm:flex gap-4 w-full sm:w-auto">
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueStatuses.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Filter by location..." className="w-full sm:w-auto flex-grow" />
                <Button variant="secondary">Filter</Button>
              </div>
            </div>
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="mr-2 h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="map">
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Map of issues"
                width={1200}
                height={600}
                data-ai-hint="map city"
                className="h-full w-full object-cover"
              />
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
