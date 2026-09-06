'use client';

import {useState} from 'react';
import {Plus, X} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';

import AddCarForm from './AddCarForm';

export default function AddCarSection() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <div>
                <Button
                    type="button"
                    size="lg"
                    onClick={() => setIsOpen(true)}
                    className="gap-2 font-semibold"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add new car
                </Button>
            </div>
        );
    }

    return (
        <GlassPanel variant="solid" className="max-w-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="max-w-lg">
                    <p className="eyebrow">New vehicle</p>

                    <h2 className="section-title mt-3">
                        Add a car to your garage
                    </h2>

                    <p className="body-muted mt-2">
                        Start with the vehicle details. You can manage
                        modifications, costs, and AI recommendations afterward.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close add car form"
                    className="shrink-0"
                >
                    <X className="size-4" aria-hidden="true" />
                </Button>
            </div>

            <AddCarForm onSuccess={() => setIsOpen(false)} />
        </GlassPanel>
    );
}
