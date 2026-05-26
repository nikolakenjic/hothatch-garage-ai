'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';
import ModificationService from '@/services/modification.service';

type Props = {
    modId: string;
};

export default function DeleteModificationButton({modId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const token = getAuthToken();
            await ModificationService.deleteModification(token!, modId);
            toast.success('Modification deleted');
            router.refresh();
        } catch (error: any) {
            toast.error('Failed to delete modification');
            console.error(
                'Failed to delete mod:',
                error.response?.data?.message,
            );
        }
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
        </Button>
    );
}
