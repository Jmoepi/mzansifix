'use server';

import {
  suggestIssueCategories as suggestIssueCategoriesFlow,
  type SuggestIssueCategoriesInput,
} from '@/ai/flows/suggest-issue-categories';
import { z } from 'zod';

const ActionInputSchema = z.object({
  description: z.string().optional(),
  photoDataUri: z.string().optional(),
});

/**
 * Server action to suggest issue categories based on description and/or photo.
 * This function is designed to be called from client components.
 *
 * @param input - An object containing the issue description and/or a data URI of a photo.
 * @returns A promise that resolves to an array of suggested category strings.
 */
export async function suggestCategories(
  input: SuggestIssueCategoriesInput
): Promise<string[]> {
  const parsedInput = ActionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    console.error('Invalid input for suggestCategories action:', parsedInput.error);
    return [];
  }
  
  if (!parsedInput.data.description && !parsedInput.data.photoDataUri) {
    // Don't call the flow if there is no input to avoid unnecessary API calls.
    return [];
  }

  try {
    const result = await suggestIssueCategoriesFlow(parsedInput.data);
    return result.categories;
  } catch (error) {
    console.error('Error executing suggestIssueCategoriesFlow:', error);
    // In a production app, you might want to throw a more specific error
    // or return a structured error object.
    return [];
  }
}
