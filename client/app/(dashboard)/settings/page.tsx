'use client';

import {useAuth} from '@/context/AuthContext';
import {PageContainer} from '@/components/layout';

import SettingsHeader from './_components/SettingsHeader';
import ProfileSettingsForm from './_components/ProfileSettingsForm';
import PreferencesSettingsForm from './_components/PreferencesSettingsForm';
import PrivacySettingsForm from './_components/PrivacySettingsForm';
import ChangePasswordForm from './_components/ChangePasswordForm';
import DangerZone from './_components/DangerZone';

export default function SettingsPage() {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <main className="page-shell">
                <PageContainer className="py-8 md:py-10">
                    <div className="h-72 animate-pulse rounded-2xl border border-border-subtle bg-surface" />
                </PageContainer>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <SettingsHeader user={user} />

                <div className="space-y-8">
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <ProfileSettingsForm user={user} />

                        <aside className="space-y-8">
                            <PreferencesSettingsForm user={user} />
                            <PrivacySettingsForm user={user} />
                        </aside>
                    </div>

                    <ChangePasswordForm />

                    <DangerZone />
                </div>
            </PageContainer>
        </main>
    );
}
