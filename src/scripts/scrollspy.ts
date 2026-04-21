const links = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
if (links.length > 0) {
  const byId = new Map<string, HTMLAnchorElement>();
  links.forEach((a) => {
    const id = a.getAttribute('href')?.replace(/^#/, '');
    if (id) byId.set(id, a);
  });

  const setActive = (id: string): void => {
    links.forEach((a) => a.classList.remove('on'));
    byId.get(id)?.classList.add('on');
  };

  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length > 0) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    setActive(sections[0].id);
  }
}
