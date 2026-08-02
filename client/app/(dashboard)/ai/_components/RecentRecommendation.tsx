import {History, Sparkles} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Recommendation} from '@/types/ai';

type RecentRecommendationProps = {
    recommendation?: Recommendation;
};

export default function RecentRecommendation({
    recommendation,
}: RecentRecommendationProps) {
    return (
        <GlassPanel variant="solid" className="h-full">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="eyebrow">Recent activity</p>

                    <h2 className="section-title mt-3">
                        Recent AI recommendation
                    </h2>

                    <p className="body-text mt-2">
                        Your latest generated advice will appear here.
                    </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-muted text-muted-foreground">
                    <History className="size-5" aria-hidden="true" />
                </div>
            </div>

            {!recommendation ? (
                <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted/40 px-6 text-center">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="size-5" aria-hidden="true" />
                    </div>

                    <h3 className="card-title mt-4">No recommendations yet</h3>

                    <p className="body-text mt-2 max-w-sm">
                        Select a vehicle and use one of the AI tools to generate
                        your first recommendation.
                    </p>
                </div>
            ) : (
                <div className="mt-8 rounded-xl border border-border-subtle bg-surface-muted/40 p-6">
                    <div className="flex items-center justify-between">
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            Car recommendation
                        </span>

                        <span className="caption">
                            {new Intl.DateTimeFormat('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            }).format(new Date(recommendation.createdAt))}
                        </span>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground line-clamp-6">
                        {recommendation.content}
                    </p>
                </div>
            )}
        </GlassPanel>
    );
}
