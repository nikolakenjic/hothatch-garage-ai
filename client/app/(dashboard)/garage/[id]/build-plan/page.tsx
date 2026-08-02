import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
    ArrowLeft,
    BrainCircuit,
    CircleDollarSign,
    ListChecks,
    Target,
} from 'lucide-react';

import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';

import BuildPlanForm from './_components/BuildPlanForm';

type BuildPlanPageProps = {
    params: Promise<{id: string}>;
};

export default async function BuildPlanPage({params}: BuildPlanPageProps) {
    const {id} = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        redirect('/login');
    }

    const cookieHeader = cookieStore
        .getAll()
        .map(({name, value}) => `${name}=${value}`)
        .join('; ');

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
                                <ListChecks
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="eyebrow mt-6">
                                Vehicle AI · Build planner
                            </p>

                            <h1 className="page-title mt-3">
                                Create a focused upgrade roadmap
                            </h1>

                            <p className="body-large mt-4 max-w-2xl">
                                Generate a prioritized build plan for your{' '}
                                {vehicleName}, based on your budget, goals,
                                current specifications, and modification
                                history.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <PlannerStat
                                icon={
                                    <CircleDollarSign
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Budget"
                                value="Defined by you"
                            />

                            <PlannerStat
                                icon={
                                    <Target
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Goal"
                                value="Personalized"
                            />

                            <PlannerStat
                                icon={
                                    <BrainCircuit
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Context"
                                value="Vehicle-aware"
                            />
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <GlassPanel variant="solid" padding="lg">
                        <BuildPlanForm carId={id} />
                    </GlassPanel>

                    <GlassPanel variant="solid" padding="lg" className="h-fit">
                        <p className="eyebrow">How it works</p>

                        <h2 className="section-title mt-3">
                            What the planner considers
                        </h2>

                        <p className="body-text mt-3">
                            The recommendation combines your stated goal with
                            the vehicle and modification data already stored in
                            your garage.
                        </p>

                        <div className="mt-6 space-y-4">
                            <PlannerGuidance
                                title="Current build"
                                description="Installed modifications are considered so the planner does not repeat completed upgrades."
                            />

                            <PlannerGuidance
                                title="Upgrade order"
                                description="The result prioritizes sensible sequencing, including reliability and safety dependencies."
                            />

                            <PlannerGuidance
                                title="Budget alignment"
                                description="Recommendations are organized around the budget you provide rather than unlimited spending."
                            />
                        </div>
                    </GlassPanel>
                </div>
            </PageContainer>
        </main>
    );
}

type PlannerStatProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

function PlannerStat({icon, label, value}: PlannerStatProps) {
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

type PlannerGuidanceProps = {
    title: string;
    description: string;
};

function PlannerGuidance({title, description}: PlannerGuidanceProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
