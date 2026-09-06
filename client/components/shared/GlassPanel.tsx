import {cn} from '@/lib/utils';
import {HTMLAttributes} from 'react';

type GlassPanelVariant = 'glass' | 'solid' | 'elevated';
type GlassPanelPadding = 'none' | 'sm' | 'md' | 'lg';

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
    variant?: GlassPanelVariant;
    padding?: GlassPanelPadding;
};

const variantClasses: Record<GlassPanelVariant, string> = {
    glass: [
        'border border-border-subtle',
        'bg-background/70 backdrop-blur-xl',
        'shadow-sm',
    ].join(' '),
    solid: ['border border-border-subtle', 'bg-surface'].join(' '),
    elevated: [
        'border border-border-subtle',
        'bg-surface-elevated',
        'shadow-md',
    ].join(' '),
};

const paddingClasses: Record<GlassPanelPadding, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6 md:p-8',
};

export default function GlassPanel({
    className,
    children,
    variant = 'glass',
    padding = 'md',
    ...props
}: GlassPanelProps) {
    return (
        <div
            className={cn(
                'rounded-2xl',
                variantClasses[variant],
                paddingClasses[padding],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
