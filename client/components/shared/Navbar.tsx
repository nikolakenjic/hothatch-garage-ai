'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie =
            'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login');
    };

    return (
        <nav className="border-b px-6 py-3 flex items-center justify-between">
            <Link href="/garage" className="text-xl font-bold">
                HotHatch 🔥
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
            </Button>
        </nav>
    );
}
