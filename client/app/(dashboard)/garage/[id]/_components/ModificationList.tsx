import {CircleDollarSign, PackageOpen, Wrench} from 'lucide-react';

import DeleteModificationButton from '@/app/(dashboard)/garage/_components/forms/DeleteModificationButton';
import EditModificationButton from '@/app/(dashboard)/garage/_components/forms/EditModificationButton';
import GlassPanel from '@/components/shared/GlassPanel';
import {Modification} from '@/types/modification';

type ModificationListProps = {
    modifications: Modification[];
    totalSpent: number;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
});

export default function ModificationList({
    modifications,
    totalSpent,
}: ModificationListProps) {
    return (
        <GlassPanel className="overflow-hidden">
            <div className="border-b border-border p-6 md:p-8">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                        <Wrench className="size-5 text-muted-foreground" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            Modifications
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Track every upgrade installed on this vehicle.
                        </p>
                    </div>
                </div>
            </div>

            {modifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center md:px-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/50">
                        <PackageOpen className="size-5 text-muted-foreground" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-foreground">
                        No modifications yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                        Start documenting each upgrade to build a complete
                        history of this vehicle.
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-3 p-6 md:p-8">
                        {modifications.map((modification) => (
                            <ModificationCard
                                key={modification._id}
                                modification={modification}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background/60">
                                <CircleDollarSign className="size-4 text-muted-foreground" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Build investment
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Total recorded modification cost
                                </p>
                            </div>
                        </div>

                        <p className="text-2xl font-semibold tracking-tight text-foreground">
                            {currencyFormatter.format(totalSpent)}
                        </p>
                    </div>
                </>
            )}
        </GlassPanel>
    );
}

type ModificationCardProps = {
    modification: Modification;
};

function ModificationCard({modification}: ModificationCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background/60 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {modification.name}
                    </p>

                    <span className="inline-flex rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {modification.category}
                    </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                    {modification.price !== undefined
                        ? currencyFormatter.format(modification.price)
                        : 'Price not recorded'}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <EditModificationButton mod={modification} />
                <DeleteModificationButton modId={modification._id} />
            </div>
        </div>
    );
}
