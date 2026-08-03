'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {usePathname} from 'next/navigation';
import {useTheme} from 'next-themes';
import {
    Bot,
    Car,
    Check,
    ChevronDown,
    LogOut,
    Moon,
    Sun,
    UserRound,
    Settings,
} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useAuth} from '@/context/AuthContext';
import {APP_NAME} from '@/lib/constants';

const navigationItems = [
    {
        label: 'Garage',
        href: '/garage',
        icon: Car,
    },
    {
        label: 'AI Advisor',
        href: '/ai',
        icon: Bot,
    },
];

export default function DashboardNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const {theme, setTheme} = useTheme();
    const {user, logout} = useAuth();

    if (!user) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/garage"
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/50 transition-colors group-hover:bg-muted">
                        <Car className="size-4.5 text-foreground" />
                    </div>

                    <span className="hidden font-heading text-base font-bold tracking-tight text-foreground sm:inline">
                        {APP_NAME}
                    </span>
                </Link>

                <nav
                    aria-label="Dashboard navigation"
                    className="flex min-w-0 flex-1 items-center gap-1"
                >
                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            item.href === '/garage'
                                ? pathname === '/garage' ||
                                  pathname.startsWith('/garage/')
                                : pathname === item.href ||
                                  pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={[
                                    'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                ].join(' ')}
                            >
                                <Icon className="size-4" />

                                <span className="hidden md:inline">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                    <ThemeMenu currentTheme={theme} setTheme={setTheme} />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 gap-2 px-2 sm:px-3"
                                aria-label="Open account menu"
                            >
                                <div className="flex size-7 items-center justify-center rounded-full border border-border bg-muted">
                                    <UserRound className="size-3.5 text-muted-foreground" />
                                </div>

                                <span className="hidden max-w-40 truncate text-sm font-medium lg:inline">
                                    {user.email}
                                </span>

                                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-64">
                            <div className="px-2 py-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Signed in as
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-foreground">
                                    {user.email}
                                </p>
                            </div>

                            <div className="my-1 h-px bg-border" />

                            <DropdownMenuItem
                                onClick={() => router.push('/settings')}
                                className="gap-2"
                            >
                                <Settings className="size-4" />
                                Settings
                            </DropdownMenuItem>

                            <div className="my-1 h-px bg-border" />

                            <DropdownMenuItem
                                onClick={() => void logout()}
                                className="gap-2 text-destructive focus:text-destructive"
                            >
                                <LogOut className="size-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

type ThemeMenuProps = {
    currentTheme: string | undefined;
    setTheme: (theme: string) => void;
};

function ThemeMenu({currentTheme, setTheme}: ThemeMenuProps) {
    const themeOptions = [
        {
            label: 'Light',
            value: 'light',
            icon: Sun,
        },
        {
            label: 'Dark',
            value: 'dark',
            icon: Moon,
        },
        {
            label: 'System',
            value: 'system',
            icon: MonitorIcon,
        },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Change theme"
                >
                    <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
                {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = currentTheme === option.value;

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className="gap-2"
                        >
                            <Icon className="size-4" />

                            <span className="flex-1">{option.label}</span>

                            {isSelected ? <Check className="size-3.5" /> : null}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MonitorIcon({className}: {className?: string}) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
    );
}
