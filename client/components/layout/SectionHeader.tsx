import {cn} from '@/lib/utils';
import {HTMLAttributes, ReactNode} from 'react';

type SectionHeaderProps = HTMLAttributes<HTMLElement> & {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export default function SectionHeader({
    title,
    description,
    actions,
    className,
    ...props
}: SectionHeaderProps) {
    return (
        <header
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
                className,
            )}
            {...props}
        >
            <div className="space-y-1.5">
                <h2 className="section-title">{title}</h2>

                {description ? (
                    <p className="body-text max-w-2xl">{description}</p>
                ) : null}
            </div>

            {actions ? (
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {actions}
                </div>
            ) : null}
        </header>
    );
}
