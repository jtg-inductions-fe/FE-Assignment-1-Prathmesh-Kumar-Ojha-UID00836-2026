/**
 * Manages interactive mobile accordion behavior for footer link columns.
 */
export class Footer {
    /**
     * Initializes the Footer instance and caches the links container element.
     */
    constructor() {
        /**
         * Container element holding all footer navigation columns.
         * @type {HTMLElement | null}
         */
        this.footerLinks = document.querySelector('.footer__links');
    }

    /**
     * Toggles the visibility of a footer column's link list and rotates its reveal icon
     * when clicked on mobile viewports.
     *
     * @param {MouseEvent} event - The click event delegated from the footer links container.
     * @returns {void}
     */
    handleReveal = (event) => {
        const trigger = event.target.closest(
            '.footer__reveal, .footer__heading',
        );
        if (!trigger) return;

        const column = trigger.closest('.footer__column');
        if (!column) return;

        const reveal = column.querySelector('.footer__reveal');
        const list = column.querySelector('.footer__list');
        if (!reveal || !list) return;

        if (window.getComputedStyle(reveal).display === 'none') return;

        reveal.classList.toggle('footer__reveal--active');
        list.classList.toggle('footer__list--visible');
    };

    /**
     * Attaches delegated event listeners required for footer interactivity.
     *
     * @returns {void}
     */
    init = () => {
        this.footerLinks?.addEventListener('click', this.handleReveal);
    };
}
