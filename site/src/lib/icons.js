// Ícones da marca (grade 24, traço 1.5, um ponto de luz em Lume). Use <span data-icon="nome"></span>.
export const ICONS = {
  restaurante: ['<path d="M3 18h18"/><path d="M4.5 18a7.5 7.5 0 0 1 15 0"/><path d="M12 10.5V9"/>', [12, 7]],
  autonomo: ['<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>', null],
  loja: ['<path d="M4.5 10v10h15V10"/><path d="M3 10l2-6h14l2 6z"/><path d="M10 20v-5h4v5"/>', null],
  empresa: ['<path d="M3 21h18"/><path d="M6 21V4h8v17"/><path d="M14 9h4v12"/><path d="M9 8h2M9 12h2M9 16h2"/>', null],
  ecommerce: ['<path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>', [12, 14]],
  seo: ['<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>', [10.5, 10.5]],
  velocidade: ['<path d="M13.5 3L5.5 13.5h6L10.5 21l8-10.5h-6z"/>', null],
  mobile: ['<rect x="6.5" y="3" width="11" height="18" rx="2"/><path d="M11 18h2"/>', null],
  chat: ['<path d="M4 5.5h16v11H10l-4.5 3.5v-3.5H4z"/>', [12, 11]],
  agenda: ['<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>', [12, 15]],
  design: ['<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M13.5 7l3.5 3.5"/>', null],
  codigo: ['<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13"/>', null],
  suporte: ['<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="4.5" y="14" width="3" height="5" rx="1"/><rect x="16.5" y="14" width="3" height="5" rx="1"/><path d="M18 19c0 1.4-1.8 2-4.5 2"/>', null],
  nuvem: ['<path d="M7 19h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 12.1 3.5 3.5 0 0 0 7 19z"/>', null],
  grafico: ['<path d="M4 20h16M7 17v-4M12 17V9M17 17V7"/>', [17, 4]],
  cadeado: ['<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', [12, 15.5]],
  lampada: ['<path d="M9.5 17.5h5M10.5 20.5h3"/><path d="M9 15A6 6 0 1 1 15 15v2.5H9z"/>', [12, 9]],
  globo: ['<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.4 3.4 5.4 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.4-3.4-8.5s1-6.1 3.4-8.5z"/>', null],
  seta: ['<path d="M5 12h14M13 6l6 6-6 6"/>', null],
  mais: ['<path d="M12 5v14M5 12h14"/>', null],
};
export function iconSVG(name, sw = 1.5) {
  const [p, dot] = ICONS[name] || ICONS.lampada;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round" aria-hidden="true">${p}${dot ? `<circle cx="${dot[0]}" cy="${dot[1]}" r="1.5" fill="#FFB547" stroke="none"/>` : ''}</svg>`;
}
export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { if (!el.firstElementChild) el.innerHTML = iconSVG(el.dataset.icon); });
}
