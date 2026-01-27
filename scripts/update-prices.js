#!/usr/bin/env node

/**
 * Metal Prices Update Script
 *
 * Fetches current metal prices and updates the JSON data file.
 * Run with: node scripts/update-prices.js
 *
 * Data sources:
 * - gold-api.com (free, no API key): Gold, Silver, Copper, Platinum, Palladium
 * - freegoldapi.com (free, no API key): Gold backup
 *
 * Metals without free API sources require manual update:
 * - Aluminum, Nickel, Zinc, Tin, Tungsten, Molybdenum, Iron, Cobalt, Lithium, Titanium
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On server: /var/www/reports/data/metals-prices.json
// On local: /path/to/project/public/data/metals-prices.json
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '../public/data/metals-prices.json');

// Metal configurations with data source info
// gold-api.com uses USD/oz for gold/silver, USD/lb for copper
// westmetall.com provides LME data (USD/ton)
const METAL_SOURCES = {
  gold: {
    api: 'gold-api',
    symbol: 'XAU',
    unit: 'USD/oz',
    multiplier: 1,
  },
  silver: {
    api: 'gold-api',
    symbol: 'XAG',
    unit: 'USD/oz',
    multiplier: 1,
  },
  copper: {
    api: 'westmetall',
    name: 'Copper',
    unit: 'USD/ton',
  },
  aluminum: {
    api: 'westmetall',
    name: 'Aluminium',
    unit: 'USD/ton',
  },
  nickel: {
    api: 'westmetall',
    name: 'Nickel',
    unit: 'USD/ton',
  },
  zinc: {
    api: 'westmetall',
    name: 'Zinc',
    unit: 'USD/ton',
  },
  tin: {
    api: 'westmetall',
    name: 'Tin',
    unit: 'USD/ton',
  },
  // Metals with manual price lookup (no free API)
  // Prices from web search: Trading Economics, Fastmarkets, SMM, etc.
  // Updated: 2026-01-27
  tungsten: {
    api: 'manual',
    price: 1200,  // USD/mtu - APT FOB China ~$1,080-1,325/mtu
    unit: 'USD/mtu',
    source: 'Fastmarkets APT',
  },
  molybdenum: {
    api: 'manual',
    price: 23.5,  // USD/lb - LME/SMM ~$23.47-23.55/lb
    unit: 'USD/lb',
    source: 'LME/SMM',
  },
  iron: {
    api: 'manual',
    price: 106,   // USD/ton - CFR China 62% Fe ~$106.36/ton
    unit: 'USD/ton',
    source: 'Trading Economics CFR China',
  },
  cobalt: {
    api: 'manual',
    price: 25.5,  // USD/lb - LME ~$56,290/ton = $25.53/lb
    unit: 'USD/lb',
    source: 'LME/Trading Economics',
  },
  lithium: {
    api: 'manual',
    price: 22000, // USD/ton - Battery-grade carbonate ~CNY 156,000/ton ≈ $22,000
    unit: 'USD/ton',
    source: 'SMM China',
  },
  titanium: {
    api: 'manual',
    price: 10000, // USD/ton - Titanium sponge ~$9,000-11,000/ton
    unit: 'USD/ton',
    source: 'SMM/Argus',
  },
};

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

/**
 * Fetch JSON from URL
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch price from gold-api.com
 */
async function fetchFromGoldAPI(symbol) {
  const url = `https://api.gold-api.com/price/${symbol}`;
  const data = await fetchJSON(url);

  if (data.price && data.price > 0) {
    return data.price;
  }
  throw new Error('Invalid price from gold-api.com');
}

// Cache for westmetall data (fetched once per run)
let westmetallCache = null;

/**
 * Fetch HTML content
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html',
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
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
 * Fetch LME prices from westmetall.com
 */
