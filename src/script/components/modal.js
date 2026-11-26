import { animate } from 'motion';

export class Modal {
    constructor() {
        this.openLink = document.querySelector('.navbar__link--deals');
        this.modal = document.querySelector('.deals');
        this.closeButton = document.querySelector('.deals__close');
        this.wheel = document.querySelector('.deals__wheel-spinner');

        this.spinAnimation = null;
    }

    handleClose = (target) => {
        const closeButton = target.closest('.deals__close');

        if (closeButton) {
            this.modal.close();
        }
    };

    handleSpin = (target) => {
        const spinButton = target.closest('.deals__wheel-center');

        if (!spinButton || this.spinAnimation) return;

        const randomRotation = Math.floor(Math.random() * 360);
        const currentRotation = Number(this.wheel.dataset.rotation) || 0;

        const finalRotation = currentRotation + 360 * 8 + randomRotation;

        this.spinAnimation = animate(
            this.wheel,
            {
                rotate: finalRotation,
            },
            {
                duration: 4,
                ease: 'easeInOut',
            },
        );

        this.wheel.dataset.rotation = String(finalRotation);

        this.spinAnimation.then(() => {
            this.spinAnimation = null;
        });
    };

    init = () => {
        this.modal.addEventListener('click', (event) => {
            const target = event.target;
            this.handleClose(target);
            this.handleSpin(target);
        });
    };
}
