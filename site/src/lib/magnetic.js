// Botões magnéticos: [data-magnetic] (força opcional: data-magnetic="0.4")
import { gsap, E, reduce, isTouch } from './motion.js';

export function initMagnetic(root = document) {
  if (reduce || isTouch) return;
  root.querySelectorAll('[data-magnetic]').forEach(el => {
    if (el.dataset.magDone) return; el.dataset.magDone = '1';
    const k = parseFloat(el.dataset.magnetic) || 0.3;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: E.lume });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: E.lume });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * k);
      yTo((e.clientY - r.top - r.height / 2) * k);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: E.faisca });
    });
  });
}
