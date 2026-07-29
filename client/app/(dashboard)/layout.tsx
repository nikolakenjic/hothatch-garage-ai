import type {ReactNode} from 'react';

import DashboardNavbar from '@/components/layout/DashboardNavbar';

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({children}: DashboardLayoutProps) {
    return (
        <>
            <DashboardNavbar />
            {children}
        </>
    );
}
