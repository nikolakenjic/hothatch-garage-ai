import {Button} from '@/components/ui/button';
import {Car} from '@/types/car';
import {Modification} from '@/types/modification';
import Link from 'next/link';

type CarHeaderProps = {
    car: Car;
    modifications: Modification[];
    totalSpent: number;
    id: string;
};

export default function CarHeader({
    car,
    modifications,
    totalSpent,
    id,
}: CarHeaderProps) {
    return (
        <header className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                        Hot Hatch
                    </p>
                    <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-950 dark:text-white md:text-5xl">
                        {car.brand} {car.model}
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Model year {car.year}
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        {label: 'Mods', value: modifications.length},
                        {label: 'Spent', value: `€${totalSpent}`},
                        {label: 'AI', value: 'Ready'},
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5"
                        >
                            <p className="font-heading text-xl font-black text-zinc-950 dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                <Link href={`/garage/${id}/build-plan`}>
                    <Button className="bg-red-600 font-bold hover:bg-red-500">
                        AI Build Planner 🤖
                    </Button>
                </Link>
            </div>
        </header>
    );
}
