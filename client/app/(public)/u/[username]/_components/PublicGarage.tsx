import GlassPanel from '@/components/shared/GlassPanel';
import {PublicCar} from '@/types/user';

type PublicGarageProps = {
    publicGarage: boolean;
    cars: PublicCar[];
};

export default function PublicGarage({publicGarage, cars}: PublicGarageProps) {
    return (
        <GlassPanel>
            <h2 className="section-title">Garage</h2>

            <p className="body-text mt-2">
                {!publicGarage
                    ? 'This garage is private.'
                    : `${cars.length} public vehicles`}
            </p>
        </GlassPanel>
    );
}
