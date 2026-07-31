import {CarFront, History, Sparkles} from 'lucide-react';

import {PageContainer} from '@/components/layout';

import AIFeatureCard from './_components/AIFeatureCard';
import AIHero from './_components/AIHero';
import AITips from './_components/AITips';
import RecentRecommendation from './_components/RecentRecommendation';

const aiFeatures = [
    {
        title: 'Recommend a car',
        description:
            'Describe your budget, preferred fuel type, and driving needs to receive a tailored hot hatch recommendation.',
        href: '/ai/recommend-car',
        icon: Sparkles,
        actionLabel: 'Start recommendation',
    },
    {
        title: 'AI history',
        description:
            'Review previously generated vehicle recommendations and revisit earlier AI advice.',
        href: '/ai/history',
        icon: History,
        actionLabel: 'View history',
    },
    {
        title: 'Continue with a garage vehicle',
        description:
            'Choose one of your saved cars to access build planning, build review, cost analysis, and next-upgrade tools.',
        href: '/garage',
        icon: CarFront,
        actionLabel: 'Open garage',
    },
];
export default function AIPage() {
    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <AIHero />

                <section aria-labelledby="ai-tools-title" className="space-y-5">
                    <div>
                        <p className="eyebrow">AI tools</p>

                        <h2 id="ai-tools-title" className="section-title mt-3">
                            Choose how you want to use the AI advisor
                        </h2>

                        <p className="body-text mt-2 max-w-2xl">
                            Get help choosing your next car, review previous
                            recommendations, or continue working with a vehicle
                            already saved in your garage.
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {aiFeatures.map((feature) => (
                            <AIFeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
                    <RecentRecommendation />
                    <AITips />
                </div>
            </PageContainer>
        </main>
    );
}
