import { animate } from 'motion';

export class Modal {
    constructor() {
        this.openLink = document.querySelector('.navbar__link--deals');
        this.modal = document.querySelector('.deals');
        this.closeButton = document.querySelector('.deals__close');
        this.wheel = document.querySelector('.deals__wheel-spinner');

        this.spinAnimation = null;
        this.currentRotation = Number(this.wheel?.dataset.rotation) || 0;
    }

    handleOpen = (event) => {
        event.preventDefault();
        this.modal.showModal();
    };

    handleClose = (event) => {
        const closeButton = event.target.closest('.deals__close');
        if (!closeButton || this.spinAnimation) return;
        this.modal.close();
    };

    resetModal = () => {
        this.spinAnimation?.stop();
        this.spinAnimation = null;

        this.currentRotation = 0;
        this.wheel.dataset.rotation = '0';

        animate(this.wheel, { rotate: 0 }, { duration: 0 });

        this.wheel.classList.remove('disable');
        this.closeButton.classList.remove('disable');
    };

    handleSpin = (event) => {
        const spinButton = event.target.closest('.deals__wheel-center');
        if (!spinButton || this.spinAnimation) return;

        const randomRotation = Math.floor(Math.random() * 360);
        const finalRotation = this.currentRotation + 360 * 2.5 + randomRotation;

        this.currentRotation = finalRotation;
        this.wheel.dataset.rotation = String(finalRotation);

        this.spinAnimation = animate(
            this.wheel,
            { rotate: finalRotation },
            {
                duration: 4,
                ease: 'easeInOut',
                onPlay: () => {
                    this.wheel.classList.add('disable');
                    this.closeButton.classList.add('disable');
                },
                onComplete: () => {
                    this.wheel.classList.remove('disable');
                    this.closeButton.classList.remove('disable');
                    this.spinAnimation = null;
                },
            },
        );
    };

    init = () => {
        this.openLink?.addEventListener('click', this.handleOpen);

        this.modal?.addEventListener('click', (event) => {
            this.handleClose(event);
            this.handleSpin(event);
        });

        this.modal?.addEventListener('close', this.resetModal);
    };
}
