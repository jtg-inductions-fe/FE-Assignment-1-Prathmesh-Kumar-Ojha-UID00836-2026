const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.navbar__hamburger');
const logoLink = document.querySelector('.navbar__logo-link');
const navLinks = document.querySelectorAll('.navbar__link');

function adjustRegions() {
    if (window.innerWidth <= 430) {
        navbar.insertBefore(logoLink, menu);
    } else if (window.innerWidth <= 1024) {
        navbar.insertBefore(menu, logoLink);
    }
}

function handleLinkActive() {
    navLinks.forEach((link) => {
        const setActive = () => {
            navLinks.forEach((item) =>
                item.classList.remove('navbar__link--active'),
            );
            link.classList.add('navbar__link--active');
        };

        link.addEventListener('click', setActive);
        link.addEventListener('focus', setActive);
    });
}

export function initNavbar() {
    adjustRegions();
    handleLinkActive();
    window.addEventListener('resize', adjustRegions);
}
