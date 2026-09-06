'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {isUnauthorizedError} from '@/lib/errors';

import {AuthUser} from '@/types/auth';
import {LoginInput, RegisterInput} from '@/lib/validations/auth';
import AuthService from '@/services/auth.service';

type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: AuthUser) => void;
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
                setUser(response.user);
            } catch (error) {
                if (isUnauthorizedError(error)) {
                    setUser(null);
                    return;
                }

                console.error('Failed to restore authenticated user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        void restoreUser();
    }, []);

    const register = async (data: RegisterInput) => {
        const response = await AuthService.register(data);

        if (response.verificationEmailSent) {
            toast.success(
                'Account created. Check your email to verify your account.',
            );
        } else {
            toast.warning(
                'Account created, but the verification email could not be sent. You can request a new one.',
            );
        }

        router.replace('/login');
    };

    const login = async (data: LoginInput) => {
        const response = await AuthService.login(data);

        setUser(response.user);
        toast.success('Welcome back!');
        router.replace('/garage');
    };

    const updateUser = (updatedUser: AuthUser) => {
        setUser(updatedUser);
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
            value={{user, isLoading, login, register, updateUser, logout}}
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
