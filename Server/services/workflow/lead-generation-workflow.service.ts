import EmbeddingService from "../embedding/embedding.service";
import LeadGenerationService from "../lead-generation/lead-generation.service";
import AstraVectorStore from "../vector-store/astra-vector.service";
import WebScraperService from "../web-scrapper/web-scrapper.service";

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

  async generateLeads(query: string) {
    // Scrape websites
    const scrapedData = await this.webScraper.scrapeWebsites();

    // Generate embeddings
    const texts = scrapedData.map(data => data.content);
    const embeddings = await this.embeddingService.generateEmbeddings(texts);

    // Extract vector values 
    const vectorData = scrapedData.map((data, index) => ({
      ...data,
      embedding: embeddings.openai[index].embedding // Access the actual vector
    }));

    // Upsert vectors to Astra DB
    await this.vectorStore.upsertVectors('maritime_leads', vectorData);

    // Generate query embedding
    const queryEmbedding = await this.embeddingService.generateEmbeddings([query]);

    // Extract query vector
    const queryVector = queryEmbedding.openai[0].embedding;

    // Retrieve similar documents
    const relevantDocuments = await this.vectorStore.similaritySearch(
      'maritime_leads', 
      queryVector // Now passing the actual vector array
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