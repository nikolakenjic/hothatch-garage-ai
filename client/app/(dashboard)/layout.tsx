import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {getServerAuthenticatedUser} from '@/lib/auth/server-auth';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import {isUnauthorizedError} from '@/lib/errors';

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
        if (isUnauthorizedError(error)) {
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
