export class Modal {
    constructor() {
        this.modal = document.querySelector('.deals');
    }

    init = () => {
        document
            .querySelector('.navbar__link--deals')
            .addEventListener('click', () => {
                this.modal.showModal();
            });
    };
}
