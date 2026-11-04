export class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menu = document.querySelector('.navbar__hamburger');
        this.logoLink = document.querySelector('.navbar__logo-link');
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.navOverlay = document.querySelector('.navbar__overlay');
        this.back = document.querySelector('.navbar__back-container');
        this.backButton = this.back.querySelector('#back-button');

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
        const viewWidth = document.documentElement.clientWidth;
        const drawerIsClosed = !this.isDrawerOpen;

        if (drawerIsClosed) {
            this.navOverlay.classList.add('navbar__overlay--resizing');
        }

        if (viewWidth <= 430) {
            this.currentDevice = 'mobile';
            this.navbar.insertBefore(this.logoLink, this.menu);
        } else if (viewWidth <= 1024) {
            this.currentDevice = 'tablet';
            this.navbar.insertBefore(this.menu, this.logoLink);
        } else {
            this.currentDevice = 'desktop';
        }

        if (drawerIsClosed) {
            this.navOverlay.getBoundingClientRect();
            requestAnimationFrame(() => {
                this.navOverlay.classList.remove('navbar__overlay--resizing');
            });
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
        if (this.isDrawerOpen) return;

        this.isDrawerOpen = true;
        this.backButton.classList.remove('navbar__back-button--rotated');
        this.navOverlay.classList.add('navbar__overlay--active');
        history.pushState({ isDrawerOpen: true }, '');
    };

    closeDrawer = () => {
        if (!this.isDrawerOpen) return;

        this.isDrawerOpen = false;

        this.backButton.addEventListener(
            'transitionend',
            (event) => {
                if (event.propertyName !== 'transform') return;

                this.navOverlay.classList.remove('navbar__overlay--active');

                if (history.state?.isDrawerOpen) {
                    history.back();
                }

                setTimeout(() => {
                    this.backButton.classList.remove(
                        'navbar__back-button--rotated',
                    );
                }, 200); // This resets the rotation of the #back-button
            },
            { once: true },
        );

        this.backButton.classList.add('navbar__back-button--rotated');
    };

    handleDrawer = () => {
        this.menu.addEventListener('click', this.openDrawer);

        window.addEventListener('popstate', this.closeDrawer);

        this.back.addEventListener('click', this.closeDrawer);

        if (this.currentDevice !== 'desktop') {
            this.navOverlay.appendChild(
                document.querySelector('.navbar__links'),
            );
        }
    };

    init = () => {
        this.adjustRegions();
        this.handleLinkActive();
        this.handleDrawer();
        window.addEventListener('resize', this.adjustRegions);
        document.documentElement.classList.add('drawer-ready'); // This helps keep the drawer closed when page loads
    };
}
