document.addEventListener('DOMContentLoaded', function () {
  var dropdownButtons = document.querySelectorAll('.header__nav-link--dropdown');

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
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllDropdowns();
    }
  });
});
