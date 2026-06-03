'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import {RegisterInput, registerSchema} from '@/lib/validations/auth';
import {useAuth} from '@/context/AuthContext';
import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';

export default function RegisterPage() {
    const router = useRouter();
    const {register: signUp} = useAuth();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const registerFields: Field[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Nikola',
        },
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

    const onSubmit = async (data: RegisterInput) => {
        try {
            await signUp(data);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AuthLayout
            hero={{
                title: 'Build your garage.',
                highlight: 'Tune your passion.',
                description:
                    'Join a community of hot hatch enthusiasts. Add your car, track modifications, and get AI-powered upgrade ideas.',
                features: [
                    {title: 'AI', description: 'Upgrade help'},
                    {title: 'OEM+', description: 'Clean builds'},
                    {title: 'Garage', description: 'Your cars'},
                ],
            }}
            card={{
                eyebrow: 'Create profile',
                title: 'Start your garage',
                description:
                    'Register and start building your hot hatch profile.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Create account"
                submitLoadingText="Starting garage..."
                fields={registerFields}
                secondaryAction={
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
                }
            />
        </AuthLayout>
    );
}
