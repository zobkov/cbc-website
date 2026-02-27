document.addEventListener('DOMContentLoaded', function () {
    // We clone the burger button to strip all existing event listeners
    // (specifically from main.min.js which conflicts with our logic)
    var oldBurger = document.querySelector('.header__burger');
    if (!oldBurger) return;

    var burger = oldBurger.cloneNode(true);
    oldBurger.parentNode.replaceChild(burger, oldBurger);
    
    var nav = document.querySelector('.header__nav');
    var body = document.body;
    var navLinks = document.querySelectorAll('.header__nav-link');

    console.log('Burger menu script initialized (Clean mode)');

    function openMenu() {
        burger.classList.add('is-active');
        burger.setAttribute('aria-expanded', 'true');
        nav.classList.add('is-active');
        nav.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-active');
        nav.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
    }

    function toggleMenu(e) {
        e.stopPropagation();
        if (nav.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    burger.addEventListener('click', toggleMenu);

    // Close when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Close when clicking the backdrop (dark area outside the white panel)
    nav.addEventListener('click', function (e) {
        var navList = nav.querySelector('.header__nav-list');
        if (navList && !navList.contains(e.target)) {
            closeMenu();
        }
    });

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