async function fetchWestmetallPrices() {
  if (westmetallCache) return westmetallCache;

  const url = 'https://www.westmetall.com/en/markdaten.php';
  const html = await fetchHTML(url);

  // Parse prices from HTML
  // Pattern: "Copper </a> </td> <td> <a...> 13,195.00 </a>"
  const prices = {};

  const metals = ['Copper', 'Tin', 'Zinc', 'Aluminium', 'Nickel', 'Lead'];

  for (const metal of metals) {
    // Match pattern: metal name followed by </a></td><td><a...>price
    // The price has format like 13,195.00 or 55,005.00
    const regex = new RegExp(
      metal + '\\s*</a>\\s*</td>\\s*<td>\\s*<a[^>]*>\\s*([\\d,]+\\.\\d{2})\\s*</a>',
      'i'
    );
    const match = html.match(regex);
    if (match) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (price > 0) {
        prices[metal] = price;
      }
    }
  }

  westmetallCache = prices;
  return prices;
}

/**
 * Fetch price from westmetall.com
 */
async function fetchFromWestmetall(metalName) {
  const prices = await fetchWestmetallPrices();
  const price = prices[metalName];

  if (price && price > 0) {
    return price;
  }
  throw new Error(`Price not found for ${metalName}`);
}

/**
 * Fetch price for a single metal
 */
async function fetchMetalPrice(metalId, config) {
  if (!config.api) {
    return { metalId, price: null, success: false, error: config.note || 'No API configured' };
  }

  try {
    let price;
    if (config.api === 'manual') {
      // Use hardcoded price from config
      console.log(`  Using manual price for ${metalId} (${config.source})...`);
      price = config.price;
    } else if (config.api === 'gold-api') {
      console.log(`  Fetching ${metalId} (${config.symbol}) from gold-api...`);
      price = await fetchFromGoldAPI(config.symbol);
    } else if (config.api === 'westmetall') {
      console.log(`  Fetching ${metalId} (${config.name}) from westmetall...`);
      price = await fetchFromWestmetall(config.name);
    } else {
      throw new Error(`Unknown API: ${config.api}`);
    }

    // Apply multiplier for unit conversion
    const multiplier = config.multiplier || 1;
    const finalPrice = Math.round(price * multiplier * 100) / 100;
    console.log(`  ✓ ${metalId}: ${finalPrice} ${config.targetUnit || config.unit}`);

    return { metalId, price: finalPrice, success: true };
  } catch (error) {
    console.log(`  ✗ ${metalId}: ${error.message}`);
    return { metalId, price: null, success: false, error: error.message };
  }
}

/**
 * Add delay between requests
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

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  const updates = [];

  // Fetch prices
  for (const [metalId, config] of Object.entries(METAL_SOURCES)) {
    if (!config.api) {
      console.log(`  ⊘ ${metalId}: Skipped (${config.note})`);
      skipCount++;
      continue;
    }

    const result = await fetchMetalPrice(metalId, config);

    if (result.success && data.metals[metalId]) {
      const metalData = data.metals[metalId].data;
      const yearEntry = metalData.find(d => d.year === currentYear);
      const oldPrice = yearEntry ? yearEntry.price : null;

      if (yearEntry) {
        yearEntry.price = result.price;
      } else {
        metalData.push({ year: currentYear, price: result.price });
        metalData.sort((a, b) => a.year - b.year);
      }

      updates.push({
        metal: metalId,
        oldPrice,
        newPrice: result.price,
        unit: data.metals[metalId].unit,
      });
      successCount++;
    } else {
      failCount++;
    }

    // Delay between requests (300ms)
    await delay(300);
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
  console.log(`Success: ${successCount}`);
  console.log(`Failed:  ${failCount}`);
  console.log(`Skipped: ${skipCount} (no free API available)`);
  console.log(`Last Updated: ${data.lastUpdated}`);

  if (updates.length > 0) {
    console.log('\n📊 Price Updates:');
    updates.forEach(u => {
      console.log(`  ${u.metal}: ${u.oldPrice} → ${u.newPrice} ${u.unit}`);
    });
  }

  console.log('\n✅ Done!');
  console.log('\n💡 Note: 6 metals use manual prices (no free API available):');
  console.log('   Tungsten, Molybdenum, Iron, Cobalt, Lithium, Titanium');
  console.log('   To update them, edit METAL_SOURCES in scripts/update-prices.js');
}

// Run the update
updatePrices().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
