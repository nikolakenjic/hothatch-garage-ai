'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import ModificationService from '@/services/modification.service';
import {getErrorMessage} from '@/lib/errors';

type Props = {
    modId: string;
};

export default function DeleteModificationButton({modId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this modification?'))
            return;
        try {
            await ModificationService.deleteModification(modId);
            toast.success('Modification deleted');
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
        </Button>
    );
}
