'use client';

import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
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
            await CarService.deleteCar(carId);

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
