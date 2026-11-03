import '../styles/main.scss';
import { Navbar } from './components/navbar';

document.addEventListener('DOMContentLoaded', () => {
    const navbar = new Navbar();
    navbar.init();
});
