import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ acceptDownloads: true });
const page = await ctx.newPage();
await page.route(/profitablecpmratenetwork|vercel-analytics|fonts\.googleapis/, (r) => r.abort());
const t = process.env.TEMP || '.';

const combos = [
  { tool: 'mp4-to-webm', file: 'ff-test.mp4' },
  { tool: 'webm-to-mp4', file: 'ff-test.webm' },
  { tool: 'avi-to-mp4', file: 'ff-test.avi' },
  { tool: 'mov-to-mp4', file: 'ff-test.mov' },
  { tool: 'mkv-to-webm', file: 'ff-test.mkv' },
];

for (const combo of combos) {
  try {
    await page.goto(`http://localhost:3000/tools/${combo.tool}`, { waitUntil: 'domcontentloaded' });
    await page.locator('input[type=file]').setInputFiles(path.join(t, combo.file));
    await page.locator('button:has-text("Convert")').click();
    await page.waitForSelector('button:has-text("Download")', { timeout: 240000 });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('button:has-text("Download")').click()]);
    const out = path.join(t, `ff-${combo.tool}-out`);
    await dl.saveAs(out);
    console.log(`PASS ${combo.tool.padEnd(15)} ${dl.suggestedFilename()} (${fs.statSync(out).size} bytes)`);
  } catch (e) {
    const alert = await page.locator('[role="alert"]').textContent().catch(() => null);
    console.log(`FAIL ${combo.tool.padEnd(15)} ${alert?.trim() || e.message.slice(0, 200)}`);
  }
}
await browser.close();
