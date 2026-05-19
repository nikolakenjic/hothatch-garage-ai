import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';

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
                <Navbar />
                {children}
            </body>
        </html>
    );
}
