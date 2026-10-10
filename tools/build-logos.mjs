// Gera os arquivos SVG do logo Lumini a partir da construção geométrica.
// Unidade base: altura-x = 100u, traço = 24u, raio dos arcos = 38u (eixo do traço).
// Uso: node tools/build-logos.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const S = 24, R = 38, G = 58, DOT = 15;
const C = { noite: '#08090D', luz: '#F2EFE8', lume: '#FFB547', brasa: '#FF6A2B' };

function wordmark() {
  let x = 12, d = '';
  const dots = [];
  const l = () => { d += `M${x} 0V-150`; x += G; };
  const u = () => { d += `M${x} -100V-50A${R} ${R} 0 0 0 ${x + 2 * R} -50M${x + 2 * R} -100V0`; x += 2 * R + G; };
  const m = () => { d += `M${x} 0V-100M${x} -50A${R} ${R} 0 0 1 ${x + 2 * R} -50V0M${x + 2 * R} -50A${R} ${R} 0 0 1 ${x + 4 * R} -50V0`; x += 4 * R + G; };
  const n = () => { d += `M${x} 0V-100M${x} -50A${R} ${R} 0 0 1 ${x + 2 * R} -50V0`; x += 2 * R + G; };
  const i = () => { d += `M${x} 0V-100`; dots.push([x, -132]); x += G; };
  l(); u(); m(); i(); n(); i();
  return { d, dots, w: x - G + 12 };
}
const W = wordmark();
const SYM = { d: `M12 0V-50A${R} ${R} 0 0 1 88 -50V0`, orb: [50, -50] };

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const glowDef = (id) =>
  `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${C.lume}" stop-opacity=".55"/><stop offset=".45" stop-color="${C.brasa}" stop-opacity=".18"/><stop offset="1" stop-color="${C.brasa}" stop-opacity="0"/></radialGradient></defs>`;

function wordmarkSVG({ fg, dot, glow, bg }) {
  const pad = 40;
  const vb = `${-pad} ${-160 - pad} ${W.w + pad * 2} ${165 + pad * 2}`;
  let body = '';
  if (bg) body += `<rect x="${-pad}" y="${-160 - pad}" width="${W.w + pad * 2}" height="${165 + pad * 2}" fill="${bg}"/>`;
  if (glow) body += glowDef('g') + W.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="56" fill="url(#g)"/>`).join('');
  body += `<path d="${W.d}" fill="none" stroke="${fg}" stroke-width="${S}"/>`;
  body += W.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${DOT}" fill="${dot}"/>`).join('');
  return svg(vb, body, 'Lumini');
}
function symbolSVG({ fg, dot, glow, bg, radius }) {
  const vb = `-14 -126 128 128`;
  let body = '';
  if (bg) body += `<rect x="-14" y="-126" width="128" height="128" rx="${radius ?? 0}" fill="${bg}"/>`;
  if (glow) body += glowDef('g') + `<circle cx="50" cy="-50" r="48" fill="url(#g)"/>`;
  body += `<path d="${SYM.d}" fill="none" stroke="${fg}" stroke-width="${S}"/>`;
  body += `<circle cx="50" cy="-50" r="${DOT}" fill="${dot}"/>`;
  return svg(vb, body, 'Lumini — símbolo');
}
function lockupSVG({ fg, dot, glow }) {
  // símbolo + logotipo lado a lado; símbolo com a mesma altura-x do logotipo
  const gap = 64, sw = 100;
  const pad = 40, total = sw + gap + W.w;
  const vb = `${-pad} ${-160 - pad} ${total + pad * 2} ${165 + pad * 2}`;
  let body = glow ? glowDef('g') : '';
  if (glow) body += `<circle cx="50" cy="-50" r="48" fill="url(#g)"/>` + W.dots.map(([x, y]) => `<circle cx="${x + sw + gap}" cy="${y}" r="56" fill="url(#g)"/>`).join('');
  body += `<path d="${SYM.d}" fill="none" stroke="${fg}" stroke-width="${S}"/><circle cx="50" cy="-50" r="${DOT}" fill="${dot}"/>`;
  body += `<g transform="translate(${sw + gap} 0)"><path d="${W.d}" fill="none" stroke="${fg}" stroke-width="${S}"/>${W.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${DOT}" fill="${dot}"/>`).join('')}</g>`;
  return svg(vb, body, 'Lumini');
}
function stackedSVG({ fg, dot, glow }) {
  // símbolo grande acima, logotipo abaixo
  const k = 2.2, pad = 40;
  const symW = 100 * k, top = -160 - 64 - 100 * k;
  const vb = `${-pad} ${top - pad} ${W.w + pad * 2} ${-top + 5 + pad * 2}`;
  const sx = (W.w - symW) / 2, sy = -160 - 64;
  let body = glow ? glowDef('g') : '';
  if (glow) body += `<circle cx="${sx + 50 * k}" cy="${sy - 50 * k}" r="${48 * k}" fill="url(#g)"/>`;
  body += `<g transform="translate(${sx} ${sy}) scale(${k})"><path d="${SYM.d}" fill="none" stroke="${fg}" stroke-width="${S}"/><circle cx="50" cy="-50" r="${DOT}" fill="${dot}"/></g>`;
  body += `<path d="${W.d}" fill="none" stroke="${fg}" stroke-width="${S}"/>${W.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${DOT}" fill="${dot}"/>`).join('')}`;
  return svg(vb, body, 'Lumini');
}

