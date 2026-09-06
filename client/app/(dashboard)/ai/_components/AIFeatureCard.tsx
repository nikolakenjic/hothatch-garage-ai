import Link from 'next/link';
import {ArrowRight, LucideIcon} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';

type AIFeatureCardProps = {
    title: string;
    description: string;
    href: string;
    actionLabel: string;
    icon: LucideIcon;
};

export default function AIFeatureCard({
    title,
    description,
    href,
    actionLabel,
    icon: Icon,
}: AIFeatureCardProps) {
    return (
        <GlassPanel
            variant="solid"
            className="group flex h-full flex-col transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
            </div>

            <h3 className="card-title mt-5">{title}</h3>

            <p className="body-text mt-2">{description}</p>

            <div className="mt-auto pt-6">
                <Button asChild variant="ai">
                    <Link href={href}>
                        {actionLabel}
                        <ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </Button>
            </div>
        </GlassPanel>
    );
}
