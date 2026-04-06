export const API_CONFIG = {

    ticketmaster: {
        url: 'https://app.ticketmaster.com/discovery/v2',
        apiKey: '4ZVaCB4uQOMJ3pUPpaPJxhKyAaiAStfO',
        endpoint: '/events.json'
    },

    eventbrite: {
        url: 'https://www.eventbriteapi.com/v3',
        apiKey: 'ETOHLLH2C5HPFB5G3TQ4',
        endpoint: '/categories/'
    },

    internal: {
        url: 'https://jsonplaceholder.typicode.com',
        endpoint: '/posts'
    }
};

export const CACHE_KEY = 'eventspace_main_cache';