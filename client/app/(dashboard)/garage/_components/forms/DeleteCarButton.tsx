'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';

import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';
import CarService from '@/services/car.service';
import {getErrorMessage} from '@/lib/errors';

type Props = {
    carId: string;
};

export default function DeleteCarButton({carId}: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this car?')) return;
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('You are not logged in');
                return;
            }
            await CarService.deleteCar(token, carId);
            toast.success('Car deleted');
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
