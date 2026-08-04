import {notFound} from 'next/navigation';

import {PageContainer} from '@/components/layout';
import UserService from '@/services/user.service';

import PublicGarage from './_components/PublicGarage';
import PublicProfileHeader from './_components/PublicProfileHeader';
import PublicProfileStats from './_components/PublicProfileStats';

type Props = {
    params: Promise<{
        username: string;
    }>;
};

export default async function PublicProfilePage({params}: Props) {
    const {username} = await params;

    const data = await UserService.getPublicProfile(username).catch(() => null);

    if (!data) {
        notFound();
    }

    const {profile, stats, cars} = data;

    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <PublicProfileHeader profile={profile} />

                <PublicProfileStats stats={stats} />

                <PublicGarage publicGarage={profile.publicGarage} cars={cars} />
            </PageContainer>
        </main>
    );
}
