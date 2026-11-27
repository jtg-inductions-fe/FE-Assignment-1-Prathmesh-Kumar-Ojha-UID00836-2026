/**
 * Bootstraps the application styles, navbar, and testimonial carousel behavior after the DOM is ready.
 */
import '@/styles/main.scss';
import { Navbar } from '@/script/components/navbar';
import { Carousel } from '@/script/components/carousel';
import { Footer } from '@/script/components/footer';

/**
 * Initializes UI components once the document has finished loading.
 */
document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
    navbar.init();

    const carousel = new Carousel();
    carousel.init();

    const footer = new Footer();
    footer.init();
});
