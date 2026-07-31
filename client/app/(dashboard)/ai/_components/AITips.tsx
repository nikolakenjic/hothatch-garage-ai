import {Info, ShieldCheck} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';

export default function AITips() {
    return (
        <GlassPanel variant="solid" className="h-full">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="size-5" aria-hidden="true" />
            </div>

            <p className="eyebrow mt-5">Better input, better advice</p>

            <h2 className="card-title mt-3">Complete your vehicle profile</h2>

            <p className="body-text mt-2">
                Accurate specifications and modification history help the AI
                produce more relevant recommendations.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-muted/50 p-4">
                <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                />

                <p className="text-sm leading-6 text-muted-foreground">
                    AI guidance is advisory. Always verify technical changes
                    with qualified automotive professionals.
                </p>
            </div>
        </GlassPanel>
    );
}
