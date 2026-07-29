export type AuthUser = {
    id: string;
    email: string;
};

export type LoginResponse = {
    message: string;
    user: AuthUser;
};

export type RegisterResponse = {
    message: string;
    verificationToken: string;
    user: AuthUser;
};

export type MeResponse = {
    status: string;
    data: {
        user: AuthUser;
    };
};

export type LogoutResponse = {
    message: string;
};
