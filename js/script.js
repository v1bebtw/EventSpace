document.addEventListener('DOMContentLoaded', function() {

    const burger = document.getElementById('burger');
    const nav = document.querySelector('.header__nav');

    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
});