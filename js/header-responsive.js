(function(){
  function updateHeaderNav() {
    var nav = document.querySelector('.header__nav');
    var list = document.querySelector('.header__nav-list');
    var burger = document.querySelector('.header__burger');
    if (!nav || !list || !burger) return;
    var w = window.innerWidth;
    // default: show nav, hide burger
    var showNav = true;
    var showBurger = false;

    if (w <= 1000) {
      // always use burger on small screens
      showNav = false;
      showBurger = true;
    } else if (w <= 1440) {
      // only switch to burger on overflow in this range
      // ensure nav is measurable (temporarily show it)
      var prevDisplay = nav.style.display;
      nav.style.display = nav.style.display || '';
      var overflow = list.scrollWidth > nav.clientWidth - 8;
      if (overflow) {
        showNav = false;
        showBurger = true;
      }
      // restore inline style (we'll apply final below)
      nav.style.display = prevDisplay;
    } else {
      // large screens: always show nav
      showNav = true;
      showBurger = false;
    }

    nav.style.display = showNav ? 'flex' : 'none';
    burger.style.display = showBurger ? 'block' : 'none';
  }

  window.addEventListener('load', updateHeaderNav);
  window.addEventListener('resize', function(){
    // throttle
    if (window._headerResizeTimeout) clearTimeout(window._headerResizeTimeout);
    window._headerResizeTimeout = setTimeout(updateHeaderNav, 120);
  });

  // Re-check after fonts load (in case widths change)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateHeaderNav);
  }
})();
