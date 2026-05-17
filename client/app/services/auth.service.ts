import api from '@/lib/axios';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';

export const loginService = async (data: LoginInput) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const registerService = async (data: RegisterInput) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};
