import {CarFront, Sparkles} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';

export default function EmptyGarage() {
    return (
        <GlassPanel variant="solid" className="border-dashed py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CarFront className="size-6" aria-hidden="true" />
            </div>

            <h2 className="section-title mt-5">Your garage is ready</h2>

            <p className="body-muted mx-auto mt-2 max-w-md">
                Add your first vehicle to organize specifications,
                modifications, ownership costs, and future build decisions.
            </p>

            <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                AI recommendations become available after adding a vehicle
            </div>
        </GlassPanel>
    );
}
