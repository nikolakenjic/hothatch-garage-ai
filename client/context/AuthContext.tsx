'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import {AuthUser} from '@/types/auth';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import AuthService from '@/services/auth.service';

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreUser = async () => {
            try {
                const response = await AuthService.getMe();
                setUser(response.data.user);
            } catch (error) {
                console.error('Failed to restore authenticated user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        void restoreUser();
    }, []);

    const login = async (data: LoginInput) => {
        const response = await AuthService.login(data);

        setUser(response.user);
        toast.success('Welcome back!');
        router.replace('/garage');
    };

    const register = async (data: RegisterInput) => {
        await AuthService.register(data);
        toast.success('Account created. Please log in.');
        router.replace('/login');
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } finally {
            setUser(null);
            router.replace('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{user, isLoading, login, register, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
