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

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-active')) {
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});
