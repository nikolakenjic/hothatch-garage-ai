import BaseService from '@/lib/api/base.service';
import type {AxiosRequestConfig} from 'axios';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import {
    LoginResponse,
    LogoutResponse,
    MeResponse,
    RegisterResponse,
} from '@/types/auth';

export default class AuthService {
    static readonly ENDPOINT = '/auth';

    static async login(data: LoginInput): Promise<LoginResponse> {
        return BaseService.create<LoginResponse>(
            `${this.ENDPOINT}/login`,
            data,
        );
    }

    static async register(data: RegisterInput): Promise<RegisterResponse> {
        return BaseService.create<RegisterResponse>(
            `${this.ENDPOINT}/register`,
            data,
        );
    }

    static async getMe(config?: AxiosRequestConfig): Promise<MeResponse> {
        return BaseService.get<MeResponse>(`${this.ENDPOINT}/me`, config);
    }

    static async logout(): Promise<LogoutResponse> {
        return BaseService.create<LogoutResponse>(
            `${this.ENDPOINT}/logout`,
            {},
        );
    }
}
