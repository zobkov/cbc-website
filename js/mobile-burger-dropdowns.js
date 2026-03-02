// ./js/mobile-burger-dropdowns.js
// Mobile drawer dropdowns for "Наша экосистема" and "Партнёры"
// Prevents burger from closing on dropdown-parent clicks.

(() => {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;

    const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

    const dropdownItems = Array.from(nav.querySelectorAll('.header__nav-item--dropdown'));
    if (!dropdownItems.length) return;

    const closeAllDropdowns = (except) => {
        dropdownItems.forEach((li) => {
            if (li === except) return;
            li.classList.remove('is-open');
            const btn = li.querySelector('.header__nav-link--dropdown');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    };

    dropdownItems.forEach((li) => {
        const btn = li.querySelector('.header__nav-link--dropdown');
        const menu = li.querySelector('.header__dropdown');
        if (!btn || !menu) return;

        btn.setAttribute('aria-expanded', 'false');

        // CAPTURE handler so we run before bubble handlers that close the burger
        btn.addEventListener(
            'click',
            (e) => {
                if (!isMobile()) return;

                // strongest block: prevents other handlers from seeing this click
                e.preventDefault();
                e.stopImmediatePropagation();

                const isOpen = li.classList.toggle('is-open');
                btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

                if (isOpen) closeAllDropdowns(li);
            },
            true
        );
    });

    // Allow submenu links to behave normally (page navigation can close burger)
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('.header__dropdown-link');
        if (!link) return;
        closeAllDropdowns();
    });
})();
