'use client';

import {createContext, useContext, useEffect, useRef, useState} from 'react';
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
    const authVersion = useRef(0);

    useEffect(() => {
        const version = authVersion.current;
        let active = true;

        const restoreUser = async () => {
            try {
                const response = await AuthService.getClientMe();

                if (active && version === authVersion.current) {
                    setUser(response.user);
                }
            } catch (error) {
                if (active && version === authVersion.current) {
                    if (!isUnauthorizedError(error)) {
                        console.error(
                            'Failed to restore authenticated user:',
                            error,
                        );
                    }

                    setUser(null);
                }
            } finally {
                if (active && version === authVersion.current) {
                    setIsLoading(false);
                }
            }
        };

        void restoreUser();

        return () => {
            active = false;
        };
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

        authVersion.current += 1;
        setUser(response.user);
        setIsLoading(false);

        toast.success('Welcome back!');
        router.replace('/garage');
    };

    const updateUser = (updatedUser: AuthUser) => {
        authVersion.current += 1;
        setUser(updatedUser);
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } finally {
            authVersion.current += 1;
            setUser(null);
            setIsLoading(false);
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
