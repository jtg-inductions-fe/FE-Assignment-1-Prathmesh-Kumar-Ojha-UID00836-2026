export class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menu = document.querySelector('.navbar__hamburger');
        this.logoLink = document.querySelector('.navbar__logo-link');
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.navOverlay = document.querySelector('.navbar__overlay');

        this.device = 'mobile';

        this.isDrawerOpen = false;
    }

    get currentDevice() {
        return this.device;
    }

    set currentDevice(device) {
        this.device = device;
    }

    adjustRegions = () => {
        if (window.innerWidth <= 430) {
            this.currentDevice = 'mobile';
            this.navbar.insertBefore(this.logoLink, this.menu);
        } else if (window.innerWidth <= 1024) {
            this.currentDevice = 'tablet';
            this.navbar.insertBefore(this.menu, this.logoLink);
        } else {
            this.currentDevice = 'desktop';
        }
    };

    handleLinkActive = () => {
        this.navLinks.forEach((link) => {
            const setActive = () => {
                this.navLinks.forEach((item) =>
                    item.classList.remove('navbar__link--active'),
                );
                link.classList.add('navbar__link--active');
            };

            link.addEventListener('click', setActive);
            link.addEventListener('focus', setActive);
        });
    };

    openDrawer = () => {
        this.isDrawerOpen = true;
        this.navOverlay.classList.toggle('navbar__overlay--active');

        history.pushState({ isDrawerOpen: this.isDrawerOpen }, '');
    };

    closeDrawer = () => {
        if (!this.isDrawerOpen) return;

        this.isDrawerOpen = false;
        this.navOverlay.classList.toggle('navbar__overlay--active');

        if (history.state?.isDrawerOpen) {
            history.back();
        }
    };

    handleDrawer = () => {
        this.menu.addEventListener('click', () => {
            this.openDrawer();
        });

        window.addEventListener('popstate', () => {
            this.closeDrawer();
        });
    };

    init = () => {
        this.adjustRegions();
        this.handleLinkActive();
        this.handleDrawer();
        window.addEventListener('resize', this.adjustRegions);
    };
}
