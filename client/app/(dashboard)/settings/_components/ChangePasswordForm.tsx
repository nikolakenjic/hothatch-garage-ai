'use client';

import {ReactNode} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {KeyRound, LoaderCircle, Save} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getErrorMessage} from '@/lib/errors';
import UserService from '@/services/user.service';

const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(6, 'Current password must contain at least 6 characters'),

        newPassword: z
            .string()
            .min(6, 'New password must contain at least 6 characters'),

        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from the current password',
        path: ['newPassword'],
    });

type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<ChangePasswordFormInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ChangePasswordFormInput) => {
        try {
            await UserService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            reset();
            toast.success(
                'Password changed successfully. Please log in again when your session expires.',
            );
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <GlassPanel variant="solid" padding="lg">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <KeyRound className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <p className="eyebrow">Security</p>

                    <h2 className="section-title mt-2">Change password</h2>

                    <p className="body-text mt-2">
                        Use your current password to protect this account with a
                        new one.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-7 space-y-5"
                noValidate
            >
                <FormField
                    id="current-password"
                    label="Current password"
                    error={errors.currentPassword?.message}
                >
                    <Input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.currentPassword)}
                        aria-describedby={
                            errors.currentPassword
                                ? 'current-password-error'
                                : undefined
                        }
                        {...register('currentPassword')}
                        className="h-11 border-border-subtle bg-background/70"
                    />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        id="new-password"
                        label="New password"
                        error={errors.newPassword?.message}
                    >
                        <Input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={Boolean(errors.newPassword)}
                            aria-describedby={
                                errors.newPassword
                                    ? 'new-password-error'
                                    : undefined
                            }
                            {...register('newPassword')}
                            className="h-11 border-border-subtle bg-background/70"
                        />
                    </FormField>

                    <FormField
                        id="confirm-password"
                        label="Confirm new password"
                        error={errors.confirmPassword?.message}
                    >
                        <Input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            aria-describedby={
                                errors.confirmPassword
                                    ? 'confirm-password-error'
                                    : undefined
                            }
                            {...register('confirmPassword')}
                            className="h-11 border-border-subtle bg-background/70"
                        />
                    </FormField>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                        Changing your password invalidates existing refresh
                        sessions on other devices.
                    </p>
                </div>

                <div className="flex justify-end border-t border-border-subtle pt-5">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                />
                                Changing password...
                            </>
                        ) : (
                            <>
                                <Save className="size-4" aria-hidden="true" />
                                Change password
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </GlassPanel>
    );
}

type FormFieldProps = {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
};

function FormField({id, label, error, children}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            {children}

            {error ? (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="text-sm text-destructive"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}
