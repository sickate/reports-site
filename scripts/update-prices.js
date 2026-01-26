#!/usr/bin/env node

/**
 * Metal Prices Update Script
 *
 * Fetches current metal prices from web sources and updates the JSON data file.
 * Run with: node scripts/update-prices.js
 *
 * Data sources:
 * - Trading Economics (most metals)
 * - Kitco (gold, silver fallback)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// On server: /var/www/reports/data/metals-prices.json
// On local: /path/to/project/public/data/metals-prices.json
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '../public/data/metals-prices.json');

// Metal configurations with scraping sources
const METAL_SOURCES = {
  gold: {
    url: 'https://www.kitco.com/charts/livegold.html',
    selector: 'bid price',
    parser: 'kitco',
    unit: 'USD/oz'
  },
  silver: {
    url: 'https://www.kitco.com/charts/livesilver.html',
    selector: 'bid price',
    parser: 'kitco',
    unit: 'USD/oz'
  },
  copper: {
    url: 'https://tradingeconomics.com/commodity/copper',
    parser: 'tradingeconomics',
    unit: 'USD/lb'
  },
  aluminum: {
    url: 'https://tradingeconomics.com/commodity/aluminum',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  nickel: {
    url: 'https://tradingeconomics.com/commodity/nickel',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  zinc: {
    url: 'https://tradingeconomics.com/commodity/zinc',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  tin: {
    url: 'https://tradingeconomics.com/commodity/tin',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  tungsten: {
    url: 'https://tradingeconomics.com/commodity/tungsten',
    parser: 'tradingeconomics',
    unit: 'USD/kg'
  },
  molybdenum: {
    url: 'https://tradingeconomics.com/commodity/molybdenum',
    parser: 'tradingeconomics',
    unit: 'USD/lb'
  },
  iron: {
    url: 'https://tradingeconomics.com/commodity/iron-ore',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  cobalt: {
    url: 'https://tradingeconomics.com/commodity/cobalt',
    parser: 'tradingeconomics',
    unit: 'USD/ton'
  },
  lithium: {
    url: 'https://tradingeconomics.com/commodity/lithium',
    parser: 'tradingeconomics',
    unit: 'CNY/ton'
  },
  titanium: {
    url: 'https://tradingeconomics.com/commodity/titanium',
    parser: 'tradingeconomics',
    unit: 'USD/kg'
  }
};

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Fetch URL content with proper headers
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      }
    };

    protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse price from Trading Economics HTML
 * Looking for patterns like: id="p" or class containing price value
 */
function parseTradingEconomics(html) {
  // Try multiple patterns used by Trading Economics
  const patterns = [
    /<span[^>]*id="p"[^>]*>([0-9,]+\.?[0-9]*)<\/span>/i,
    /<div[^>]*class="[^"]*te-commodity-header[^"]*"[^>]*>[\s\S]*?([0-9,]+\.?[0-9]*)/i,
    /data-actual="([0-9,]+\.?[0-9]*)"/i,
    /<td[^>]*id="p"[^>]*>([0-9,]+\.?[0-9]*)<\/td>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price > 0) {
        return price;
      }
    }
  }
  return null;
}

/**
 * Parse price from Kitco HTML
 */
function parseKitco(html) {
  // Kitco uses various formats for bid price
  const patterns = [
    /Bid[\s\S]*?<td[^>]*>[\s$]*([0-9,]+\.?[0-9]*)/i,
    /class="[^"]*bid[^"]*"[^>]*>[\s$]*([0-9,]+\.?[0-9]*)/i,
    /<span[^>]*class="[^"]*price[^"]*"[^>]*>[\s$]*([0-9,]+\.?[0-9]*)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price > 0) {
        return price;
      }
    }
  }
  return null;
}

/**
 * Fetch price for a single metal
 */
async function fetchMetalPrice(metalId, config) {
  try {
    console.log(`  Fetching ${metalId} from ${config.url}...`);
    const html = await fetchUrl(config.url);

    let price = null;
    if (config.parser === 'tradingeconomics') {
      price = parseTradingEconomics(html);
    } else if (config.parser === 'kitco') {
      price = parseKitco(html);
    }

    if (price !== null) {
      console.log(`  ✓ ${metalId}: ${price} ${config.unit}`);
      return { metalId, price, success: true };
    } else {
      console.log(`  ✗ ${metalId}: Could not parse price`);
      return { metalId, price: null, success: false, error: 'Parse failed' };
    }
  } catch (error) {
    console.log(`  ✗ ${metalId}: ${error.message}`);
    return { metalId, price: null, success: false, error: error.message };
  }
}

/**
 * Add delay between requests to be respectful
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main update function
 */
async function updatePrices() {
  console.log('='.repeat(50));
  console.log('Metal Prices Update');
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));

  // Read current data
  let data;
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(content);
  } catch (error) {
    console.error(`Error reading data file: ${error.message}`);
    process.exit(1);
  }

  const currentYear = new Date().getFullYear();
  console.log(`\nUpdating prices for year: ${currentYear}\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Fetch prices sequentially with delays
  for (const [metalId, config] of Object.entries(METAL_SOURCES)) {
    const result = await fetchMetalPrice(metalId, config);
    results.push(result);

    if (result.success) {
      successCount++;

      // Update the price in data
      if (data.metals[metalId]) {
        const metalData = data.metals[metalId].data;
        const yearEntry = metalData.find(d => d.year === currentYear);

        if (yearEntry) {
          yearEntry.price = result.price;
        } else {
          metalData.push({ year: currentYear, price: result.price });
          // Keep sorted by year
          metalData.sort((a, b) => a.year - b.year);
        }
      }
    } else {
      failCount++;
    }

    // Delay between requests (1 second)
    await delay(1000);
  }

  // Update timestamp
  data.lastUpdated = new Date().toISOString();

  // Write updated data
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`\nData file updated: ${DATA_FILE}`);
  } catch (error) {
    console.error(`Error writing data file: ${error.message}`);
    process.exit(1);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Summary');
  console.log('='.repeat(50));
  console.log(`Success: ${successCount}/${Object.keys(METAL_SOURCES).length}`);
  console.log(`Failed:  ${failCount}/${Object.keys(METAL_SOURCES).length}`);
  console.log(`Last Updated: ${data.lastUpdated}`);

  if (failCount > 0) {
    console.log('\nFailed metals:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.metalId}: ${r.error}`);
    });
  }

  console.log('\nDone!');
}

// Run the update
updatePrices().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
