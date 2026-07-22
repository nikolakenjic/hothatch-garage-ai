import api from '@/lib/axios';
import type {AxiosRequestConfig} from 'axios';

export default class BaseService {
    static async get<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        const response = await api.get<T>(endpoint, config);
        return response.data;
    }

    static async create<T>(
        endpoint: string,
        body: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        const response = await api.post<T>(endpoint, body, config);
        return response.data;
    }

    static async update<T>(
        endpoint: string,
        body: unknown,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        const response = await api.patch<T>(endpoint, body, config);
        return response.data;
    }

    static async remove<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        const response = await api.delete<T>(endpoint, config);
        return response.data;
    }
}
