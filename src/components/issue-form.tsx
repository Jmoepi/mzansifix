'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useTransition, useCallback, useRef } from 'react';
import { suggestCategories } from '@/app/actions';
import { Loader2, Lightbulb, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import type { IssueCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import Image from 'next/image';
import { useIssues } from '@/hooks/use-issues';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const issueCategories: IssueCategory[] = [
  'Road Maintenance',
  'Water and Sanitation',
  'Electricity',
  'Waste Management',
  'Public Safety',
  'Other',
];

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  category: z.enum(issueCategories, {
    errorMap: () => ({ message: 'Please select a valid category.' }),
  }),
  location: z.string().min(5, {
    message: 'Please provide a location.',
  }),
  photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function IssueForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { addIssue } = useIssues();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoDataUri = useRef<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
    },
  });

  const handleSuggestion = useCallback(() => {
    const description = form.getValues('description');
    if (!description && !photoDataUri.current) return;

    setIsSuggesting(true);
    startTransition(async () => {
      try {
        const result = await suggestCategories({
          description: description,
          photoDataUri: photoDataUri.current ?? undefined,
        });
        setSuggestions(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch AI suggestions.',
        });
        setSuggestions([]);
      } finally {
        setIsSuggesting(false);
      }
    });
  }, [form, toast]);
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        photoDataUri.current = dataUrl;
        setPhotoPreview(dataUrl);
        handleSuggestion();
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to report an issue.',
      });
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addIssue({
        ...values,
        imageUrl: photoDataUri.current ?? undefined,
      });

      toast({
        title: 'Issue Reported!',
        description: 'Thank you for your submission. Your issue has been logged.',
      });
      
      form.reset();
      router.push('/');

    } catch (error) {
       toast({
          variant: 'destructive',
          title: 'Submission Error',
          description: 'There was a problem submitting your issue. Please try again.',
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Massive Pothole on Main St"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail. What is it, where is it, and what is the impact?"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Photo (Optional)</FormLabel>
              <FormControl>
                <div className="relative flex items-center justify-center w-full">
                  <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                    {photoPreview ? (
                       <Image src={photoPreview} alt="Preview" fill className="object-contain rounded-lg p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                    )}
                     <Input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="bg-muted/30 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">AI-Powered Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Get category suggestions based on your description and photo.
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleSuggestion}
              disabled={isSuggesting}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSuggesting ? 'Suggesting...' : 'Get Suggestions'}
            </Button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Suggested Categories:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    onClick={() =>
                      form.setValue('category', suggestion as IssueCategory, {
                        shouldValidate: true,
                      })
                    }
                    className="cursor-pointer transition-all hover:bg-primary/80"
                    variant={form.watch('category') === suggestion ? 'default' : 'secondary'}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for the issue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Corner of Main St and 1st Ave, near the Post Office"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a specific address or nearest landmark.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Issue
        </Button>
      </form>
    </Form>
  );
}
