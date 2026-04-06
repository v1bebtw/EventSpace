class SessionStorageService {
    constructor() {
        this.storage = window.sessionStorage;
    }

    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            this.storage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = this.storage.getItem(key);
            if (!item) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}

export default SessionStorageService;