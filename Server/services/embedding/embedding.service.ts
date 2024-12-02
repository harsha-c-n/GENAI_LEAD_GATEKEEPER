import OpenAI from 'openai';
import { CohereClient } from 'cohere-ai';

class EmbeddingService {
  private openai: OpenAI;
  private cohere: CohereClient;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY
    });
  }

  async generateEmbeddings(texts: string[]) {
    try {
      // OpenAI Embeddings
      const openaiResponse = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts
      });

      // Cohere Embeddings (alternative/comparison)
      const cohereResponse = await this.cohere.embed({
        texts: texts,
        model: 'embed-english-v3.0'
      });

      return {
        openai: openaiResponse.data,
        cohere: cohereResponse.embeddings
      };
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }
}

export default EmbeddingService;