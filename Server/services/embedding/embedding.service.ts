import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });
class EmbeddingService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateEmbeddings(texts: string[]) {
    try {
      const openaiResponse = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts
      });

      return {
        embeddings: [
          {
            provider: 'openai',
            embedding: texts.map(() => Math.random()) // placeholder
          },
          // Potentially other providers
        ]
      };
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }
}

export default EmbeddingService;