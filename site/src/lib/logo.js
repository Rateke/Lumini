// Geometria do logo Lumini (igual a tools/build-logos.mjs na raiz do repositório).
// Altura-x = 100u, traço 24u, arcos com raio 38u, pontos com raio 15u.
export const S = 24, R = 38, G = 58, DOT = 15;
export const C = { noite: '#08090D', luz: '#F2EFE8', lume: '#FFB547', brasa: '#FF6A2B' };

export const WORD = (() => {
  let x = 12; const segs = [], dots = [];
  const l = () => { segs.push(`M${x} 0V-150`); x += G; };
  const u = () => { segs.push(`M${x} -100V-50A${R} ${R} 0 0 0 ${x + 2 * R} -50`, `M${x + 2 * R} -100V0`); x += 2 * R + G; };
  const m = () => { segs.push(`M${x} 0V-100`, `M${x} -50A${R} ${R} 0 0 1 ${x + 2 * R} -50V0`, `M${x + 2 * R} -50A${R} ${R} 0 0 1 ${x + 4 * R} -50V0`); x += 4 * R + G; };
  const n = () => { segs.push(`M${x} 0V-100`, `M${x} -50A${R} ${R} 0 0 1 ${x + 2 * R} -50V0`); x += 2 * R + G; };
  const i = () => { segs.push(`M${x} 0V-100`); dots.push([x, -132]); x += G; };
  l(); u(); m(); i(); n(); i();
  return { segs, d: segs.join(''), dots, w: x - G + 12 };
})();
export const SYMBOL_D = `M12 0V-50A${R} ${R} 0 0 1 88 -50V0`;

/** Logotipo "lumini". segs=true gera um <path class="seg"> por traço (para animar a ignição). */
export function wordmarkSVG({ fg = 'currentColor', dot = C.lume, segs = false, cls = '', title = 'Lumini' } = {}) {
  const paths = segs
    ? WORD.segs.map(d => `<path class="seg" d="${d}" pathLength="1"/>`).join('')
    : `<path d="${WORD.d}"/>`;
  return `<svg class="${cls}" viewBox="0 -150 ${WORD.w} 150" role="img" aria-label="${title}"><g fill="none" stroke="${fg}" stroke-width="${S}">${paths}</g>${WORD.dots.map(([x, y]) => `<circle class="dt" cx="${x}" cy="${y}" r="${DOT}" fill="${dot}"/>`).join('')}</svg>`;
}
/** Símbolo: a porta iluminada. */
export function symbolSVG({ fg = 'currentColor', dot = C.lume, cls = '' } = {}) {
  return `<svg class="${cls}" viewBox="0 -100 100 100" aria-hidden="true"><path d="${SYMBOL_D}" fill="none" stroke="${fg}" stroke-width="${S}"/><circle cx="50" cy="-50" r="${DOT}" fill="${dot}"/></svg>`;
}
/** Assinatura horizontal: símbolo + logotipo. */
export function lockupSVG({ fg = 'currentColor', dot = C.lume, cls = '' } = {}) {
  const gap = 64, tot = 100 + gap + WORD.w;
  return `<svg class="${cls}" viewBox="0 -150 ${tot} 150" role="img" aria-label="Lumini"><path d="${SYMBOL_D}" fill="none" stroke="${fg}" stroke-width="${S}"/><circle cx="50" cy="-50" r="${DOT}" fill="${dot}"/><g transform="translate(${100 + gap} 0)"><path d="${WORD.d}" fill="none" stroke="${fg}" stroke-width="${S}"/>${WORD.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${DOT}" fill="${dot}"/>`).join('')}</g></svg>`;
}
/** Preenche todos os [data-logo="word|symbol|lockup"] da página. */
export function mountLogos(root = document) {
  root.querySelectorAll('[data-logo]').forEach(el => {
    if (el.dataset.logoDone) return; el.dataset.logoDone = '1';
    const k = el.dataset.logo, o = { cls: el.dataset.logoClass || '' };
    if (k === 'word') el.insertAdjacentHTML('afterbegin', wordmarkSVG({ ...o, segs: el.hasAttribute('data-logo-segs') }));
    else if (k === 'symbol') el.insertAdjacentHTML('afterbegin', symbolSVG(o));
    else if (k === 'lockup') el.insertAdjacentHTML('afterbegin', lockupSVG(o));
  });
}
