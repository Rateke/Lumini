// Renderiza o trailer (brand/trailer.html) quadro a quadro e gera os MP4.
//
// Uso:
//   node tools/render-trailer.mjs                    # 16:9 e 9:16 completos
//   node tools/render-trailer.mjs --fmt 16x9         # só um formato
//   node tools/render-trailer.mjs --frames 2,9,16,30 # só quadros de teste (PNG)
//
// Requisitos: Playwright (Chromium) e ffmpeg no PATH.
// Áudio: rode antes `python3 tools/trailer-audio.py` para gerar a trilha.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'brand/assets/trailer');
mkdirSync(out, { recursive: true });
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const fmts = opt('--fmt') ? [opt('--fmt')] : ['16x9', '9x16'];
const testFrames = opt('--frames');
const SIZE = { '16x9': [1920, 1080], '9x16': [1080, 1920] };
const audio = ['wav', 'm4a'].map(e => resolve(out, `lumini-trailer-audio.${e}`)).find(f => existsSync(f));

const browser = await chromium.launch();
for (const fmt of fmts) {
  const [w, h] = SIZE[fmt];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('erro na página:', e.message));
  await page.goto(`file://${resolve(root, 'brand/trailer.html')}?capture=1&fmt=${fmt}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.ready);
  const { DURATION, FPS } = await page.evaluate(() => ({ DURATION: window.DURATION, FPS: window.FPS }));

  if (testFrames) {
    for (const s of testFrames.split(',').map(Number)) {
      await page.evaluate(t => window.seek(t), s);
      await page.screenshot({ path: resolve(out, `teste-${fmt}-${String(s).replace('.', '_')}s.png`) });
    }
    console.log(`${fmt}: quadros de teste salvos`);
    await page.close();
    continue;
  }

  const total = Math.round(DURATION * FPS);
  const mp4 = resolve(out, `lumini-trailer-${fmt}.mp4`);
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ffArgs.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  ffArgs.push('-c:v', 'libx264', '-preset', 'slow', '-crf', fmt === '16x9' ? '20' : '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4);
  const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${fmt}: quadro ${f}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', c => (c === 0 ? r() : j(new Error('ffmpeg saiu com código ' + c)))));
  // pôster: quadro com logo + slogan
  await page.evaluate(t => window.seek(t), 33.2);
  await page.screenshot({ path: resolve(out, `poster-${fmt}.jpg`), type: 'jpeg', quality: 90 });
  console.log(`${fmt}: ${mp4}`);
  await page.close();
}
await browser.close();
