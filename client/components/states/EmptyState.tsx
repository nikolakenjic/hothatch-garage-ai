import {cn} from '@/lib/utils';
import {Inbox} from 'lucide-react';
import {HTMLAttributes, ReactNode} from 'react';

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
};

export default function EmptyState({
    title,
    description,
    icon,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-muted/50 px-6 py-12 text-center',
                className,
            )}
            {...props}
        >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border-subtle bg-surface-elevated text-muted-foreground shadow-sm">
                {icon ?? <Inbox className="size-5" aria-hidden="true" />}
            </div>

            <h3 className="card-title">{title}</h3>

            {description ? (
                <p className="body-text mt-2 max-w-md">{description}</p>
            ) : null}

            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
