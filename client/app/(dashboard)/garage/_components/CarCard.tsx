import {ReactNode} from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CalendarDays,
    CarFront,
    Fuel,
    Gauge,
    Settings2,
} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Car} from '@/types/car';

import DeleteCarButton from './forms/DeleteCarButton';

type CarCardProps = {
    car: Car;
};

export default function CarCard({car}: CarCardProps) {
    const carName = `${car.brand} ${car.model}`;

    return (
        <GlassPanel
            variant="solid"
            padding="none"
            className="group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
            <Link
                href={`/garage/${car._id}`}
                className="flex flex-1 flex-col p-6 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
                aria-label={`View ${carName}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="eyebrow">Vehicle</p>

                        <h2 className="card-title mt-3 transition-colors group-hover:text-primary">
                            {carName}
                        </h2>

                        {car.nickname ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {car.nickname}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CarFront className="size-5" aria-hidden="true" />
                    </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-3">
                    <VehicleDetail
                        icon={
                            <CalendarDays
                                className="size-4"
                                aria-hidden="true"
                            />
                        }
                        label="Model year"
                        value={car.year}
                    />

                    <VehicleDetail
                        icon={<Fuel className="size-4" aria-hidden="true" />}
                        label="Fuel"
                        value={car.fuelType ?? 'Not added'}
                    />

                    <VehicleDetail
                        icon={<Gauge className="size-4" aria-hidden="true" />}
                        label="Power"
                        value={
                            car.horsepower
                                ? `${car.horsepower} hp`
                                : 'Not added'
                        }
                    />

                    <VehicleDetail
                        icon={
                            <Settings2 className="size-4" aria-hidden="true" />
                        }
                        label="Transmission"
                        value={car.transmission ?? 'Not added'}
                    />
                </dl>

                <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-5">
                    <span className="text-sm font-medium text-primary">
                        Open vehicle
                    </span>

                    <ArrowRight
                        className="size-4 text-primary transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                    />
                </div>
            </Link>

            <div className="flex items-center justify-between border-t border-border-subtle bg-surface-muted/40 px-6 py-3">
                <span className="caption">Garage vehicle</span>

                <DeleteCarButton carId={car._id} />
            </div>
        </GlassPanel>
    );
}

type VehicleDetailProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
};

function VehicleDetail({icon, label, value}: VehicleDetailProps) {
    return (
        <div className="rounded-xl bg-surface-muted p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
                {icon}
                <span className="caption">{label}</span>
            </dt>

            <dd className="mt-2 truncate text-sm font-semibold capitalize text-foreground">
                {value}
            </dd>
        </div>
    );
}
