// Renderiza as cenas de fundo (tools/scenes/*.html) em vídeos com loop perfeito.
// Uso:
//   node tools/render-scenes.mjs                 # todas as cenas
//   node tools/render-scenes.mjs orbe cidade     # só algumas
//   node tools/render-scenes.mjs orbe --test     # 4 quadros PNG de teste em tools/scenes/out/
// Saída: public/videos/<nome>.webm (VP9), <nome>.mp4 (H.264) e <nome>.jpg (pôster).
// Opções: --w 1280 --h 720 --fps 30
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname } from 'node:path';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const W = +opt('--w', 1280), H = +opt('--h', 720), FPS = +opt('--fps', 30);
const TEST = argv.includes('--test');
const names = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
const all = readdirSync(resolve(here, 'scenes')).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
const todo = names.length ? names : all;
const outDir = resolve(root, 'public/videos');
mkdirSync(outDir, { recursive: true });
mkdirSync(resolve(here, 'scenes/out'), { recursive: true });

const run = (args, opts = {}) => new Promise((ok, fail) => {
  const p = spawn('ffmpeg', args, { stdio: opts.stdin ? ['pipe', 'inherit', 'inherit'] : 'inherit' });
  if (opts.stdin) opts.stdin(p);
  p.on('close', c => (c === 0 ? ok() : fail(new Error('ffmpeg ' + c))));
});

// servidor estático local (módulos ES não carregam via file://)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => {
  const f = resolve(here, 'scenes', decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(resolve(here, 'scenes')) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const name of todo) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error(`[${name}] erro:`, e.message));
  page.on('console', m => { if (m.type() === 'error') console.error(`[${name}]`, m.text()); });
  await page.goto(`${BASE}/${name}.html?capture=1`);
  await page.waitForFunction(() => window.ready && window.seek);
  const LOOP = await page.evaluate(() => window.LOOP);
  if (TEST) {
    for (const f of [0, 0.25, 0.5, 0.75]) {
      await page.evaluate(t => window.seek(t), f * LOOP);
      await page.screenshot({ path: resolve(here, `scenes/out/${name}-${f * 100}.png`) });
    }
    console.log(`[${name}] quadros de teste em tools/scenes/out/`);
    await page.close(); continue;
  }
  const total = Math.round(LOOP * FPS), master = resolve(tmpdir(), `cena-${name}.mp4`), t0 = Date.now();
  await run(['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '12', '-pix_fmt', 'yuv420p', master], {
    stdin: async p => {
      for (let f = 0; f < total; f++) {
        await page.evaluate(t => window.seek(t), f / FPS);
        const buf = await page.screenshot({ type: 'png' });
        if (!p.stdin.write(buf)) await new Promise(r => p.stdin.once('drain', r));
        if (f % 60 === 0) console.log(`[${name}] ${f}/${total} (${((Date.now() - t0) / 1000) | 0}s)`);
      }
      p.stdin.end();
    },
  });
  await run(['-y', '-loglevel', 'error', '-i', master, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-an', resolve(outDir, `${name}.webm`)]);
  await run(['-y', '-loglevel', 'error', '-i', master, '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', resolve(outDir, `${name}.mp4`)]);
  await run(['-y', '-loglevel', 'error', '-ss', String(LOOP / 2), '-i', master, '-frames:v', '1', '-q:v', '4', resolve(outDir, `${name}.jpg`)]);
  rmSync(master, { force: true });
  console.log(`[${name}] pronto: public/videos/${name}.{webm,mp4,jpg} (${((Date.now() - t0) / 1000) | 0}s)`);
  await page.close();
}
await browser.close();
server.close();
