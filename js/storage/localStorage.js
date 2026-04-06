class LocalStorageService {
    constructor() {
        this.storage = window.localStorage;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.get('app_settings')) {
            this.set('app_settings', { theme: 'light', cacheDuration: 3600000 });
        }
    }

    set(key, value) {
        try {
            const item = { value, timestamp: new Date().getTime() };
            this.storage.setItem(key, JSON.stringify(item));
            return true;
        } catch (e) { return false; }
    }

    get(key, defaultValue = null, maxAge = null) {
        try {
            const item = this.storage.getItem(key);
            if (!item) return defaultValue;
            const parsed = JSON.parse(item);
            if (maxAge && (new Date().getTime() - parsed.timestamp > maxAge)) {
                this.remove(key);
                return defaultValue;
            }
            return parsed.value;
        } catch (e) { return defaultValue; }
    }

    remove(key) { this.storage.removeItem(key); }

    clearExpired() {
        const duration = this.get('app_settings')?.cacheDuration || 3600000;
        Object.keys(this.storage).forEach(key => this.get(key, null, duration));
    }
}

export default LocalStorageService;