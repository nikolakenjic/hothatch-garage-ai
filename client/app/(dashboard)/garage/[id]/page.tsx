import {cookies} from 'next/headers';
import Link from 'next/link';
import CarService from '@/services/car.service';
import ModificationService from '@/services/modification.service';
import EditCarForm from '@/app/(dashboard)/garage/_components/forms/EditCarForm';
import AddModificationForm from '@/app/(dashboard)/garage/_components/forms/AddModificationForm';
import {redirect} from 'next/navigation';
import CarHeader from './_components/CarHeader';
import ModificationList from './_components/ModificationList';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CarDetailPage({params}: Props) {
    const {id} = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        redirect('/login');
    }

    const cookieHeader = cookieStore
        .getAll()
        .map(({name, value}) => `${name}=${value}`)
        .join('; ');

    const requestConfig = {
        headers: {
            Cookie: cookieHeader,
        },
    };

    const car = await CarService.getCarById(id, requestConfig);

    const modifications = await ModificationService.getModifications(
        id,
        requestConfig,
    );

    const totalSpent = modifications.reduce(
        (sum, mod) => sum + (mod.price ?? 0),
        0,
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-white">
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
                <CarHeader
                    car={car}
                    modifications={modifications}
                    totalSpent={totalSpent}
                    id={id}
                />

                <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
                    <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                        Edit Car
                    </h2>
                    <EditCarForm car={car} />
                </div>

                {/* Modifications */}
                <ModificationList
                    modifications={modifications}
                    totalSpent={totalSpent}
                />

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
