'use client';

import {ReactNode, useState} from 'react';
import Image from 'next/image';
import {CalendarDays, CarFront, Globe2, LockKeyhole} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {PublicProfile} from '@/types/user';

type PublicProfileHeaderProps = {
    profile: PublicProfile;
};

const memberSinceFormatter = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
});

export default function PublicProfileHeader({
    profile,
}: PublicProfileHeaderProps) {
    const [imageError, setImageError] = useState(false);
    const displayName = profile.displayName ?? profile.username;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <GlassPanel variant="elevated" className="overflow-hidden">
            <div className="flex flex-col gap-8 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {profile.avatarUrl && !imageError ? (
                        <Image
                            src={profile.avatarUrl}
                            alt={`${displayName} profile`}
                            width={96}
                            height={96}
                            onError={() => setImageError(true)}
                            className="size-24 shrink-0 rounded-3xl border border-border-subtle object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl border border-border-subtle bg-primary/10 font-heading text-3xl font-black text-primary shadow-sm">
                            {initial}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="eyebrow">Public profile</p>

                        <h1 className="page-title mt-3 break-words">
                            {displayName}
                        </h1>

                        <p className="mt-2 text-sm font-medium text-primary">
                            @{profile.username}
                        </p>

                        {profile.bio ? (
                            <p className="body-large mt-4 max-w-2xl whitespace-pre-wrap">
                                {profile.bio}
                            </p>
                        ) : (
                            <p className="body-text mt-4">
                                This user has not added a bio yet.
                            </p>
                        )}

                        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays
                                className="size-4"
                                aria-hidden="true"
                            />
                            Member since{' '}
                            {memberSinceFormatter.format(
                                new Date(profile.createdAt),
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-72 lg:grid-cols-1">
                    <ProfileBadge
                        icon={<Globe2 className="size-4" aria-hidden="true" />}
                        label="Profile"
                        value="Public"
                    />

                    <ProfileBadge
                        icon={
                            profile.publicGarage ? (
                                <CarFront
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <LockKeyhole
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )
                        }
                        label="Garage"
                        value={profile.publicGarage ? 'Public' : 'Private'}
                    />
                </div>
            </div>
        </GlassPanel>
    );
}

type ProfileBadgeProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function ProfileBadge({icon, label, value}: ProfileBadgeProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface px-4 py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="caption">{label}</span>
            </div>

            <p className="mt-2 text-sm font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}
