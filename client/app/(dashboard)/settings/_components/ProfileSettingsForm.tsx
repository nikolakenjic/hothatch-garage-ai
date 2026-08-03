'use client';

import {ReactNode} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {Save, UserRound} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAuth} from '@/context/AuthContext';
import {getErrorMessage} from '@/lib/errors';
import UserService from '@/services/user.service';
import {User} from '@/types/user';

const profileSettingsSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers and underscores',
        )
        .or(z.literal('')),

    displayName: z
        .string()
        .trim()
        .max(50, 'Display name must be at most 50 characters'),

    bio: z.string().trim().max(300, 'Bio must be at most 300 characters'),

    avatarUrl: z
        .string()
        .trim()
        .url('Avatar must be a valid URL')
        .or(z.literal('')),
});

type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;

type ProfileSettingsFormProps = {
    user: User;
};

export default function ProfileSettingsForm({user}: ProfileSettingsFormProps) {
    const {updateUser} = useAuth();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<ProfileSettingsInput>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            username: user.username ?? '',
            displayName: user.displayName ?? '',
            bio: user.bio ?? '',
            avatarUrl: user.avatarUrl ?? '',
        },
    });

    const onSubmit = async (data: ProfileSettingsInput) => {
        try {
            const updatedUser = await UserService.updateProfile({
                username: data.username || undefined,
                displayName: data.displayName || undefined,
                bio: data.bio || undefined,
                avatarUrl: data.avatarUrl || undefined,
            });

            updateUser(updatedUser);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <GlassPanel variant="solid" padding="lg">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserRound className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <p className="eyebrow">Public identity</p>

                    <h2 className="section-title mt-2">Profile information</h2>

                    <p className="body-text mt-2">
                        Manage the information displayed across your account and
                        future public profile.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-7 space-y-5"
                noValidate
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        id="display-name"
                        label="Display name"
                        error={errors.displayName?.message}
                    >
                        <Input
                            id="display-name"
                            placeholder="Nikola"
                            aria-invalid={Boolean(errors.displayName)}
                            {...register('displayName')}
                            className="h-11 border-border-subtle bg-background/70"
                        />
                    </FormField>

                    <FormField
                        id="username"
                        label="Username"
                        error={errors.username?.message}
                    >
                        <Input
                            id="username"
                            placeholder="nikola_gtd"
                            aria-invalid={Boolean(errors.username)}
                            {...register('username')}
                            className="h-11 border-border-subtle bg-background/70"
                        />
                    </FormField>
                </div>

                <FormField
                    id="avatar-url"
                    label="Avatar URL"
                    error={errors.avatarUrl?.message}
                >
                    <Input
                        id="avatar-url"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        aria-invalid={Boolean(errors.avatarUrl)}
                        {...register('avatarUrl')}
                        className="h-11 border-border-subtle bg-background/70"
                    />
                </FormField>

                <FormField id="bio" label="Bio" error={errors.bio?.message}>
                    <textarea
                        id="bio"
                        rows={5}
                        placeholder="Hot hatch enthusiast focused on clean OEM+ builds."
                        aria-invalid={Boolean(errors.bio)}
                        {...register('bio')}
                        className="flex w-full resize-y rounded-lg border border-border-subtle bg-background/70 px-3.5 py-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
                    />
                </FormField>

                <div className="flex justify-end border-t border-border-subtle pt-5">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || !isDirty}
                        className="font-semibold"
                    >
                        <Save className="size-4" aria-hidden="true" />

                        {isSubmitting ? 'Saving profile...' : 'Save profile'}
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
