import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';

const backendBaseURL = process.env.NEXT_PUBLIC_API_URL;

if (!backendBaseURL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

const isBrowser = typeof window !== 'undefined';

const api = axios.create({
    baseURL: isBrowser ? '/api/backend' : backendBaseURL,
    withCredentials: true,
});

export const sameOriginApi = axios.create({
    withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
    await sameOriginApi.post('/api/auth/refresh');
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
