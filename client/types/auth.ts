import {User} from '@/types/user';

export type AuthUser = User;

export type LoginResponse = {
    message: string;
    user: AuthUser;
};

export type RegisterResponse = {
    message: string;
    verificationEmailSent: boolean;
    user: AuthUser;
};

export type MeResponse = {
    message: string;
    user: AuthUser;
};

export type LogoutResponse = {
    message: string;
};
