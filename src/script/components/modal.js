export class Modal {
    constructor() {
        this.modal = document.querySelector('.deals');
        this.openLink = document.querySelector('.navbar__link--deals');
        this.closeButton = document.querySelector('.deals__close');
    }

    handleClose = (target) => {
        const closeButton = target.closest('.deals__close');

        if (closeButton) {
            this.modal.close();
        }
    };

    handleSpin = (target) => {
        const spinButton = target.closest('.deals__wheel-center');

        if (spinButton) {
            // console.log('Clicked');
        }
    };

    init = () => {
        this.modal.addEventListener('click', (event) => {
            const target = event.target;
            this.handleClose(target);
            this.handleSpin(target);
        });
    };
}
