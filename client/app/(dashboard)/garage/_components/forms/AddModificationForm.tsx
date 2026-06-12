'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {getAuthToken} from '@/lib/cookies';
import {useRouter} from 'next/navigation';
import ModificationService from '@/services/modification.service';
import {getErrorMessage} from '@/lib/errors';

const addModSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.coerce.number().optional(),
});

type AddModInput = z.infer<typeof addModSchema>;

type Props = {
    carId: string;
};

export default function AddModificationForm({carId}: Props) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<AddModInput>({
        resolver: zodResolver(addModSchema) as any,
    });

    const onSubmit = async (data: AddModInput) => {
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('You are not logged in');
                return;
            }
            await ModificationService.createModification(token, carId, data);
            toast.success('Modification added! 🔧');
            reset();
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        {...register('category')}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                    {errors.category && (
                        <p className="text-sm text-red-500">
                            {errors.category.message}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input
                        id="price"
                        type="number"
                        {...register('price')}
                        className="border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 transition-all duration-200 hover:border-red-300 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Modification'}
                </Button>
            </form>
        </div>
    );
}
