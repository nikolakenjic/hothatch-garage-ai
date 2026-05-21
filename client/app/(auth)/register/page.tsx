'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {RegisterInput, registerSchema} from '@/lib/validations/auth';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useRouter} from 'next/navigation';
import {registerService} from '@/services/auth.service';
import {setAuthCookie} from '@/lib/cookies';
import {toast} from 'sonner';

export default function RegisterPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            const response = await registerService(data);
            setAuthCookie(response.token);
            toast.success('Account created!');
            router.replace('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 text-zinc-950 dark:bg-[#070707] dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_35%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
                <div className="hidden space-y-6 lg:block">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                        HotHatch Garage AI
                    </p>

                    <h1 className="font-heading max-w-xl text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                        Build your garage.
                        <span className="block text-red-600 dark:text-red-500">
                            Tune your passion.
                        </span>
                    </h1>

                    <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
                        Join a community of hot hatch enthusiasts. Add your car,
                        track modifications, and get AI-powered upgrade ideas.
                    </p>

                    <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
                        {['AI', 'OEM+', 'Garage'].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                            >
                                <p className="font-heading text-2xl font-bold">
                                    {item}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {item === 'AI'
                                        ? 'Upgrade help'
                                        : item === 'OEM+'
                                          ? 'Clean builds'
                                          : 'Your cars'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="w-full border-zinc-200 bg-white/85 shadow-xl backdrop-blur-xl lg:shadow-2xl dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-red-950/30">
                    <CardHeader className="space-y-2 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600 dark:text-red-500">
                            Create profile
                        </p>

                        <CardTitle className="font-heading text-3xl font-black text-zinc-950 dark:text-white">
                            Start your garage
                        </CardTitle>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Register and start building your hot hatch profile.
                        </p>
                    </CardHeader>

                    <CardContent className="pt-3">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nikola"
                                    {...register('name')}
                                    className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 w-full bg-red-600 font-bold text-white shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.01] hover:bg-red-500 active:scale-[0.99]"
                            >
                                {isSubmitting
                                    ? 'Starting garage...'
                                    : 'Create account'}
                            </Button>

                            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/login')}
                                    className="font-semibold text-red-600 transition-colors hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                >
                                    Login
                                </button>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
