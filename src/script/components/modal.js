export class Modal {
    constructor() {
        this.modal = document.querySelector('.deals');
    }

    handleOpen = () => {
        document
            .querySelector('.navbar__link--deals')
            .addEventListener('click', () => {
                setTimeout(() => {
                    this.modal.show();
                }, 450);
            });
    };

    init = () => {
        this.handleOpen();
    };
}
