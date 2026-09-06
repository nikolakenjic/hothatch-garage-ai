import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {AlertTriangle, RefreshCw} from 'lucide-react';
import {HTMLAttributes} from 'react';

type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    retryLabel?: string;
    onRetry?: () => void;
};

export default function ErrorState({
    title = 'Something went wrong',
    description = 'We could not load this content. Please try again.',
    retryLabel = 'Try again',
    onRetry,
    className,
    ...props
}: ErrorStateProps) {
    return (
        <div
            role="alert"
            className={cn(
                'flex min-h-64 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center',
                className,
            )}
            {...props}
        >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" aria-hidden="true" />
            </div>

            <h3 className="card-title">{title}</h3>

            <p className="body-text mt-2 max-w-md">{description}</p>

            {onRetry ? (
                <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={onRetry}
                >
                    <RefreshCw className="size-4" aria-hidden="true" />
                    {retryLabel}
                </Button>
            ) : null}
        </div>
    );
}
