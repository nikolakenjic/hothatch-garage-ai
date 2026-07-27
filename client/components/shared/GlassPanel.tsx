import {cn} from '@/lib/utils';
import {HTMLAttributes} from 'react';

type GlassPanelProps = HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({
    className,
    children,
    ...props
}: GlassPanelProps) {
    return (
        <div
            className={cn(
                'rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
