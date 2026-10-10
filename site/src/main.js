// Lumini — inicialização do site.
// Ordem: estilos → logos/ícones → rolagem suave → palco de vídeo → moldura (preloader, menu, cursor)
// → seções → revelações (depois da intro) → recálculo do ScrollTrigger.
import './styles/base.css';
import './styles/chrome.css';
import './styles/stage.css';
import './sections/hero.css';
import './sections/manifesto.css';
import './sections/servicos.css';
import './sections/projetos.css';
import './sections/processo.css';
import './sections/planos.css';
import './sections/sobre.css';
import './sections/faq.css';
import './sections/contato.css';
import './sections/footer.css';

import { gsap, ScrollTrigger, E, reduce, isTouch, createLenis } from './lib/motion.js';
import { initReveals } from './lib/reveal.js';
import { initMagnetic } from './lib/magnetic.js';
import { mountLogos } from './lib/logo.js';
import { mountIcons } from './lib/icons.js';
import { CONFIG } from './lib/config.js';
import initStage from './stage.js';
import initChrome from './chrome.js';
import hero from './sections/hero.js';
import manifesto from './sections/manifesto.js';
import servicos from './sections/servicos.js';
import projetos from './sections/projetos.js';
import processo from './sections/processo.js';
import planos from './sections/planos.js';
import sobre from './sections/sobre.js';
import faq from './sections/faq.js';
import contato from './sections/contato.js';
import footer from './sections/footer.js';

const params = new URLSearchParams(location.search);
const ctx = {
  gsap, ScrollTrigger, E, reduce, isTouch, config: CONFIG,
  lenis: null, stage: null,
  bus: new EventTarget(),                // eventos: 'intro:done', 'menu:open', 'menu:close'
  skipIntro: params.has('nointro') || reduce,
  ready: null,                           // Promise resolvida quando o preloader termina
};
window.__lumini = ctx;

mountLogos();
mountIcons();
ctx.lenis = createLenis();
if (ctx.lenis) ctx.lenis.stop();

ctx.stage = initStage(ctx);
const chrome = initChrome(ctx);
ctx.ready = chrome?.intro ?? Promise.resolve();

for (const [name, init] of Object.entries({ hero, manifesto, servicos, projetos, processo, planos, sobre, faq, contato, footer })) {
  try { init(ctx); } catch (err) { console.error(`[lumini] seção ${name}:`, err); }
}
initMagnetic();

document.fonts.ready.then(async () => {
  await ctx.ready;
  document.body.classList.remove('is-loading');
  ctx.lenis?.start();
  initReveals();
  ScrollTrigger.refresh();
  ctx.bus.dispatchEvent(new Event('intro:done'));
});
addEventListener('load', () => ScrollTrigger.refresh());
