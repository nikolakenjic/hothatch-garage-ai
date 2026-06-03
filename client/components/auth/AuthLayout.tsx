import {ReactNode} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
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
    const {eyebrow, title, description} = card;

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_35%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
                <div className="hidden space-y-6 lg:block">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                        {APP_NAME}
                    </p>

                    <h1 className="font-heading max-w-xl text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                        {hero.title}
                        <span className="block text-red-600 dark:text-red-500">
                            {hero.highlight}
                        </span>
                    </h1>

                    <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
                        {hero.description}
                    </p>

                    <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
                        {hero.features.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                            >
                                <p className="font-heading text-2xl font-bold">
                                    {item.title}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="w-full border-zinc-200 bg-white/85 shadow-xl backdrop-blur-xl lg:shadow-2xl dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-red-950/30">
                    <CardHeader className="space-y-2 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600 dark:text-red-500">
                            {eyebrow}
                        </p>

                        <CardTitle className="font-heading text-3xl font-black text-zinc-950 dark:text-white">
                            {title}
                        </CardTitle>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {description}
                        </p>
                    </CardHeader>

                    <CardContent className="pt-3">{children}</CardContent>
                </Card>
            </section>
        </main>
    );
}
