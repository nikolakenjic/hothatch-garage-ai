'use client';

import {AlertTriangle, RotateCcw} from 'lucide-react';

import {Button} from '@/components/ui/button';

type GlobalErrorProps = {
    error: Error & {digest?: string};
    reset: () => void;
};

export default function GlobalError({reset}: GlobalErrorProps) {
    return (
        <main className="page-shell">
            <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="size-6" aria-hidden="true" />
                    </div>

                    <h1 className="page-title mt-6">Something went wrong</h1>

                    <p className="body-text mt-3">
                        We could not complete this request. Try again and
                        continue where you left off.
                    </p>

                    <Button type="button" className="mt-6" onClick={reset}>
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Try again
                    </Button>
                </div>
            </div>
        </main>
    );
}
