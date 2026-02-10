document.addEventListener('DOMContentLoaded', function () {
  var dropdownButtons = document.querySelectorAll('.header__nav-link--dropdown');
  var burger = document.querySelector('.header__burger');
  var nav = document.querySelector('.header__nav');

  function closeAllDropdowns() {
    document.querySelectorAll('.header__dropdown.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      dd.previousElementSibling.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = btn.nextElementSibling;
      var isOpen = dropdown.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        dropdown.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }

      // Burger conflict fix: existing main.min.js removes is-active from burger/nav
      // when any .header__nav-link is clicked. Re-assert on mobile.
      if (window.innerWidth <= 767 && burger && nav) {
        burger.classList.add('is-active');
        nav.classList.add('is-active');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.header__nav-item--dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllDropdowns();
    }
  });
});
