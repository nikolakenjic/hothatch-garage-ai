'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {getAuthToken, removeAuthCookie, setAuthCookie} from '@/lib/cookies';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import {useRouter} from 'next/navigation';
import AuthService from '@/services/auth.service';
import {toast} from 'sonner';

type User = {
    userId: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => void;
};

type DecodedToken = User & {
    exp: number;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreUser = () => {
            try {
                const token = getAuthToken();

                if (!token) {
                    setUser(null);
                    return;
                }

                const decoded = jwtDecode<DecodedToken>(token);

                if (decoded.exp * 1000 <= Date.now()) {
                    removeAuthCookie();
                    setUser(null);
                    return;
                }

                setUser({
                    userId: decoded.userId,
                    email: decoded.email,
                });
            } catch (error) {
                console.error('Failed to restore authenticated user:', error);

                removeAuthCookie();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreUser();
    }, []);
    const login = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            const response = await AuthService.login(data);
            setAuthCookie(response.token);
            setUser(jwtDecode<User>(response.token));
            toast.success('Welcome back!');
            router.replace('/garage');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterInput) => {
        setIsLoading(true);
        try {
            const response = await AuthService.register(data);
            setAuthCookie(response.token);
            setUser(jwtDecode<User>(response.token));
            toast.success('Account created!');
            router.replace('/garage');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        removeAuthCookie();
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider
            value={{user, isLoading, login, register, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
