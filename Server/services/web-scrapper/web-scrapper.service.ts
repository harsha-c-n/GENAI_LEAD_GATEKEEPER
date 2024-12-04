import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"; 

class WebScraperService {
  private sources: string[] = [
    'https://en.wikipedia.org/wiki/Maersk',  
  ];

  // Method to update sources
  updateSources(newSources: string[]) {
    this.sources = newSources;
  }

  splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
  })

  async scrapeWebsites() {
    for await (const url of this.sources) {
     const content = await this.scrapePage(url)
     const chunks= await this.splitter.splitText(content)
     return chunks;
    }
  }
  async scrapePage(url:string){
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      evaluate: async (page, browser) => {
        const result = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return result;
      },
    });
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
  }
}

export default WebScraperService;