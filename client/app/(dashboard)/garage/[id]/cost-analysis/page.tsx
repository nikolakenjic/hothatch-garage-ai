import {cookies} from 'next/headers';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import CarService from '@/services/car.service';
import CostAnalysisForm from './_components/CostAnalysisForm';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CostAnalysisPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const car = await CarService.getCarById(token, id);

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-20" />

            <section className="relative z-10 mx-auto max-w-3xl">
                <Link
                    href={`/garage/${id}`}
                    className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-red-600 dark:hover:text-red-500"
                >
                    ← Back to {car.brand} {car.model}
                </Link>

                <header className="mb-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                        AI Powered
                    </p>

                    <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                        Cost Analysis 🤖
                    </h1>

                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Find the best value upgrades for your {car.brand}{' '}
                        {car.model} based on your budget and goal.
                    </p>
                </header>

                <CostAnalysisForm carId={id} />
            </section>
        </main>
    );
}
