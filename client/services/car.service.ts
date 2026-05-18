import api from '@/lib/axios';

export const getCarsService = async (token: string) => {
    const response = await api.get('/cars', {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.cars;
};
