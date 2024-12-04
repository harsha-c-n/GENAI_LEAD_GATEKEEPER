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
  private defaultQuery: string;

  constructor() {
    this.webScraper = new WebScraperService();
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new AstraVectorStore();
    this.leadGenerator = new LeadGenerationService();
    
    // Set the default query for maritime B2B leads
    this.defaultQuery = `Generate high-quality B2B leads for selling a digital web application designed for maritime shipping companies. Focus on companies with the following attributes:
1. **Industry**: Maritime shipping, logistics, or supply chain management.
2. **Revenue & Financial Data**: Companies with annual revenues of $100M+ or those showing recent growth trends.
3. **Geographical Focus**: Europe, Asia-Pacific, and North America.
4. **Recent Trends**: Prioritize companies involved in digitization, sustainability, or adopting AI-driven analytics.
5. **Decision Makers**: Provide details on C-level executives, IT directors, and operations managers.
6. **Use Case**: Highlight how they are leveraging or planning to adopt digital solutions to improve efficiency, compliance, and fuel optimization.
Include company names, financial data, recent news (like partnerships or technology adoption), and contact details where available.`;
  }

  // Method to set a custom default query if needed
  setDefaultQuery(query: string) {
    this.defaultQuery = query;
  }

  async generateLeads(query?: string, sources?: any) {
    console.log("AAAAAAAAAAAAAAAA")
    // Use the provided query or fall back to the default query
    const finalQuery = query || this.defaultQuery;

    // Scrape websites
    const scrapedData:any = await this.webScraper.scrapeWebsites();
    
    // Generate embeddings
    for await(const chunk of scrapedData){
      const embeddingResult = await this.embeddingService.generateEmbeddings(chunk);
      const vector = embeddingResult.data[0].embedding;
      await this.vectorStore.upsertVectors(chunk, vector);

    }
    const texts = scrapedData;
    console.log("AAAAAAAAAAAAAAAAAA")
    console.log(texts)
    console.log("AAAAAAAAAAAAAAAAAA")

    
    // Upsert vectors to Astra DB
   
    
    // Generate query embedding
    // const queryEmbeddingResult = await this.embeddingService.generateEmbeddings([finalQuery]);
    
    // // Extract query vector
    // const queryVector = queryEmbeddingResult.embeddings.find(e => e.provider === 'openai')?.embedding ||
    //                     queryEmbeddingResult.embeddings[0].embedding;
    
    // Retrieve similar documents
    // const relevantDocuments = await this.vectorStore.similaritySearch(
    //   'maritime_leads',
    //   queryVector
    // );
    
    // // Generate lead insights
    // const leadInsights = await this.leadGenerator.generateLeadInsights(
    //   relevantDocuments,
    //   finalQuery
    // );
    
    // return {
    //   scrapedData,
    //   relevantDocuments,
    //   leadInsights
    // };
  }
}

export default LeadGenerationWorkflow;