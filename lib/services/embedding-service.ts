import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Service to handle vector embedding generation using OpenAI.
 * Uses text-embedding-3-small (1536 dimensions) for optimal cost/performance.
 */
export class EmbeddingService {
  /**
   * Generates a vector embedding for the given text.
   * @param text The input text to vectorize.
   * @returns A promise that resolves to an array of numbers (the embedding).
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      throw new Error("Cannot generate embedding for empty text.");
    }

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '), // Recommended preprocessing for embeddings
      });

      return response.data[0].embedding;
    } catch (error: any) {
      console.error("Error generating embedding:", error);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }

  /**
   * Helper to truncate text to stay within OpenAI's token limits if needed.
   * (Simplified version, roughly 4 chars per token)
   */
  truncateToLimit(text: string, maxTokens = 8191): string {
    const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars);
  }
}

export const embeddingService = new EmbeddingService();
