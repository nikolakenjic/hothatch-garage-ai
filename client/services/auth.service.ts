import BaseService from '@/lib/api/base.service';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import {AuthResponse} from '@/types/auth';

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
