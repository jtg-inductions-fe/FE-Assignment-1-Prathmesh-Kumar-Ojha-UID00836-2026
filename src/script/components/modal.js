import { animate } from 'motion';

export class Modal {
    constructor() {
        this.openLink = document.querySelector('.navbar__link--deals');
        this.modal = document.querySelector('.deals');
        this.closeButton = document.querySelector('.deals__close');
        this.pointer = document.querySelector('.deals__wheel-pointer');
        this.wheel = document.querySelector('.deals__wheel-spinner');

        this.dealsUrl =
            'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
        this.deals = [];

        this.spinAnimation = null;
        this.currentRotation = Number(this.wheel?.dataset.rotation) || 0;
    }

    fetchDeals = () => {
        if (this.deals.length > 0) {
            return Promise.resolve(this.deals);
        }

        return fetch(this.dealsUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.deals = data;
                return this.deals;
            })
            .catch(() => []);
    };

    handleOpen = (event) => {
        event.preventDefault();
        this.modal.showModal();
    };

    handleClose = (event) => {
        const closeButton = event.target.closest('.deals__close');
        if (!closeButton || this.spinAnimation) return;
        this.modal.close();
    };

    handleCancel = (event) => {
        if (this.spinAnimation) {
            event.preventDefault();
        }
    };

    resetModal = () => {
        this.spinAnimation?.stop();
        this.spinAnimation = null;

        this.currentRotation = 0;
        this.wheel.dataset.rotation = '0';
        this.pointer.style.backgroundColor = '';

        animate(this.wheel, { rotate: 0 }, { duration: 0 });

        this.modal.classList.remove('is-spinning');
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
                mass: 1.25,
                duration: 4,
                ease: 'easeInOut',
                onPlay: () => {
                    this.modal.classList.add('is-spinning');
                    this.wheel.classList.add('disable');
                    this.closeButton.classList.add('disable');
                },
                onComplete: () => {
                    this.modal.classList.remove('is-spinning');
                    this.wheel.classList.remove('disable');
                    this.closeButton.classList.remove('disable');
                    this.spinAnimation = null;
                },
                onUpdate: () => {
                    const winnerStyle = this.getWinner();
                    if (winnerStyle) {
                        this.pointer.style.backgroundColor =
                            winnerStyle.backgroundColor;
                    }
                },
            },
        );
    };

    getWinner = () => {
        if (!this.pointer) return null;

        const rect = this.pointer.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.bottom;

        const elements = document.elementsFromPoint(x, y);
        const prize = elements
            .map((el) => el.closest('.deals__wheel-prize'))
            .find(Boolean);

        if (!prize) return null;

        return getComputedStyle(prize);
    };

    init = () => {
        this.openLink?.addEventListener('click', this.handleOpen);

        this.modal?.addEventListener('click', (event) => {
            this.handleClose(event);
            this.handleSpin(event);
        });

        this.modal?.addEventListener('cancel', this.handleCancel);
        this.modal?.addEventListener('close', this.resetModal);
    };
}
