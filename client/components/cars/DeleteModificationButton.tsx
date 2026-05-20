'use client';

import {Button} from '@/components/ui/button';
import {deleteModificationService} from '@/services/modification.service';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';

type Props = {
    modId: string;
};

export default function DeleteModificationButton({modId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const token = getAuthToken();
            await deleteModificationService(token!, modId);
            router.refresh();
        } catch (error: any) {
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
