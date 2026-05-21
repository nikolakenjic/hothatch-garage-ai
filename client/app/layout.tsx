import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import ThemeProvider from '@/components/shared/ThemeProvider';
import {AuthProvider} from '@/context/AuthContext';
import {Toaster} from '@/components/ui/sonner';

const geist = Geist({
    variable: '--font-geist-sans',
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
        <html lang="en" className={`${geist.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <AuthProvider>
                        <Navbar />
                        {children}
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
