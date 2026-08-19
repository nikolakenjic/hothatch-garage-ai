import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {isAxiosError} from 'axios';
import {getServerAuthenticatedUser} from '@/lib/auth/server-auth';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    try {
        await getServerAuthenticatedUser();
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            redirect('/login');
        }

        throw error;
    }

    return (
        <>
            <DashboardNavbar />
            {children}
        </>
    );
}
