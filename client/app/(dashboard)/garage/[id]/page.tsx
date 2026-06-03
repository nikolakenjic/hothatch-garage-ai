import {cookies} from 'next/headers';
import {Modification} from '@/types/modification';
import AddModificationForm from '@/components/cars/AddModificationForm';
import DeleteModificationButton from '@/components/cars/DeleteModificationButton';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';
import ModificationService from '@/services/modification.service';
import EditCarForm from '@/components/cars/EditCarForm';
import EditModificationButton from '@/components/cars/EditModificationButton';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CarDetailPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const car = await CarService.getCarById(token!, id);
    const modifications = await ModificationService.getModifications(
        token!,
        id,
    );
    const totalSpent = modifications.reduce(
        (sum, mod) => sum + (mod.price || 0),
        0,
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-[#070707] dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 mx-auto max-w-5xl">
                {/* Back button */}
                <Link
                    href="/garage"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-red-600 dark:hover:text-red-500 transition-colors mb-8"
                >
                    ← Back to Garage
                </Link>

                {/* Car Header */}
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
                    <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                        <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                            Edit Car
                        </h2>
                        <EditCarForm car={car} />
                    </div>
                </header>

                {/* Modifications */}
                <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                        Modifications
                    </h2>
                    {modifications.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">
                            No modifications yet — add your first mod below.
                        </p>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {modifications.map((mod: Modification) => (
                                    <div
                                        key={mod._id}
                                        className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]"
                                    >
                                        <div>
                                            <p className="font-semibold text-zinc-950 dark:text-white">
                                                {mod.name}
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {mod.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {mod.price && (
                                                <p className="font-bold text-zinc-950 dark:text-white">
                                                    €{mod.price}
                                                </p>
                                            )}
                                            <EditModificationButton mod={mod} />
                                            <DeleteModificationButton
                                                modId={mod._id}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-100 dark:border-white/10">
                                <p className="font-semibold text-zinc-950 dark:text-white">
                                    Total spent
                                </p>
                                <p className="font-heading text-2xl font-black text-red-600 dark:text-red-500">
                                    €{totalSpent}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Add Modification */}
                <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                        Add Modification
                    </h2>
                    <AddModificationForm carId={id} />
                </div>
            </section>
        </main>
    );
}
