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
        this.linkList = document.querySelector('.footer__list');
    }

    /**
     * Toggles the visibility of a footer column's link list and rotates its reveal icon
     * when clicked on mobile viewports.
     *
     * @param {MouseEvent} event - The click event delegated from the footer links container.
     * @returns {void}
     */
    handleReveal = (event) => {
        const reveal = event.target.closest('.footer__reveal');
        if (!reveal) return;

        const column = reveal.closest('.footer__column');
        const list = column?.querySelector('.footer__list');
        if (!list) return;

        reveal.classList.toggle('footer__reveal--active');
        list.classList.toggle('footer__list--visible');

        const isExpanded = reveal.getAttribute('aria-expanded') === 'true';
        reveal.setAttribute('aria-expanded', String(!isExpanded));
    };

    /**
     * Attaches delegated event listeners required for footer interactivity.
     *
     * @returns {void}
     */
    init = () => {
        this.footerLinks.addEventListener('click', this.handleReveal);
    };
}
