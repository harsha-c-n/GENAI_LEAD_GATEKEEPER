import cron from 'node-cron';
import EmbeddingService from "../embedding/embedding.service";
import LeadGenerationService from "../lead-generation/lead-generation.service";
import AstraVectorStore from "../vector-store/astra-vector.service";
import WebScraperService from "../web-scrapper/web-scrapper.service";
import Logger  from '../../utils/logger';

class LeadGenerationWorkflow {
  private webScraper: WebScraperService;
  private embeddingService: EmbeddingService;
  private vectorStore: AstraVectorStore;
  private leadGenerator: LeadGenerationService;

  private defaultQuery: string;
  private isUpdating: boolean = false;

  constructor() {
    this.webScraper = new WebScraperService();
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new AstraVectorStore();
    this.leadGenerator = new LeadGenerationService();
    
    this.defaultQuery = `Generate high-quality B2B leads for selling a digital web application designed for maritime shipping companies...`; // Your existing query
  }

  // Scheduled Data Update Method
  async performScheduledUpdate() {
    // Prevent concurrent updates
    if (this.isUpdating) {
      Logger.warn('Update already in progress. Skipping this scheduled run.');
      return;
    }

    try {
      this.isUpdating = true;
      Logger.info('Starting scheduled data update...');

      // Start timing
      const startTime = Date.now();

      // 1. Scrape Websites
      const scrapedData = await this.webScraper.scrapeWebsites();
   

      // 2. Process and Embed Scraped Data
      const embeddedVectors = [];
      for await(const chunk of scrapedData!) {
        try {
          // Generate embeddings
          const embeddingResult = await this.embeddingService.generateEmbeddings(chunk);
          
          // Upsert to Vector DB
          await this.vectorStore.upsertVectors(chunk, embeddingResult.data[0].embedding);
          
          embeddedVectors.push({
            chunk,
            embedding: embeddingResult.data[0].embedding
          });
        } catch (error) {
          Logger.error('error:' ,error);
        }
      }

      // Calculate and log update duration
      const duration = Date.now() - startTime;
      Logger.info(`Scheduled update completed in ${duration}ms. Embedded ${embeddedVectors.length} items.`);
    } catch (error) {
      Logger.error(`Scheduled update failed: ${error}`);
    } finally {
      this.isUpdating = false;
    }
  }

  // Initialize Scheduled Updates
  initScheduledUpdates() {
    // Run every 12 hours
    cron.schedule('0 */12 * * *', () => {
      this.performScheduledUpdate();
    });

    Logger.info('Scheduled updates initialized for every 12 hours');
  }

  // Main Lead Generation Method
  async generateLeads(query?: string) {
    try {
      // Use provided query or default
      const finalQuery = query || this.defaultQuery;
      Logger.info(`Generating leads for query: ${finalQuery}`);

      // 1. Generate Query Embedding
      const queryEmbeddingResult = await this.embeddingService.generateEmbeddings(finalQuery);
      
      // 2. Perform Similarity Search
      const relevantDocuments = await this.vectorStore.similaritySearch(
        queryEmbeddingResult
      );

      // 3. Generate Lead Insights
      const leadInsights = await this.leadGenerator.generateLeadInsights(
        relevantDocuments,
        finalQuery
      );

      // Log results
      Logger.info(`Found ${relevantDocuments.length} relevant documents`);

      return {
        relevantDocuments,
        leadInsights
      };
    } catch (error) {
      Logger.error(`Lead generation failed: ${error}`);
      throw error;
    }
  }

  // Method to manually trigger update
  async manualUpdate() {
    await this.performScheduledUpdate();
  }

  // Start the workflow
  async start() {
    // Perform initial update
    await this.performScheduledUpdate();
    
    // Initialize scheduled updates
    this.initScheduledUpdates();
  }
}

export default LeadGenerationWorkflow;

// Example Usage
async function initLeadGenerationWorkflow() {
  const workflow = new LeadGenerationWorkflow();
  
  // Start the workflow (initial update + scheduling)
  await workflow.start();

  return workflow;
}

export { initLeadGenerationWorkflow };