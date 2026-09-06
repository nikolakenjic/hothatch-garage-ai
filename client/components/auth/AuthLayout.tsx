import Link from 'next/link';
import {ArrowLeft, Check} from 'lucide-react';
import {ReactNode} from 'react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {APP_NAME} from '@/lib/constants';

type Feature = {
    title: string;
    description: string;
};

type HeroProps = {
    title: string;
    highlight: string;
    description: string;
    features: Feature[];
};

type CardProps = {
    eyebrow: string;
    title: string;
    description: string;
};

type AuthLayoutProps = {
    children: ReactNode;
    hero: HeroProps;
    card: CardProps;
};

export default function AuthLayout({children, hero, card}: AuthLayoutProps) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_32%),radial-gradient(circle_at_85%_85%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_30%)]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_35%,transparent)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 mask-[linear-gradient(to_bottom,black,transparent_85%)]"
            />

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 font-heading text-sm font-bold tracking-tight"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm">
                            HH
                        </span>

                        <span>{APP_NAME}</span>
                    </Link>

                    <Button asChild variant="ghost" size="sm">
                        <Link href="/">
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Back to home
                        </Link>
                    </Button>
                </header>

                <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)] lg:gap-20">
                    <div className="hidden lg:block">
                        <p className="eyebrow mb-5">
                            Built for performance enthusiasts
                        </p>

                        <h1 className="hero-title max-w-2xl">
                            {hero.title}{' '}
                            <span className="text-primary">
                                {hero.highlight}
                            </span>
                        </h1>

                        <p className="body-large mt-6 max-w-xl">
                            {hero.description}
                        </p>

                        <div className="mt-10 grid max-w-xl gap-3">
                            {hero.features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface/70 p-4 backdrop-blur-sm"
                                >
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Check
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {feature.title}
                                        </p>

                                        <p className="mt-0.5 text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <GlassPanel
                        variant="elevated"
                        padding="lg"
                        className="mx-auto w-full max-w-lg"
                    >
                        <div className="mb-8 text-center sm:text-left">
                            <p className="eyebrow">{card.eyebrow}</p>

                            <h2 className="page-title mt-3">{card.title}</h2>

                            <p className="body-text mt-3">{card.description}</p>
                        </div>

                        {children}
                    </GlassPanel>
                </section>

                <footer className="py-3 text-center text-xs text-muted-foreground">
                    Your garage data stays private and belongs to you.
                </footer>
            </div>
        </main>
    );
}
