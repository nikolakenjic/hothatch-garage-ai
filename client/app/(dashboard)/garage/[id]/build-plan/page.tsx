import {cookies} from 'next/headers';
import BuildPlanForm from '@/components/cars/BuildPlanForm';
import CarService from '@/services/car.service';
import Link from 'next/link';
import EditCarForm from '@/components/cars/EditCarForm';

type Props = {
    params: Promise<{id: string}>;
};

export default async function BuildPlanPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const car = await CarService.getCarById(token!, id);

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-[#070707] dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 mx-auto max-w-3xl">
                <Link
                    href={`/garage/${id}`}
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-red-600 dark:hover:text-red-500 transition-colors mb-8"
                >
                    ← Back to {car.brand} {car.model}
                </Link>

                <header className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70 mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                        AI Powered
                    </p>
                    <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                        Build Planner 🤖
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Get a personalized mod plan for your {car.brand}{' '}
                        {car.model} — tailored to your budget and goals.
                    </p>
                    <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                        <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                            Edit Car
                        </h2>
                        <EditCarForm car={car} />
                    </div>
                </header>

                <div className="rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <BuildPlanForm carId={id} />
                </div>
            </section>
        </main>
    );
}
