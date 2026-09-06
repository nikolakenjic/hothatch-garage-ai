import Link from 'next/link';
import {ArrowLeft, Plus, Settings2} from 'lucide-react';

import AddModificationForm from '@/app/(dashboard)/garage/_components/forms/AddModificationForm';
import EditCarForm from '@/app/(dashboard)/garage/_components/forms/EditCarForm';
import {PageContainer} from '@/components/layout';
import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import CarService from '@/services/car.service';
import ModificationService from '@/services/modification.service';
import {getServerCookieHeader} from '@/lib/auth/server-auth';

import CarHeader from './_components/CarHeader';
import ModificationList from './_components/ModificationList';

type Props = {
    params: Promise<{id: string}>;
};

export default async function CarDetailPage({params}: Props) {
    const {id} = await params;
    const cookieHeader = await getServerCookieHeader();

    const requestConfig = {
        headers: {
            Cookie: cookieHeader,
        },
    };

    const [car, modifications] = await Promise.all([
        CarService.getCarById(id, requestConfig),
        ModificationService.getModifications(id, requestConfig),
    ]);

    const totalSpent = modifications.reduce(
        (sum, modification) => sum + (modification.cost ?? 0),
        0,
    );

    return (
        <main className="page-shell">
            <PageContainer className="space-y-8 py-8 md:py-10">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-3 w-fit text-muted-foreground hover:text-foreground"
                >
                    <Link href="/garage">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back to garage
                    </Link>
                </Button>

                <CarHeader
                    car={car}
                    modifications={modifications}
                    totalSpent={totalSpent}
                    id={id}
                />

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
                    <div className="space-y-8">
                        <ModificationList
                            modifications={modifications}
                            totalSpent={totalSpent}
                        />

                        <GlassPanel className="p-6 md:p-8">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                                    <Plus
                                        className="size-5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                        Add modification
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Record a new upgrade and keep your build
                                        history up to date.
                                    </p>
                                </div>
                            </div>

                            <AddModificationForm carId={id} />
                        </GlassPanel>
                    </div>

                    <aside className="space-y-8">
                        <GlassPanel className="p-6 md:p-8">
                            <div className="mb-6 flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                                    <Settings2
                                        className="size-5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                        Vehicle details
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Update the basic information associated
                                        with this vehicle.
                                    </p>
                                </div>
                            </div>

                            <EditCarForm car={car} />
                        </GlassPanel>
                    </aside>
                </div>
            </PageContainer>
        </main>
    );
}
