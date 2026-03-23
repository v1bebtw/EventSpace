import { validateEmail, showError, clearErrors } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', function() {

    const header = document.querySelector('.header');
    const allCards = document.querySelectorAll('.speaker-card');
    const mainContainer = document.getElementById('main');

    console.log('Найдено элементов:', {
        header: header,
        cards: allCards,
        container: mainContainer
    });

    const projectTitle = document.querySelector('.logo__title');
    if (projectTitle) {
        projectTitle.innerHTML = 'EventSpace <span id="header-year">2026</span>';
    }

    const firstCard = document.querySelector('.speaker-card');
    if (firstCard) {

        firstCard.classList.add('card--highlighted');

        firstCard.style.transform = 'scale(1.02)';
        firstCard.style.transition = 'all 0.3s ease';

        Object.assign(firstCard.style, {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '10px',
            borderRadius: '20px'
        });
    }

    const burger = document.getElementById('burger');
    const nav = document.querySelector('.header__nav');
    if (burger) burger.addEventListener('click', () => nav.classList.toggle('active'));

    const modal = document.getElementById('modal-reg');
    const joinBtn = document.querySelector('.hero__btn');
    const closeBtn = document.getElementById('modal-close');
    const regForm = document.getElementById('event-reg-form');

    if (joinBtn) joinBtn.addEventListener('click', () => modal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInp = document.getElementById('user-email');
            clearErrors(emailInp);

            if (validateEmail(emailInp.value)) {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                localStorage.setItem('eventRegistration', JSON.stringify(data));
                
                alert('Success! Data saved to LocalStorage.');
                modal.classList.remove('active');
                console.log('Данные формы:', data);
            } else {
                showError(emailInp, 'Please enter a valid email');
            }
        });
    }

    const deadline = new Date('March 31, 2026 09:00:00').getTime();
    setInterval(() => {
        const diff = deadline - new Date().getTime();
        if (diff > 0) {
            document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById('hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById('minutes').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById('seconds').textContent = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);

    const calendarGrid = document.getElementById('calendar-grid');
    if (calendarGrid) {
        const today = new Date().getDate();
        for (let i = 1; i <= 31; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar__day';
            dayEl.textContent = i;
            
            if (i === today) dayEl.classList.add('today');

            if (i === 31) {
                dayEl.classList.add('event-day');
            }

            calendarGrid.appendChild(dayEl);
        }
    }
    
});