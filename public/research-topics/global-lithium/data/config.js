// Runtime configuration for the global-lithium research topic.
//
// Version literals live in ../core/version.js — see the comment there for why there are
// three of them and what breaks when they are conflated. They are re-exported here only so
// existing importers keep working; new code should import from core/version.js directly.

export { CODE_VERSION, DATA_CACHE_KEY, UPDATE_MARKER } from '../core/version.js';

export const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';
export const DATA_URL = '/data/global-lithium-database-2026.csv';
export const COMPANY_FINANCIALS_URL = '/data/company-financials.jsonl';
// Layer C — everything that changes weekly (core call, changelog, research cards, key
// metrics). Kept out of the .js modules so the weekly refresh edits data, not source.
export const MARKET_URL = '/data/global-lithium-market.json';
