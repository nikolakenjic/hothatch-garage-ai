import {Bot, CalendarDays, CarFront} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Recommendation} from '@/types/ai';

type RecommendationHistoryListProps = {
    recommendations: Recommendation[];
};

const recommendationLabels: Record<Recommendation['type'], string> = {
    'next-upgrade': 'Next upgrade',
    'next-upgrade-advisor': 'Next upgrade advisor',
    'build-review': 'Build review',
    'cost-analysis': 'Cost analysis',
    'car-recommendation': 'Car recommendation',
    'build-plan': 'Build plan',
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

export default function RecommendationHistoryList({
    recommendations,
}: RecommendationHistoryListProps) {
    if (recommendations.length === 0) {
        return (
            <GlassPanel variant="solid">
                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-14 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Bot className="size-5" aria-hidden="true" />
                    </div>

                    <h2 className="section-title mt-5">
                        No AI recommendations yet
                    </h2>

                    <p className="body-text mt-2 max-w-md">
                        Generate a car recommendation or use one of the
                        vehicle-specific AI tools to begin building your
                        history.
                    </p>
                </div>
            </GlassPanel>
        );
    }

    return (
        <section aria-label="AI recommendation history" className="space-y-4">
            {recommendations.map((recommendation) => (
                <GlassPanel
                    key={recommendation.id}
                    variant="solid"
                    className="overflow-hidden"
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                    {recommendationLabels[recommendation.type]}
                                </span>

                                {recommendation.car ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <CarFront
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        Garage vehicle
                                    </span>
                                ) : null}
                            </div>

                            <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                                {recommendation.content}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays
                                className="size-4"
                                aria-hidden="true"
                            />
                            {dateFormatter.format(
                                new Date(recommendation.createdAt),
                            )}
                        </div>
                    </div>
                </GlassPanel>
            ))}
        </section>
    );
}
