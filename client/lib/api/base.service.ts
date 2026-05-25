import api from '@/lib/axios';

export default class BaseService {
    static async fetch<T>(endpoint: string, token?: string): Promise<T> {
        const response = await api.get(endpoint, {
            headers: token ? {Authorization: `Bearer ${token}`} : {},
        });
        return response.data;
    }

    static async create<T>(
        endpoint: string,
        body: unknown,
        token?: string,
    ): Promise<T> {
        const response = await api.post(endpoint, body, {
            headers: token ? {Authorization: `Bearer ${token}`} : {},
        });
        return response.data;
    }

    static async update<T>(
        endpoint: string,
        body: unknown,
        token?: string,
    ): Promise<T> {
        const response = await api.patch(endpoint, body, {
            headers: token ? {Authorization: `Bearer ${token}`} : {},
        });
        return response.data;
    }

    static async remove<T>(endpoint: string, token?: string): Promise<T> {
        const response = await api.delete(endpoint, {
            headers: token ? {Authorization: `Bearer ${token}`} : {},
        });
        return response.data;
    }
}
