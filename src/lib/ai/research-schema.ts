import { z } from 'zod';

export const ResearchResponseSchema = z.object({
  answer: z.string().describe("The answer to the user's question, based entirely on the sources."),
  sufficient: z.boolean().describe("True if the sources contain enough information to answer the question, false otherwise."),
  citations: z.array(
    z.object({
      sourceId: z.string().describe("The ID of the source used."),
      sourceTitle: z.string().describe("The title of the source used."),
      excerpt: z.string().describe("A relevant excerpt from the source supporting the claim."),
    })
  ).describe("A list of citations supporting the answer. Empty if sources are insufficient."),
});

export type ResearchResponse = z.infer<typeof ResearchResponseSchema>;
