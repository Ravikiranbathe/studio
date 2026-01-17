'use server';

/**
 * @fileOverview AI-powered proposal generator for developers.
 *
 * - generateProposal - A function that generates a project proposal.
 * - AiProposalGeneratorInput - The input type for the generateProposal function.
 * - AiProposalGeneratorOutput - The return type for the generateProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProposalGeneratorInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectDescription: z.string().describe('The description of the project.'),
  techStack: z.string().describe('The tech stack required for the project.'),
  successfulApplicationExamples: z.string().describe('Examples of successful application proposals.'),
});
export type AiProposalGeneratorInput = z.infer<typeof AiProposalGeneratorInputSchema>;

const AiProposalGeneratorOutputSchema = z.object({
  proposal: z.string().describe('The generated project proposal.'),
});
export type AiProposalGeneratorOutput = z.infer<typeof AiProposalGeneratorOutputSchema>;

export async function generateProposal(input: AiProposalGeneratorInput): Promise<AiProposalGeneratorOutput> {
  return aiProposalGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProposalGeneratorPrompt',
  input: {schema: AiProposalGeneratorInputSchema},
  output: {schema: AiProposalGeneratorOutputSchema},
  prompt: `You are an expert proposal writer for software development projects.

  Based on the project requirements and examples of successful application proposals, generate a compelling project proposal.

  Project Title: {{{projectTitle}}}
  Project Description: {{{projectDescription}}}
  Tech Stack: {{{techStack}}}
  Successful Application Examples: {{{successfulApplicationExamples}}}

  Write a proposal that highlights your understanding of the project requirements, your skills and experience with the required tech stack, and your unique approach to solving the project's challenges.  The proposal should be concise and persuasive.
  `,
});

const aiProposalGeneratorFlow = ai.defineFlow(
  {
    name: 'aiProposalGeneratorFlow',
    inputSchema: AiProposalGeneratorInputSchema,
    outputSchema: AiProposalGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
