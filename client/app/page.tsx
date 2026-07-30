import Link from 'next/link';
import {
    ArrowRight,
    BrainCircuit,
    CarFront,
    Check,
    Gauge,
    Wrench,
} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {APP_NAME} from '@/lib/constants';

const productFeatures = [
    {
        icon: CarFront,
        title: 'Personal garage',
        description:
            'Keep every car, specification, and build detail organized in one place.',
    },
    {
        icon: Wrench,
        title: 'Modification tracking',
        description:
            'Record upgrades, costs, categories, and the complete evolution of your build.',
    },
    {
        icon: BrainCircuit,
        title: 'AI garage advisor',
        description:
            'Receive recommendations based on your exact car, modifications, budget, and goals.',
    },
];

const buildHighlights = [
    'Vehicle-aware recommendations',
    'Modification history and cost tracking',
    'Personalized build plans',
];

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_28%),radial-gradient(circle_at_85%_40%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_26%)]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_35%,transparent)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
            />

            <div className="relative">
                <header className="page-container flex h-20 items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 font-heading text-sm font-bold tracking-tight"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm">
                            HH
                        </span>

                        <span>{APP_NAME}</span>
                    </Link>

                    <nav
                        aria-label="Primary navigation"
                        className="flex items-center gap-2"
                    >
                        <Button
                            asChild
                            variant="ghost"
                            className="hidden sm:inline-flex"
                        >
                            <Link href="/login">Sign in</Link>
                        </Button>

                        <Button asChild>
                            <Link href="/register">
                                Create garage
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                    </nav>
                </header>

                <section className="page-container grid min-h-[calc(100vh-5rem)] items-center gap-14 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)] lg:py-24">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                            <Gauge className="size-4" aria-hidden="true" />
                            Built for serious automotive enthusiasts
                        </div>

                        <h1 className="hero-title max-w-4xl">
                            Build a better car with a{' '}
                            <span className="text-primary">
                                smarter garage.
                            </span>
                        </h1>

                        <p className="body-large mt-6 max-w-2xl">
                            Track your hot hatch, organize every modification,
                            and use AI to plan upgrades that match your car,
                            budget, and driving goals.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg">
                                <Link href="/register">
                                    Start your garage
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="lg">
                                <Link href="/login">Open existing garage</Link>
                            </Button>
                        </div>

                        <div className="mt-9 grid gap-3 sm:grid-cols-3">
                            {buildHighlights.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                    <Check
                                        className="size-4 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-xl">
                        <div
                            aria-hidden="true"
                            className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl"
                        />

                        <GlassPanel
                            variant="elevated"
                            padding="lg"
                            className="relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between border-b border-border-subtle pb-5">
                                <div>
                                    <p className="caption">Current build</p>
                                    <h2 className="card-title mt-1">
                                        Golf GTI Clubsport
                                    </h2>
                                </div>

                                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Stage 2
                                </span>
                            </div>

                            <div className="grid gap-3 py-6 sm:grid-cols-3">
                                <div className="rounded-xl bg-surface-muted p-4">
                                    <p className="caption">Power</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">
                                        365 hp
                                    </p>
                                </div>

                                <div className="rounded-xl bg-surface-muted p-4">
                                    <p className="caption">Modifications</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">
                                        12
                                    </p>
                                </div>

                                <div className="rounded-xl bg-surface-muted p-4">
                                    <p className="caption">Build cost</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">
                                        €8.4k
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                    <BrainCircuit
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    AI next-upgrade analysis
                                </div>

                                <p className="body-text mt-3">
                                    Upgrade the front brake setup before adding
                                    more power. Your current build would benefit
                                    most from improved thermal capacity and
                                    pedal consistency.
                                </p>

                                <Button variant="ai" size="sm" className="mt-5">
                                    View recommendation
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </div>
                        </GlassPanel>
                    </div>
                </section>

                <section className="page-container pb-24">
                    <div className="border-t border-border-subtle pt-16">
                        <div className="mb-10 max-w-2xl">
                            <p className="eyebrow">
                                One garage. Every decision.
                            </p>

                            <h2 className="section-title mt-3">
                                Everything your build needs to move forward.
                            </h2>

                            <p className="body-text mt-3">
                                HotHatch Garage AI brings vehicle data,
                                modification history, cost tracking, and
                                intelligent planning into one focused workspace.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {productFeatures.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <GlassPanel
                                        key={feature.title}
                                        variant="solid"
                                        className="h-full"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <h3 className="card-title mt-5">
                                            {feature.title}
                                        </h3>

                                        <p className="body-text mt-2">
                                            {feature.description}
                                        </p>
                                    </GlassPanel>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
