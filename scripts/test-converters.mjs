/**
 * End-to-end converter smoke test.
 * Usage: node scripts/test-converters.mjs [baseUrl]
 * Requires a running server (npm run dev / npm run start) and a local Chrome/Edge.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3000';
const TEMP = fs.mkdtempSync(path.join(os.tmpdir(), 'fileforge-test-'));
const PUBLIC = path.resolve('public');

function makeFixture(name, content) {
  const file = path.join(TEMP, name);
  fs.writeFileSync(file, content);
  return file;
}

const fixtures = {
  jpg: path.join(PUBLIC, 'test.jpg'),
  png: path.join(PUBLIC, 'test.png'),
  webp: makeFixture('input.webp', fs.readFileSync(path.join(PUBLIC, 'test.jpg'))), // replaced below by PIL note
  pdf: makeFixture('input.pdf', ''),
  txt: makeFixture('input.txt', 'Line one of the test document.\nLine two.\n'),
};

// Minimal single-page PDF (avoids depending on external generators).
const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 49 >>
stream
BT /F1 18 Tf 72 700 Td (Hello FileForge PDF) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
fs.writeFileSync(fixtures.pdf, Buffer.from(pdfContent));

// WebP fixture: use Python/PIL if available, otherwise skip that tool.
try {
  const { execFileSync } = await import('node:child_process');
  execFileSync('python', ['-c', `from PIL import Image; Image.open(r'${fixtures.jpg}').save(r'${fixtures.webp}', 'WEBP')`], { stdio: 'ignore' });
} catch {
  console.log('Note: could not generate WebP fixture with PIL; WebP tests may fail.');
}

const cases = [
  { id: 'image-compress', files: [fixtures.jpg] },
  { id: 'image-resize', files: [fixtures.jpg], fill: { '#resize-width': '320', '#resize-height': '240' } },
  { id: 'jpg-to-webp', files: [fixtures.jpg] },
  { id: 'webp-to-jpg', files: [fixtures.webp] },
  { id: 'png-to-jpg', files: [fixtures.png] },
  { id: 'jpg-to-png', files: [fixtures.jpg] },
  { id: 'png-to-webp', files: [fixtures.png] },
  { id: 'image-to-pdf', files: [fixtures.jpg, fixtures.png] },
  { id: 'jpg-to-pdf', files: [fixtures.jpg] },
  { id: 'png-to-pdf', files: [fixtures.png] },
  { id: 'webp-to-pdf', files: [fixtures.webp] },
  { id: 'pdf-to-jpg', files: [fixtures.pdf] },
  { id: 'pdf-to-png', files: [fixtures.pdf] },
  { id: 'pdf-merge', files: [fixtures.pdf, fixtures.pdf] },
  { id: 'pdf-split', files: [fixtures.pdf], fill: { '#page-input': '1' } },
  { id: 'pdf-compress', files: [fixtures.pdf] },
  { id: 'txt-to-pdf', files: [fixtures.txt] },
];

const executablePath = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const results = [];

for (const test of cases) {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  // Block ads/analytics so tests are deterministic and fast.
  await page.route(/profitablecpmratenetwork|vercel-analytics|google-analytics|fonts\.googleapis/, (route) => route.abort());
  let result = { tool: test.id, ok: false, detail: '' };
  try {
    await page.goto(`${BASE}/tools/${test.id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('input[type=file]').setInputFiles(test.files);
    for (const [selector, value] of Object.entries(test.fill || {})) {
      await page.locator(selector).fill(value);
    }
    await page.locator('button:has-text("Convert")').click();
    await page.waitForSelector('button:has-text("Download")', { timeout: 60000 });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 20000 }),
      page.locator('button:has-text("Download")').click(),
    ]);
    const outputPath = path.join(TEMP, `${test.id}-out`);
    await download.saveAs(outputPath);
    const size = fs.statSync(outputPath).size;
    if (size < 20) throw new Error(`Output too small (${size} bytes)`);
    result.ok = true;
    result.detail = `${download.suggestedFilename()} (${size} bytes)`;
  } catch (error) {
    const alert = await page.locator('[role="alert"]').textContent().catch(() => null);
    result.detail = alert?.trim() || error.message.slice(0, 220);
  }
  results.push(result);
  await context.close();
}

await browser.close();

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.tool.padEnd(22)} ${r.detail}`);
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} tools passed.`);
if (failed.length) process.exitCode = 1;
