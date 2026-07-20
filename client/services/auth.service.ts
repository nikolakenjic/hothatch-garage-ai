import BaseService from '@/lib/api/base.service';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import {LoginResponse, MeResponse} from '@/types/auth';

export default class AuthService {
    static readonly ENDPOINT = '/auth';

    static async login(data: LoginInput): Promise<LoginResponse> {
        return BaseService.create<LoginResponse>(
            `${this.ENDPOINT}/login`,
            data,
        );
    }

    static async register(data: RegisterInput) {
        return BaseService.create(`${this.ENDPOINT}/register`, data);
    }

    static async getMe(): Promise<MeResponse> {
        return BaseService.get<MeResponse>(`${this.ENDPOINT}/me`);
    }

    static async logout(): Promise<LoginResponse> {
        return BaseService.create<LoginResponse>(`${this.ENDPOINT}/logout`, {});
    }
}
