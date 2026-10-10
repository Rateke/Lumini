// Revelações automáticas por atributo. Use no HTML das seções:
//   data-reveal="lines"  → linhas sobem de uma máscara com desfoque (títulos)
//   data-reveal="words"  → palavras, uma a uma
//   data-reveal="chars"  → letras (use só em títulos curtos)
//   data-reveal="up"     → o bloco sobe e acende (parágrafos, cards)
//   data-reveal="fade"   → só acende
//   data-reveal-delay="0.2"  data-reveal-stagger="0.08"  data-reveal-start="top 85%"
//   data-reveal-group    → no contêiner: filhos com data-reveal="up" entram em sequência
// O conteúdo fica visível sem JS; o estado inicial escondido é aplicado aqui.
import { gsap, ScrollTrigger, SplitText, E, reduce } from './motion.js';

const BLUR = 'blur(12px)';

export function splitReveal(el, type = 'lines', opts = {}) {
  const split = SplitText.create(el, {
    type: type === 'chars' ? 'lines,words,chars' : type === 'words' ? 'lines,words' : 'lines',
    mask: 'lines', linesClass: 'split-line', autoSplit: type === 'lines', aria: 'auto',
    onSplit(self) {
      const targets = type === 'chars' ? self.chars : type === 'words' ? self.words : self.lines;
      return gsap.from(targets, {
        yPercent: 110, opacity: 0, filter: BLUR, duration: opts.duration ?? (type === 'chars' ? 1.1 : 1.2),
        stagger: opts.stagger ?? (type === 'chars' ? 0.025 : type === 'words' ? 0.04 : 0.09),
        delay: opts.delay ?? 0, ease: E.lume,
        scrollTrigger: opts.trigger === false ? undefined : { trigger: el, start: opts.start ?? 'top 85%', once: true },
        paused: opts.paused ?? false,
      });
    },
  });
  return split;
}

export function revealBlock(el, opts = {}) {
  const kind = opts.kind ?? 'up';
  return gsap.from(el, {
    y: kind === 'up' ? 40 : 0, opacity: 0, filter: 'blur(10px)', duration: opts.duration ?? 1.1,
    delay: opts.delay ?? 0, ease: E.lume,
    scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%', once: true },
  });
}

export function initReveals(root = document) {
  if (reduce) return;
  root.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.dataset.revealDone) return;
    el.dataset.revealDone = '1';
    const type = el.dataset.reveal;
    const delay = parseFloat(el.dataset.revealDelay || '0');
    const stagger = el.dataset.revealStagger ? parseFloat(el.dataset.revealStagger) : undefined;
    const start = el.dataset.revealStart;
    if (el.closest('[data-reveal-group]') && (type === 'up' || type === 'fade')) return;
    if (type === 'lines' || type === 'words' || type === 'chars') splitReveal(el, type, { delay, stagger, start });
    else revealBlock(el, { kind: type, delay, start });
  });
  root.querySelectorAll('[data-reveal-group]').forEach(g => {
    const items = g.querySelectorAll('[data-reveal="up"],[data-reveal="fade"]');
    if (!items.length) return;
    gsap.from(items, {
      y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.1, ease: E.lume,
      stagger: parseFloat(g.dataset.revealStagger || '0.08'),
      scrollTrigger: { trigger: g, start: g.dataset.revealStart || 'top 85%', once: true },
    });
  });
}
