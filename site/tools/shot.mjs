// Captura de tela para conferir o site enquanto desenvolve (sobe um servidor Vite próprio).
// Uso:
//   node tools/shot.mjs --port 5181 --target "#hero" --out /tmp/hero        # desktop 1440x900 e celular 390x844
//   node tools/shot.mjs --port 5181 --target "#servicos" --scroll 1200 --out /tmp/serv
//   node tools/shot.mjs --port 5181 --full --out /tmp/pagina                # páginas inteiras em pedaços
// Opções: --wait 2500 (ms após rolar)  --only desktop|mobile  --intro (mostra o preloader)
// Imprime erros de console/página. Gera <out>-desktop.png e <out>-mobile.png (ou <out>-NN.png com --full).
import { createServer } from 'vite';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const has = k => a.includes(k);
const port = +opt('--port', 5180), out = opt('--out', '/tmp/lumini'), target = opt('--target', null);
const extra = +opt('--scroll', 0), wait = +opt('--wait', 2500), only = opt('--only', null);

const server = await createServer({ root, configFile: resolve(root, 'vite.config.js'), server: { port, strictPort: true, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const url = `http://127.0.0.1:${port}/${has('--intro') ? '' : '?nointro'}`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const views = [['desktop', 1440, 900], ['mobile', 390, 844]].filter(v => !only || v[0] === only);
const errors = [];
for (const [name, w, h] of views) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: name === 'mobile', isMobile: name === 'mobile' });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${name}] ${m.type()}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`[${name}] PAGEERROR: ${e.message}`));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  if (has('--full')) {
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    let n = 0;
    for (let y = 0; y < H; y += h) {
      await page.evaluate(y => (window.__lumini?.lenis ? window.__lumini.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)), y);
      await page.waitForTimeout(wait);
      await page.screenshot({ path: `${out}-${name}-${String(n++).padStart(2, '0')}.png` });
    }
    console.log(`${name}: ${n} capturas (altura ${H}px)`);
  } else {
    if (target) {
      await page.evaluate(([sel, extra]) => {
        const el = document.querySelector(sel); if (!el) return;
        const y = el.getBoundingClientRect().top + scrollY + extra;
        window.__lumini?.lenis ? window.__lumini.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
      }, [target, extra]);
    }
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}-${name}.png` });
  }
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  if (sw[0] > sw[1]) errors.push(`[${name}] rolagem horizontal: scrollWidth ${sw[0]} > ${sw[1]}`);
  await page.close();
}
await browser.close();
await server.close();
console.log(errors.length ? errors.join('\n') : 'sem erros no console');
