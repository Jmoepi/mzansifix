'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockIssues } from '@/lib/data';
import { BarChart, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

export default function DashboardPage() {
  const totalIssues = mockIssues.length;
  const openIssues = mockIssues.filter((i) => i.status === 'Open').length;
  const resolvedIssues = mockIssues.filter(
    (i) => i.status === 'Resolved'
  ).length;
  const inProgressIssues = mockIssues.filter(
    (i) => i.status === 'In Progress'
  ).length;

  const issueDataByCategory = mockIssues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = { category: issue.category, count: 0 };
    }
    acc[issue.category].count++;
    return acc;
  }, {} as Record<string, { category: string; count: number }>);

  const chartData = Object.values(issueDataByCategory);

  const chartConfig = {
    count: {
      label: 'Issues',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues by Category</CardTitle>
          <CardDescription>
            A breakdown of all reported issues by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                <YAxis />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
