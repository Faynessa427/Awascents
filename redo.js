const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.querySelector('.menu-links');

if (menuToggle && menuLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    const wrapper = menuToggle.closest('.menu-wrap');
    if (wrapper && !wrapper.contains(target)) {
      menuLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
