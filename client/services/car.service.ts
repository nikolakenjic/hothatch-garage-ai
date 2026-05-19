import api from '@/lib/axios';
import {Car, CreateCarInput} from '@/types/car';

export const getCarsService = async (token: string): Promise<Car[]> => {
    const response = await api.get('/cars', {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.cars;
};

export const createCarService = async (
    token: string,
    data: CreateCarInput,
): Promise<Car> => {
    const response = await api.post('/cars', data, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.car;
};
