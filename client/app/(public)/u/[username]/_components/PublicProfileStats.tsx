import GlassPanel from '@/components/shared/GlassPanel';
import {PublicProfileStats as PublicProfileStatsType} from '@/types/user';

type PublicProfileStatsProps = {
    stats: PublicProfileStatsType | null;
};

export default function PublicProfileStats({stats}: PublicProfileStatsProps) {
    return (
        <GlassPanel>
            <h2 className="section-title">Statistics</h2>

            <p className="body-text mt-2">
                {stats
                    ? `${stats.totalCars} public vehicles`
                    : 'Garage statistics are private.'}
            </p>
        </GlassPanel>
    );
}
