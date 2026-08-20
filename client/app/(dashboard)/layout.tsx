import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {isAxiosError} from 'axios';
import {getServerAuthenticatedUser} from '@/lib/auth/server-auth';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const requestHeaders = await headers();
    const currentPath = requestHeaders.get('x-current-path') ?? '/garage';

    try {
        await getServerAuthenticatedUser();
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            redirect(
                `/api/auth/refresh?returnTo=${encodeURIComponent(currentPath)}`,
            );
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
