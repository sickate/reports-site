import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { writeDaily } from '../lib/daily-store.mjs';

function storeFixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'instap-metals-store-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'metals-daily.json');
  fs.writeFileSync(file, '{"lastUpdated":"previous","metals":{}}');
  return { directory, file };
}

test('publishing retains complete quote metadata and leaves no temporary file', (t) => {
  const { directory, file } = storeFixture(t);
  const metals = { copper: { data: [{ date: '2026-09-01', price: 14395.5, sourceUrl: 'https://www.westmetall.com/' }] } };
  writeDaily(file, { metals });
  const published = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.deepEqual(published.metals, metals);
  assert.ok(Number.isFinite(Date.parse(published.lastUpdated)));
  assert.deepEqual(fs.readdirSync(directory), ['metals-daily.json']);
});

test('failed publication preserves the previous readable store and cleans up', (t) => {
  const { directory, file } = storeFixture(t);
  const previous = fs.readFileSync(file, 'utf8');
  t.mock.method(fs, 'renameSync', () => { throw new Error('simulated publication failure'); });
  assert.throws(() => writeDaily(file, { metals: { copper: { data: [] } } }), /publication failure/);
  assert.equal(fs.readFileSync(file, 'utf8'), previous);
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(fs.readdirSync(directory), ['metals-daily.json']);
});
