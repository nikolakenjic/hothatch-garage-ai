'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import AddCarForm from './AddCarForm';

export default function AddCarSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {!isOpen ? (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-11 rounded-xl bg-red-600 px-6 font-bold text-white shadow-lg shadow-red-900/25 transition-all duration-200 hover:scale-[1.02] hover:bg-red-500 active:scale-[0.98]"
                >
                    + Add New Car
                </Button>
            ) : (
                <div className="max-w-xl rounded-[1.75rem] border border-zinc-200 bg-white/85 p-6 shadow-xl shadow-zinc-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-red-950/20">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 dark:text-red-500">
                                New Build
                            </p>
                            <h2 className="font-heading mt-1 text-2xl font-black text-zinc-950 dark:text-white">
                                Add New Car
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Add the basic car information first. Mods and AI
                                upgrades come later.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
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
