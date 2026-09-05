'use client';

import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';

import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';
import {
    ForgotPasswordInput,
    forgotPasswordSchema,
} from '@/lib/validations/auth';
import AuthService from '@/services/auth.service';

const fields: Field<ForgotPasswordInput>[] = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
    },
];

export default function ForgotPasswordPage() {
    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            const response = await AuthService.forgotPassword(data);
            toast.success(response.message);
            form.reset();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AuthLayout
            hero={{
                title: 'Recover access.',
                highlight: 'Get back to your garage.',
                description:
                    'Request a password reset link using the email connected to your account.',
                features: [
                    {
                        title: 'Secure recovery',
                        description:
                            'Password reset links are sent directly to your email.',
                    },
                    {
                        title: 'Your garage stays protected',
                        description:
                            'Only a valid recovery link can reset your password.',
                    },
                    {
                        title: 'Back on track',
                        description:
                            'Choose a new password and continue managing your build.',
                    },
                ],
            }}
            card={{
                eyebrow: 'Account recovery',
                title: 'Forgot your password?',
                description:
                    'Enter your email and we will send you password reset instructions.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Send reset link"
                submitLoadingText="Sending..."
                fields={fields}
                secondaryAction={
                    <p className="text-center text-sm text-muted-foreground">
                        Remembered your password?{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            Back to login
                        </Link>
                    </p>
                }
            />
        </AuthLayout>
    );
}
