'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

import {Button} from '@/components/ui/button';
import {getErrorMessage} from '@/lib/errors';
import ModificationService from '@/services/modification.service';

type DeleteModificationButtonProps = {
    modId: string;
};

export default function DeleteModificationButton({
    modId,
}: DeleteModificationButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const shouldDelete = window.confirm(
            'Are you sure you want to delete this modification?',
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setIsDeleting(true);

            await ModificationService.deleteModification(modId);

            toast.success('Modification deleted');
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={handleDelete}
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
