import {ReactNode} from 'react';
import Link from 'next/link';
import {getServerCookieHeader} from '@/lib/auth/server-auth';
import {
    ArrowLeft,
    ChartNoAxesCombined,
    CircleDollarSign,
    Scale,
    Target,
} from 'lucide-react';

import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';

import CostAnalysisForm from './_components/CostAnalysisForm';

type CostAnalysisPageProps = {
    params: Promise<{id: string}>;
};

export default async function CostAnalysisPage({
    params,
}: CostAnalysisPageProps) {
    const {id} = await params;

    const cookieHeader = await getServerCookieHeader();

    const car = await CarService.getCarById(id, {
        headers: {
            Cookie: cookieHeader,
        },
    });

    const vehicleName = `${car.brand} ${car.model}`;

    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-3 w-fit text-muted-foreground hover:text-foreground"
                >
                    <Link href={`/garage/${id}`}>
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to {vehicleName}
                    </Link>
                </Button>

                <GlassPanel variant="elevated" className="overflow-hidden">
                    <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:items-end">
                        <div className="max-w-3xl">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ChartNoAxesCombined
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="eyebrow mt-6">
                                Vehicle AI · Cost analysis
                            </p>

                            <h1 className="page-title mt-3">
                                Spend where your build gains the most
                            </h1>

                            <p className="body-large mt-4 max-w-2xl">
                                Analyze the cost efficiency of your{' '}
                                {vehicleName} build and identify where your
                                available budget can deliver the best balance of
                                performance, reliability, and practicality.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <AnalysisStat
                                icon={
                                    <CircleDollarSign
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Budget"
                                value="Allocated"
                            />

                            <AnalysisStat
                                icon={
                                    <Scale
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Value"
                                value="Compared"
                            />

                            <AnalysisStat
                                icon={
                                    <Target
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Goal"
                                value="Prioritized"
                            />
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <GlassPanel variant="solid" padding="lg">
                        <CostAnalysisForm carId={id} />
                    </GlassPanel>

                    <GlassPanel variant="solid" padding="lg" className="h-fit">
                        <p className="eyebrow">Analysis criteria</p>

                        <h2 className="section-title mt-3">
                            How spending priorities are evaluated
                        </h2>

                        <p className="body-text mt-3">
                            The advisor compares upgrade value against your
                            stated goal, current modifications, and available
                            budget.
                        </p>

                        <div className="mt-6 space-y-4">
                            <AnalysisGuidance
                                title="Best value upgrades"
                                description="The analysis highlights changes that produce meaningful results without unnecessary spending."
                            />

                            <AnalysisGuidance
                                title="Poor-value choices"
                                description="Expensive upgrades with limited benefit for your stated goal are identified and deprioritized."
                            />

                            <AnalysisGuidance
                                title="Spending sequence"
                                description="The result provides a practical order for allocating the available budget."
                            />
                        </div>
                    </GlassPanel>
                </div>
            </PageContainer>
        </main>
    );
}

type AnalysisStatProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function AnalysisStat({icon, label, value}: AnalysisStatProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface px-3 py-4">
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

type AnalysisGuidanceProps = {
    title: string;
    description: string;
};

function AnalysisGuidance({title, description}: AnalysisGuidanceProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
