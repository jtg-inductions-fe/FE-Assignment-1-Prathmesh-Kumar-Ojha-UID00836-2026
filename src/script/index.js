/**
 * Bootstraps the application styles and navbar behavior after the DOM is ready.
 */
import '../styles/main.scss';
import { Navbar } from './components/navbar';

/**
 * Initializes the navbar once the document has finished loading.
 */
document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
    navbar.init();
});
