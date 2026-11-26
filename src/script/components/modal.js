export class Modal {
    constructor() {
        this.modal = document.querySelector('.deals');
        this.openLink = document.querySelector('.navbar__link--deals');
        this.closeButton = document.querySelector('.deals__close');
    }

    handleOpen = () => {
        this.openLink.addEventListener('click', () => {
            setTimeout(() => {
                this.modal.show();
            }, 450);
        });
    };

    handleClose = () => {
        this.closeButton.addEventListener('click', () => {
            this.modal.close();
        });
    };

    init = () => {
        this.handleOpen();
        this.handleClose();
    };
}
