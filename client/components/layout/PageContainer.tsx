import {cn} from '@/lib/utils';
import {HTMLAttributes} from 'react';

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export default function PageContainer({
    className,
    children,
    ...props
}: PageContainerProps) {
    return (
        <div className={cn('page-container', className)} {...props}>
            {children}
        </div>
    );
}
