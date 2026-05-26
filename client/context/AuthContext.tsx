'use client';

import {createContext, useContext, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {getAuthToken, setAuthCookie} from '@/lib/cookies';
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

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window === 'undefined') return null;
        const token = getAuthToken();
        if (!token) return null;
        return jwtDecode<User>(token);
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = async (data: LoginInput) => {
        const response = await AuthService.login(data);
        setAuthCookie(response.token);
        setUser(jwtDecode<User>(response.token));
        toast.success('Welcome back!');
        router.replace('/garage');
    };

    const register = async (data: RegisterInput) => {
        const response = await AuthService.register(data);
        setAuthCookie(response.token);
        setUser(jwtDecode<User>(response.token));
        toast.success('Account created!');
        router.replace('/garage');
    };

    const logout = () => {
        document.cookie =
            'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
