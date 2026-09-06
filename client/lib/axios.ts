import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';

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

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
    await refreshApi.post('/api/auth/refresh');
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (typeof window === 'undefined') {
            return Promise.reject(error);
        }

        const originalRequest = error.config as
            | RetryableRequestConfig
            | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;

            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    },
);

export default api;
