(() => {
  const root = document.querySelector('[data-hero-reg]');

  if (!root) {
    return;
  }

  const toggle = root.querySelector('.hero-reg__toggle');
  const menu = root.querySelector('.hero-reg__menu');
  const backdrop = root.querySelector('.hero-reg__backdrop');
  const desktopHref = toggle?.dataset.defaultHref || 'registration_general.html';
  const mobileMq = window.matchMedia('(max-width: 767px)');

  if (!toggle || !menu || !backdrop) {
    return;
  }

  const isMobile = () => mobileMq.matches;

  const setExpanded = (value) => {
    toggle.setAttribute('aria-expanded', String(value));
    root.classList.toggle('is-open', value);
  };

  const closeMenu = () => setExpanded(false);
  const openMenu = () => setExpanded(true);
  const toggleMenu = () => setExpanded(!root.classList.contains('is-open'));

  toggle.addEventListener('click', (event) => {
    if (!isMobile()) {
      window.location.href = desktopHref;
      return;
    }

    event.preventDefault();
    toggleMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('click', (event) => {
    if (!root.classList.contains('is-open')) {
      return;
    }

    if (!root.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  mobileMq.addEventListener('change', () => {
    if (!isMobile()) {
      closeMenu();
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  closeMenu();
})();
