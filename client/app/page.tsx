import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function HomePage() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 px-4 text-zinc-950 dark:bg-[#070707] dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_35%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 flex flex-col items-center text-center max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500 mb-4">
                    HotHatch Garage AI
                </p>

                <h1 className="font-heading text-5xl font-black leading-tight tracking-tight lg:text-7xl mb-6">
                    Your garage.
                    <span className="block text-red-600 dark:text-red-500">
                        Supercharged by AI.
                    </span>
                </h1>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-10">
                    Track your hot hatch, manage modifications, and get
                    AI-powered build plans tailored to your budget and goals.
                </p>

                <div className="flex gap-4">
                    <Link href="/register">
                        <Button className="h-12 px-8 bg-red-600 font-bold text-white hover:bg-red-500">
                            Get Started 🔥
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="h-12 px-8 font-bold"
                        >
                            Login
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-16 w-full max-w-lg">
                    {[
                        {title: 'Garage', desc: 'Manage your cars'},
                        {title: 'Mods', desc: 'Track every build'},
                        {title: 'AI', desc: 'Smart upgrade plans'},
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                        >
                            <p className="font-heading text-2xl font-bold">
                                {item.title}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
