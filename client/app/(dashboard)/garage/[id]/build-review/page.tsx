import {ReactNode} from 'react';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft, SearchCheck, ShieldCheck, Target} from 'lucide-react';

import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';

import BuildReviewForm from './_components/BuildReviewForm';

type BuildReviewPageProps = {
    params: Promise<{id: string}>;
};

export default async function BuildReviewPage({params}: BuildReviewPageProps) {
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
                                <SearchCheck
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="eyebrow mt-6">
                                Vehicle AI · Build review
                            </p>

                            <h1 className="page-title mt-3">
                                Review the balance of your current build
                            </h1>

                            <p className="body-large mt-4 max-w-2xl">
                                Analyze the strengths, weaknesses, missing
                                upgrades, and safety of your {vehicleName} based
                                on its current specifications and modification
                                history.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <ReviewStat
                                icon={
                                    <SearchCheck
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Review"
                                value="Complete"
                            />

                            <ReviewStat
                                icon={
                                    <Target
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Goal"
                                value="Considered"
                            />

                            <ReviewStat
                                icon={
                                    <ShieldCheck
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                }
                                label="Safety"
                                value="Included"
                            />
                        </div>
                    </div>
                </GlassPanel>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <GlassPanel variant="solid" padding="lg">
                        <BuildReviewForm carId={id} />
                    </GlassPanel>

                    <GlassPanel variant="solid" padding="lg" className="h-fit">
                        <p className="eyebrow">Review criteria</p>

                        <h2 className="section-title mt-3">
                            What the advisor evaluates
                        </h2>

                        <p className="body-text mt-3">
                            The review considers the complete vehicle setup,
                            rather than judging one modification in isolation.
                        </p>

                        <div className="mt-6 space-y-4">
                            <ReviewGuidance
                                title="Build balance"
                                description="The advisor checks whether power, handling, braking, and supporting upgrades work together."
                            />

                            <ReviewGuidance
                                title="Missing foundations"
                                description="Important reliability, safety, and chassis upgrades can be identified before further performance changes."
                            />

                            <ReviewGuidance
                                title="Practical next steps"
                                description="The result includes a prioritized list of realistic improvements for a daily-driven hot hatch."
                            />
                        </div>
                    </GlassPanel>
                </div>
            </PageContainer>
        </main>
    );
}

type ReviewStatProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function ReviewStat({icon, label, value}: ReviewStatProps) {
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

type ReviewGuidanceProps = {
    title: string;
    description: string;
};

function ReviewGuidance({title, description}: ReviewGuidanceProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface-muted/40 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
