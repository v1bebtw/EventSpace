export const parseJSON = (jsonString) => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parsing error:', error);
        return null;
    }
};

export const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Неверная дата';
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (error) {
        return 'Ошибка даты';
    }
};

export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

export const generateId = (prefix = '') => {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
};