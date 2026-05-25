export type AuthResponse = {
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
};
