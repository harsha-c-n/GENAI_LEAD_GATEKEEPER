import EmbeddingService from "../embedding/embedding.service";
import LeadGenerationService from "../lead-generation/lead-generation.service";
import AstraVectorStore from "../vector-store/astra-vector.service";
import WebScraperService from "../web-scrapper/web-scrapper.service";

// Define an interface for the embedding result
interface EmbeddingResult {
  embeddings: {
    provider: string;
    embedding: number[];
  }[];
}

class LeadGenerationWorkflow {
  private webScraper: WebScraperService;
  private embeddingService: EmbeddingService;
  private vectorStore: AstraVectorStore;
  private leadGenerator: LeadGenerationService;

  constructor() {
    this.webScraper = new WebScraperService();
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new AstraVectorStore();
    this.leadGenerator = new LeadGenerationService();
  }

  async generateLeads(query: string, sources: any) {
    // Scrape websites
    const scrapedData = await this.webScraper.scrapeWebsites(sources);

    // Generate embeddings
    const texts = scrapedData.map(data => data.content);
    const embeddingResult = await this.embeddingService.generateEmbeddings(texts);

    // Extract vector values 
    const vectorData = scrapedData.map((data, index) => {
      // Find the OpenAI embedding or use the first available
      const embedding = embeddingResult.embeddings.find(e => e.provider === 'openai')?.embedding || 
                        embeddingResult.embeddings[0].embedding;
      
      return {
        ...data,
        embedding: embedding
      };
    });

    // Upsert vectors to Astra DB
    await this.vectorStore.upsertVectors('maritime_leads', vectorData);

    // Generate query embedding
    const queryEmbeddingResult = await this.embeddingService.generateEmbeddings([query]);

    // Extract query vector
    const queryVector = queryEmbeddingResult.embeddings.find(e => e.provider === 'openai')?.embedding || 
                        queryEmbeddingResult.embeddings[0].embedding;

    // Retrieve similar documents
    const relevantDocuments = await this.vectorStore.similaritySearch(
      'maritime_leads', 
      queryVector
    );

    // Generate lead insights
    const leadInsights = await this.leadGenerator.generateLeadInsights(
      relevantDocuments, 
      query
    );

    return {
      scrapedData,
      relevantDocuments,
      leadInsights
    };
  }
}

export default LeadGenerationWorkflow;