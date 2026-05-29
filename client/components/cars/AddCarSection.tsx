'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import AddCarForm from './AddCarForm';

export default function AddCarSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-8">
            {!isOpen ? (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 hover:bg-red-500 font-bold"
                >
                    + Add New Car
                </Button>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/80 max-w-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                            Add New Car
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            ✕
                        </button>
                    </div>
                    <AddCarForm onSuccess={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}
