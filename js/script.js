import { validateEmail, showError, clearErrors } from './utils/helpers.js';
import ApiService from './api/apiService.js';
import LocalStorageService from './storage/localStorage.js';
import SessionStorageService from './storage/sessionStorage.js';
import { formatDate, truncateText } from './utils/dataParser.js';
import { API_CONFIG, CACHE_KEY } from './api/config.js';

class APIIntegrationManager {
    constructor() {
        this.api = new ApiService();
        this.storage = new LocalStorageService();
        this.sessionStorage = new SessionStorageService();
        this.init();
    }

    async init() {

        if (!this.sessionStorage.get('session_active')) 
        {
            this.sessionStorage.set('session_active', true);
            console.log('Лог сессии: Новая сессия инициализирована в SessionStorage.');
        } 
        else 
        {
            console.log('Лог сессии: Продолжение текущей сессии.');
        }

        const cachedData = this.storage.get(CACHE_KEY);
        if (cachedData) {
            console.log('Данные найдены в LocalStorage.');
            this.render(cachedData, true);
        }

        if (navigator.onLine) {
            await this.syncAll();
        } else {
            console.warn('Браузер находится в оффлайн-режиме. Синхронизация невозможна.');
        }

        document.getElementById('refresh-btn')?.addEventListener('click', () => this.syncAll());
    }

    async syncAll() {
        this.showLoading(true);
        console.log('Попытка синхронизации...');
        if (!navigator.onLine) {
            console.warn('Интернета нет. Загружаю данные из LocalStorage...');
            const cached = this.storage.get(CACHE_KEY);
            if (cached) {
                this.render(cached, true);
            }
            this.showLoading(false);
            return;
        }
        
        try {
            const results = await Promise.allSettled([
                this.api.get(API_CONFIG.ticketmaster.url, API_CONFIG.ticketmaster.endpoint, { size: 2 }, 'query', API_CONFIG.ticketmaster.apiKey),
                this.api.get(API_CONFIG.eventbrite.url, API_CONFIG.eventbrite.endpoint, {}, 'bearer', API_CONFIG.eventbrite.apiKey),
                this.api.get(API_CONFIG.internal.url, API_CONFIG.internal.endpoint)
            ]);

            let aggregated = [];

            results.forEach((res, index) => {
                if (res.status === 'fulfilled' && res.value) {
                    const data = res.value;
                    if (index === 0 && data._embedded) {
                        data._embedded.events.forEach(e => aggregated.push({ name: e.name, date: e.dates.start.localDate, src: 'Ticketmaster' }));
                    } else if (index === 1 && data.categories) {
                        data.categories.slice(0, 2).forEach(cat => aggregated.push({ name: cat.name, date: new Date().toISOString(), src: 'Eventbrite' }));
                    } else if (index === 2) {
                        data.slice(0, 2).forEach(p => aggregated.push({ name: p.title, date: new Date().toISOString(), src: 'EventSpace' }));
                    }
                }
            });

            if (aggregated.length > 0) {
                this.storage.set(CACHE_KEY, aggregated);
                this.render(aggregated, false);
                console.log('Синхронизация успешна. Кэш обновлен.');
            }
        } catch (error) {
            console.error('Ошибка при запросе:', error);
        } finally {
            this.showLoading(false);
        }
    }

    render(data, isCached) {
        const container = document.getElementById('api-data-container');
        if (!container) return;

        container.innerHTML = data.map(item => `
            <div class="speaker-card" style="border: 2px solid #93b5f7; padding: 20px; border-radius: 20px; background: #fff; color: #000; text-align: left; position: relative;">
                ${isCached ? '<span style="position:absolute; top:10px; right:10px; font-size:8px; color:orange;">OFFLINE COPY</span>' : ''}
                <h4 style="margin-bottom: 10px; font-family: var(--font-header);">${truncateText(item.name, 40)}</h4>
                <p style="font-size: 14px; margin-bottom: 10px;">Scheduled: ${formatDate(item.date)}</p>
                <div style="background: #f0f4ff; display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 10px; color: blue; font-weight: bold;">
                    Source: ${item.src}
                </div>
            </div>
        `).join('');
    }

    showLoading(show) {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = show ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new APIIntegrationManager();
    
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

    const deadline = new Date('May 31, 2026 09:00:00').getTime();
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
        for (let i = 1; i <= 30; i++) {
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