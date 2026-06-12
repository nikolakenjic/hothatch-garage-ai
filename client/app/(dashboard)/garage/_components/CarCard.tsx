import Link from 'next/link';
import {Car} from '@/types/car';
import {Button} from '@/components/ui/button';
import DeleteCarButton from './forms/DeleteCarButton';

type CarCardProps = {
    car: Car;
};

export default function CarCard({car}: CarCardProps) {
    return (
        <article className="group relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white/85 p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-2xl hover:shadow-red-900/10 dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-black/30 dark:hover:border-red-500/40 dark:hover:shadow-red-950/30">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-500/10 blur-2xl transition-all duration-300 group-hover:bg-red-500/20" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-600 dark:text-red-500">
                        {/* TODO: use car.category when available */}
                        Hot Hatch
                    </p>

                    <Link href={`/garage/${car._id}`}>
                        <h2 className="font-heading text-2xl font-black text-zinc-950 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-500">
                            {car.brand} {car.model}
                        </h2>
                    </Link>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Model year {car.year}
                    </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-2xl shadow-sm dark:border-white/10 dark:bg-white/5">
                    🚗
                </div>
            </div>

            <div className="relative mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between text-sm">
                    {/* TODO: connect to real modification progress */}
                    <span className="text-zinc-500 dark:text-zinc-400">
                        Build status
                    </span>
                    <span className="font-semibold text-zinc-950 dark:text-white">
                        Active
                    </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div className="h-full w-1/3 rounded-full bg-red-600" />
                </div>
            </div>

            <div className="relative mt-6 flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-white/5">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/garage/${car._id}`}>View Details</Link>
                </Button>

                <DeleteCarButton carId={car._id} />
            </div>
        </article>
    );
}
