import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

const api = axios.create({
    baseURL,
    withCredentials: true,
});

const refreshApi = axios.create({
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (typeof window === 'undefined') {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest?._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        await refreshApi.post('/api/auth/refresh');

        return api(originalRequest);
    },
);

export default api;
