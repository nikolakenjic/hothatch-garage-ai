import GlassPanel from '@/components/shared/GlassPanel';
import {PublicCar} from '@/types/user';

type PublicGarageProps = {
    publicGarage: boolean;
    cars: PublicCar[];
};

export default function PublicGarage({publicGarage, cars}: PublicGarageProps) {
    if (!publicGarage) {
        return (
            <GlassPanel>
                <h2 className="section-title">Garage</h2>

                <p className="body-text mt-2">
                    This user has chosen not to share their garage publicly.
                </p>
            </GlassPanel>
        );
    }

    if (cars.length === 0) {
        return (
            <GlassPanel>
                <h2 className="section-title">Garage</h2>

                <p className="body-text mt-2">No public vehicles yet.</p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel>
            <h2 className="section-title">Garage</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className="rounded-xl border border-border-subtle bg-surface-muted p-5"
                    >
                        <h3 className="card-title">
                            {car.brand} {car.model}
                        </h3>

                        <p className="body-text mt-1">
                            {car.nickname ?? 'No nickname'}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                            <span>Year</span>
                            <span>{car.year}</span>

                            <span>Fuel</span>
                            <span>{car.fuelType ?? '-'}</span>

                            <span>Power</span>
                            <span>
                                {car.horsepower ? `${car.horsepower} HP` : '-'}
                            </span>

                            <span>Transmission</span>
                            <span>{car.transmission ?? '-'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}
