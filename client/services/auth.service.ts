import BaseService from '@/lib/api/base.service';
import api from '@/lib/axios';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import {AuthResponse} from '@/types/auth';

// export const loginService = async (data: LoginInput) => {
//     const response = await api.post('/auth/login', data);
//     return response.data;
// };

// export const registerService = async (data: RegisterInput) => {
//     const response = await api.post('/auth/register', data);
//     return response.data;
// };

export default class AuthService {
    static readonly ENDPOINT = '/auth';

    static async login(data: LoginInput): Promise<AuthResponse> {
        return BaseService.create<AuthResponse>(`${this.ENDPOINT}/login`, data);
    }

    static async register(data: RegisterInput): Promise<AuthResponse> {
        return BaseService.create<AuthResponse>(
            `${this.ENDPOINT}/register`,
            data,
        );
    }
}
