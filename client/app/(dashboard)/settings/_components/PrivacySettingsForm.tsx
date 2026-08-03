'use client';

import {useEffect} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {toast} from 'sonner';
import {Eye, Save, ShieldCheck} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/context/AuthContext';
import {getErrorMessage} from '@/lib/errors';
import UserService from '@/services/user.service';
import {User} from '@/types/user';

type PrivacySettingsInput = {
    publicProfile: boolean;
    publicGarage: boolean;
};

type PrivacySettingsFormProps = {
    user: User;
};

export default function PrivacySettingsForm({user}: PrivacySettingsFormProps) {
    const {updateUser} = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: {isDirty, isSubmitting},
    } = useForm<PrivacySettingsInput>({
        defaultValues: {
            publicProfile: user.privacy.publicProfile,
            publicGarage: user.privacy.publicGarage,
        },
    });

    const publicProfile = useWatch({
        control,
        name: 'publicProfile',
    });

    const publicGarage = useWatch({
        control,
        name: 'publicGarage',
    });

    useEffect(() => {
        reset({
            publicProfile: user.privacy.publicProfile,
            publicGarage: user.privacy.publicGarage,
        });
    }, [reset, user.privacy]);

    const onSubmit = async (data: PrivacySettingsInput) => {
        try {
            const updatedUser = await UserService.updateSettings({
                privacy: data,
            });

            updateUser(updatedUser);

            reset({
                publicProfile: updatedUser.privacy.publicProfile,
                publicGarage: updatedUser.privacy.publicGarage,
            });

            toast.success('Privacy settings updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <GlassPanel variant="solid" padding="lg">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <p className="eyebrow">Visibility</p>

                    <h2 className="section-title mt-2">Privacy</h2>

                    <p className="body-text mt-2">
                        Control what other users can view on your profile.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
                <PrivacyOption
                    title="Public profile"
                    description="Allow people to open your profile using your username."
                    enabled={publicProfile}
                    onToggle={() =>
                        setValue('publicProfile', !publicProfile, {
                            shouldDirty: true,
                        })
                    }
                />

                <PrivacyOption
                    title="Public garage"
                    description="Allow your saved vehicles to appear on your public profile."
                    enabled={publicGarage}
                    disabled={!publicProfile}
                    onToggle={() =>
                        setValue('publicGarage', !publicGarage, {
                            shouldDirty: true,
                        })
                    }
                />

                {!publicProfile && publicGarage ? (
                    <p className="text-sm text-destructive">
                        A public garage requires a public profile.
                    </p>
                ) : null}

                <div className="flex justify-end border-t border-border-subtle pt-5">
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !isDirty ||
                            (!publicProfile && publicGarage)
                        }
                        className="font-semibold"
                    >
                        <Save className="size-4" aria-hidden="true" />

                        {isSubmitting ? 'Saving privacy...' : 'Save privacy'}
                    </Button>
                </div>
            </form>
        </GlassPanel>
    );
}

type PrivacyOptionProps = {
    title: string;
    description: string;
    enabled: boolean;
    disabled?: boolean;
    onToggle: () => void;
};

function PrivacyOption({
    title,
    description,
    enabled,
    disabled = false,
    onToggle,
}: PrivacyOptionProps) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <div className="flex gap-3">
                <Eye
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                />

                <div>
                    <p className="text-sm font-medium text-foreground">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            <Button
                type="button"
                size="sm"
                variant={enabled ? 'default' : 'outline'}
                disabled={disabled}
                onClick={onToggle}
                aria-pressed={enabled}
            >
                {enabled ? 'Public' : 'Private'}
            </Button>
        </div>
    );
}
