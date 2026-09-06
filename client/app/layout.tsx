import type {Metadata} from 'next';
import {Geist, Space_Grotesk} from 'next/font/google';
import './globals.css';

import AppProviders from '@/components/providers/AppProviders';

import {Toaster} from '@/components/ui/sonner';

const geist = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'HotHatch Garage AI',
    description: 'Your personal hot hatch companion',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geist.variable} ${spaceGrotesk.variable} h-full antialiased`}
        >
            <body
                suppressHydrationWarning
                className="flex min-h-full flex-col font-sans"
            >
                <AppProviders>
                    {children}
                    <Toaster />
                </AppProviders>
            </body>
        </html>
    );
}
