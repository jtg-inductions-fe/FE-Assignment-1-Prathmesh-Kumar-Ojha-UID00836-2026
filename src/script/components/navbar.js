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
        this.menu = document.querySelector('.navbar__hamburger');
        this.logoLink = document.querySelector('.navbar__logo-link');
        this.actions = document.querySelector('.navbar__actions');
        this.navLinkContainer = document.querySelector('.navbar__links');
        this.navLinks = document.querySelectorAll('.navbar__link');
        this.navOverlay = document.querySelector('.navbar__overlay');
        this.back = document.querySelector('.navbar__back-container');
        this.backButton = this.back.querySelector('#back-icon');
        this.mobileQuery = window.matchMedia('(max-width: 430px)');
        this.desktopQuery = window.matchMedia('(min-width: 1025px)');

        this.device = 'mobile';
        this.isDrawerOpen = false;
    }

    /**
     * Returns the current viewport mode for the navbar.
     * @returns {'mobile' | 'tablet' | 'desktop'} The current device mode.
     */
    get currentDevice() {
        return this.device;
    }

    /**
     * Sets the active viewport mode used by responsive layout logic.
     * @param {'mobile' | 'tablet' | 'desktop'} device - The device mode to apply.
     */
    set currentDevice(device) {
        this.device = device;
    }

    /**
     * Reorders navbar regions based on the active viewport and drawer state.
     */
    adjustRegions = () => {
        const drawerIsClosed = !this.isDrawerOpen;

        if (drawerIsClosed) {
            this.navOverlay.classList.add('navbar__overlay--resizing');
        }

        if (this.mobileQuery.matches) {
            this.currentDevice = 'mobile';
            this.navbar.insertBefore(this.logoLink, this.menu);
        } else if (this.desktopQuery.matches) {
            this.currentDevice = 'desktop';
            this.navbar.insertBefore(this.menu, this.logoLink);
        } else {
            this.currentDevice = 'tablet';
            this.navbar.insertBefore(this.menu, this.logoLink);
        }

        if (this.currentDevice === 'desktop') {
            this.navbar.insertBefore(this.navLinkContainer, this.actions);

            if (this.isDrawerOpen) {
                this.isDrawerOpen = false;
                this.menu.setAttribute('aria-expanded', String(false));
                this.navOverlay.classList.remove('navbar__overlay--active');
                this.navbar.classList.remove('navbar--hidden');
            }
        } else {
            this.navOverlay.appendChild(this.navLinkContainer);
        }

        if (drawerIsClosed) {
            this.navOverlay.getBoundingClientRect();
            requestAnimationFrame(() => {
                this.navOverlay.classList.remove('navbar__overlay--resizing');
            });
        }
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
        this.backButton.classList.remove('navbar__back-button--rotated');
        this.navOverlay.classList.add('navbar__overlay--active');
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

                this.navOverlay.classList.remove('navbar__overlay--active');

                this.navbar.classList.remove('navbar--hidden');

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

    /**
     * Binds menu button and overlay dismissal events used to control the drawer.
     */
    handleDrawer = () => {
        this.menu.addEventListener('click', this.openDrawer);

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
