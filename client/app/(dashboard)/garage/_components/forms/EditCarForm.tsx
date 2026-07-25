'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import CarService from '@/services/car.service';
import {useRouter} from 'next/navigation';
import {Car} from '@/types/car';
import {getErrorMessage} from '@/lib/errors';

const editCarSchema = z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
});

type EditCarInput = z.infer<typeof editCarSchema>;

type EditCarProps = {
    car: Car;
    onSuccess?: () => void;
};

export default function EditCarForm({car, onSuccess}: EditCarProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<EditCarInput>({
        resolver: zodResolver(editCarSchema) as any,
        defaultValues: {
            brand: car.brand,
            model: car.model,
            year: car.year,
        },
    });

    const onSubmit = async (data: EditCarInput) => {
        try {
            await CarService.updateCar(car._id, data);

            toast.success('Car update successfully! 🚗');
            reset();
            router.refresh();
            onSuccess?.();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                        id="brand"
                        placeholder="Volkswagen"
                        {...register('brand')}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                    {errors.brand && (
                        <p className="text-sm text-red-500">
                            {errors.brand.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                        id="model"
                        placeholder="Golf 6 R"
                        {...register('model')}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                    {errors.model && (
                        <p className="text-sm text-red-500">
                            {errors.model.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                    id="year"
                    type="number"
                    placeholder="2012"
                    {...register('year')}
                    className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                />
                {errors.year && (
                    <p className="text-sm text-red-500">
                        {errors.year.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-900/25 transition-all duration-200 hover:scale-[1.01] hover:bg-red-500 active:scale-[0.99]"
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
}
