'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {z} from 'zod';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import CarService from '@/services/car.service';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';

const addCarSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
});

type AddCarInput = z.infer<typeof addCarSchema>;

export default function AddCarForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<AddCarInput>({
        resolver: zodResolver(addCarSchema) as any,
    });

    const onSubmit = async (data: AddCarInput) => {
        try {
            const token = getAuthToken();
            await CarService.createCar(token!, data);
            toast.success('Car added successfully! 🚗');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to add car:', error.response?.data?.message);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add New Car</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" {...register('brand')} />
                        {errors.brand && (
                            <p className="text-sm text-red-500">
                                {errors.brand.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" {...register('model')} />
                        {errors.model && (
                            <p className="text-sm text-red-500">
                                {errors.model.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" {...register('year')} />
                        {errors.year && (
                            <p className="text-sm text-red-500">
                                {errors.year.message}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Car'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
