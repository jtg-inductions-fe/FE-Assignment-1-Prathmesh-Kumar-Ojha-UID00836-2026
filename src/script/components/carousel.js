import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';

import data from '@/data/testimonial.json';

/**
 * Provides responsive carousel for mobile, tablet, and desktop layouts.
 * Handles rendering testimonials from data and initializing Swiper carousel.
 */
export class Carousel {
    /**
     * Creates the Carousel controller and caches DOM references.
     */
    constructor() {
        this.data = data;
        this.wrapper = document.getElementById('testimonial-slider-wrapper');
        this.swiperInstance = null;
    }

    /**
     * Dynamically renders testimonial cards from JSON into the Swiper wrapper.
     */
    renderTestimonials = () => {
        if (!this.wrapper) return;

        this.wrapper.innerHTML = this.data
            .map((item) => {
                const starsHtml = Array.from({ length: 5 }, (_, i) => {
                    const isSolid = i < item.rating;
                    return `<i class="${isSolid ? 'fa-solid' : 'fa-regular'} fa-star" aria-hidden="true"></i>`;
                }).join('');

                return `
                    <div class="testimonial__card swiper-slide">
                        <div class="testimonial__profile">
                            <img
                                class="testimonial__profile-image"
                                src="${item.profilePicture}"
                                alt="${item.user.name}'s profile picture"
                            />
                        </div>
                        <div class="testimonial__info">
                            <div class="testimonial__info-text">
                                <h5 class="testimonial__info-text--content testimonial__info-text--name">
                                    ${item.user.name}
                                </h5>
                                <h6 class="testimonial__info-text--content testimonial__info-text--type">
                                    / ${item.user.type}
                                </h6>
                            </div>
                            <div class="testimonial__info-rating" aria-label="${item.rating} out of 5 stars">
                                ${starsHtml}
                            </div>
                        </div>
                        <div class="testimonial__desc">
                            <p class="testimonial__desc-content">
                                ${item.desc}
                            </p>
                        </div>
                    </div>
                `;
            })
            .join('');
    };

    /**
     * Initializes Swiper with navigation, pagination, and accessibility support.
     */
    initSwiper = () => {
        const sliderElement = document.querySelector('.testimonial__slider');
        if (!sliderElement) return;

        this.swiperInstance = new Swiper(sliderElement, {
            modules: [Navigation, Pagination, Keyboard, A11y],
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            speed: 400,
            grabCursor: true,
            navigation: {
                prevEl: '.testimonial__pointers--left',
                nextEl: '.testimonial__pointers--right',
            },
            pagination: {
                el: '.testimonial__indicator',
                clickable: true,
                bulletClass: 'testimonial__indicator--bullet',
                bulletActiveClass: 'testimonial__indicator--active',
                renderBullet: (index, className) => {
                    return `<i class="fa-solid fa-circle ${className}" aria-label="Go to testimonial ${index + 1}"></i>`;
                },
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            a11y: {
                prevSlideMessage: 'Previous testimonial',
                nextSlideMessage: 'Next testimonial',
            },
        });
    };

    /**
     * Renders slides and initializes the Swiper carousel.
     */
    init = () => {
        this.renderTestimonials();
        this.initSwiper();
    };
}
