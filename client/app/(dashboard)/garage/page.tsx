import AddCarForm from '@/components/cars/AddCarForm';
import {getCarsService} from '@/services/car.service';
import {Car} from '@/types/car';
import {cookies} from 'next/headers';

export default async function GaragePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const cars = await getCarsService(token!);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Garage 🚗</h1>
            <AddCarForm />
            {cars.length === 0 ? (
                <p className="text-muted-foreground">
                    No cars yet. Add your first car!
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cars.map((car: Car) => (
                        <div key={car._id} className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold">
                                {car.brand} {car.model}
                            </h2>
                            <p className="text-muted-foreground">{car.year}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