const out = 'brand/assets/logo';
mkdirSync(out, { recursive: true });
const files = {
  'lumini-logotipo.svg': wordmarkSVG({ fg: C.luz, dot: C.lume, glow: true }),
  'lumini-logotipo-sem-brilho.svg': wordmarkSVG({ fg: C.luz, dot: C.lume, glow: false }),
  'lumini-logotipo-dia.svg': wordmarkSVG({ fg: C.noite, dot: C.brasa, glow: false }),
  'lumini-logotipo-mono-claro.svg': wordmarkSVG({ fg: C.luz, dot: C.luz, glow: false }),
  'lumini-logotipo-mono-escuro.svg': wordmarkSVG({ fg: C.noite, dot: C.noite, glow: false }),
  'lumini-assinatura-horizontal.svg': lockupSVG({ fg: C.luz, dot: C.lume, glow: true }),
  'lumini-assinatura-horizontal-dia.svg': lockupSVG({ fg: C.noite, dot: C.brasa, glow: false }),
  'lumini-assinatura-vertical.svg': stackedSVG({ fg: C.luz, dot: C.lume, glow: true }),
  'lumini-simbolo.svg': symbolSVG({ fg: C.luz, dot: C.lume, glow: true }),
  'lumini-simbolo-dia.svg': symbolSVG({ fg: C.noite, dot: C.brasa, glow: false }),
  'lumini-simbolo-mono.svg': symbolSVG({ fg: C.luz, dot: C.luz, glow: false }),
  'lumini-app-icon.svg': symbolSVG({ fg: C.luz, dot: C.lume, glow: true, bg: C.noite, radius: 28 }),
  'favicon.svg': symbolSVG({ fg: C.luz, dot: C.lume, glow: false, bg: C.noite, radius: 24 }),
};
for (const [name, content] of Object.entries(files)) writeFileSync(`${out}/${name}`, content);
// geometria exportada para o brand book e o trailer
writeFileSync('brand/assets/logo/geometria.json', JSON.stringify({ unidade: 'altura-x = 100u', traco: S, raioArco: R, avanco: G, raioPonto: DOT, logotipo: W, simbolo: SYM }, null, 2) + '\n');
console.log(Object.keys(files).length, 'arquivos;', 'largura logotipo', W.w);
