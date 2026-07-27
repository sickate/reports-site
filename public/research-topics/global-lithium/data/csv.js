// RFC-4180 CSV parsing + row normalisation. Shared by the browser app and the Node build
// check so the two can never drift. Handles the UTF-8 BOM the database file carries.

import { numericFields, normalizeStatusGroup } from './schema.js';

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(cell);
      if (row.some((value) => value !== '')) {
        rows.push(row);
      }
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell !== '' || row.length) {
    row.push(cell);
    if (row.some((value) => value !== '')) {
      rows.push(row);
    }
  }

  return rows;
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function loadCsvData(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ''));
  const [headers, ...values] = rows;

  return values.map((cols) => {
    const item = {};

    headers.forEach((header, index) => {
      const key = header.replace(/^\uFEFF/, '').trim();
      const value = cols[index] ?? '';
      item[key] = numericFields.has(key) ? toNumber(value) : value;
    });

    item.status_group = normalizeStatusGroup(item.status);
    item.map_capacity_kta = Math.max(
      Number(item.current_kta_lce || 0),
      Number(item.planned_kta_lce || 0),
      Number(item.map_capacity_kta || 0)
    );

    return item;
  });
}
