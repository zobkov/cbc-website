document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.header__burger');
  var nav = document.querySelector('.header__nav');
  var dropdownButtons = document.querySelectorAll('.header__nav-link--dropdown');
  var body = document.body;

  // Toggle Mobile Menu
  if (burger && nav) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isActive = nav.classList.contains('is-active');
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  function openMenu() {
    if (burger) {
      burger.classList.add('is-active');
      burger.setAttribute('aria-expanded', 'true');
    }
    if (nav) {
      nav.classList.add('is-active');
      nav.setAttribute('aria-hidden', 'false');
    }
    body.style.overflow = 'hidden'; 
  }

  function closeMenu() {
    if (burger) {
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    }
    if (nav) {
      nav.classList.remove('is-active');
      nav.setAttribute('aria-hidden', 'true');
    }
    body.style.overflow = '';
    closeAllDropdowns();
  }

  // Toggle Dropdowns
  dropdownButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var dropdown = btn.nextElementSibling;
      var isOpen = dropdown.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.header__dropdown.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      var btn = dd.previousElementSibling;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    // If click is outside nav item (for dropdowns)
    if (!e.target.closest('.header__nav-item--dropdown')) {
      closeAllDropdowns();
    }
    // Also close menu if click is outside nav and menu is open
    if (nav && nav.classList.contains('is-active')) {
       if (!e.target.closest('.header__nav') && !e.target.closest('.header__burger')) {
         closeMenu();
       }
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllDropdowns();
      closeMenu();
    }
  });
});
