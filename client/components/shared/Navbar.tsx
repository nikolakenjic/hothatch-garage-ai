'use client';

import Link from 'next/link';
import {useTheme} from 'next-themes';
import {Moon, Sun} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useAuth} from '@/context/AuthContext';

export default function Navbar() {
    const {setTheme} = useTheme();
    const {user, logout} = useAuth();

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#070707]/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <Link
                    href="/garage"
                    className="font-heading text-xl font-black tracking-tight transition-colors hover:text-red-600 dark:hover:text-red-500"
                >
                    HotHatch Garage
                </Link>

                <div className="flex items-center gap-3">
                    {/* User */}
                    {user && (
                        <span className="max-w-[140px] truncate text-sm text-zinc-600 dark:text-zinc-400">
                            {user.email}
                        </span>
                    )}

                    {/* Theme switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="relative border-zinc-200 transition-all hover:border-red-300 dark:border-white/10"
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="border-zinc-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"
                        >
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                Light
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                Dark
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setTheme('system')}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Logout */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="border-zinc-200 font-semibold transition-all hover:border-red-300 hover:text-red-600 dark:border-white/10 dark:hover:text-red-500"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
}
