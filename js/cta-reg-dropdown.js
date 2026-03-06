(() => {
  const roots = Array.from(document.querySelectorAll('[data-cta-reg]'));

  if (!roots.length) {
    return;
  }

  const setExpanded = (root, value) => {
    const toggle = root.querySelector('.cta-reg__toggle');

    if (!toggle) {
      return;
    }

    root.classList.toggle('is-open', value);
    toggle.setAttribute('aria-expanded', String(value));
  };

  const closeAll = (exceptRoot = null) => {
    roots.forEach((root) => {
      if (root !== exceptRoot) {
        setExpanded(root, false);
      }
    });
  };

  roots.forEach((root) => {
    const toggle = root.querySelector('.cta-reg__toggle');
    const links = root.querySelectorAll('.cta-reg__link');

    if (!toggle) {
      return;
    }

    setExpanded(root, false);

    toggle.addEventListener('click', (event) => {
      event.preventDefault();

      const willOpen = !root.classList.contains('is-open');
      closeAll(root);
      setExpanded(root, willOpen);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        setExpanded(root, false);
      });
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideAny = roots.some((root) => root.contains(event.target));

    if (!clickedInsideAny) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAll();
    }
  });

  window.addEventListener('resize', () => {
    closeAll();
  });
})();
