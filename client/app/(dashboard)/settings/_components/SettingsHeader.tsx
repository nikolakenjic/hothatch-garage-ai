import {Settings2, ShieldCheck} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {User} from '@/types/user';

type SettingsHeaderProps = {
    user: User;
};

export default function SettingsHeader({user}: SettingsHeaderProps) {
    const accountName =
        user.displayName ?? user.username ?? user.email.split('@')[0];

    return (
        <GlassPanel variant="elevated" className="overflow-hidden">
            <div className="flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Settings2 className="size-6" aria-hidden="true" />
                    </div>

                    <p className="eyebrow mt-6">Account settings</p>

                    <h1 className="page-title mt-3">
                        Manage your profile and account
                    </h1>

                    <p className="body-large mt-4 max-w-2xl">
                        Update how your profile appears, manage privacy
                        preferences, and keep the account for {accountName}{' '}
                        secure.
                    </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="size-4" aria-hidden="true" />
                        <span className="caption">Email status</span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                        {user.isEmailVerified ? 'Verified' : 'Not verified'}
                    </p>
                </div>
            </div>
        </GlassPanel>
    );
}
