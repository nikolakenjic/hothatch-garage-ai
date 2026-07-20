import api from '@/lib/axios';

export default class BaseService {
    static async get<T>(endpoint: string): Promise<T> {
        const response = await api.get(endpoint);
        return response.data;
    }

    static async create<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await api.post(endpoint, body);
        return response.data;
    }

    static async update<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await api.patch(endpoint, body);
        return response.data;
    }

    static async remove<T>(endpoint: string): Promise<T> {
        const response = await api.delete(endpoint);
        return response.data;
    }
}
