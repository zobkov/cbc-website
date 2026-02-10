// header-responsive.js
// Toggle `header--use-burger` class based on viewport width and nav overflow.
(function(){
  var header = document.querySelector('.header');
  var nav = document.querySelector('.header__nav');
  var list = document.querySelector('.header__nav-list');
  var burger = document.querySelector('.header__burger');
  if (!header || !nav || !list || !burger) {
    console.debug && console.debug('header-responsive: missing elements', {header: !!header, nav: !!nav, list: !!list, burger: !!burger});
    return;
  }
  console.debug && console.debug('header-responsive: init', {width: window.innerWidth});

  function isOverflowing() {
    return list.scrollWidth > nav.clientWidth - 8;
  }

  function update() {
    var w = window.innerWidth;

    function enableBurger() {
      header.classList.add('header--use-burger');
      try { burger.style.display = 'block'; } catch (e) {}
      try { nav.style.display = 'none'; } catch (e) {}
    }

    function disableBurger() {
      header.classList.remove('header--use-burger');
      try { burger.style.display = ''; } catch (e) {}
      try { nav.style.display = ''; } catch (e) {}
    }

    // start by clearing any inline fallbacks
    disableBurger();

    if (w <= 1030) {
      enableBurger();
      console.debug && console.debug('header-responsive: forced burger by width', w);
      return;
    }

    if (w <= 1440) {
      // measure overflow in this range
      var prev = nav.style.display;
      nav.style.display = '';
      var overflow = isOverflowing();
      nav.style.display = prev;
      console.debug && console.debug('header-responsive: measured overflow', {w: w, overflow: overflow});
      if (overflow) {
        enableBurger();
      }
      return;
    }

    // >1440: ensure burger disabled
    disableBurger();
  }

  var t;
  window.addEventListener('load', update);
  window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(update, 100); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();
