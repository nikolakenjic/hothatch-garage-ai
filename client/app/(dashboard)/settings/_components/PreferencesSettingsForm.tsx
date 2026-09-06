'use client';

import {useEffect} from 'react';
import {useTheme} from 'next-themes';
import {useForm, useWatch} from 'react-hook-form';
import {toast} from 'sonner';
import {Bell, Moon, Save} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/context/AuthContext';
import {getErrorMessage} from '@/lib/errors';
import UserService from '@/services/user.service';
import {ThemePreference, User} from '@/types/user';

type PreferencesSettingsInput = {
    theme: ThemePreference;
    emailNotifications: boolean;
};

type PreferencesSettingsFormProps = {
    user: User;
};

const themeOptions: Array<{
    label: string;
    value: ThemePreference;
}> = [
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
    {label: 'System', value: 'system'},
];

export default function PreferencesSettingsForm({
    user,
}: PreferencesSettingsFormProps) {
    const {updateUser} = useAuth();
    const {setTheme} = useTheme();

    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: {isDirty, isSubmitting},
    } = useForm<PreferencesSettingsInput>({
        defaultValues: {
            theme: user.preferences.theme,
            emailNotifications: user.preferences.emailNotifications,
        },
    });

    const selectedTheme = useWatch({
        control,
        name: 'theme',
    });

    const emailNotifications = useWatch({
        control,
        name: 'emailNotifications',
    });

    useEffect(() => {
        reset({
            theme: user.preferences.theme,
            emailNotifications: user.preferences.emailNotifications,
        });
    }, [reset, user.preferences]);

    const onSubmit = async (data: PreferencesSettingsInput) => {
        try {
            const updatedUser = await UserService.updateSettings({
                preferences: data,
            });

            updateUser(updatedUser);
            setTheme(updatedUser.preferences.theme);

            reset({
                theme: updatedUser.preferences.theme,
                emailNotifications: updatedUser.preferences.emailNotifications,
            });

            toast.success('Preferences updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <GlassPanel variant="solid" padding="lg">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Moon className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <p className="eyebrow">Application</p>

                    <h2 className="section-title mt-2">Preferences</h2>

                    <p className="body-text mt-2">
                        Manage your visual theme and account notifications.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-6">
                <div>
                    <p className="text-sm font-medium text-foreground">Theme</p>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => {
                            const isSelected = selectedTheme === option.value;

                            return (
                                <Button
                                    key={option.value}
                                    type="button"
                                    variant={isSelected ? 'default' : 'outline'}
                                    onClick={() =>
                                        setValue('theme', option.value, {
                                            shouldDirty: true,
                                        })
                                    }
                                    aria-pressed={isSelected}
                                >
                                    {option.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
                    <div className="flex gap-3">
                        <Bell
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                        />

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Email notifications
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Receive important account and garage updates by
                                email.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        variant={emailNotifications ? 'default' : 'outline'}
                        onClick={() =>
                            setValue(
                                'emailNotifications',
                                !emailNotifications,
                                {shouldDirty: true},
                            )
                        }
                        aria-pressed={emailNotifications}
                    >
                        {emailNotifications ? 'Enabled' : 'Disabled'}
                    </Button>
                </div>

                <div className="flex justify-end border-t border-border-subtle pt-5">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="font-semibold"
                    >
                        <Save className="size-4" aria-hidden="true" />

                        {isSubmitting
                            ? 'Saving preferences...'
                            : 'Save preferences'}
                    </Button>
                </div>
            </form>
        </GlassPanel>
    );
}
