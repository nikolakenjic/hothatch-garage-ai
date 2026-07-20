export type AuthUser = {
    _id: string;
    email: string;
};

export type LoginResponse = {
    message: string;
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
