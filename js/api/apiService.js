export default class ApiService {
    async get(baseUrl, endpoint, params = {}, authType = 'none', key = '') {
        try {
            let url = `${baseUrl}${endpoint}`;

            if (authType === 'query') {
                params.apikey = key;
            }

            const queryParams = new URLSearchParams(params).toString();
            if (queryParams) url += `?${queryParams}`;

            const options = { method: 'GET', headers: {} };

            if (authType === 'bearer') {
                options.headers['Authorization'] = `Bearer ${key}`;
            }

            const response = await fetch(url, options);
            
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Ошибка запроса к ${baseUrl}:`, error);
            throw error;
        }
    }
}