import { launch, Page, Browser } from 'puppeteer';

class WebScraperService {
  private sources: string[] = [
    'https://en.wikipedia.org/wiki/Maersk',  
  ];

  // Method to update sources
  updateSources(newSources: string[]) {
    this.sources = newSources;
  }

  async scrapeWebsites(customSources?: string[]) {
    // Use custom sources if provided, otherwise use default sources
    const sourcesToScrape = customSources || this.sources;
    const scrapedData: { 
      source: string; 
      title: string; 
      content: string; 
      link: string; 
      scrapedAt: Date; 
    }[] = [];

    const browser = await launch({ 
      headless: true,  // Change to false if you want to see the browser
      // Optional: Add additional launch options if needed
      // args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (const url of sourcesToScrape) {
        try {
          const page = await browser.newPage();
          
          // Navigate to the page
          await page.goto(url, { 
            waitUntil: 'networkidle0',  // Wait until network is idle
            timeout: 30000  // 30 seconds timeout
          });

          // Extract articles using Puppeteer's page.evaluate
          const pageArticles = await page.evaluate(() => {
            const articles: { 
              title: string; 
              content: string; 
              link: string; 
            }[] = [];

            // Customize these selectors based on the specific website's HTML structure
            const articleElements = document.querySelectorAll('.article, .news-item, .content');
            
            articleElements.forEach((element) => {
              const titleEl = element.querySelector('h2, .title');
              const contentEl = element.querySelector('p, .excerpt');
              const linkEl = element.querySelector('a');

              articles.push({
                title: titleEl ? titleEl.textContent?.trim() || '' : '',
                content: contentEl ? contentEl.textContent?.trim() || '' : '',
                link: linkEl ? (linkEl as HTMLAnchorElement).href || url : url
              });
            });

            return articles;
          });

          // Add scraped articles to the main data array
          scrapedData.push(...pageArticles.map(article => ({
            source: url,
            ...article,
            scrapedAt: new Date()
          })));

          // Close the page
          await page.close();
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
        }
      }
    } finally {
      // Always close the browser
      await browser.close();
    }

    return scrapedData;
  }
}

export default WebScraperService;