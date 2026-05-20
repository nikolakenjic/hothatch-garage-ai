import api from '@/lib/axios';
import {Modification, CreateModificationInput} from '@/types/modification';

export const getModificationsService = async (
    token: string,
    carId: string,
): Promise<Modification[]> => {
    const response = await api.get(`/modifications/${carId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.modifications;
};

export const createModificationService = async (
    token: string,
    carId: string,
    data: CreateModificationInput,
): Promise<Modification> => {
    const response = await api.post(`/modifications/${carId}`, data, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.modification;
};

export const deleteModificationService = async (
    token: string,
    modId: string,
): Promise<void> => {
    await api.delete(`/modifications/${modId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};
