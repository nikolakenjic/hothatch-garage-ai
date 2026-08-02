import {ReactNode} from 'react';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
    ArrowLeft,
    BrainCircuit,
    CircleDollarSign,
    Route,
    Target,
} from 'lucide-react';

import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';

import NextUpgradeForm from './_components/NextUpgradeForm';

type NextUpgradePageProps = {
    params: Promise<{id: string}>;
};

export default async function NextUpgradePage({params}: NextUpgradePageProps) {
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
                                <BrainCircuit
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="eyebrow mt-6">
                                Vehicle AI · Next upgrade
                            </p>

                            <h1 className="page-title mt-3">
                                Decide what your build needs next
                            </h1>

                            <p className="body-large mt-4 max-w-2xl">
                                Analyze your {vehicleName}, its current
                                modifications, previous AI advice, budget, and
                                goals to find the most valuable next upgrade.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <AdvisorStat
                                icon={
                                    <CircleDollarSign
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Budget"
                                value="Respected"
                            />

                            <AdvisorStat
                                icon={
                                    <Target
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Goal"
                                value="Focused"
                            />

                            <AdvisorStat
                                icon={
                                    <Route
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Priority"
                                value="Sequenced"
                            />
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <GlassPanel variant="solid" padding="lg">
                        <NextUpgradeForm carId={id} />
                    </GlassPanel>

                    <GlassPanel variant="solid" padding="lg" className="h-fit">
                        <p className="eyebrow">Advisor logic</p>

                        <h2 className="section-title mt-3">
                            How the next move is selected
                        </h2>

                        <p className="body-text mt-3">
                            The advisor compares your current setup with your
                            goal and avoids recommending upgrades already
                            installed.
                        </p>

                        <div className="mt-6 space-y-4">
                            <GuidanceItem
                                title="Safety and reliability first"
                                description="Supporting upgrades can be prioritized before additional power when the build requires them."
                            />

                            <GuidanceItem
                                title="Previous advice"
                                description="Recent recommendations are considered to reduce repetitive or conflicting suggestions."
                            />

                            <GuidanceItem
                                title="Realistic priorities"
                                description="The result favors useful upgrades that fit a daily-driven hot hatch and your available budget."
                            />
                        </div>
                    </GlassPanel>
                </div>
            </PageContainer>
        </main>
    );
}

type AdvisorStatProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function AdvisorStat({icon, label, value}: AdvisorStatProps) {
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

type GuidanceItemProps = {
    title: string;
    description: string;
};

function GuidanceItem({title, description}: GuidanceItemProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
