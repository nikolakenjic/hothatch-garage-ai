import AddCarForm from '@/components/cars/AddCarForm';
import DeleteCarButton from '@/components/cars/DeleteCarButton';
import {getCarsService} from '@/services/car.service';
import {Car} from '@/types/car';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default async function GaragePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const cars = await getCarsService(token!);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#070707] px-4 py-10">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500 mb-2">
                        Your Collection
                    </p>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                        My Garage 🔥
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                        {cars.length === 0
                            ? 'No cars yet — add your first hot hatch below'
                            : `${cars.length} car${cars.length > 1 ? 's' : ''} in your garage`}
                    </p>
                </div>

                {/* Car Grid */}
                {cars.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {cars.map((car: Car) => (
                            <div
                                key={car._id}
                                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-red-200 dark:border-white/10 dark:bg-zinc-950/80 dark:hover:border-red-500/30"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <Link href={`/garage/${car._id}`}>
                                            <h2 className="text-xl font-bold text-zinc-950 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors cursor-pointer">
                                                {car.brand} {car.model}
                                            </h2>
                                        </Link>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                            {car.year}
                                        </p>
                                    </div>
                                    <span className="text-2xl">🚗</span>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
                                    <Link href={`/garage/${car._id}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                    <DeleteCarButton carId={car._id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Car Form */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/80">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">
                        Add New Car
                    </h2>
                    <AddCarForm />
                </div>
            </div>
        </main>
    );
}
