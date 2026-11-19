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
     * Synchronizes drawer state, ARIA attributes, layout visibility, and browser history.
     * @param {boolean} isOpen - Whether the drawer should be open.
     */
    setDrawerState = (isOpen) => {
        this.isDrawerOpen = isOpen;
        this.menu.setAttribute('aria-expanded', String(isOpen));
        this.navOverlay.classList.toggle('navbar-drawer--active', isOpen);
        this.navbar.classList.toggle('navbar--hidden', isOpen);

        if (isOpen) {
            history.pushState({ isDrawerOpen: true }, '');
        } else if (history.state?.isDrawerOpen) {
            history.back();
        }
    };

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
        } else {
            this.navbar.insertBefore(this.menu, this.logoLink);
        }

        if (this.currentDevice === 'desktop') {
            this.navbar.insertBefore(this.navLinkContainer, this.actions);

            if (this.isDrawerOpen) {
                this.setDrawerState(false);
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
     * Opens the mobile/tablet navigation drawer and updates the button accessibility state.
     */
    openDrawer = () => {
        if (this.isDrawerOpen) return;

        this.setDrawerState(true);
        this.backButton.classList.remove('navbar-drawer__icon--rotated');
    };

    /**
     * Closes the drawer after the back button transition completes.
     */
    closeDrawer = () => {
        if (!this.isDrawerOpen) return;

        this.isDrawerOpen = false; // Prevents double triggers during animation

        this.backButton.addEventListener(
            'transitionend',
            (event) => {
                if (event.propertyName !== 'transform') return;

                this.setDrawerState(false);

                setTimeout(() => {
                    this.backButton.classList.remove(
                        'navbar-drawer__icon--rotated',
                    );
                }, 200); // Resets the rotation of the back button
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
        this.handleDrawer();
        document.documentElement.classList.add('drawer-ready'); // Keeps the drawer closed when page loads
    };
}
