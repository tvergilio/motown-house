'use server';

/**
 * @fileOverview An AI agent that provides personalized album recommendations based on user browsing history.
 *
 * - getPersonalizedRecommendations - A function that returns album recommendations.
 * - ThemedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - ThemedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemedRecommendationsInputSchema = z.object({
  browsingHistory: z.string().describe('The user browsing history.'),
  theme: z.string().describe('The theme for the album recommendations.'),
});
export type ThemedRecommendationsInput = z.infer<typeof ThemedRecommendationsInputSchema>;

const ThemedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of album recommendations based on the user browsing history and theme.'),
});
export type ThemedRecommendationsOutput = z.infer<typeof ThemedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: ThemedRecommendationsInput
): Promise<ThemedRecommendationsOutput> {
  return themedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'themedRecommendationsPrompt',
  input: {schema: ThemedRecommendationsInputSchema},
  output: {schema: ThemedRecommendationsOutputSchema},
  prompt: `You are a personal music assistant. Given the user's browsing history and a specific theme, you will recommend albums that align with their taste and the given theme.

Browsing History: {{{browsingHistory}}}
Theme: {{{theme}}}

Based on the browsing history and theme, what albums do you recommend? Return a list of album recommendations.`,
});

const themedRecommendationsFlow = ai.defineFlow(
  {
    name: 'themedRecommendationsFlow',
    inputSchema: ThemedRecommendationsInputSchema,
    outputSchema: ThemedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
