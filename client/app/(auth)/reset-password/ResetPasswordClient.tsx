'use client';

import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';

import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';
import {ResetPasswordInput, resetPasswordSchema} from '@/lib/validations/auth';
import AuthService from '@/services/auth.service';

const fields: Field<ResetPasswordInput>[] = [
    {
        name: 'password',
        label: 'New password',
        type: 'password',
        placeholder: '••••••••',
    },
];

type ResetPasswordClientProps = {
    token: string | null;
};

export default function ResetPasswordClient({token}: ResetPasswordClientProps) {
    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) {
            toast.error('Password reset token is missing.');
            return;
        }

        try {
            const response = await AuthService.resetPassword(token, data);

            toast.success(response.message);
            form.reset();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    if (!token) {
        return (
            <AuthLayout
                hero={{
                    title: 'Recover access.',
                    highlight: 'Secure your account.',
                    description:
                        'Choose a new password to restore access to your HotHatch Garage account.',
                    features: [],
                }}
                card={{
                    eyebrow: 'Password reset',
                    title: 'Invalid reset link',
                    description:
                        'This password reset link does not contain a valid token.',
                }}
            >
                <div className="space-y-5 text-center">
                    <p role="alert" className="text-sm text-destructive">
                        Password reset token is missing.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-primary"
                    >
                        Request a new reset link
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            hero={{
                title: 'Recover access.',
                highlight: 'Choose a new password.',
                description:
                    'Create a new secure password and return to your garage.',
                features: [
                    {
                        title: 'Secure recovery',
                        description:
                            'Your reset link authorizes this password change.',
                    },
                    {
                        title: 'Strong password',
                        description:
                            'Use a password that meets the account security requirements.',
                    },
                    {
                        title: 'Return to your garage',
                        description:
                            'Sign in again after resetting your password.',
                    },
                ],
            }}
            card={{
                eyebrow: 'Password reset',
                title: 'Set a new password',
                description:
                    'Enter the new password you want to use for your account.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Reset password"
                submitLoadingText="Resetting..."
                fields={fields}
                secondaryAction={
                    <Link
                        href="/login"
                        className="block text-center text-sm font-semibold text-primary"
                    >
                        Back to login
                    </Link>
                }
            />
        </AuthLayout>
    );
}
