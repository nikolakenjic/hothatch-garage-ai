import {cookies} from 'next/headers';
import CarService from '@/services/car.service';
import {Car} from '@/types/car';
import AddCarSection from '@/components/cars/AddCarSection';
import EmptyGarage from '@/components/cars/EmptyGarage';
import CarCard from '@/components/cars/CarCard';
import GarageHeader from '@/components/cars/GarageHeader';

export default async function GaragePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const cars = await CarService.getCars(token!);

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-[#070707] dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 mx-auto max-w-7xl">
                <GarageHeader carsCount={cars.length} />

                <div className="mt-8">
                    <AddCarSection />
                </div>

                {cars.length === 0 ? (
                    <EmptyGarage />
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {cars.map((car: Car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
