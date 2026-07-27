// Runtime configuration for the global-lithium research topic.
//
// DATA_VERSION does double duty: it cache-busts /data/*.csv|jsonl AND marks which rows
// render the "本次更新" pill (item.updated === DATA_VERSION). Only bump it when the DATA
// changes — bumping it for a code-only release silently clears every pill.
// ASSET_VERSION is the separate code-cache-buster (see index.html's script tag).

export const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';
// Bump DATA_VERSION on every weekly update so browsers/CDN never serve stale
// /data/*.csv / *.jsonl (nginx sends no cache-control on these static files).
// NOTE: this constant does double duty — it cache-busts /data/*.csv|jsonl AND marks which
// rows render the "本次更新" pill (item.updated === DATA_VERSION). Only bump it when the
// *data* changes; bumping it for a code-only release would silently clear every pill.
// Phase 4 splits these two roles apart (core/version.js).
export const DATA_VERSION = '2026-07-24';
export const DATA_URL = '/data/global-lithium-database-2026.csv';
export const COMPANY_FINANCIALS_URL = '/data/company-financials.jsonl';
