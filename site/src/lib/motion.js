// Movimento da marca: GSAP + plugins, curvas nomeadas e Lenis (rolagem suave).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Curvas do manual (brand/tokens): lume (entradas), eclipse (transições), faisca (micro), brisa (loops)
export const E = {
  lume: CustomEase.create('lume', '0.16,1,0.3,1'),
  eclipse: CustomEase.create('eclipse', '0.76,0,0.24,1'),
  faisca: CustomEase.create('faisca', '0.34,1.56,0.64,1'),
  brisa: CustomEase.create('brisa', '0.45,0,0.55,1'),
};
gsap.defaults({ ease: E.lume, duration: 0.9 });

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

export function createLenis() {
  if (reduce) return null;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export { gsap, ScrollTrigger, SplitText };
