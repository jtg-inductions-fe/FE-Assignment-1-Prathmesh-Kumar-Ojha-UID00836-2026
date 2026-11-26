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
        this.navOverlay = document.querySelector('.navbar-drawer');
        this.back = document.querySelector('.navbar-drawer__close-button');
        this.backIcon = this.back.querySelector('.navbar-drawer__icon');
        this.mobileQuery = window.matchMedia('(width <= 430px)');
        this.desktopQuery = window.matchMedia('(width > 1024px)');
        this.modal = document.querySelector('.deals');

        this.isDrawerOpen = false;
        this.isDrawerClosing = false;
        this.pendingModalOpen = false;
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
        this.isDrawerClosing = false;

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

            if (this.isDrawerOpen || this.isDrawerClosing) {
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
        if (this.isDrawerOpen || this.isDrawerClosing) return;

        this.setDrawerState(true);
        this.backIcon.classList.remove('navbar-drawer__icon--rotated');
    };

    /**
     * Closes the drawer after the back button transition completes.
     */
    closeDrawer = () => {
        if (!this.isDrawerOpen || this.isDrawerClosing) return;

        this.isDrawerClosing = true;

        const handleTransitionEnd = (event) => {
            if (
                event.target !== this.backIcon ||
                event.propertyName !== 'transform'
            ) {
                return;
            }

            this.backIcon.removeEventListener(
                'transitionend',
                handleTransitionEnd,
            );

            this.finishClosing();
        };

        this.backIcon.addEventListener('transitionend', handleTransitionEnd);

        this.backIcon.classList.add('navbar-drawer__icon--rotated');
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

        document.addEventListener('click', this.openModal);

        window.addEventListener('popstate', () => {
            if (this.isDrawerOpen) {
                this.closeDrawer();
            }
        });

        this.back.addEventListener('click', this.closeDrawer);
    };

    /**
     * Opens the deals modal when the deals link is clicked.
     * @param {MouseEvent} event - The click event.
     */
    openModal = (event) => {
        const dealsLink = event.target.closest('.navbar__link--deals');

        if (!dealsLink) return;

        event.preventDefault();

        if (this.isDrawerClosing) return;

        if (this.isDrawerOpen) {
            this.pendingModalOpen = true;
            this.closeDrawer();
            return;
        }

        if (!this.modal.open) {
            this.modal.showModal();
        }
    };

    /**
     * Completes the drawer closing transition.
     */
    finishClosing = () => {
        this.setDrawerState(false);

        if (this.pendingModalOpen) {
            this.pendingModalOpen = false;
            this.modal.showModal();
        }

        setTimeout(() => {
            this.backIcon.classList.remove('navbar-drawer__icon--rotated');
        }, 200);
    };

    /**
     * Initializes responsive behavior and drawer events.
     */
    init = () => {
        this.mobileQuery.addEventListener('change', this.adjustRegions);
        this.desktopQuery.addEventListener('change', this.adjustRegions);
        this.adjustRegions();
        this.handleDrawer();
        document.documentElement.classList.add('drawer-ready'); // Keeps the drawer closed when page loads
    };
}
