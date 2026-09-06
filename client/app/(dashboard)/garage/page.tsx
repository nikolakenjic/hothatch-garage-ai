import {PageContainer} from '@/components/layout';
import {getServerCookieHeader} from '@/lib/auth/server-auth';
import CarService from '@/services/car.service';
import {Car} from '@/types/car';

import AddCarSection from './_components/AddCarSection';
import CarCard from './_components/CarCard';
import EmptyGarage from './_components/EmptyGarage';
import GarageHeader from './_components/GarageHeader';

export default async function GaragePage() {
    const cookieHeader = await getServerCookieHeader();

    const cars = await CarService.getCars({
        headers: {
            Cookie: cookieHeader,
        },
    });

    return (
        <main className="page-shell">
            <PageContainer className="page-content">
                <GarageHeader carsCount={cars.length} />

                <AddCarSection />

                {cars.length === 0 ? (
                    <EmptyGarage />
                ) : (
                    <section
                        aria-label="Your vehicles"
                        className="dashboard-grid-3"
                    >
                        {cars.map((car: Car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </section>
                )}
            </PageContainer>
        </main>
    );
}
