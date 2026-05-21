'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {deleteCarService} from '@/services/car.service';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';

type Props = {
    carId: string;
};

export default function DeleteCarButton({carId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const token = getAuthToken();
            await deleteCarService(token!, carId);
            toast.success('Car deleted');
            router.refresh();
        } catch (error: any) {
            toast.error('Failed to delete car');
            console.error(
                'Failed to delete car:',
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
