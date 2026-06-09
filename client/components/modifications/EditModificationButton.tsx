'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import EditModificationForm from './EditModificationForm';
import {Modification} from '@/types/modification';

type Props = {
    mod: Modification;
};

export default function EditModificationButton({mod}: Props) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                <EditModificationForm
                    mod={mod}
                    onSuccess={() => setIsEditing(false)}
                />
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mt-2 text-sm text-zinc-400 hover:text-zinc-600"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
        </Button>
    );
}
