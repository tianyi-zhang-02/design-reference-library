import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const catalog = JSON.parse(await readFile(new URL('./catalog.json', import.meta.url), 'utf8'));
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function index(rows, label) {
  assert.ok(Array.isArray(rows) && rows.length > 0, `${label} must be a nonempty array`);
  const ids = new Set();
  for (const { id } of rows) {
    assert.match(id, slug, `Invalid ${label} ID`);
    assert.ok(!ids.has(id), `Duplicate ${label} ID ${id}`);
    ids.add(id);
  }
  return ids;
}

function checkText(row, fields) {
  for (const field of fields) {
    assert.ok(typeof row[field] === 'string' && row[field].trim(), `${row.id ?? 'style source'}.${field} must be nonempty text`);
  }
}

function checkSource(row) {
  checkText(row, ['title', 'publisher', 'url']);
  const url = new URL(row.url);
  assert.equal(url.protocol, 'https:', `${row.title} must link to an HTTPS source`);
  assert.ok(!url.username && !url.password, `${row.title} source must not contain credentials`);
  return url.href;
}

assert.equal(catalog.version, 1);
checkSource(catalog.styleSource);
const groups = index(catalog.groups, 'group');
const kinds = index(catalog.kinds, 'kind');
const styles = index(catalog.styles, 'style');
index(catalog.references, 'reference');

for (const item of [...catalog.groups, ...catalog.kinds]) checkText(item, ['name']);
for (const item of catalog.styles) {
  checkText(item, ['name', 'cues', 'use']);
  assert.equal(typeof item.nameZh, 'string', `${item.id}.nameZh must be text`);
  assert.ok(groups.has(item.group), `Unknown group for ${item.id}`);
}

const urls = new Set();
for (const item of catalog.references) {
  const url = checkSource(item);
  assert.ok(!urls.has(url), `Duplicate source ${url}`);
  urls.add(url);
  checkText(item, ['observe', 'adapt', 'tradeoff']);
  assert.ok(kinds.has(item.kind), `Unknown kind for ${item.id}`);
  assert.ok(Array.isArray(item.styles), `${item.id}.styles must be an array`);
  assert.equal(new Set(item.styles).size, item.styles.length, `Duplicate styles for ${item.id}`);
  for (const id of item.styles) assert.ok(styles.has(id), `Unknown style ${id} for ${item.id}`);
}

console.log(`Valid catalog: ${styles.size} styles and ${catalog.references.length} references.`);
