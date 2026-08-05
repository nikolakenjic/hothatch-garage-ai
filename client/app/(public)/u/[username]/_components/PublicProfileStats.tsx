import GlassPanel from '@/components/shared/GlassPanel';
import {PublicProfileStats as PublicProfileStatsType} from '@/types/user';

type Props = {
    stats: PublicProfileStatsType | null;
};

export default function PublicProfileStats({stats}: Props) {
    if (!stats) {
        return (
            <GlassPanel>
                <h2 className="section-title">Statistics</h2>

                <p className="body-text mt-2">
                    This user has chosen to keep their garage statistics
                    private.
                </p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel>
            <h2 className="section-title">Statistics</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border-subtle bg-surface-muted p-5">
                    <p className="eyebrow">Vehicles</p>

                    <p className="mt-3 text-3xl font-black">
                        {stats.totalCars}
                    </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface-muted p-5">
                    <p className="eyebrow">Modifications</p>

                    <p className="mt-3 text-3xl font-black">
                        {stats.totalModifications}
                    </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface-muted p-5">
                    <p className="eyebrow">Money invested</p>

                    <p className="mt-3 text-3xl font-black">
                        €{stats.totalMoneySpent.toLocaleString()}
                    </p>
                </div>
            </div>
        </GlassPanel>
    );
}
