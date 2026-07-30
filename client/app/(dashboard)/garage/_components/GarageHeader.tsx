import {ReactNode} from 'react';
import {CarFront, Sparkles} from 'lucide-react';

import {PageHeader} from '@/components/layout';

type GarageHeaderProps = {
    carsCount: number;
};

export default function GarageHeader({carsCount}: GarageHeaderProps) {
    const vehiclesLabel = `${carsCount} ${
        carsCount === 1 ? 'vehicle' : 'vehicles'
    }`;

    return (
        <PageHeader
            eyebrow="Personal garage"
            title="My Garage"
            description={
                carsCount === 0
                    ? 'Add your first car to begin tracking specifications, modifications, costs, and AI recommendations.'
                    : `Manage ${vehiclesLabel} and keep every build decision organized in one focused workspace.`
            }
            actions={
                <div className="grid grid-cols-2 gap-3">
                    <GarageStat
                        icon={
                            <CarFront className="size-4" aria-hidden="true" />
                        }
                        label="Vehicles"
                        value={carsCount}
                    />

                    <GarageStat
                        icon={
                            <Sparkles className="size-4" aria-hidden="true" />
                        }
                        label="AI advisor"
                        value="Ready"
                    />
                </div>
            }
        />
    );
}

type GarageStatProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
};

function GarageStat({icon, label, value}: GarageStatProps) {
    return (
        <div className="min-w-32 rounded-xl border border-border-subtle bg-surface px-4 py-3 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="caption">{label}</span>
            </div>

            <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}
