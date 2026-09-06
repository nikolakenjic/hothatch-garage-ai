import BaseService from '@/lib/api/base.service';
import type {AxiosRequestConfig} from 'axios';
import {
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    ResendVerificationInput,
    ResetPasswordInput,
} from '@/lib/validations/auth';
import {
    LoginResponse,
    LogoutResponse,
    MeResponse,
    RegisterResponse,
    VerifyEmailResponse,
} from '@/types/auth';

type AuthMessageResponse = {
    message: string;
};

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

    static async verifyEmail(token: string): Promise<VerifyEmailResponse> {
        return BaseService.create<VerifyEmailResponse>(
            `${this.ENDPOINT}/verify-email`,
            {token},
        );
    }

    static async resendVerification(
        data: ResendVerificationInput,
    ): Promise<AuthMessageResponse> {
        return BaseService.create<AuthMessageResponse>(
            `${this.ENDPOINT}/resend-verification`,
            data,
        );
    }

    static async forgotPassword(
        data: ForgotPasswordInput,
    ): Promise<AuthMessageResponse> {
        return BaseService.create<AuthMessageResponse>(
            `${this.ENDPOINT}/forgot-password`,
            data,
        );
    }

    static async resetPassword(
        token: string,
        data: ResetPasswordInput,
    ): Promise<AuthMessageResponse> {
        return BaseService.create<AuthMessageResponse>(
            `${this.ENDPOINT}/reset-password`,
            {
                token,
                newPassword: data.password,
            },
        );
    }
}
