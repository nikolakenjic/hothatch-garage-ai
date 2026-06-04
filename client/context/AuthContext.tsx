'use client';

import {createContext, useContext, useState} from 'react';
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
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window === 'undefined') return null;
        const token = getAuthToken();
        if (!token) return null;

        // jwtDecode does not verify signature - validation happens on server via middleware
        const decoded = jwtDecode<DecodedToken>(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            removeAuthCookie();
            return null;
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
        };
    });
    const [isLoading, setIsLoading] = useState(false);

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
