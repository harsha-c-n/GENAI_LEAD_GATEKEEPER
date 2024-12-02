import axios from 'axios';
import * as cheerio from 'cheerio';

class WebScraperService {
  private sources = [
    'https://www.marinelink.com/',
    'https://www.maritime-executive.com/',
    'https://www.seatrade-maritime.com/',
    'https://www.rivieramm.com/news-content-hub/news-content-hub/container-shipping-top-2024-trends-78826'
  ];

  async scrapeWebsites() {
    const scrapedData: { source: string; title: any; content: any; link: any; scrapedAt: Date; }[] = [];

    for (const url of this.sources) {
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Customize selectors based on each website's HTML structure
        const articles = $('.article-content');
        
        articles.each((index, element) => {
          const title = $(element).find('h2').text().trim();
          const content = $(element).find('p').text().trim();
          const link = $(element).find('a').attr('href');

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