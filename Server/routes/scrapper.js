import puppeteer from "puppeteer";
const searchNames = ['CMA CGM', 'Kajal', 'RHL HAMBURGER LLOYD TANKER GMBH & COMPANY KG']; // List of names to search for
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results = []; // To store all results across searches
    for (const name of searchNames) {
        console.log(`Searching for: ${name}`);
        await page.goto('https://yourmaritime.com/');
        await page.waitForSelector('#keyword');
        // Clear existing input and type the new name
        await page.evaluate(() => document.querySelector('#keyword').value = '');
        await page.type('#keyword', name);
        await Promise.all([
            page.waitForNavigation(),
            page.click('.btn-block')
        ]);
        // Check if there are results
        const hasResults = await page.evaluate(() => {
            const noResultsMessage = document.querySelector('.listing-results-container .col-12 p')?.innerText || '';
            const hasCards = !!document.querySelectorAll('.card-body h4 a.text-dark').length; // Check if result cards exist
            return !noResultsMessage.includes('No results found') && hasCards;
        });
        if (!hasResults) {
            console.log(`No results found for: ${name}`);
            continue; // Skip to the next search term
        }
        // Extract up to 5 links from the search results
        const links = await page.$$eval('.card-body h4 a.text-dark', (elements) =>
            elements.slice(0, 5).map(el => el.href) // Take only the first 5 links
        );
        console.log(`Processing ${links.length} results for ${name}`);
        // Loop through each link (up to 5) and scrape data
        for (const link of links) {
            await page.goto(link);
            await page.waitForSelector('.ml-2.text-secondary'); // Ensure the address section is loaded
            // Scrape data from the detail page
            const data = await page.evaluate(() => {
                const name = document.querySelector('h1.display-3 span')?.innerText || '';
                const address = document.querySelector('[itemprop="streetAddress"]')?.innerText || '';
                const email = document.querySelector('[itemprop="email"]')?.innerText || '';
                const addressCountry = document.querySelector('[itemprop="addressCountry"]')?.innerText || '';
                return { name, address, email, addressCountry };
            });
            results.push({ ...data, searchTerm: name });
            // Push only non-duplicate data
            if (!results.some(item => item.name === data.name && item.address === data.address)) {
                results.push(data);
            }
        }
    }
    console.log("Scraping completed. Results:");
    console.log(results);
    await browser.close();
})();