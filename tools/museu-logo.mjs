// Gera os SVGs da marca do Museu das Conchas a partir da geometria.
//
// O símbolo é o corte de um náutilo: uma espiral logarítmica que cresce 3x a
// cada volta (como o náutilo de verdade) com as câmaras de flutuação (septos).
// O texto é convertido em contornos com opentype.js, então os SVGs não dependem
// de fontes instaladas.
//
// Uso (precisa de opentype.js instalado na pasta atual):
//   npm i opentype.js && node tools/museu-logo.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';

const require = createRequire(process.cwd() + '/');
const opentype = require('opentype.js');
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../projetos/museu-das-conchas/assets/logo');
mkdirSync(out, { recursive: true });

// ---------- fontes (instâncias estáticas do Google Fonts) ----------
const FONTS = {
  display: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@144,500,100',
  italic: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@1,144,400,100',
  mono: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500',
};
async function font(key) {
  const f = resolve(tmpdir(), `museu-${key}.ttf`);
  if (!existsSync(f)) {
    const css = await (await fetch(FONTS[key], { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)[1];
    writeFileSync(f, Buffer.from(await (await fetch(url)).arrayBuffer()));
  }
  return opentype.loadSync(f);
}
const F = { display: await font('display'), italic: await font('italic'), mono: await font('mono') };

// ---------- cores ----------
const C = { abismo: '#04121D', crepusculo: '#0A3550', espuma: '#EAF5F2', nacar: '#F4E9DC', areia: '#E8CFA0', bio: '#6FF2DC', fossa: '#02080E' };

// ---------- símbolo: espiral de câmaras ----------
const TAU = Math.PI * 2, b = Math.log(3) / TAU;
const r = th => Math.exp(b * th);
const pt = th => [r(th) * Math.cos(th), -r(th) * Math.sin(th)];
const f2 = n => +n.toFixed(2);
function symbolPaths({ turns = 2.5, chambers = 11, living = .3, curve = .38 } = {}) {
  const th1 = 0, th0 = -turns * TAU;
  const spiral = [];
  for (let th = th0; th <= th1 + 1e-9; th += .04) spiral.push(pt(th));
  const septa = [];
  const step = TAU / chambers;
  for (let th = th1 - living * TAU; th - TAU > th0 + .12 * TAU; th -= step) {
    const a = pt(th - TAU), o = pt(th);
    const rm = (r(th - TAU) + r(th)) / 2, tc = th - curve;
    septa.push([a, [rm * Math.cos(tc), -rm * Math.sin(tc)], o]);
  }
  const lip = [pt(th1), pt(th1 - TAU)];
  return { spiral, septa, lip };
}
// encaixa a geometria numa caixa e devolve strings de path
function fit(geo, box, pad = 0) {
  const all = [...geo.spiral, ...geo.septa.flat(), ...geo.lip];
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = (box - 2 * pad) / Math.max(x1 - x0, y1 - y0);
  const ox = pad + ((box - 2 * pad) - (x1 - x0) * s) / 2, oy = pad + ((box - 2 * pad) - (y1 - y0) * s) / 2;
  const T = p => [f2(ox + (p[0] - x0) * s), f2(oy + (p[1] - y0) * s)];
  const spiral = 'M' + geo.spiral.map(T).map(p => p.join(' ')).join('L');
  const septa = geo.septa.map(([a, c, o]) => `M${T(a).join(' ')}Q${T(c).join(' ')} ${T(o).join(' ')}`).join('');
  const lip = `M${T(geo.lip[0]).join(' ')}L${T(geo.lip[1]).join(' ')}`;
  return { spiral, septa, lip };
}
function symbolSVG({ size = 100, stroke = C.nacar, sw = 3.2, bg = null, radius = 22, pad = 10, chambers = 11, septaOpacity = .85 } = {}) {
  const g = fit(symbolPaths({ chambers }), size, pad);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    (bg ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` : '') +
    `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="${g.spiral}"/><path d="${g.lip}"/><path d="${g.septa}" stroke-width="${f2(sw * .72)}" opacity="${septaOpacity}"/></g></svg>`;
}

// ---------- texto em contornos ----------
function textPath(font, str, x, y, size, tracking = 0) {
  let d = '', cx = x;
  const glyphs = font.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += g.advanceWidth / font.unitsPerEm * size + tracking;
    if (i < glyphs.length - 1) cx += font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm * size;
  });
  return { d, width: cx - x - tracking };
}
function runs(parts, x, y) { // [{font,text,size,tracking}] em sequência
  let d = '', cx = x;
  for (const p of parts) { const t = textPath(p.font, p.text, cx, y, p.size, p.tracking || 0); d += t.d; cx += t.width + (p.gap || 0); }
  return { d, width: cx - x };
}

// ---------- assinatura horizontal ----------
function horizontal({ ink = C.espuma, mark = C.nacar, sub = C.bio, bg = null } = {}) {
  const H = 120, ms = 104;
  const g = fit(symbolPaths(), ms, 6);
  const word = runs([
    { font: F.display, text: 'Museu ', size: 46 },
    { font: F.italic, text: 'das', size: 46, gap: 11 },
    { font: F.display, text: 'Conchas', size: 46 },
  ], ms + 26, 64);
  const line = textPath(F.mono, 'ITAPIRUBÁ · IMBITUBA · SC', ms + 28, 98, 13.5, 3.4);
  const W = Math.ceil(ms + 26 + Math.max(word.width, line.width) + 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    (bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : '') +
    `<g transform="translate(0 ${(H - ms) / 2})" fill="none" stroke="${mark}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="${g.spiral}"/><path d="${g.lip}"/><path d="${g.septa}" stroke-width="2.4" opacity=".85"/></g>` +
    `<path fill="${ink}" d="${word.d}"/><path fill="${sub}" d="${line.d}"/></svg>`;
}

// ---------- assinatura vertical ----------
function vertical({ ink = C.espuma, mark = C.nacar, sub = C.bio, bg = null } = {}) {
  const ms = 150;
  const w1 = runs([{ font: F.display, text: 'Museu ', size: 50 }, { font: F.italic, text: 'das', size: 50 }], 0, 0);
  const w2 = textPath(F.display, 'Conchas', 0, 0, 50);
  const l = textPath(F.mono, 'ITAPIRUBÁ · IMBITUBA · SC', 0, 0, 13, 3.2);
  const W = Math.ceil(Math.max(w1.width, w2.width, l.width, ms) + 40), H = 380;
  const cx = W / 2;
  const a = runs([{ font: F.display, text: 'Museu ', size: 50 }, { font: F.italic, text: 'das', size: 50 }], cx - w1.width / 2, ms + 82);
  const b2 = textPath(F.display, 'Conchas', cx - w2.width / 2, ms + 138, 50);
  const c = textPath(F.mono, 'ITAPIRUBÁ · IMBITUBA · SC', cx - l.width / 2, ms + 186, 13, 3.2);
  const g = fit(symbolPaths(), ms, 6);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    (bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : '') +
    `<g transform="translate(${cx - ms / 2} 12)" fill="none" stroke="${mark}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="${g.spiral}"/><path d="${g.lip}"/><path d="${g.septa}" stroke-width="2.8" opacity=".85"/></g>` +
    `<path fill="${ink}" d="${a.d}${b2.d}"/><path fill="${sub}" d="${c.d}"/></svg>`;
}

// ---------- selo circular ----------
function seal({ ink = C.nacar, ring = C.bio, bg = null } = {}) {
  const S = 400, cx = S / 2, R = 162, size = 21;
  const text = 'MUSEU DAS CONCHAS · ITAPIRUBÁ · MAIS DE 2.000 ESPÉCIES · ';
  const glyphs = F.mono.stringToGlyphs(text);
  const adv = glyphs.map(g => g.advanceWidth / F.mono.unitsPerEm * size);
  const total = adv.reduce((a, b) => a + b, 0);
  const track = (TAU * R - total) / glyphs.length;
  let d = '', s = 0;
  glyphs.forEach((g, i) => {
    const mid = s + adv[i] / 2, ang = mid / R - Math.PI / 2;
    const p = g.getPath(-adv[i] / 2, 0, size);
    p.commands.forEach(c => {
      // eixo x do glifo na tangente, "para cima" apontando para fora do círculo
      for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) if (c[kx] !== undefined) {
        const x = c[kx], y = c[ky], ca = Math.cos(ang), sa = Math.sin(ang);
        c[kx] = cx + R * ca - x * sa - y * ca;
        c[ky] = cx + R * sa + x * ca - y * sa;
      }
    });
    d += p.toPathData(2);
    s += adv[i] + track;
  });
  const g = fit(symbolPaths(), 190, 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">` +
    (bg ? `<circle cx="${cx}" cy="${cx}" r="${cx}" fill="${bg}"/>` : '') +
    `<circle cx="${cx}" cy="${cx}" r="${R + 22}" fill="none" stroke="${ring}" stroke-width="1.5" opacity=".7"/>` +
    `<circle cx="${cx}" cy="${cx}" r="${R - 26}" fill="none" stroke="${ring}" stroke-width="1.5" opacity=".7"/>` +
    `<path fill="${ink}" d="${d}"/>` +
    `<g transform="translate(${cx - 95} ${cx - 95})" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="${g.spiral}"/><path d="${g.lip}"/><path d="${g.septa}" stroke-width="3.6" opacity=".85"/></g></svg>`;
}

const files = {
  'simbolo.svg': symbolSVG(),
  'simbolo-mono.svg': symbolSVG({ stroke: 'currentColor' }),
  'simbolo-escuro.svg': symbolSVG({ stroke: C.crepusculo }),
  'favicon.svg': symbolSVG({ size: 64, sw: 4.2, bg: C.crepusculo, radius: 14, pad: 9, chambers: 7, stroke: C.nacar, septaOpacity: .9 }),
  'icone-app.svg': symbolSVG({ size: 512, sw: 22, bg: C.crepusculo, radius: 112, pad: 92, chambers: 9, stroke: C.nacar }),
  'logo-horizontal.svg': horizontal(),
  'logo-horizontal-areia.svg': horizontal({ ink: C.abismo, mark: C.crepusculo, sub: '#0F6E78' }),
  'logo-vertical.svg': vertical(),
  'logo-vertical-areia.svg': vertical({ ink: C.abismo, mark: C.crepusculo, sub: '#0F6E78' }),
  'selo.svg': seal(),
  'selo-areia.svg': seal({ ink: C.abismo, ring: '#0F6E78' }),
};
for (const [n, s] of Object.entries(files)) writeFileSync(resolve(out, n), s + '\n');
// paths crus para embutir no HTML
writeFileSync(resolve(out, 'simbolo-paths.json'), JSON.stringify(fit(symbolPaths(), 100, 6)) + '\n');
console.log('ok:', Object.keys(files).join(', '));
