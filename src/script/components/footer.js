export class Footer {
    constructor() {
        this.footerLinks = document.querySelector('.footer__links');
    }

    handleReveal = (event) => {
        const trigger = event.target.closest(
            '.footer__reveal, .footer__column-container',
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

    init = () => {
        this.footerLinks?.addEventListener('click', this.handleReveal);
    };
}
