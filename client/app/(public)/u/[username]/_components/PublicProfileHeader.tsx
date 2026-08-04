import GlassPanel from '@/components/shared/GlassPanel';
import {PublicProfile} from '@/types/user';

type PublicProfileHeaderProps = {
    profile: PublicProfile;
};

export default function PublicProfileHeader({
    profile,
}: PublicProfileHeaderProps) {
    return (
        <GlassPanel>
            <h1 className="page-title">
                {profile.displayName ?? profile.username}
            </h1>
        </GlassPanel>
    );
}
