// src/ai/flows/suggest-issue-categories.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests issue categories based on a description and/or an image.
 *
 * - suggestIssueCategories - A function that accepts an issue description and/or image and returns suggested categories.
 * - SuggestIssueCategoriesInput - The input type for the suggestIssueCategories function.
 * - SuggestIssueCategoriesOutput - The output type for the suggestIssueCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIssueCategoriesInputSchema = z.object({
  description: z.string().describe('A description of the issue.').optional(),
  photoDataUri: z
    .string()
    .describe(
      "A photo related to the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});

export type SuggestIssueCategoriesInput = z.infer<
  typeof SuggestIssueCategoriesInputSchema
>;

const SuggestIssueCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested issue categories.'),
});

export type SuggestIssueCategoriesOutput = z.infer<
  typeof SuggestIssueCategoriesOutputSchema
>;

export async function suggestIssueCategories(
  input: SuggestIssueCategoriesInput
): Promise<SuggestIssueCategoriesOutput> {
  return suggestIssueCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIssueCategoriesPrompt',
  input: {schema: SuggestIssueCategoriesInputSchema},
  output: {schema: SuggestIssueCategoriesOutputSchema},
  prompt: `You are an AI assistant helping users report infrastructure issues.

  Based on the following issue description and/or image, suggest a list of relevant issue categories.
  Return ONLY the categories, and nothing else. The categories MUST be from this list:
  ["Road Maintenance", "Water and Sanitation", "Electricity", "Waste Management", "Public Safety", "Other"]

  Description: {{description}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}
  Categories:`,
});

const suggestIssueCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestIssueCategoriesFlow',
    inputSchema: SuggestIssueCategoriesInputSchema,
    outputSchema: SuggestIssueCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Attempt to parse the output as a JSON array. If it fails, split the output by commas.
    let categories: string[];
    try {
      categories = JSON.parse(output!.categories) as string[];
    } catch (e) {
      // Split by commas and trim whitespace.
      categories = output!.categories.split(',').map(s => s.trim());
    }

    return {categories};
  }
);
