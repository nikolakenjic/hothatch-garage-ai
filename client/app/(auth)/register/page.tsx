'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {RegisterInput, registerSchema} from '@/lib/validations/auth';
import {useAuth} from '@/context/AuthContext';
import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';
import Link from 'next/link';

const registerFields: Field<RegisterInput>[] = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Name',
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

export default function RegisterPage() {
    const {register: signUp} = useAuth();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

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
                title: 'Your build deserves',
                highlight: 'a better workspace.',
                description:
                    'Create a structured home for your car, modifications, costs, and future upgrade plans.',
                features: [
                    {
                        title: 'Organized from day one',
                        description:
                            'Keep vehicle and build data in one place.',
                    },
                    {
                        title: 'Built around your car',
                        description:
                            'Recommendations use your real garage context.',
                    },
                    {
                        title: 'Plan with confidence',
                        description:
                            'Review costs and prioritize meaningful upgrades.',
                    },
                ],
            }}
            card={{
                eyebrow: 'Create your account',
                title: 'Start your garage',
                description:
                    'Create an account and add your first car in a few minutes.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Create account"
                submitLoadingText="Starting garage..."
                fields={registerFields}
                secondaryAction={
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            Login
                        </Link>
                    </p>
                }
            />
        </AuthLayout>
    );
}
