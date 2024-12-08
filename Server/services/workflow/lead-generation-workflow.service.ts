import cron from 'node-cron';
import EmbeddingService from "../embedding/embedding.service";
import LeadGenerationService from "../lead-generation/lead-generation.service";
import AstraVectorStore from "../vector-store/astra-vector.service";
import WebScraperService from "../web-scrapper/web-scrapper.service";
import Logger from '../../utils/logger';
import puppeteer from 'puppeteer';

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

    this.defaultQuery = `Generate a list of potential maritime companies with the following business details:

Company Name
Market Cap
Profit
Employees
Address
Return the data as an array of JSON objects in the following structure:

{
    "company_name": "",
    "market_cap": "",
    "profit": "",
    "employees": "",
    "address": ""
}
Ensure the following:

No empty objects. Only include companies with valid data for all the fields.
Include well-known and significant maritime companies in the industry, such as shipping lines, port operators, and logistics companies.
Do not include private companies or companies with incomplete information, unless estimations or reliable data can be used for market cap and profit.
  `; // Your existing query
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
      for await (const chunk of scrapedData!) {
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
          Logger.error('error:', error);
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
  async generateLeads(query?: any) {
    try {
      // Use provided query or default
      const finalQuery = query || this.defaultQuery;
      Logger.info(`Generating leads for query: ${finalQuery}`);
      // 1. Generate Query Embedding
      const queryEmbeddingResult = await this.embeddingService.generateEmbeddings(finalQuery);
      console.log(queryEmbeddingResult, ": queryEmbeddingResult")
      // 2. Perform Similarity Search
      const relevantDocuments = await this.vectorStore.similaritySearch(
        queryEmbeddingResult
      );

      // 3. Generate Lead Insights
      const leadInsights: any = await this.leadGenerator.generateLeadInsights(
        finalQuery, relevantDocuments
      );

      // Log results
      Logger.info(`Found ${relevantDocuments.length} relevant documents`);
      if (query) {
        console.log(leadInsights)
        return leadInsights
      }
      else {
          
        const jsonMatch = leadInsights.match(/{[\s\S]*?}/);

        if (jsonMatch && jsonMatch[1]) {
          try {
            // Parse the extracted JSON string into a JavaScript array
            const maritimeCompanies = JSON.parse(jsonMatch[1]);
            console.log('Extracted Array:', maritimeCompanies);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.log('No valid JSON found in the string.');
        }
          
          return leadInsights;
        }


      }

     catch (error) {
      Logger.error(`Lead generation failed: ${error}`);
      throw error;
    }
  }
  async scrapeMaritimeData(companyNames: string[]) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results: Array<{
      name: string;
      address: string;
      email: string;
      addressCountry: string;
      searchTerm: string;
    }> = []; // To store all results across searches

    for (const name of companyNames) {
      console.log(`Searching for: ${name}`);
      try {
        await page.goto('https://yourmaritime.com/');
        await page.waitForSelector('#keyword', { timeout: 5000 });

        // Clear existing input and type the new name
        await page.evaluate(() => {
          const inputElement = document.querySelector('#keyword') as HTMLInputElement | null;
          if (inputElement) inputElement.value = '';
        });
        await page.type('#keyword', name);

        await Promise.all([
          page.waitForNavigation(),
          page.click('.btn-block'),
        ]);

        // Check if there are results
        const hasResults = await page.evaluate(() => {
          const noResultsMessage = document.querySelector('.listing-results-container .col-12 p')?.textContent || '';
          const hasCards = !!document.querySelectorAll('.card-body h4 a.text-dark').length;
          return !noResultsMessage.includes('No results found') && hasCards;
        });

        if (!hasResults) {
          console.log(`No results found for: ${name}`);
          continue;
        }

        // Extract up to 5 links from the search results
        const links = await page.$$eval('.card-body h4 a.text-dark', (elements) =>
          elements.slice(0, 5).map(el => (el as HTMLAnchorElement).href)
        );

        console.log(`Processing ${links.length} results for ${name}`);

        // Process each link in batches
        for (const link of links) {
          const detailPage = await browser.newPage(); // Open a new tab for each link
          try {
            await detailPage.goto(link);
            await detailPage.waitForSelector('.ml-2.text-secondary', { timeout: 5000 });

            // Scrape data from the detail page
            const data = await detailPage.evaluate(() => {
              const name = document.querySelector('h1.display-3 span')?.textContent || '';
              const address = document.querySelector('[itemprop="streetAddress"]')?.textContent || '';
              const email = document.querySelector('[itemprop="email"]')?.textContent || '';
              const addressCountry = document.querySelector('[itemprop="addressCountry"]')?.textContent || '';
              return { name, address, email, addressCountry };
            });

            // Push only non-duplicate data
            if (!results.some(item => item.name === data.name && item.address === data.address)) {
              results.push({ ...data, searchTerm: name });
            }
          } catch (error) {
            console.error(`Error processing link ${link}:`, error);
          } finally {
            await detailPage.close(); // Ensure the tab is closed
          }
        }
      } catch (error) {
        console.error(`Error searching for ${name}:`, error);
      }
    }

    console.log('Scraping completed. Results:', results);

    await browser.close();
    return results;
  }
  extractJsonFromString(input: string): any {
    try {
        // Regular expression to find JSON-like structures in the string
        const jsonMatch = input.match(/{[\s\S]*?}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in the input string.');
        }
        // Extract the JSON string
        const jsonString = jsonMatch[0];
        // Parse the JSON string
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } catch (error) {
        console.error('Error extracting JSON:', error);
        return null;
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