'use client';

import {createContext, useContext, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {getAuthToken} from '@/lib/cookies';

type User = {
    userId: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window === 'undefined') return null;
        const token = getAuthToken();
        if (!token) return null;
        return jwtDecode<User>(token);
    });
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AuthContext.Provider value={{user, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
