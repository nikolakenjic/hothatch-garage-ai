'use client';

import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';

import AuthForm, {Field} from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import {getErrorMessage} from '@/lib/errors';
import {
    ResendVerificationInput,
    resendVerificationSchema,
} from '@/lib/validations/auth';
import AuthService from '@/services/auth.service';

const fields: Field<ResendVerificationInput>[] = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
    },
];

export default function ResendVerificationPage() {
    const form = useForm<ResendVerificationInput>({
        resolver: zodResolver(resendVerificationSchema),
    });

    const onSubmit = async (data: ResendVerificationInput) => {
        try {
            const response = await AuthService.resendVerification(data);
            toast.success(response.message);
            form.reset();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <AuthLayout
            hero={{
                title: 'One more step.',
                highlight: 'Verify your email.',
                description:
                    'Request a new verification link and finish activating your HotHatch Garage account.',
                features: [
                    {
                        title: 'Secure access',
                        description:
                            'Verification helps protect your garage and account.',
                    },
                    {
                        title: 'Fresh verification link',
                        description:
                            'Request another link if the previous one expired.',
                    },
                    {
                        title: 'Continue your setup',
                        description:
                            'Verify your email and return to your garage.',
                    },
                ],
            }}
            card={{
                eyebrow: 'Email verification',
                title: 'Request a new verification link',
                description:
                    'Enter the email address associated with your account.',
            }}
        >
            <AuthForm
                form={form}
                onSubmit={onSubmit}
                submitText="Send verification email"
                submitLoadingText="Sending..."
                fields={fields}
                secondaryAction={
                    <p className="text-center text-sm text-muted-foreground">
                        Already verified?{' '}
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
