import { animate } from 'motion';

const DEALS_STORAGE_KEY = 'travlog_special_deals';
const AVAILED_STORAGE_KEY = 'travlog_availed_deals';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class Modal {
    constructor() {
        this.openLink = document.querySelector('.navbar__link--deals');
        this.modal = document.querySelector('.deals');
        this.closeButton = document.querySelector('.deals__close');
        this.heading = document.querySelector('.deals__heading');
        this.desc = document.querySelector('.deals__desc');
        this.wheelContainer = document.querySelector('.deals__wheel');
        this.pointer = document.querySelector('.deals__wheel-pointer');
        this.wheel = document.querySelector('.deals__wheel-spinner--loaded');
        this.prizeElements = Array.from(
            document.querySelectorAll('.deals__wheel-prize'),
        );
        this.winSection = document.querySelector('.deals__win');
        this.winPrizeTemplate = document.querySelector('.deals__win-prize');
        this.winName = document.querySelector('.deals__win-name');
        this.winDuration = document.querySelector('.deals__win-duration');
        this.winCode = document.querySelector('.deals__win-code');
        this.copyButton = document.querySelector('.deals__win-copy');
        this.unlockedList = document.querySelector('.deals__unlocked');
        this.toggleButtonText = document.querySelector('.deals__button-text');
        this.unlockedIndicator = document.querySelector(
            '.deals__button-indicator',
        );

        this.dealsUrl =
            'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';
        this.deals = [];
        this.wheelDeals = [];

        this.spinAnimation = null;
        this.winTimeout = null;
        this.copyTimeout = null;
        this.activeCopyButton = null;
        this.isUnlockedView = false;
        this.currentRotation = Number(this.wheel?.dataset.rotation) || 0;
    }

    getCachedDeals = () => {
        try {
            const raw = localStorage.getItem(DEALS_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    setLoading = (isLoading) => {
        this.wheelContainer?.classList.toggle(
            'deals__wheel--loading',
            isLoading,
        );
    };

    fetchDealsFromApi = () => {
        return fetch(this.dealsUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    this.deals = data;
                    try {
                        localStorage.setItem(
                            DEALS_STORAGE_KEY,
                            JSON.stringify(data),
                        );
                    } catch {
                        localStorage.removeItem(DEALS_STORAGE_KEY);
                    }
                }
                return this.deals;
            })
            .catch(() => this.deals);
    };

    pickRandomDeals = (deals, count = 4) => {
        const shuffled = [...deals];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }; // Fisher-Yates Shuffle algorithm

    getAvailedDeals = () => {
        try {
            const raw = localStorage.getItem(AVAILED_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    getActiveAvailed = () => {
        const now = Date.now();
        return this.getAvailedDeals().filter(
            (entry) => entry.expiresAt == null || entry.expiresAt > now,
        );
    };

    updateUnlockedCount = () => {
        if (!this.unlockedIndicator) return;
        const uniqueActive = new Set(
            this.getActiveAvailed().map((entry) => entry.promoCode),
        );
        this.unlockedIndicator.textContent = String(uniqueActive.size);
    };

    availDeal = (deal) => {
        if (!deal) return null;

        const now = Date.now();
        const expiresAt =
            typeof deal.validFor === 'number'
                ? now + deal.validFor * MS_PER_DAY
                : null;
        const availed = [
            ...this.getAvailedDeals(),
            { ...deal, availedAt: now, expiresAt },
        ];

        try {
            localStorage.setItem(AVAILED_STORAGE_KEY, JSON.stringify(availed));
        } catch {
            localStorage.removeItem(AVAILED_STORAGE_KEY);
        }

        this.updateUnlockedCount();
        return expiresAt;
    };

    formatRemainingDuration = (expiresAt) => {
        if (expiresAt == null) return 'No expiration';

        const remainingDays = Math.max(
            0,
            Math.ceil((expiresAt - Date.now()) / MS_PER_DAY),
        );
        return `Expires in ${remainingDays}d`;
    };

    renderWheelPrizes = () => {
        this.updateUnlockedCount();
        if (this.deals.length === 0 || this.prizeElements.length === 0) return;

        const availedCodes = new Set(
            this.getActiveAvailed().map((entry) => entry.promoCode),
        );
        const availableDeals = this.deals.filter(
            (deal) => !availedCodes.has(deal.promoCode),
        );

        this.wheelDeals = this.pickRandomDeals(
            availableDeals,
            this.prizeElements.length,
        );

        this.prizeElements.forEach((prizeEl, index) => {
            const deal = this.wheelDeals[index];
            const labelEl = prizeEl.querySelector('span');
            if (!labelEl) return;

            if (deal) {
                labelEl.textContent = deal.label;
                prizeEl.dataset.dealIndex = String(index);
            } else {
                labelEl.textContent = 'No offers';
                delete prizeEl.dataset.dealIndex;
            }
        });
    };

    hideWinDetails = () => {
        clearTimeout(this.winTimeout);
        this.winTimeout = null;
        this.resetCopyIndicator();
        this.winSection?.classList.remove('deals__win--visible');
    };

    updateWinDetails = (deal, expiresAt) => {
        if (!deal) return;

        clearTimeout(this.winTimeout);

        if (this.winName) {
            this.winName.textContent = deal.label;
        }
        if (this.winDuration) {
            this.winDuration.textContent =
                this.formatRemainingDuration(expiresAt);
        }
        if (this.winCode) {
            this.winCode.textContent = deal.promoCode;
        }

        this.winSection?.classList.add('deals__win--visible');
        this.winTimeout = setTimeout(() => {
            this.hideWinDetails();
        }, 5000);
    };

    loadDeals = () => {
        if (this.deals.length > 0) {
            this.renderWheelPrizes();
            this.setLoading(false);
            return this.fetchDealsFromApi();
        } // Adds deals to localStorage in bg if deals are already loaded.

        const cached = this.getCachedDeals();

        if (cached.length > 0) {
            this.deals = cached;
            this.renderWheelPrizes();
            this.setLoading(false);
            return this.fetchDealsFromApi();
        }

        this.setLoading(true);
        return this.fetchDealsFromApi()
            .then(() => {
                this.renderWheelPrizes();
            })
            .finally(() => {
                this.setLoading(false);
            });
    };

    handleClose = (event) => {
        const closeButton = event.target.closest('.deals__close');
        if (!closeButton || this.spinAnimation) return;
        this.modal.close();
    };

    getWinner = () => {
        if (!this.pointer) return null;

        const rect = this.pointer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const probeY = rect.bottom + 16;

        for (const offsetX of [0, 6, -6]) {
            const elements = document.elementsFromPoint(
                centerX + offsetX,
                probeY,
            );
            const prize = elements
                .map((el) => el.closest('.deals__wheel-prize'))
                .find(Boolean);

            if (prize) return prize;
        }

        return null;
    };

    handleSpin = (event) => {
        const spinButton = event.target.closest('.deals__wheel-center');
        if (!spinButton || this.spinAnimation) return;

        this.renderWheelPrizes();
        if (this.wheelDeals.length === 0) return;

        const randomRotation = Math.floor(Math.random() * 360);
        let finalRotation = this.currentRotation + 360 * 2.5 + randomRotation;

        const remainder = finalRotation % 90;
        if (remainder < 6 || remainder > 84) {
            finalRotation += 8;
        } // Accounts for grid gaps

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
                    this.hideWinDetails();
                    this.modal.classList.add('deals--spinning');
                    this.wheel.classList.add('deals__wheel-spinner--disabled');
                    this.closeButton.classList.add('deals__close--disabled');
                },
                onComplete: () => {
                    this.modal.classList.remove('deals--spinning');
                    this.wheel.classList.remove(
                        'deals__wheel-spinner--disabled',
                    );
                    this.closeButton.classList.remove('deals__close--disabled');
                    this.spinAnimation = null;

                    const winnerEl = this.getWinner();
                    if (winnerEl) {
                        const { dealIndex } = winnerEl.dataset;
                        const deal =
                            dealIndex !== undefined
                                ? this.wheelDeals[Number(dealIndex)]
                                : null;
                        if (deal) {
                            const expiresAt = this.availDeal(deal);
                            this.updateWinDetails(deal, expiresAt);
                        }
                    }
                },
                onUpdate: () => {
                    const winnerEl = this.getWinner();
                    if (winnerEl) {
                        this.pointer.style.backgroundColor =
                            getComputedStyle(winnerEl).backgroundColor;
                    }
                },
            },
        );
    };

    createCouponCard = (deal) => {
        const isExpired =
            deal.expiresAt != null && deal.expiresAt <= Date.now();
        const card = this.winPrizeTemplate.cloneNode(true);

        card.classList.toggle('deals__win-prize--expired', isExpired);
        card.querySelector('.deals__win-name').textContent = deal.label;
        card.querySelector('.deals__win-duration').textContent = isExpired
            ? 'Deal expired'
            : this.formatRemainingDuration(deal.expiresAt);
        card.querySelector('.deals__win-code').textContent = deal.promoCode;

        const copyBtn = card.querySelector('.deals__win-copy');
        copyBtn.disabled = isExpired;
        copyBtn.classList.remove('deals__win-copy--copied');
        const icon = copyBtn.querySelector('i');
        if (icon) {
            icon.className = 'fa-regular fa-clone';
        }

        return card;
    };

    renderUnlockedDeals = () => {
        if (!this.unlockedList) return;

        const availed = this.getAvailedDeals();
        this.unlockedList.replaceChildren();

        if (availed.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'deals__unlocked-empty';
            empty.textContent = 'No deals unlocked yet.';
            this.unlockedList.appendChild(empty);
            return;
        }

        const cards = [...availed]
            .reverse()
            .map((deal) => this.createCouponCard(deal));
        this.unlockedList.append(...cards);
    };

    setUnlockedView = (isUnlocked) => {
        this.isUnlockedView = isUnlocked;
        this.modal?.classList.toggle('deals--unlocked', isUnlocked);

        if (this.heading) {
            this.heading.textContent = isUnlocked
                ? 'Unlocked Deals'
                : 'Spin & Win!';
        }
        if (this.desc) {
            this.desc.textContent = isUnlocked
                ? 'All the deals you’ve unlocked yet!'
                : 'Tap the center of the wheel to spin';
        }
        if (this.toggleButtonText) {
            this.toggleButtonText.textContent = isUnlocked
                ? 'Go Back'
                : 'View All Unlocked Deals';
        }

        this.resetCopyIndicator();

        if (isUnlocked) {
            this.hideWinDetails();
            this.renderUnlockedDeals();
        } else {
            this.renderWheelPrizes();
        }
    };

    handleToggleView = (event) => {
        const button = event.target.closest('.deals__button');
        if (!button || this.spinAnimation) return;

        this.setUnlockedView(!this.isUnlockedView);
    };

    resetCopyIndicator = () => {
        clearTimeout(this.copyTimeout);
        this.copyTimeout = null;
        if (!this.activeCopyButton) return;

        this.activeCopyButton.classList.remove('deals__win-copy--copied');
        const icon = this.activeCopyButton.querySelector('i');
        if (icon) {
            icon.className = 'fa-regular fa-clone';
        }
        this.activeCopyButton = null;
    };

    handleCopy = (event) => {
        const copyButton = event.target.closest('.deals__win-copy');
        if (!copyButton || copyButton.disabled) return;

        const code = copyButton
            .closest('.deals__win-coupon')
            ?.querySelector('.deals__win-code')
            ?.textContent?.trim();
        if (!code) return;

        navigator.clipboard
            ?.writeText(code)
            .then(() => {
                this.resetCopyIndicator();
                this.activeCopyButton = copyButton;
                copyButton.classList.add('deals__win-copy--copied');
                const icon = copyButton.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-check';
                }
                this.copyTimeout = setTimeout(() => {
                    this.resetCopyIndicator();
                }, 1500);
            })
            .catch(() => {});
    };

    handleCancel = (event) => {
        if (this.spinAnimation) {
            event.preventDefault();
        }
    };

    resetModal = () => {
        if (this.isUnlockedView) {
            this.setUnlockedView(false);
        }
        this.hideWinDetails();
        this.spinAnimation?.stop();
        this.spinAnimation = null;

        this.currentRotation = 0;
        this.wheel.dataset.rotation = '0';
        this.pointer.style.backgroundColor = '';

        animate(this.wheel, { rotate: 0 }, { duration: 0 });

        this.modal.classList.remove('deals--spinning');
        this.wheel.classList.remove('deals__wheel-spinner--disabled');
        this.closeButton.classList.remove('deals__close--disabled');
    };

    init = () => {
        if (!this.modal) return;

        this.updateUnlockedCount();
        this.openLink?.addEventListener('click', this.loadDeals);

        this.modal.addEventListener('click', (event) => {
            this.handleClose(event);
            this.handleSpin(event);
            this.handleCopy(event);
            this.handleToggleView(event);
        });

        this.modal.addEventListener('cancel', this.handleCancel);
        this.modal.addEventListener('close', this.resetModal);
    };
}
