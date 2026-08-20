'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

import AuthLayout from '@/components/auth/AuthLayout';
import {Button} from '@/components/ui/button';
import {getErrorMessage} from '@/lib/errors';
import AuthService from '@/services/auth.service';

type VerificationStatus = 'loading' | 'success' | 'error';

type VerifyEmailClientProps = {
    token: string | null;
};

const hero = {
    title: 'Almost there.',
    highlight: 'Verify your account.',
    description:
        'Confirm your email address to finish setting up your HotHatch Garage account.',
    features: [
        {
            title: 'Secure your account',
            description:
                'Email verification helps protect access to your garage.',
        },
        {
            title: 'Keep recovery available',
            description:
                'A verified email makes account recovery more reliable.',
        },
        {
            title: 'Finish your setup',
            description: 'Verify once and continue building your garage.',
        },
    ],
};

export default function VerifyEmailClient({token}: VerifyEmailClientProps) {
    const [status, setStatus] = useState<VerificationStatus>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setErrorMessage('Verification token is missing.');
                setStatus('error');
                return;
            }

            try {
                await AuthService.verifyEmail(token);
                setStatus('success');
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
                setStatus('error');
            }
        };

        void verifyEmail();
    }, [token]);

    if (status === 'loading') {
        return (
            <AuthLayout
                hero={hero}
                card={{
                    eyebrow: 'Email verification',
                    title: 'Verifying your email',
                    description: 'We are checking your verification link.',
                }}
            >
                <div role="status" className="space-y-3 text-center">
                    <p className="font-semibold text-foreground">
                        Verifying your email...
                    </p>
                    <p className="text-sm text-muted-foreground">
                        This should only take a moment.
                    </p>
                </div>
            </AuthLayout>
        );
    }

    if (status === 'success') {
        return (
            <AuthLayout
                hero={hero}
                card={{
                    eyebrow: 'Verification complete',
                    title: 'Email verified',
                    description:
                        'Your email address has been verified successfully.',
                }}
            >
                <div className="space-y-5 text-center">
                    <p className="text-sm text-muted-foreground">
                        Your account is ready. You can now continue to your
                        garage.
                    </p>

                    <Button asChild className="w-full">
                        <Link href="/login">Continue to login</Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            hero={hero}
            card={{
                eyebrow: 'Verification problem',
                title: 'Verification failed',
                description: 'We could not verify your email with this link.',
            }}
        >
            <div className="space-y-5 text-center">
                <p role="alert" className="text-sm text-destructive">
                    {errorMessage ?? 'Something went wrong.'}
                </p>

                <p className="text-sm text-muted-foreground">
                    The link may be invalid or expired. Request a new
                    verification email and try again.
                </p>

                <Button asChild className="w-full">
                    <Link href="/resend-verification">
                        Request a new verification email
                    </Link>
                </Button>

                <Button asChild variant="ghost" className="w-full">
                    <Link href="/login">Back to login</Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
