'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {loginSchema, LoginInput} from '@/lib/validations/auth';
import {useAuth} from '@/context/AuthContext';
import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';
import Link from 'next/link';

const loginFields: Field<LoginInput>[] = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
    },
];

export default function LoginPage() {
    const {login} = useAuth();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AuthLayout
            hero={{
                title: 'Welcome back.',
                highlight: 'Your garage is ready.',
                description:
                    'Continue managing your cars, reviewing modifications, and planning the next stage of your build.',
                features: [
                    {
                        title: 'Complete garage',
                        description: 'Access every vehicle and build detail.',
                    },
                    {
                        title: 'Modification history',
                        description: 'Continue tracking upgrades and costs.',
                    },
                    {
                        title: 'AI recommendations',
                        description:
                            'Plan your next move with vehicle-aware advice.',
                    },
                ],
            }}
            card={{
                eyebrow: 'Member access',
                title: 'Sign in to your garage',
                description:
                    'Enter your account details to continue where you left off.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Login"
                submitLoadingText="Opening garage..."
                fields={loginFields}
                secondaryAction={
                    <div className="space-y-3 text-center text-sm">
                        <Link
                            href="/forgot-password"
                            className="font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            Forgot password?
                        </Link>

                        <p className="text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                }
            />
        </AuthLayout>
    );
}
