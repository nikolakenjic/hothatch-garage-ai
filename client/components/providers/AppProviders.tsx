'use client';

import type {ReactNode} from 'react';

import {AuthProvider} from '@/context/AuthContext';

import ThemeProvider from './ThemeProvider';

type AppProvidersProps = {
    children: ReactNode;
};

export default function AppProviders({children}: AppProvidersProps) {
    return (
        <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    );
}
