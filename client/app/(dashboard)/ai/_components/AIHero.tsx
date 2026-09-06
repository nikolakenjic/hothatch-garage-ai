import {ReactNode} from 'react';

import {Bot, CarFront, History, Sparkles} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';

export default function AIHero() {
    return (
        <GlassPanel variant="elevated" className="overflow-hidden">
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-end">
                <div className="max-w-3xl">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Bot className="size-6" aria-hidden="true" />
                    </div>

                    <p className="eyebrow">AI garage advisor</p>

                    <h1 className="page-title mt-3">
                        Automotive guidance before and after you choose a car
                    </h1>

                    <p className="body-large mt-4 max-w-2xl">
                        Find a suitable hot hatch, revisit previous
                        recommendations, or continue with vehicle-specific AI
                        tools from your garage.
                    </p>
                </div>

                <dl className="grid grid-cols-3 gap-3">
                    <HeroStat
                        icon={
                            <Sparkles className="size-4" aria-hidden="true" />
                        }
                        label="Advisor"
                        value="Global"
                    />

                    <HeroStat
                        icon={<History className="size-4" aria-hidden="true" />}
                        label="History"
                        value="Saved"
                    />

                    <HeroStat
                        icon={
                            <CarFront className="size-4" aria-hidden="true" />
                        }
                        label="Garage"
                        value="Connected"
                    />
                </dl>
            </div>
        </GlassPanel>
    );
}

type HeroStatProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function HeroStat({icon, label, value}: HeroStatProps) {
    return (
        <div className="rounded-xl border border-border-subtle bg-surface px-3 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="caption">{label}</span>
            </div>

            <dd className="mt-2 text-sm font-semibold text-foreground">
                {value}
            </dd>
        </div>
    );
}
