import axios from 'axios';
import * as cheerio from 'cheerio';

class WebScraperService {
  private sources: string[] = [
    'https://www.marinelink.com/',
    'https://www.maritime-executive.com/',
    'https://www.seatrade-maritime.com/',
    'https://www.rivieramm.com/news-content-hub/news-content-hub/container-shipping-top-2024-trends-78826'
  ];

  // Method to update sources
  updateSources(newSources: string[]) {
    this.sources = newSources;
  }

  async scrapeWebsites(customSources?: string[]) {
    // Use custom sources if provided, otherwise use default sources
    const sourcesToScrape = customSources || this.sources;
    const scrapedData: { source: string; title: string; content: string; link: string; scrapedAt: Date; }[] = [];

    for (const url of sourcesToScrape) {
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Customize selectors based on each website's HTML structure
        // Note: This is a generic selector and might need customization for specific websites
        const articles = $('.article, .news-item, .content');
        
        articles.each((index, element) => {
          const title = $(element).find('h2, .title').text().trim();
          const content = $(element).find('p, .excerpt').text().trim();
          const link = $(element).find('a').attr('href') || url;

          scrapedData.push({
            source: url,
            title,
            content,
            link,
            scrapedAt: new Date()
          });
        });
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

    return scrapedData;
  }
}

export default WebScraperService;