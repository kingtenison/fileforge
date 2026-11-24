import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });

async function test(toolId, file, label = toolId) {
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  await page.route(/profitablecpmratenetwork|vercel-analytics|fonts\.googleapis/, (r) => r.abort());
  try {
    await page.goto(`${BASE}/tools/${toolId}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.locator('input[type=file]').setInputFiles(file);
    await page.locator('button:has-text("Convert")').click();
    await page.waitForSelector('button:has-text("Download")', { timeout: 120000 });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('button:has-text("Download")').click()]);
    const out = path.join(process.env.TEMP || '.', `ff-${toolId}-out`);
    await dl.saveAs(out);
    console.log(`PASS ${label.padEnd(22)} ${dl.suggestedFilename()} (${fs.statSync(out).size} bytes)`);
  } catch (e) {
    const alert = await page.locator('[role="alert"]').textContent().catch(() => null);
    console.log(`FAIL ${label.padEnd(22)} ${alert?.trim() || e.message.slice(0, 200)}`);
  }
  await ctx.close();
}

const t = process.env.TEMP || '.';
await test('background-eraser', path.resolve('public/test.jpg'), 'background-eraser (AI)');
await test('word-to-pdf', path.join(t, 'ff-test.docx'), 'word-to-pdf (API)');
await test('pdf-to-word', path.join(t, 'ff-test.pdf'), 'pdf-to-word (API)');
await test('m4a-to-mp3', path.join(t, 'ff-test.m4a'), 'm4a-to-mp3 (API)');
await test('mp4-to-mp3', path.join(t, 'ff-test.mp4'), 'mp4-to-mp3 (API)');
await browser.close();
