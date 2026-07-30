import {cn} from '@/lib/utils';
import {LoaderCircle} from 'lucide-react';
import {HTMLAttributes} from 'react';

type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
    label?: string;
};

export default function LoadingState({
    label = 'Loading...',
    className,
    ...props
}: LoadingStateProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'flex min-h-64 flex-col items-center justify-center gap-4 text-center',
                className,
            )}
            {...props}
        >
            <div className="flex size-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-elevated shadow-sm">
                <LoaderCircle
                    className="size-5 animate-spin text-primary"
                    aria-hidden="true"
                />
            </div>

            <p className="body-text">{label}</p>
        </div>
    );
}
