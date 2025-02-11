const navWrapper = document.getElementById('navWrapper');
const menuToggle = document.getElementById('menuToggle');

// Once the falling animation of the nav-wrapper finishes, add the active class.
// This triggers the orbit animations of the menu items.
navWrapper.addEventListener('animationend', function () {
  navWrapper.classList.add('active');
});

// Since the main button should no longer close the menu, we only allow it to open the menu.
// Here, if the menu isn’t active (e.g. on first click before the fall completes), we add the active class.
// Once active, further clicks do nothing.
menuToggle.addEventListener('click', function (e) {
  if (!navWrapper.classList.contains('active')) {
    navWrapper.classList.add('active');
  }
  e.stopPropagation();
});

// Remove any logic that closes the menu on outside clicks.
// The menu will remain open once activated.
document.addEventListener('click', function (e) {
  // No action here.
});

