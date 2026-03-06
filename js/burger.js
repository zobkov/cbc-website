// FAQ categories – filters accordion items by data-faq-cat (no empty-state)
(() => {
    const tabs = document.querySelector('[data-faq-tabs]');
    if (!tabs) return;

    const section = tabs.closest('.question') || document;
    const accordion = section.querySelector('.accordion');
    if (!accordion) return;

    const btns = Array.from(tabs.querySelectorAll('[data-faq-tab]'));
    const items = Array.from(accordion.querySelectorAll('.accordion__element'));

    // default category for untagged items
    items.forEach((el) => {
        if (!el.dataset.faqCat || !String(el.dataset.faqCat).trim()) el.dataset.faqCat = 'forum';
    });

    const parseCats = (value) =>
        String(value || '').split(/[,\s]+/).map(s => s.trim()).filter(Boolean);

    const closeAccordionItem = (el) => {
        el.classList.remove('is-active');
        const content = el.querySelector('.accordion__content');
        if (content) {
            content.style.height = '';
            content.style.maxHeight = '';
        }
    };

    const setActive = (cat) => {
        btns.forEach((b) => {
            const active = b.dataset.faqTab === cat;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        items.forEach((el) => {
            const isMatch = parseCats(el.dataset.faqCat).includes(cat);
            if (!isMatch) closeAccordionItem(el);
            el.hidden = !isMatch;
            el.classList.toggle('faq-is-hidden', !isMatch);
        });
    };

    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-faq-tab]');
        if (!btn) return;
        setActive(btn.dataset.faqTab);
    });

    const initial =
        (btns.find((b) => b.classList.contains('is-active')) || btns[0])?.dataset.faqTab || 'forum';

    setActive(initial);
    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});

// Registration dropdown (header) – closes on outside click + ESC
(() => {
    const dropdowns = Array.from(document.querySelectorAll('[data-reg-dropdown]'));
    if (!dropdowns.length) return;

    const closeAll = (except) => {
        dropdowns.forEach((dd) => {
            if (dd !== except) dd.open = false;
        });
    };

    dropdowns.forEach((dd) => {
        dd.addEventListener('toggle', () => {
            if (dd.open) closeAll(dd);
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach((dd) => {
            if (dd.open && !dd.contains(e.target)) dd.open = false;
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
})();

// Mobile burger: close when clicking outside the white menu panel
(() => {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const panel = nav?.querySelector('.header__nav-list');

    if (!burger || !nav || !panel) return;

    const closeMenu = () => {
        burger.classList.remove('is-active');
        nav.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
    };

    nav.addEventListener('click', (e) => {
        if (!nav.classList.contains('is-active')) return;

        // click on dark overlay, not inside white panel
        if (!panel.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-active')) {
            closeMenu();
        }
    });
})();
