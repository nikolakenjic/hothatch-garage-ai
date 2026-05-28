'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import {loginSchema, LoginInput} from '@/lib/validations/auth';
import {useAuth} from '@/context/AuthContext';
import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';

export default function LoginPage() {
    const router = useRouter();
    const {login} = useAuth();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const loginFields: Field[] = [
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

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AuthLayout
            eyebrow="Sign in"
            title="Welcome back"
            description="Login and continue building your garage."
            heroTitle="Welcome back."
            heroHighlight="Your garage is waiting."
            heroDescription="Continue managing your hot hatches, tracking modifications, and getting AI-powered upgrade ideas."
            features={[
                {title: 'Garage', description: 'Your cars'},
                {title: 'Mods', description: 'Track builds'},
                {title: 'AI', description: 'Smart help'},
            ]}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Login"
                submitLoadingText="Opening garage..."
                fields={loginFields}
                secondaryAction={
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className="font-semibold text-red-600 transition-colors hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                        >
                            Create account
                        </button>
                    </p>
                }
            />
        </AuthLayout>
    );
}
