'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';

import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';
import CarService from '@/services/car.service';

type Props = {
    carId: string;
};

export default function DeleteCarButton({carId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const token = getAuthToken();
            await CarService.deleteCar(token!, carId);
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
