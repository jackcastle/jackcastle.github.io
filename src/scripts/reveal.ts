const REVEALED_KEY = 'cv:revealed';
const STAGGER_MS = 700;

const shouldSkip = (): boolean => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try { return sessionStorage.getItem(REVEALED_KEY) === '1'; } catch { return false; }
};

const revealInstant = (els: NodeListOf<HTMLElement>): void => {
  els.forEach((el) => el.classList.add('in'));
};

const revealStaggered = (els: NodeListOf<HTMLElement>): void => {
  els.forEach((el, i) => {
    const delay = i * STAGGER_MS;
    window.setTimeout(() => el.classList.add('in'), delay);
  });
  try { sessionStorage.setItem(REVEALED_KEY, '1'); } catch {}
};

const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (els.length > 0) {
  if (shouldSkip()) revealInstant(els);
  else revealStaggered(els);
}
