import Link from 'next/link';
import {ArrowLeft, Sparkles} from 'lucide-react';

import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';

import RecommendCarForm from './_components/RecommendCarForm';

export default function RecommendCarPage() {
    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-3 w-fit text-muted-foreground hover:text-foreground"
                >
                    <Link href="/ai">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to AI advisor
                    </Link>
                </Button>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)]">
                    <div className="space-y-6">
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Sparkles
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="eyebrow mt-6">Global AI advisor</p>

                            <h1 className="page-title mt-3">
                                Find a hot hatch that fits your life
                            </h1>

                            <p className="body-large mt-4 max-w-xl">
                                Tell us your budget, preferred fuel type, and
                                how you plan to use the car. The AI will return
                                one focused recommendation with a clear reason.
                            </p>
                        </div>

                        <GlassPanel variant="solid">
                            <h2 className="card-title">
                                What makes a useful recommendation?
                            </h2>

                            <div className="mt-5 space-y-4">
                                <GuidanceItem
                                    title="Use a realistic budget"
                                    description="Include the approximate purchase budget and market currency."
                                />

                                <GuidanceItem
                                    title="Describe the real use case"
                                    description="Daily driving, mountain roads, weekend fun, or occasional track use all lead to different choices."
                                />

                                <GuidanceItem
                                    title="Mention important priorities"
                                    description="Reliability, steering feel, fuel economy, practicality, and tuning potential can change the result."
                                />
                            </div>
                        </GlassPanel>
                    </div>

                    <GlassPanel variant="elevated" padding="lg">
                        <RecommendCarForm />
                    </GlassPanel>
                </div>
            </PageContainer>
        </main>
    );
}

type GuidanceItemProps = {
    title: string;
    description: string;
};

function GuidanceItem({title, description}: GuidanceItemProps) {
    return (
        <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
