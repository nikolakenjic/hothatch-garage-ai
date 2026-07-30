import {cn} from '@/lib/utils';
import {HTMLAttributes, ReactNode} from 'react';

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
};

export default function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <header
            className={cn(
                'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
                className,
            )}
            {...props}
        >
            <div className="max-w-3xl space-y-3">
                {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

                <div className="space-y-2">
                    <h1 className="page-title">{title}</h1>

                    {description ? (
                        <p className="body-large max-w-2xl">{description}</p>
                    ) : null}
                </div>
            </div>

            {actions ? (
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {actions}
                </div>
            ) : null}
        </header>
    );
}
