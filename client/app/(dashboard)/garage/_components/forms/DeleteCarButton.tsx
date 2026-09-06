'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Trash2} from 'lucide-react';
import {toast} from 'sonner';

import {Button} from '@/components/ui/button';
import {getErrorMessage} from '@/lib/errors';
import CarService from '@/services/car.service';

type DeleteCarButtonProps = {
    carId: string;
};

export default function DeleteCarButton({carId}: DeleteCarButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const shouldDelete = window.confirm(
            'Are you sure you want to delete this vehicle? This action cannot be undone.',
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setIsDeleting(true);

            await CarService.deleteCar(carId);

            toast.success('Vehicle deleted');
            router.replace('/garage');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            onClick={handleDelete}
            className="gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
            <Trash2 className="size-4" aria-hidden="true" />
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
