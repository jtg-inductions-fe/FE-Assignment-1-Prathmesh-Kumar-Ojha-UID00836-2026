/**
 * Provides responsive navbar behavior for mobile, tablet, and desktop layouts.
 * Handles region ordering, drawer toggling, and active nav state updates.
 */
export class Navbar {
    /**
     * Creates the navbar controller and caches DOM references used across the component.
     */
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menu = document.querySelector('.navbar__menu-toggle');
        this.logoLink = document.querySelector('.navbar__logo');
        this.actions = document.querySelector('.navbar__actions');
        this.navLinkContainer = document.querySelector('.navbar__list');
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.navOverlay = document.querySelector('.navbar-drawer');
        this.back = document.querySelector('.navbar-drawer__close-button');
        this.backButton = this.back.querySelector('.navbar-drawer__icon');
        this.mobileQuery = window.matchMedia('(width <= 430px)');
        this.desktopQuery = window.matchMedia('(width > 1024px)');

        this.isDrawerOpen = false;
    }

    /**
     * Returns the current viewport mode for the navbar.
     * @returns {'mobile' | 'tablet' | 'desktop'} The current device mode.
     */
    get currentDevice() {
        if (this.desktopQuery.matches) return 'desktop';
        return this.mobileQuery.matches ? 'mobile' : 'tablet';
    }

    /**
     * Reorders navbar regions based on the active viewport and drawer state.
     */
    adjustRegions = () => {
        const drawerIsClosed = !this.isDrawerOpen;

        if (drawerIsClosed) {
            this.navOverlay.classList.add('navbar-drawer--resizing');
        }

        if (this.mobileQuery.matches) {
            this.navbar.insertBefore(this.logoLink, this.menu);
        } else if (this.desktopQuery.matches) {
            this.navbar.insertBefore(this.menu, this.logoLink);
        } else {
            this.navbar.insertBefore(this.menu, this.logoLink);
        }

        if (this.currentDevice === 'desktop') {
            this.navbar.insertBefore(this.navLinkContainer, this.actions);

            if (this.isDrawerOpen) {
                this.isDrawerOpen = false;
                this.menu.setAttribute('aria-expanded', String(false));
                this.toggleDrawer(false);
                this.navbar.classList.remove('navbar--hidden');
            }
        } else {
            this.navOverlay.appendChild(this.navLinkContainer);
        }

        if (drawerIsClosed) {
            this.navOverlay.getBoundingClientRect();
            requestAnimationFrame(() => {
                this.navOverlay.classList.remove('navbar-drawer--resizing');
            });
        }
    };

    /**
     * Synchronizes the drawer overlay class with the requested drawer state.
     * @param {boolean} isOpen - Whether the drawer overlay should be visible.
     */
    toggleDrawer = (isOpen) => {
        this.navOverlay.classList.toggle('navbar-drawer--active', isOpen);
    };

    /**
     * Attaches click handlers so only the selected navigation link keeps the active style.
     */
    handleLinkActive = () => {
        this.navLinks.forEach((link) => {
            const setActive = () => {
                this.navLinks.forEach((item) =>
                    item.classList.remove('navbar__link--active'),
                );
                link.classList.add('navbar__link--active');
            };

            link.addEventListener('click', setActive);
        });
    };

    /**
     * Opens the mobile/tablet navigation drawer and updates the button accessibility state.
     */
    openDrawer = () => {
        if (this.isDrawerOpen) return;

        this.isDrawerOpen = true;
        this.menu.setAttribute('aria-expanded', String(true));
        this.backButton.classList.remove('navbar-drawer__icon--rotated');
        this.toggleDrawer(true);
        this.navbar.classList.add('navbar--hidden');
        history.pushState({ isDrawerOpen: true }, '');
    };

    /**
     * Closes the drawer after the back button transition completes.
     */
    closeDrawer = () => {
        if (!this.isDrawerOpen) return;

        this.isDrawerOpen = false;
        this.menu.setAttribute('aria-expanded', String(false));

        this.backButton.addEventListener(
            'transitionend',
            (event) => {
                if (event.propertyName !== 'transform') return;

                this.toggleDrawer(false);

                this.navbar.classList.remove('navbar--hidden');

                if (history.state?.isDrawerOpen) {
                    history.back();
                }

                setTimeout(() => {
                    this.backButton.classList.remove(
                        'navbar-drawer__icon--rotated',
                    );
                }, 200); // This resets the rotation of the #back-button
            },
            { once: true },
        );

        this.backButton.classList.add('navbar-drawer__icon--rotated');
    };

    /**
     * Binds menu button and overlay dismissal events used to control the drawer.
     */
    handleDrawer = () => {
        this.menu.addEventListener('click', this.openDrawer);
        this.navOverlay.addEventListener('click', (event) => {
            if (event.target === this.navOverlay) {
                this.closeDrawer();
            }
        });
        window.addEventListener('popstate', this.closeDrawer);
        this.back.addEventListener('click', this.closeDrawer);
    };

    /**
     * Initializes responsive behavior, active link handling, and drawer events.
     */
    init = () => {
        this.mobileQuery.addEventListener('change', this.adjustRegions);
        this.desktopQuery.addEventListener('change', this.adjustRegions);
        this.adjustRegions();
        this.handleLinkActive();
        this.handleDrawer();
        document.documentElement.classList.add('drawer-ready'); // This helps keep the drawer closed when page loads
    };
}
