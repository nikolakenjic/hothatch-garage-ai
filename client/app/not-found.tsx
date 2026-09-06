import Link from 'next/link';
import {ArrowLeft, SearchX} from 'lucide-react';

import {Button} from '@/components/ui/button';

export default function NotFound() {
    return (
        <main className="page-shell">
            <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <SearchX className="size-6" aria-hidden="true" />
                    </div>

                    <p className="eyebrow mt-6">404</p>

                    <h1 className="page-title mt-3">Page not found</h1>

                    <p className="body-text mt-3">
                        The page you are looking for does not exist or is no
                        longer available.
                    </p>

                    <Button asChild className="mt-6">
                        <Link href="/">
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Back to home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
