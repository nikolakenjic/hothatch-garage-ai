import Link from 'next/link';
import {
    Bot,
    BrainCircuit,
    ChevronRight,
    CircleDollarSign,
    Fuel,
    Gauge,
    Layers3,
    Settings2,
    Sparkles,
} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {Car} from '@/types/car';
import {Modification} from '@/types/modification';

type CarHeaderProps = {
    car: Car;
    modifications: Modification[];
    totalSpent: number;
    id: string;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
});

export default function CarHeader({
    car,
    modifications,
    totalSpent,
    id,
}: CarHeaderProps) {
    const vehicleName = car.nickname
        ? car.nickname
        : `${car.brand} ${car.model}`;

    const vehicleSubtitle = car.nickname
        ? `${car.brand} ${car.model}`
        : `Model year ${car.year}`;

    const specifications = [
        {
            label: 'Power',
            value: car.horsepower ? `${car.horsepower} hp` : 'Not added',
            icon: Gauge,
        },
        {
            label: 'Fuel',
            value: car.fuelType ?? 'Not added',
            icon: Fuel,
        },
        {
            label: 'Drivetrain',
            value: car.drivetrain ?? 'Not added',
            icon: Settings2,
        },
        {
            label: 'Transmission',
            value: car.transmission ?? 'Not added',
            icon: Layers3,
        },
    ];

    const aiActions = [
        {
            title: 'Build planner',
            description: 'Create a structured upgrade roadmap.',
            href: `/garage/${id}/build-plan`,
            icon: Sparkles,
        },
        {
            title: 'Next upgrade',
            description: 'Find the best next modification.',
            href: `/garage/${id}/next-upgrade`,
            icon: ChevronRight,
        },
        {
            title: 'Build review',
            description: 'Analyze the current vehicle setup.',
            href: `/garage/${id}/build-review`,
            icon: BrainCircuit,
        },
        {
            title: 'Cost analysis',
            description: 'Review build costs and priorities.',
            href: `/garage/${id}/cost-analysis`,
            icon: CircleDollarSign,
        },
    ];

    return (
        <GlassPanel className="overflow-hidden">
            <div className="border-b border-border p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                                Vehicle profile
                            </span>

                            <span className="text-sm text-muted-foreground">
                                {car.year}
                            </span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                            {vehicleName}
                        </h1>

                        <p className="mt-3 text-base text-muted-foreground">
                            {vehicleSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <StatCard
                            label="Modifications"
                            value={modifications.length.toString()}
                        />

                        <StatCard
                            label="Total spent"
                            value={currencyFormatter.format(totalSpent)}
                        />

                        <StatCard
                            label="AI advisor"
                            value="Ready"
                            className="col-span-2 sm:col-span-1"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-px bg-border lg:grid-cols-[1fr_1.15fr]">
                <section className="bg-background/50 p-6 md:p-8">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Vehicle overview
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {specifications.map((specification) => {
                            const Icon = specification.icon;

                            return (
                                <div
                                    key={specification.label}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4"
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Icon className="size-4 text-muted-foreground" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            {specification.label}
                                        </p>

                                        <p className="truncate text-sm font-medium text-foreground">
                                            {specification.value}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-background/50 p-6 md:p-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                AI garage advisor
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Analyze, plan and improve this build.
                            </p>
                        </div>

                        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/50">
                            <Bot className="size-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {aiActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Button
                                    key={action.title}
                                    asChild
                                    variant="outline"
                                    className="h-auto justify-start whitespace-normal p-4 text-left"
                                >
                                    <Link href={action.href}>
                                        <Icon className="size-4 shrink-0" />

                                        <span>
                                            <span className="block text-sm font-medium">
                                                {action.title}
                                            </span>

                                            <span className="mt-1 block text-xs font-normal text-muted-foreground">
                                                {action.description}
                                            </span>
                                        </span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </GlassPanel>
    );
}

type StatCardProps = {
    label: string;
    value: string;
    className?: string;
};

function StatCard({label, value, className}: StatCardProps) {
    return (
        <div
            className={`min-w-28 rounded-xl border border-border bg-background/60 px-4 py-3 ${
                className ?? ''
            }`}
        >
            <p className="truncate text-lg font-semibold tracking-tight text-foreground">
                {value}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
    );
}
